import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/content/schema";
import type { Metadata } from "next";
import Link from "next/link";
import PostArt from "@/components/PostArt";
import Reveal from "@/components/Reveal";
import TechCard from "@/components/TechCard";
import { posts } from "@/content/posts";
import { news } from "@/content/site";

export const metadata: Metadata = {
  title: "News and Insights",
  description: news.intro,
  alternates: { canonical: "/news" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function NewsPage() {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "News", path: "/news" }])} />
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{news.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{news.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog">{news.intro}</p>
        </div>
      </section>
      <section className="shell py-20 md:py-28">
        <div className="grid gap-5 md:grid-cols-2">
          {sorted.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08} as="article">
              <Link href={`/news/${p.slug}`} className="group block h-full">
                <TechCard className="h-full overflow-hidden">
                  <div className="aspect-[5/3] overflow-hidden border-b border-line">
                    <PostArt kind={p.art} className="transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-7">
                    <p className="figure text-xs uppercase tracking-[0.13em] text-fog">
                      {formatDate(p.date)} &middot; {p.readingMinutes} min read
                    </p>
                    <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-fog">{p.title}</h2>
                    <p className="mt-3 leading-relaxed text-fog">{p.excerpt}</p>
                    <span className="link-underline mt-5 inline-block text-base text-fog">Read the article</span>
                  </div>
                </TechCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
