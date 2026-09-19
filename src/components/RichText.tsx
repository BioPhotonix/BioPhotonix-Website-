import Link from "next/link";
import { LINK_RE } from "@/content/links";

/**
 * A run of article text with its inline links rendered. Everything that is
 * not a link is emitted as a plain string, which React escapes, so the text
 * cannot carry markup; a link's label is a string too.
 */
export default function RichText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const at = m.index ?? 0;
    if (at > last) out.push(text.slice(last, at));
    const [whole, label, href] = m;
    out.push(
      href.startsWith("/") ? (
        <Link key={i++} href={href} className="link-underline">
          {label}
        </Link>
      ) : (
        <a key={i++} href={href} target="_blank" rel="noopener noreferrer" className="link-underline">
          {label}
        </a>
      ),
    );
    last = at + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
