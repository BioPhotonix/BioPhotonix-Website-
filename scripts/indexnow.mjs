#!/usr/bin/env node
/**
 * Tell the search engines behind IndexNow (Bing, Yandex, Seznam, Naver;
 * DuckDuckGo and others read Bing's index) that a page is new or changed, so
 * it is crawled within minutes rather than whenever the sitemap is next read.
 * Google does not take part; it reads the sitemap, which already lists every
 * article with its date.
 *
 *   node scripts/indexnow.mjs https://www.biophotonix.co.uk/news/<slug> [more urls]
 *
 * The key is the name of the file public/<key>.txt, which the site serves at
 * its root; IndexNow fetches it to confirm the request comes from the site's
 * owner. It is not a secret: all it lets anyone do is ask for this site's
 * own pages to be crawled. Run it after the deployment is live, never before.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const urls = process.argv.slice(2);
if (!urls.length || urls.some((u) => !/^https:\/\/www\.biophotonix\.co\.uk\//.test(u))) {
  console.error("usage: node scripts/indexnow.mjs https://www.biophotonix.co.uk/<path> [...]");
  process.exit(2);
}
const keyFile = fs.readdirSync(path.join(root, "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("no IndexNow key file in public/ (a 32-character hex name ending in .txt)");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");
const body = { host: "www.biophotonix.co.uk", key, keyLocation: `https://www.biophotonix.co.uk/${keyFile}`, urlList: urls };
const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(body), signal: AbortSignal.timeout(20000) });
const text = (await r.text()).trim();
if (r.status === 200 || r.status === 202) {
  console.log(`IndexNow accepted ${urls.length} URL${urls.length === 1 ? "" : "s"} (${r.status})`);
} else {
  console.error(`IndexNow answered ${r.status}${text ? `: ${text.slice(0, 200)}` : ""}`);
  process.exit(1);
}
