/**
 * Regression suite for the site.
 *
 *   npm run build && npm start &
 *   npm run test:site
 *
 * Every page, at two widths, with and without prefers-reduced-motion, under
 * three scroll patterns. It watches for the failures that are easy to ship
 * without noticing: a section left invisible by a reveal animation that never
 * fired, sideways scroll on a phone, a skipped heading level, an image with no
 * alt text, text under 14px, more than one <main> or <h1>, and anything in
 * the console.
 *
 * The scroll patterns are the point. Reveal animations that work when you
 * scroll gently can strand a section when someone jumps to the bottom.
 */

import { launch, reporter } from "./launch.mjs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const PAGES = [
  "/",
  "/technology",
  "/vision",
  "/clinics",
  "/about",
  "/investors",
  "/news",
  "/news/the-silent-epidemic-addressing-the-unmet-need-in-dry-amd",
  "/contact",
  "/contact?as=investor",
  "/privacy-policy",
  "/nope-404",
];
const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];
const MOTION = ["no-preference", "reduce"];

const { fail, finish } = reporter();
const browser = await launch();

for (const [vpName, width, height] of VIEWPORTS) {
  for (const motion of MOTION) {
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width, height },
      reducedMotion: motion,
      isMobile: vpName === "mobile",
      userAgent:
        vpName === "mobile"
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          : undefined,
    });
    // Vercel serves the analytics script only on a deployed site; stand in for it here.
    await ctx.route("**/_vercel/insights/**", (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "" }));
    for (const url of PAGES) {
      for (const scroll of ["none", "slow", "jump"]) {
        const page = await ctx.newPage();
        const errors = [];
        const expected404 = url === "/nope-404";
        page.on("console", (m) => {
          if (m.type() !== "error") return;
          if (expected404 && /status of 404/.test(m.text())) return;
          errors.push(m.text());
        });
        page.on("pageerror", (e) => errors.push(String(e)));
        const where = `${vpName}/${motion}/${url}/${scroll}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        if (scroll === "slow") {
          const h = await page.evaluate(() => document.body.scrollHeight);
          for (let y = 0; y < h; y += 400) {
            await page.evaluate((y) => window.scrollTo(0, y), y);
            await page.waitForTimeout(40);
          }
        } else if (scroll === "jump") {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await page.waitForTimeout(150);
          await page.evaluate(() => window.scrollTo(0, 0));
        }
        // The reveal transition is 750ms; anything shorter reads a section mid-fade.
        await page.waitForTimeout(900);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        // 1300ms clears the reveal transitions.
        await page.waitForTimeout(1300);
        // The counters run for 1500ms from whenever they were reached, so on
        // the pages that have them, let them finish before reading the figure.
        if (await page.locator("[data-count-to]").count()) await page.waitForTimeout(1600);

        const report = await page.evaluate(() => {
          const out = { invisible: [], overflow: 0, headings: [], noAlt: [], tiny: [], mains: 0, h1s: 0, counters: [], stuck: [] };
          out.overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
          out.mains = document.querySelectorAll("main").length;
          out.h1s = document.querySelectorAll("h1").length;
          for (const el of document.querySelectorAll("section, article, [data-reveal], h1, h2, h3, p, li")) {
            const cs = getComputedStyle(el);
            const text = (el.textContent ?? "").trim();
            if (!text) continue;
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) continue;
            if (el.closest("[aria-hidden='true']")) continue;
            if (parseFloat(cs.opacity) < 0.05 || cs.visibility === "hidden") out.invisible.push(text.slice(0, 50));
            const size = parseFloat(cs.fontSize);
            if (size < 14 && el.matches("p, li, h1, h2, h3") && !el.closest("svg")) out.tiny.push(`${size}px: ${text.slice(0, 30)}`);
          }
          let last = 0;
          for (const h of document.querySelectorAll("h1, h2, h3, h4, h5, h6")) {
            const level = Number(h.tagName[1]);
            if (last && level > last + 1) out.headings.push(`h${last} → h${level}: ${(h.textContent ?? "").slice(0, 30)}`);
            last = level;
          }
          for (const img of document.querySelectorAll("img")) {
            if (img.getAttribute("alt") === null) out.noAlt.push(img.getAttribute("src") ?? "?");
          }
          /* A count-up that stalls part way leaves a plausible but wrong
             figure on the page — "6M people with AMD worldwide" reads as a
             real statistic, and nothing else here can tell it is wrong. Each
             counter declares its target, so compare the two. */
          for (const el of document.querySelectorAll("[data-count-to]")) {
            const want = el.getAttribute("data-count-to");
            const got = (el.textContent ?? "").trim();
            if (got !== want) out.counters.push(`${got} should be ${want}`);
          }
          /* A part of a cover that pops in has to end at full size. When a
             part both popped and pulsed, the pulse replaced the pop, and the
             moving part of four covers sat at 55% of its size, pulled towards
             the middle of the picture. Parts still arriving are skipped. */
          for (const el of document.querySelectorAll(".art.is-live [data-art-pop]")) {
            if (el.getAnimations().some((a) => a.animationName === "art-pop" && a.playState === "running")) continue;
            const t = getComputedStyle(el).transform;
            if (t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)") out.stuck.push(`${el.closest("a")?.getAttribute("href") ?? "cover"} at ${t}`);
          }
          return out;
        });

        if (report.invisible.length) fail(where, `invisible: ${report.invisible.slice(0, 2).join(" | ")}`);
        if (report.overflow > 1) fail(where, `horizontal overflow of ${report.overflow}px`);
        if (report.headings.length) fail(where, `heading skip ${report.headings[0]}`);
        if (report.noAlt.length) fail(where, `img without alt: ${report.noAlt[0]}`);
        if (report.tiny.length) fail(where, `text under 14px — ${report.tiny[0]}`);
        if (report.mains !== 1) fail(where, `${report.mains} <main> elements`);
        if (report.h1s !== 1) fail(where, `${report.h1s} <h1> elements`);
        if (report.counters.length) fail(where, `counter stalled — ${report.counters[0]}`);
        if (report.stuck.length) fail(where, `cover part stuck mid-animation — ${report.stuck[0]}`);
        if (errors.length) fail(where, `console: ${errors[0].slice(0, 90)}`);
        await page.close();
      }
    }
    await ctx.close();
    console.log(`  done  ${vpName} / prefers-reduced-motion: ${motion}`);
  }
}

/* Analytics: the script loads for an ordinary visit, and not at all for a
   browser that sends Global Privacy Control (privacy policy, section 9.1). */
for (const gpc of [false, true]) {
  const ctx = await browser.newContext({ baseURL: BASE });
  let loaded = false;
  await ctx.route("**/_vercel/insights/**", (r) => {
    loaded = true;
    return r.fulfill({ status: 200, contentType: "text/javascript", body: "" });
  });
  if (gpc) await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { get: () => true }));
  const page = await ctx.newPage();
  await page.goto("/news", { waitUntil: "load" });
  await page.waitForTimeout(800);
  if (gpc && loaded) fail("analytics/gpc", "the analytics script loaded although the browser sent Global Privacy Control");
  if (!gpc && !loaded) fail("analytics/plain", "the analytics script never loaded");
  await ctx.close();
}
console.log("  done  analytics, with and without Global Privacy Control");

await browser.close();
finish(`All ${PAGES.length * VIEWPORTS.length * MOTION.length * 3 + 2} page checks passed.`);
