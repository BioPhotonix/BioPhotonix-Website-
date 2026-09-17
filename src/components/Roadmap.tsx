"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Reveal from "./Reveal";
import { roadmap } from "@/content/site";

const statusLabel = { complete: "Complete", current: "In progress", upcoming: "Planned" } as const;

/** The development stages, with a rail that fills as the list scrolls past. */
export default function Roadmap() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative mt-16">
      <div aria-hidden="true" className="absolute bottom-0 left-[0.6875rem] top-2 w-px bg-line-strong">
        <motion.div className="h-full w-full origin-top bg-teal-400" style={{ scaleY: reduce ? 1 : scaleY }} />
      </div>

      {roadmap.stages.map((s, i) => {
        const done = s.status === "complete";
        const now = s.status === "current";
        return (
          <li key={s.title} className="relative pb-12 pl-12 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border ${
                done ? "border-teal-400 bg-teal-400 text-ink-950" : now ? "pulse-ring border-teal-400 bg-ink-950 text-teal-400" : "border-line-strong bg-ink-950"
              }`}
            >
              {done && (
                <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                </svg>
              )}
              {now && <span className="relative z-10 h-2 w-2 rounded-full bg-teal-400" />}
            </span>
            <Reveal delay={Math.min(i * 0.05, 0.2)}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="figure text-xs uppercase tracking-[0.13em] text-fog">{s.tag}</span>
                <span className={`figure text-xs uppercase tracking-[0.13em] ${done ? "text-teal-400" : now ? "text-teal-300" : "text-fog"}`}>
                  {statusLabel[s.status]}
                </span>
              </div>
              <h3 className={`mt-2 font-display text-2xl font-semibold ${s.status === "upcoming" ? "text-fog" : "text-fog"}`}>{s.title}</h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-fog">{s.body}</p>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
