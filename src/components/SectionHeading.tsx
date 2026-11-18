import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  /** One paragraph, or several. */
  intro?: string | string[];
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({ eyebrow, title, intro, align = "left", className = "" }: Props) {
  const centred = align === "center";
  return (
    <Reveal className={`${centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`h-section text-fog ${eyebrow ? "mt-4" : ""}`}>{title}</h2>
      {[intro ?? []].flat().map((p, i) => (
        <p key={p} className={`lede ${i ? "mt-4" : "mt-6"} text-fog ${centred ? "mx-auto" : "max-w-2xl"}`}>
          {p}
        </p>
      ))}
    </Reveal>
  );
}
