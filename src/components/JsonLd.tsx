/**
 * Renders a JSON-LD block. Several may sit on one page; search engines merge
 * them. The data comes from the content modules, never from user input, so
 * the only escaping needed is for a literal "</script>" inside a string.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
