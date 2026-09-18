import { posts } from "@/content/posts";
import { founder, site } from "@/content/site";

/**
 * RSS for the articles, newest first. Built once at deploy time, so it costs
 * nothing to serve and can never fall out of step with the pages. The old Wix
 * feed path, `/blog-feed.xml`, redirects here.
 */
export const dynamic = "force-static";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = posts
    .map((p) => {
      const url = `${site.url}/news/${p.slug}`;
      return `    <item>
      <title>${escape(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <dc:creator>${escape(founder.name)}</dc:creator>
      <description>${escape(p.excerpt)}</description>${p.topics?.map((t) => `\n      <category>${escape(t)}</category>`).join("") ?? ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escape(site.name)}: News and insights</title>
    <link>${site.url}/news</link>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site.description)}</description>
    <language>en-gb</language>
    <lastBuildDate>${new Date(posts[0]?.updated ?? posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
