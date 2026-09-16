"use client";

import { motion } from "motion/react";
import { shift } from "@/content/site";
import { useRevealed } from "./useRevealed";

/**
 * The care pathway as it is, against the pathway with Revolux. Each step
 * lights up in turn, and the "watch and wait" branch fades where the patient
 * is lost. Ordered lists, so a screen reader hears the sequence.
 */
export default function PathwayDiagram() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const { ref, state } = useRevealed<HTMLDivElement>();
  const view = { initial: false as const, animate: state === "hidden" ? "hidden" : "shown" };
  const still = { duration: 0 };

  const row = (title: string, steps: readonly string[], tone: "dim" | "live", offset: number) => (
    <motion.div {...view} className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
      <h3 className={`eyebrow ${tone === "dim" ? "text-fog/70" : ""}`}>{title}</h3>
      <ol className="mt-6 flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const fading = tone === "dim" && i >= steps.length - 2;
          return (
            <motion.li
              key={s}
              variants={{ hidden: { opacity: 0, x: -10, transition: still }, shown: { opacity: 1, x: 0 } }}
              transition={{ delay: offset + i * 0.12, duration: 0.5, ease }}
              className="relative flex min-w-0 items-center md:flex-1"
            >
              <span
                className={`relative z-10 flex w-full min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-sm md:flex-col md:justify-center md:gap-1.5 md:px-3 md:text-center ${
                  tone === "live"
                    ? "border-teal-400/40 bg-teal-900/40 text-fog"
                    : fading
                      ? "border-ember/30 bg-ember/5 text-fog/75"
                      : "border-line bg-ink-800 text-fog/75"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`figure text-xs ${tone === "live" ? "text-teal-300" : fading ? "text-ember-text" : "text-fog/70"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s}
              </span>
              {!last && (
                <motion.span
                  aria-hidden="true"
                  variants={{ hidden: { scaleX: 0, transition: still }, shown: { scaleX: 1 } }}
                  transition={{ delay: offset + i * 0.12 + 0.1, duration: 0.35, ease }}
                  className={`hidden h-px w-6 shrink-0 origin-left md:block ${tone === "live" ? "bg-teal-400/60" : "bg-line-strong"}`}
                />
              )}
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {row(shift.today.title, shift.today.steps, "dim", 0)}
      {row(shift.future.title, shift.future.steps, "live", 0.2)}
    </div>
  );
}
