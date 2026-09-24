import raw from "./insights.json";
import { parseFigure, parseImage } from "./figure";
import type { ArtKind, Block, Post, Source } from "./posts";

/**
 * The weekly insights, read from `insights.json` and checked field by field.
 *
 * The file is written by a script, not by hand, but the check is here rather
 * than only in the script because this is the copy that reaches the build: if
 * the file is ever edited on GitHub and a field goes missing, the build fails
 * here with the entry and the field named, and the live site keeps its last
 * good deployment. The rules are mirrored in `scripts/add-insight.mjs`; change
 * both together.
 */

export const INSIGHT_ART: readonly ArtKind[] = ["imaging", "evidence", "world", "signal", "survey", "binocular"];
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* A function declaration, not an arrow constant: TypeScript only narrows the
   code after a `never` call when the callee is declared this way. */
function fail(where: string, what: string): never {
  throw new Error(`insights.json, ${where}: ${what}`);
}

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

const text = (v: unknown, where: string, max: number): string => {
  if (typeof v !== "string" || v.trim() === "") fail(where, "must be a non-empty string");
  if (v.length > max) fail(where, `is longer than ${max} characters`);
  return v;
};

const date = (v: unknown, where: string): string => {
  const s = text(v, where, 10);
  if (!ISO_DATE.test(s) || Number.isNaN(Date.parse(s))) fail(where, `"${s}" is not a YYYY-MM-DD date`);
  return s;
};

function block(v: unknown, where: string): Block {
  if (!isRecord(v)) fail(where, "must be an object");
  switch (v.type) {
    case "p":
    case "h2":
    case "quote":
      return { type: v.type, text: text(v.text, `${where}.text`, 4000) };
    case "ul": {
      if (!Array.isArray(v.items) || v.items.length === 0) fail(`${where}.items`, "must be a non-empty array");
      return { type: "ul", items: v.items.map((it, i) => text(it, `${where}.items[${i}]`, 1000)) };
    }
    default:
      return fail(`${where}.type`, `"${String(v.type)}" is not one of p, h2, ul, quote`);
  }
}

function source(v: unknown, where: string): Source {
  if (!isRecord(v)) fail(where, "must be an object");
  const url = text(v.url, `${where}.url`, 600);
  if (!/^https:\/\//.test(url)) fail(`${where}.url`, "must start with https://");
  const out: Source = {
    title: text(v.title, `${where}.title`, 300),
    publisher: text(v.publisher, `${where}.publisher`, 120),
    url,
  };
  if (v.date !== undefined) out.date = date(v.date, `${where}.date`);
  return out;
}

export function parseInsight(v: unknown, where: string): Post {
  if (!isRecord(v)) fail(where, "must be an object");
  const slug = text(v.slug, `${where}.slug`, 90);
  if (!SLUG.test(slug)) fail(`${where}.slug`, `"${slug}" must be lower-case words joined by single hyphens`);
  if (v.series !== "insight") fail(`${where}.series`, 'must be "insight"');
  if (typeof v.art !== "string" || !INSIGHT_ART.includes(v.art as ArtKind)) {
    fail(`${where}.art`, `must be one of ${INSIGHT_ART.join(", ")}`);
  }
  if (!Number.isInteger(v.readingMinutes) || (v.readingMinutes as number) < 1) fail(`${where}.readingMinutes`, "must be a positive whole number");
  if (!Array.isArray(v.body) || v.body.length === 0) fail(`${where}.body`, "must be a non-empty array of blocks");
  const post: Post = {
    slug,
    title: text(v.title, `${where}.title`, 120),
    date: date(v.date, `${where}.date`),
    readingMinutes: v.readingMinutes as number,
    excerpt: text(v.excerpt, `${where}.excerpt`, 200),
    art: v.art as ArtKind,
    body: v.body.map((b, i) => block(b, `${where}.body[${i}]`)),
    series: "insight",
  };
  if (v.updated !== undefined) post.updated = date(v.updated, `${where}.updated`);
  if (v.topics !== undefined) {
    if (!Array.isArray(v.topics) || v.topics.length > 8) fail(`${where}.topics`, "must be an array of at most 8 strings");
    post.topics = v.topics.map((t, i) => text(t, `${where}.topics[${i}]`, 40));
  }
  if (v.sources !== undefined) {
    if (!Array.isArray(v.sources) || v.sources.length > 10) fail(`${where}.sources`, "must be an array of at most 10 sources");
    post.sources = v.sources.map((s, i) => source(s, `${where}.sources[${i}]`));
  }
  if (v.figure !== undefined) post.figure = parseFigure(v.figure, `${where}.figure`);
  if (v.image !== undefined) post.image = parseImage(v.image, `${where}.image`);
  if (v.seo !== undefined) {
    if (!isRecord(v.seo)) fail(`${where}.seo`, "must be an object");
    const seo: NonNullable<Post["seo"]> = {};
    if (v.seo.keyword !== undefined) seo.keyword = text(v.seo.keyword, `${where}.seo.keyword`, 60);
    if (v.seo.metaTitle !== undefined) seo.metaTitle = text(v.seo.metaTitle, `${where}.seo.metaTitle`, 70);
    if (v.seo.metaDescription !== undefined) seo.metaDescription = text(v.seo.metaDescription, `${where}.seo.metaDescription`, 170);
    post.seo = seo;
  }
  if (v.keyPoints !== undefined) {
    if (!Array.isArray(v.keyPoints) || v.keyPoints.length < 2 || v.keyPoints.length > 4) fail(`${where}.keyPoints`, "must be a list of two to four points");
    post.keyPoints = v.keyPoints.map((k, i) => text(k, `${where}.keyPoints[${i}]`, 200));
  }
  if (v.faq !== undefined) {
    if (!Array.isArray(v.faq) || v.faq.length < 1 || v.faq.length > 6) fail(`${where}.faq`, "must be a list of one to six questions");
    post.faq = v.faq.map((f, i) => {
      if (!isRecord(f)) fail(`${where}.faq[${i}]`, "must be an object with q and a");
      const q = text(f.q, `${where}.faq[${i}].q`, 160);
      if (!q.trim().endsWith("?")) fail(`${where}.faq[${i}].q`, "must be a question, ending in ?");
      return { q, a: text(f.a, `${where}.faq[${i}].a`, 700) };
    });
  }
  return post;
}

export function parseInsights(input: unknown): Post[] {
  if (!Array.isArray(input)) fail("top level", "must be an array");
  const out = input.map((entry, i) => parseInsight(entry, `entry ${i}`));
  const slugs = new Set<string>();
  for (const p of out) {
    if (slugs.has(p.slug)) fail(p.slug, "appears twice");
    slugs.add(p.slug);
  }
  return out;
}

export const insights: Post[] = parseInsights(raw);
