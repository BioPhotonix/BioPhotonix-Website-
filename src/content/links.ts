/**
 * Inline links in article text.
 *
 * Article blocks are plain strings so that nothing can put markup on the
 * page. The one thing a weekly insight needs inside a paragraph is a link:
 * to another article on this site, to a page of the site, or to one of its
 * own sources. So a paragraph may carry `[the words](/news/some-article)` or
 * `[the words](https://doi.org/...)`, and only those two shapes: a path that
 * starts with "/" or an https URL. `RichText` renders them; `posts.ts` checks
 * at build time that every internal path is a page the site actually has,
 * so a mistyped link fails the build rather than the reader.
 */

export const LINK_RE = /\[([^\]\n]{1,120})\]\(((?:\/[^\s)]*)|(?:https:\/\/[^\s)]+))\)/g;

export type InlineLink = { label: string; href: string; internal: boolean };

export function linksIn(text: string): InlineLink[] {
  const out: InlineLink[] = [];
  for (const m of text.matchAll(LINK_RE)) out.push({ label: m[1], href: m[2], internal: m[2].startsWith("/") });
  return out;
}

/** The text with the link markup removed: what a feed, a card or a search snippet should carry. */
export function plainText(text: string): string {
  return text.replace(LINK_RE, "$1");
}
