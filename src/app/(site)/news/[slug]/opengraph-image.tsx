import { ogCard, OG_SIZE, OG_TYPE } from "@/app/_og/card";
import { posts } from "@/content/posts";
import { ogCards } from "@/content/site";

export const size = OG_SIZE;
export const contentType = OG_TYPE;

/** One card per article, so a shared link carries the headline it belongs to. */
export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateImageMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return [{ id: "card", size: OG_SIZE, contentType: OG_TYPE, alt: post?.title ?? ogCards.news.title }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return ogCard(ogCards.article.eyebrow, post?.title ?? ogCards.news.title);
}
