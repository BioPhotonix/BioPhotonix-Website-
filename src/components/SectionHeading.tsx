import { Fragment } from "react";
import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  /** One line, or several: each part of an array starts on a line of its own. */
  title: string | string[];
  /** One paragraph, or several. */
  intro?: string | string[];
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({ eyebrow, title, intro, align = "left", className = "" }: Props) {
  const centred = align === "center";
  /* A title in lines gets room for each line to stay whole on a laptop; the
     intro keeps its own, narrower measure. */
  const width = Array.isArray(title) ? "max-w-5xl" : "max-w-3xl";
  return (
    <Reveal className={`${centred ? `mx-auto ${width} text-center` : width} ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`h-section text-fog ${eyebrow ? "mt-4" : ""}`}>
        {Array.isArray(title)
          ? title.map((line, i) => (
              /* The space keeps the lines apart for screen readers and copying. */
              <Fragment key={line}>
                {i > 0 && " "}
                <span className="block">{line}</span>
              </Fragment>
            ))
          : title}
      </h2>
      {[intro ?? []].flat().map((p, i) => (
        <p key={p} className={`lede ${i ? "mt-4" : "mt-6"} text-fog ${centred ? `mx-auto ${Array.isArray(title) ? "max-w-3xl" : ""}` : "max-w-2xl"}`}>
          {p}
        </p>
      ))}
    </Reveal>
  );
}
