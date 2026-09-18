#!/usr/bin/env node
/**
 * Append a weekly insight to src/content/insights.json.
 *
 *   node scripts/add-insight.mjs <insight.json>
 *   node scripts/add-insight.mjs <insight.json> --check   # validate only, write nothing
 *
 * The file is one article in the shape `src/content/insights.ts` accepts:
 *
 *   { "slug", "title", "date", "excerpt", "art", "body": [blocks],
 *     "sources": [{ "title", "publisher", "url", "date"? }], "topics": [] }
 *
 * `series` is set to "insight" and `readingMinutes` is worked out from the
 * body if either is missing. The rules here mirror `parseInsight` in
 * src/content/insights.ts, which is the check that actually guards the build;
 * this one fails faster and says which field, before anything is written.
 * Then run `npm run typecheck && npm run build` before pushing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STORE = path.join(root, "src/content/insights.json");
const ART = ["imaging", "evidence", "world", "signal"];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

const [, , file, flag] = process.argv;
if (!file) {
  console.error("usage: node scripts/add-insight.mjs <insight.json> [--check]");
  process.exit(2);
}
const checkOnly = flag === "--check";

const problems = [];
const bad = (where, what) => problems.push(`${where}: ${what}`);
const str = (v, where, max) => {
  if (typeof v !== "string" || v.trim() === "") return bad(where, "must be a non-empty string"), null;
  if (v.length > max) return bad(where, `is longer than ${max} characters (${v.length})`), null;
  return v;
};
const date = (v, where) => {
  const s = str(v, where, 10);
  if (s !== null && (!ISO.test(s) || Number.isNaN(Date.parse(s)))) bad(where, `"${s}" is not a YYYY-MM-DD date`);
  return s;
};

const input = JSON.parse(fs.readFileSync(file, "utf8"));
if (typeof input !== "object" || input === null || Array.isArray(input)) {
  console.error("the file must hold one JSON object");
  process.exit(1);
}

const slug = str(input.slug, "slug", 90);
if (slug && !SLUG.test(slug)) bad("slug", "must be lower-case words joined by single hyphens");
str(input.title, "title", 120);
date(input.date, "date");
if (input.updated !== undefined) date(input.updated, "updated");
str(input.excerpt, "excerpt", 200);
if (!ART.includes(input.art)) bad("art", `must be one of ${ART.join(", ")}`);
if (input.series !== undefined && input.series !== "insight") bad("series", 'must be "insight" if given');

let words = 0;
if (!Array.isArray(input.body) || input.body.length === 0) bad("body", "must be a non-empty array of blocks");
else {
  input.body.forEach((b, i) => {
    const where = `body[${i}]`;
    if (typeof b !== "object" || b === null) return bad(where, "must be an object");
    if (["p", "h2", "quote"].includes(b.type)) {
      const t = str(b.text, `${where}.text`, 4000);
      if (t) words += t.split(/\s+/).length;
    } else if (b.type === "ul") {
      if (!Array.isArray(b.items) || b.items.length === 0) return bad(`${where}.items`, "must be a non-empty array");
      b.items.forEach((it, j) => {
        const t = str(it, `${where}.items[${j}]`, 1000);
        if (t) words += t.split(/\s+/).length;
      });
    } else bad(`${where}.type`, `"${b.type}" is not one of p, h2, ul, quote`);
  });
}
if (input.topics !== undefined) {
  if (!Array.isArray(input.topics) || input.topics.length > 8) bad("topics", "must be an array of at most 8 strings");
  else input.topics.forEach((t, i) => str(t, `topics[${i}]`, 40));
}
if (input.sources !== undefined) {
  if (!Array.isArray(input.sources) || input.sources.length > 10) bad("sources", "must be an array of at most 10 sources");
  else
    input.sources.forEach((s, i) => {
      const where = `sources[${i}]`;
      if (typeof s !== "object" || s === null) return bad(where, "must be an object");
      str(s.title, `${where}.title`, 300);
      str(s.publisher, `${where}.publisher`, 120);
      const u = str(s.url, `${where}.url`, 600);
      if (u && !/^https:\/\//.test(u)) bad(`${where}.url`, "must start with https://");
      if (s.date !== undefined) date(s.date, `${where}.date`);
    });
}
if (input.readingMinutes !== undefined && (!Number.isInteger(input.readingMinutes) || input.readingMinutes < 1)) {
  bad("readingMinutes", "must be a positive whole number");
}

const store = JSON.parse(fs.readFileSync(STORE, "utf8"));
if (!Array.isArray(store)) bad("insights.json", "is not an array");
else if (slug && store.some((p) => p.slug === slug)) bad("slug", `"${slug}" is already published`);

if (problems.length) {
  console.error(`${file}: ${problems.length} problem${problems.length === 1 ? "" : "s"}`);
  for (const p of problems) console.error("  - " + p);
  process.exit(1);
}

const insight = {
  slug: input.slug,
  title: input.title,
  date: input.date,
  ...(input.updated ? { updated: input.updated } : {}),
  readingMinutes: input.readingMinutes ?? Math.max(1, Math.round(words / 220)),
  excerpt: input.excerpt,
  art: input.art,
  series: "insight",
  ...(input.topics?.length ? { topics: input.topics } : {}),
  ...(input.sources?.length ? { sources: input.sources } : {}),
  body: input.body,
};

if (checkOnly) {
  console.log(`ok: "${insight.title}" (${words} words, ${insight.readingMinutes} min) would be added as /news/${insight.slug}`);
  process.exit(0);
}

store.push(insight);
store.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
fs.writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");
console.log(`added "${insight.title}" as /news/${insight.slug} (${words} words, ${insight.readingMinutes} min read); ${store.length} insight${store.length === 1 ? "" : "s"} in the file`);
