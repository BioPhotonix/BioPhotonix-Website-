import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { site } from "@/content/site";

/**
 * Every page carried `lastModified: new Date()`, which told a crawler that the
 * whole site had changed on the day it was fetched — every day it was fetched.
 * A lastmod that is always "now" is worse than none: Google's guidance is to
 * send one only when it is accurate, and a date that moves daily on a page
 * that has not changed teaches it to stop trusting the field.
 *
 * So these are real dates, and they are the one thing here that has to be kept
 * by hand: change a page's content, change its date. The articles need no such
 * care, because a post already carries its own.
 */
const PAGES = [
  { path: "", priority: 1, updated: "2026-09-18" },
  { path: "/technology", priority: 0.9, updated: "2026-09-18" },
  { path: "/vision", priority: 0.8, updated: "2026-09-18" },
  { path: "/clinics", priority: 0.9, updated: "2026-09-18" },
  { path: "/investors", priority: 0.8, updated: "2026-09-18" },
  { path: "/about", priority: 0.7, updated: "2026-09-18" },
  { path: "/news", priority: 0.6, updated: "2026-09-18" },
  { path: "/contact", priority: 0.6, updated: "2026-09-17" },
  { path: "/privacy-policy", priority: 0.2, updated: "2026-09-16" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The listing changes whenever an article is added, so its date is the newest article's.
  const newest = posts.reduce((m, p) => (p.updated ?? p.date) > m ? (p.updated ?? p.date) : m, "");
  return [
    ...PAGES.map((p) => ({
      url: `${site.url}${p.path}`,
      lastModified: new Date(p.path === "/news" && newest > p.updated ? newest : p.updated),
      changeFrequency: (p.path === "/news" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p.priority,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/news/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
