import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import PostArt from "@/components/PostArt";
import Reveal from "@/components/Reveal";
import TechCard from "@/components/TechCard";
import { getPost, posts } from "@/content/posts";
import { founder, site } from "@/content/site";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/content/schema";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function NewsPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== slug).slice(0, 2);
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: founder.name },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/news/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structured) }} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "News", path: "/news" },
          { name: post.title, path: `/news/${post.slug}` },
        ])}
      />
      <article className="shell pb-20 pt-32 md:pt-40">
        <Reveal className="mx-auto max-w-3xl">
          <Link href="/news" className="link-underline text-base text-fog hover:text-fog">
            &larr; All articles
          </Link>
          <p className="eyebrow mt-8">
            {formatDate(post.date)} &middot; {post.readingMinutes} min read
          </p>
          <h1 className="h-section mt-4 text-fog">{post.title}</h1>
          <p className="mt-5 text-sm text-fog">
            By {founder.name}, {founder.role}
            {post.updated && ` · Updated ${formatDate(post.updated)}`}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mx-auto mt-12 max-w-4xl">
          <div className="aspect-[5/2] overflow-hidden rounded-2xl border border-line">
            <PostArt kind={post.art} />
          </div>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          {post.body.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="mt-14 font-display text-2xl font-semibold text-fog md:text-3xl">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="mt-6 flex flex-col gap-3">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-fog">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="mt-8 border-l-2 border-teal-400 pl-6 font-display text-xl font-semibold leading-snug text-fog md:text-2xl">
                  {block.text}
                </blockquote>
              );
            }
            return (
              <p key={i} className="mt-6 text-[1.125rem] leading-[1.75] text-fog">
                {block.text}
              </p>
            );
          })}
        </div>

        <Reveal className="mx-auto mt-16 max-w-2xl border-t border-line pt-10">
          <h2 className="font-display text-2xl font-semibold text-fog">Interested in Revolux?</h2>
          <p className="mt-3 leading-relaxed text-fog">
            Whether you run a practice or are looking at BioPhotonix as an investor, we would like to hear from you.
          </p>
          <Button href="/contact" className="mt-7">
            Get in touch
          </Button>
        </Reveal>
      </article>

      {more.length > 0 && (
        <section className="border-t border-line bg-ink-900 py-16 md:py-24">
          <div className="shell">
            <h2 className="h-card text-fog">More reading</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {more.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.1} as="article">
                  <Link href={`/news/${p.slug}`} className="group block h-full">
                    <TechCard className="flex h-full gap-5 p-5">
                      <div className="aspect-[5/3] w-32 shrink-0 overflow-hidden rounded-lg border border-line">
                        <PostArt kind={p.art} />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold leading-snug text-fog">{p.title}</h3>
                        <span className="link-underline mt-2 inline-block text-sm text-fog">Read the article</span>
                      </div>
                    </TechCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
