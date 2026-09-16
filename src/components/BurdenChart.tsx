"use client";

import { motion } from "motion/react";
import { burden } from "@/content/site";
import PrevalenceFrame from "./PrevalenceFrame";
import { useRevealed } from "./useRevealed";

/**
 * Two drawn charts: the frame of people living with AMD, filling from 2020 to
 * 2040, and the split of AMD into its dry and wet forms.
 */
type Props = {
  /** Side by side where there is room for two full-width cards; stacked in a narrower column. */
  layout?: "side" | "stack";
};

export default function BurdenChart({ layout = "side" }: Props) {
  const { ref, state } = useRevealed<HTMLDivElement>();
  const view = { initial: false as const, animate: state === "hidden" ? "hidden" : "shown" };
  const still = { duration: 0 };
  const ease = [0.16, 1, 0.3, 1] as const;
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const dryCells = burden.split.dry.share;

  return (
    <div ref={ref} className={`grid gap-6 ${layout === "side" ? "md:grid-cols-2" : ""}`}>
      {/* Prevalence */}
      <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <figcaption>
          <p className="eyebrow">{burden.prevalence.title}</p>
          <p className="mt-2 text-sm text-fog/60">{burden.prevalence.note}</p>
        </figcaption>
        <div className="mt-8">
          <PrevalenceFrame />
        </div>
        <p className="mt-4 text-xs text-fog/45">Source: {burden.prevalence.source}</p>
      </figure>

      {/* Dry vs wet */}
      <motion.figure {...view} className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <figcaption>
          <p className="eyebrow">{burden.split.title}</p>
          <p className="mt-2 text-sm text-fog/60">Each square is one patient in a hundred.</p>
        </figcaption>
        <div
          className="mt-8 grid grid-cols-10 gap-1.5"
          role="img"
          aria-label={`${burden.split.dry.label}: ${burden.split.dry.share} in 100. ${burden.split.wet.label}: ${burden.split.wet.share} in 100.`}
        >
          {cells.map((i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.4, transition: still }, shown: { opacity: 1, scale: 1 } }}
              transition={{ delay: 0.15 + i * 0.008, duration: 0.4, ease }}
              style={i >= dryCells ? { animationDelay: `${(i - dryCells) * 0.22}s` } : undefined}
              className={`aspect-square rounded-[3px] ${i < dryCells ? "bg-teal-500" : "bg-ember-deep wet-pulse"}`}
            />
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="flex items-center gap-2 text-fog/70">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-teal-500" />
              {burden.split.dry.label}
              <span className="figure ml-auto text-fog">{burden.split.dry.share}%</span>
            </dt>
            <dd className="mt-1 text-fog/55">{burden.split.dry.note}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-fog/70">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-ember-deep" />
              {burden.split.wet.label}
              <span className="figure ml-auto text-fog">{burden.split.wet.share}%</span>
            </dt>
            <dd className="mt-1 text-fog/55">{burden.split.wet.note}</dd>
          </div>
        </dl>
      </motion.figure>
    </div>
  );
}
