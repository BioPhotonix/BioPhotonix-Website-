import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({ eyebrow, title, intro, align = "left", className = "" }: Props) {
  const centred = align === "center";
  return (
    <Reveal className={`${centred ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h-section mt-4 text-fog">{title}</h2>
      {intro && <p className={`lede mt-6 text-fog/75 ${centred ? "mx-auto" : "max-w-2xl"}`}>{intro}</p>}
    </Reveal>
  );
}
