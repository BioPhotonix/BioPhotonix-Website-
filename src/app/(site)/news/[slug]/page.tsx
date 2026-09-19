import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import InsightFigure from "@/components/InsightFigure";
import JsonLd from "@/components/JsonLd";
import PostArt from "@/components/PostArt";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import TechCard from "@/components/TechCard";
import { plainText } from "@/content/links";
import { getPost, posts, type Post } from "@/content/posts";
import { ORG_ID, breadcrumbSchema } from "@/content/schema";
import { founder, news, site } from "@/content/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/**
 * The title tag and the description are the search result. An insight writes
 * them for the query it should rank for (`seo`), and its title tag stands
 * alone, without the site name the template appends, because the sixty
 * characters a result shows are better spent on the query; the site is named
 * in the result anyway. The company's own articles keep the template.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = post.seo?.metaTitle ?? post.title;
  const description = post.seo?.metaDescription ?? plainText(post.excerpt);
  return {
    title: post.seo?.metaTitle ? { absolute: post.seo.metaTitle } : post.title,
    description,
    alternates: { canonical: `/news/${post.slug}` },
    ...(post.topics?.length ? { keywords: post.topics } : {}),
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.date,
      ...(post.updated ? { modifiedTime: post.updated } : {}),
      authors: [`${site.url}/about`],
      ...(post.series === "insight" ? { section: news.insightLabel } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const wordCount = (post: Post) =>
  post.body.reduce((n, b) => n + (b.type === "ul" ? b.items.join(" ") : b.text).split(/\s+/).filter(Boolean).length, 0);

/** How many topics two articles share, for the "More reading" pair. */
const shared = (a: Post, b: Post) => (a.topics ?? []).filter((t) => b.topics?.includes(t)).length;

export default async function NewsPost({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, n: shared(post, p) }))
    .sort((x, y) => y.n - x.n)
    .slice(0, 2)
    .map((x) => x.p);
  const url = `${site.url}/news/${post.slug}`;
  const description = post.seo?.metaDescription ?? plainText(post.excerpt);
  const structured = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    ...(post.seo?.metaTitle && post.seo.metaTitle !== post.title ? { alternativeHeadline: post.seo.metaTitle } : {}),
    description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    wordCount: wordCount(post),
    author: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      url: `${site.url}/about`,
      worksFor: { "@id": ORG_ID },
    },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: site.name,
      url: site.url,
      logo: { "@type": "ImageObject", url: `${site.url}/images/mark.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: [...(post.image ? [`${site.url}${post.image.src}`] : []), `${url}/opengraph-image`],
    ...(post.series === "insight" ? { articleSection: news.insightLabel } : {}),
    ...(post.topics?.length ? { keywords: post.topics.join(", "), about: post.topics.map((t) => ({ "@type": "Thing", name: t })) } : {}),
    ...(post.sources?.length
      ? { citation: post.sources.map((s) => ({ "@type": "CreativeWork", name: s.title, url: s.url, publisher: s.publisher })) }
      : {}),
  };
  const faqStructured = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plainText(f.a) },
        })),
      }
    : null;

  return (
    <>
      <JsonLd data={structured} />
      {faqStructured && <JsonLd data={faqStructured} />}
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
            {post.series === "insight" && <>{news.insightLabel} &middot; </>}
            {formatDate(post.date)} &middot; {post.readingMinutes} min read
          </p>
          <h1 className="h-section mt-4 text-fog">{post.title}</h1>
          <p className="mt-5 text-sm text-fog">
            By{" "}
            <Link href="/about" className="link-underline">
              {founder.name}
            </Link>
            , {post.series === "insight" ? "optometrist and orthoptist, " : ""}
            {founder.role}
            {post.updated && ` · Updated ${formatDate(post.updated)}`}
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-4xl">
          {post.figure ? (
            <InsightFigure figure={post.figure} />
          ) : (
            <Reveal delay={0.08}>
              <div className="aspect-[5/2] overflow-hidden rounded-2xl border border-line">
                <PostArt kind={post.art} />
              </div>
            </Reveal>
          )}
        </div>

        {post.keyPoints && post.keyPoints.length > 0 && (
          <Reveal className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-line bg-ink-900 p-6 md:p-7">
              <p className="eyebrow">{news.keyPointsLabel}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {post.keyPoints.map((k) => (
                  <li key={k} className="flex items-start gap-3 text-fog">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    <span className="leading-relaxed">
                      <RichText text={k} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

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
                      <span className="leading-relaxed">
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote key={i} className="mt-8 border-l-2 border-teal-400 pl-6 font-display text-xl font-semibold leading-snug text-fog md:text-2xl">
                  <RichText text={block.text} />
                </blockquote>
              );
            }
            return (
              <p key={i} className="mt-6 text-[1.125rem] leading-[1.75] text-fog">
                <RichText text={block.text} />
              </p>
            );
          })}
        </div>

        {post.faq && post.faq.length > 0 && (
          <section className="mx-auto mt-14 max-w-2xl" aria-labelledby="post-faq">
            <h2 id="post-faq" className="font-display text-2xl font-semibold text-fog md:text-3xl">
              {news.faqHeading}
            </h2>
            <div className="mt-6 flex flex-col gap-7">
              {post.faq.map((f) => (
                <div key={f.q}>
                  <h3 className="font-display text-xl font-semibold leading-snug text-fog">{f.q}</h3>
                  <p className="mt-3 leading-[1.75] text-fog">
                    <RichText text={f.a} />
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {post.sources && post.sources.length > 0 && (
          <div className="mx-auto mt-14 max-w-2xl">
            <h2 className="font-display text-2xl font-semibold text-fog md:text-3xl">Sources</h2>
            <ol className="mt-6 flex flex-col gap-4">
              {post.sources.map((s, i) => (
                <li key={s.url} className="flex items-start gap-4 text-fog">
                  <span className="figure mt-1 w-6 shrink-0 text-sm text-fog-dim">{i + 1}.</span>
                  <span className="leading-relaxed">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline">
                      {s.title}
                    </a>
                    <span className="text-fog-dim">
                      {" "}
                      &middot; {s.publisher}
                      {s.date && `, ${formatDate(s.date)}`}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {post.series === "insight" && (
          <p className="mx-auto mt-10 max-w-2xl text-sm leading-relaxed text-fog-dim">{news.insightNote}</p>
        )}

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
