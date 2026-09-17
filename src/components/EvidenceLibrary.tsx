"use client";

import { useMemo, useState } from "react";
import { evidence, studies, type Direction, type Topic } from "@/content/evidence";

/**
 * The filterable list of published studies.
 *
 * Direction is shown on every entry and can be filtered on, which is the
 * point: a reader should be able to ask "what does the unsupportive
 * literature say" and get an answer in one click rather than having to trust
 * that we included any.
 */

const DIRECTION_STYLE: Record<Direction, { dot: string; text: string }> = {
  supportive: { dot: "bg-teal-400", text: "text-teal-400" },
  mixed: { dot: "bg-fog-dim", text: "text-fog-dim" },
  cautionary: { dot: "bg-ember-deep", text: "text-ember-text" },
  context: { dot: "bg-fog/40", text: "text-fog/70" },
};

type Filter<T> = T | "all";

function Chips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { readonly id: T; readonly label: string }[];
  value: Filter<T>;
  onChange: (v: Filter<T>) => void;
}) {
  const all = [{ id: "all" as const, label: "All" }, ...options];
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 text-fog/70">{label}</span>
      {all.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id as Filter<T>)}
          aria-pressed={value === o.id}
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            value === o.id
              ? "border-teal-400 bg-teal-400/10 text-fog"
              : "border-line text-fog/70 hover:border-line-strong hover:text-fog"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function EvidenceLibrary() {
  const [topic, setTopic] = useState<Filter<Topic>>("all");
  const [direction, setDirection] = useState<Filter<Direction>>("all");

  const shown = useMemo(
    () =>
      studies
        .filter((s) => (topic === "all" || s.topic === topic) && (direction === "all" || s.direction === direction))
        .sort((a, b) => b.year - a.year),
    [topic, direction],
  );

  const directionLabel = (d: Direction) => evidence.directions.find((x) => x.id === d)?.label ?? d;

  return (
    <div>
      <div className="flex flex-col gap-3">
        <Chips label="Topic" options={evidence.topics} value={topic} onChange={setTopic} />
        <Chips label="Finding" options={evidence.directions} value={direction} onChange={setDirection} />
      </div>

      <p aria-live="polite" className="figure mt-6 text-sm text-fog/70">
        {shown.length} of {studies.length} {studies.length === 1 ? "study" : "studies"}
      </p>

      <ul className="mt-5 flex flex-col gap-px overflow-hidden rounded-2xl border border-line bg-line">
        {shown.map((s) => {
          const style = DIRECTION_STYLE[s.direction];
          return (
            <li key={s.id} className="bg-ink-900 p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className={`flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase ${style.text}`}>
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${style.dot}`} />
                  {directionLabel(s.direction)}
                </span>
                <span className="figure text-xs text-fog/70">{s.design}</span>
              </div>

              <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-fog">{s.title}</h3>
              <p className="figure mt-2 text-sm text-fog/70">
                {s.authors} <span aria-hidden="true">·</span> {s.citation}
              </p>
              <p className="mt-4 text-base leading-relaxed text-fog/80">{s.finding}</p>

              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <a
                  href={`https://doi.org/${s.doi}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-fog/80 hover:text-fog"
                >
                  doi:{s.doi}
                </a>
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-fog/80 hover:text-fog"
                >
                  PubMed {s.pmid}
                </a>
              </p>
            </li>
          );
        })}
      </ul>

      {shown.length === 0 && (
        <p className="mt-5 rounded-2xl border border-line bg-ink-900 p-8 text-fog/75">
          Nothing in the library matches both filters.
        </p>
      )}
    </div>
  );
}
