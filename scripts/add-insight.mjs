#!/usr/bin/env node
/**
 * Append a weekly insight to src/content/insights.json.
 *
 *   node scripts/add-insight.mjs <insight.json> [--image photo.jpg]
 *   node scripts/add-insight.mjs <insight.json> --check   # validate only, write nothing
 *
 * `--image` copies the photograph into public/images/insights/<slug>.jpg,
 * resized to at most 1600px, and sets `image.src`; the JSON's `image` then
 * needs `alt` and `license`. No source is stated on a published image, so
 * the licence must be one that needs no credit.
 * `figure` is checked against the same rules as src/content/figure.ts.
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

const argv = process.argv.slice(2);
const file = argv[0];
const checkOnly = argv.includes("--check");
const imageArg = argv.indexOf("--image") === -1 ? null : argv[argv.indexOf("--image") + 1];
if (!file) {
  console.error("usage: node scripts/add-insight.mjs <insight.json> [--image photo.jpg] [--check]");
  process.exit(2);
}

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

// The figure: one to three blocks of the six kinds (mirrors src/content/figure.ts).
const FIGURE_KINDS = ["before-after", "bars", "change", "stats", "flow", "share"];
const isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
const numAt = (v, where) => (typeof v === "number" && Number.isFinite(v) ? v : (bad(where, "must be a finite number"), 0));
const pointAt = (v, where) => { if (!isObj(v)) return bad(where, "must be an object"); str(v.label, `${where}.label`, 40); numAt(v.value, `${where}.value`); };
const listAt = (v, where, min, max) => (Array.isArray(v) && v.length >= min && v.length <= max ? v : (bad(where, `must be a list of ${min} to ${max} items`), []));
if (input.figure !== undefined) {
  const f = input.figure;
  if (!isObj(f)) bad("figure", "must be an object");
  else {
    str(f.title, "figure.title", 90);
    if (f.caption !== undefined) str(f.caption, "figure.caption", 240);
    if (f.source !== undefined) str(f.source, "figure.source", 160);
    listAt(f.blocks, "figure.blocks", 1, 3).forEach((b, i) => {
      const where = `figure.blocks[${i}]`;
      if (!isObj(b)) return bad(where, "must be an object");
      if (b.label !== undefined) str(b.label, `${where}.label`, 60);
      if (b.decimals !== undefined && (!Number.isInteger(b.decimals) || b.decimals < 0 || b.decimals > 3)) bad(`${where}.decimals`, "must be 0 to 3");
      if (b.unit !== undefined) str(b.unit, `${where}.unit`, 12);
      switch (b.kind) {
        case "before-after": pointAt(b.before, `${where}.before`); pointAt(b.after, `${where}.after`); break;
        case "bars": listAt(b.items, `${where}.items`, 2, 6).forEach((it, j) => { pointAt(it, `${where}.items[${j}]`); if (isObj(it) && it.value < 0) bad(`${where}.items[${j}].value`, "bars cannot be negative; use a change block"); }); break;
        case "change": listAt(b.items, `${where}.items`, 2, 6).forEach((it, j) => { if (!isObj(it)) return bad(`${where}.items[${j}]`, "must be an object"); str(it.label, `${where}.items[${j}].label`, 40); numAt(it.change, `${where}.items[${j}].change`); }); break;
        case "stats": listAt(b.items, `${where}.items`, 2, 4).forEach((it, j) => { if (!isObj(it)) return bad(`${where}.items[${j}]`, "must be an object"); str(it.value, `${where}.items[${j}].value`, 16); str(it.label, `${where}.items[${j}].label`, 60); }); break;
        case "flow": listAt(b.steps, `${where}.steps`, 3, 5).forEach((it, j) => { if (!isObj(it)) return bad(`${where}.steps[${j}]`, "must be an object"); str(it.label, `${where}.steps[${j}].label`, 40); if (it.note !== undefined) str(it.note, `${where}.steps[${j}].note`, 60); }); break;
        case "share": { const v = numAt(b.value, `${where}.value`); if (v < 0 || v > 100) bad(`${where}.value`, "must be between 0 and 100"); str(b.text, `${where}.text`, 80); break; }
        default: bad(`${where}.kind`, `"${b.kind}" is not one of ${FIGURE_KINDS.join(", ")}`);
      }
    });
  }
}

// The photograph for LinkedIn and the social card.
let imageOut = null;
if (imageArg && !fs.existsSync(imageArg)) bad("--image", `${imageArg} does not exist`);
if (input.image !== undefined || imageArg) {
  const im = input.image;
  if (!isObj(im)) bad("image", "must be an object with alt and license");
  else {
    str(im.alt, "image.alt", 200);
    const lic = str(im.license, "image.license", 60);
    if (lic && !/^(public domain|cc0|pdm|pexels)/i.test(lic.trim())) bad("image.license", `"${lic}" needs a credit or forbids this use; only public domain, CC0 or the Pexels licence qualify`);
    const src = imageArg ? `/images/insights/${input.slug}.jpg` : im.src;
    if (!imageArg && (typeof src !== "string" || !fs.existsSync(path.join(root, "public", src)))) bad("image.src", "names a file that is not in public/ (pass --image to add one)");
    imageOut = { src, alt: im.alt, license: im.license };
  }
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
  ...(input.figure ? { figure: input.figure } : {}),
  ...(imageOut ? { image: imageOut } : {}),
  body: input.body,
};

if (checkOnly) {
  console.log(`ok: "${insight.title}" (${words} words, ${insight.readingMinutes} min) would be added as /news/${insight.slug}`);
  process.exit(0);
}

if (imageArg) {
  const { default: sharp } = await import("sharp");
  const dest = path.join(root, "public/images/insights", `${insight.slug}.jpg`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  await sharp(imageArg).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  console.log(`photo written to public/images/insights/${insight.slug}.jpg`);
}

store.push(insight);
store.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
fs.writeFileSync(STORE, JSON.stringify(store, null, 2) + "\n");
console.log(`added "${insight.title}" as /news/${insight.slug} (${words} words, ${insight.readingMinutes} min read); ${store.length} insight${store.length === 1 ? "" : "s"} in the file`);
