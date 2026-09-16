import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/technology", priority: 0.9 },
    { path: "/clinics", priority: 0.9 },
    { path: "/investors", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/news", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy-policy", priority: 0.2 },
  ];
  return [
    ...staticRoutes.map((r) => ({
      url: `${site.url}${r.path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: r.priority,
    })),
    ...posts.map((p) => ({
      url: `${site.url}/news/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
