"use client";

import { motion } from "motion/react";
import { burden } from "@/content/site";
import { useRevealed } from "./useRevealed";

/**
 * Two drawn charts: prevalence in 2020 against 2040, and the split of AMD into
 * its dry and wet forms. Both animate in the first time they are seen.
 */
export default function BurdenChart() {
  const max = Math.max(...burden.chart.bars.map((b) => b.value));
  const { ref, state } = useRevealed<HTMLDivElement>();
  const view = { initial: false as const, animate: state === "hidden" ? "hidden" : "shown" };
  const still = { duration: 0 };
  const ease = [0.16, 1, 0.3, 1] as const;
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const dryCells = burden.split.dry.share;

  return (
    <div ref={ref} className="grid gap-6 md:grid-cols-2">
      {/* Prevalence */}
      <motion.figure {...view} className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <figcaption>
          <p className="eyebrow">{burden.chart.title}</p>
          <p className="mt-2 text-sm text-fog/60">In {burden.chart.unit}s. {burden.chart.note}</p>
        </figcaption>
        <div className="mt-8 flex h-56 items-end gap-8 border-b border-line px-2" role="img" aria-label={`${burden.chart.bars.map((b) => `${b.label}: ${b.value} ${burden.chart.unit}`).join(". ")}.`}>
          {burden.chart.bars.map((b, i) => (
            <div key={b.label} className="flex h-full flex-1 flex-col justify-end">
              <motion.p
                variants={{ hidden: { opacity: 0, transition: still }, shown: { opacity: 1 } }}
                transition={{ delay: 0.5 + i * 0.25, duration: 0.5 }}
                className="mono mb-2 text-center text-2xl font-medium text-fog"
                aria-hidden="true"
              >
                {b.value}
                <span className="text-sm text-fog/60">M</span>
              </motion.p>
              <motion.div
                variants={{ hidden: { scaleY: 0, transition: still }, shown: { scaleY: 1 } }}
                transition={{ delay: i * 0.25, duration: 1, ease }}
                style={{ height: `${(b.value / max) * 100}%`, transformOrigin: "bottom" }}
                className={`w-full rounded-t-md ${i === 0 ? "bg-teal-700" : "bg-gradient-to-t from-teal-600 to-teal-400"}`}
              />
              <p className="mono mt-3 text-center text-xs uppercase tracking-[0.16em] text-fog/60" aria-hidden="true">
                {b.label}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-fog/45">Source: {burden.chart.source}</p>
      </motion.figure>

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
              className={`aspect-square rounded-[3px] ${i < dryCells ? "bg-teal-400" : "bg-ember/80"}`}
            />
          ))}
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="flex items-center gap-2 text-fog/70">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-teal-400" />
              {burden.split.dry.label}
              <span className="mono ml-auto text-fog">{burden.split.dry.share}%</span>
            </dt>
            <dd className="mt-1 text-fog/55">{burden.split.dry.note}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-2 text-fog/70">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-ember/80" />
              {burden.split.wet.label}
              <span className="mono ml-auto text-fog">{burden.split.wet.share}%</span>
            </dt>
            <dd className="mt-1 text-fog/55">{burden.split.wet.note}</dd>
          </div>
        </dl>
      </motion.figure>
    </div>
  );
}
