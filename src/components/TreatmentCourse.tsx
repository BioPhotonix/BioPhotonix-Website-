"use client";

import { useEffect, useState } from "react";
import { course } from "@/content/site";
import { useRevealed } from "./useRevealed";

/**
 * The nine-session course, drawn. Sessions fill one at a time, week by week,
 * with the treatment time counting up beside them, so a clinician can see the
 * rhythm and the total commitment at a glance rather than reading it.
 *
 * Under reduced motion the finished course is shown with no fill sequence.
 */
export default function TreatmentCourse() {
  const total = course.weeks * course.perWeek;
  const { ref, state } = useRevealed<HTMLDivElement>();
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (state === "hidden") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(total);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDone(i);
      if (i >= total) window.clearInterval(id);
    }, 260);
    return () => window.clearInterval(id);
  }, [state, total]);

  const minutes = done * course.minutesPerSession;

  return (
    <div ref={ref} className="tech-card rounded-2xl p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="leading-none">
          <span className="block text-4xl font-semibold text-fog md:text-5xl">{minutes}</span>
          <span className="mt-2 block text-sm text-fog/75">minutes of treatment</span>
        </p>
        <p className="text-right leading-none">
          <span className="block text-3xl font-medium text-fog/85 md:text-4xl">
            {done}
            <span className="text-fog/70">/{total}</span>
          </span>
          <span className="mt-2 block text-sm text-fog/75">sessions delivered</span>
        </p>
      </div>

      <ol className="mt-8 flex flex-col gap-3">
        {Array.from({ length: course.weeks }, (_, w) => (
          <li key={w} className="flex items-center gap-4">
            <span className="w-16 shrink-0 text-xs font-semibold uppercase tracking-[0.13em] text-fog/70">
              Week {w + 1}
            </span>
            <span className="flex flex-1 gap-2.5" aria-hidden="true">
              {Array.from({ length: course.perWeek }, (_, k) => {
                const index = w * course.perWeek + k;
                const filled = index < done;
                return (
                  <span
                    key={k}
                    className={`relative flex h-11 flex-1 items-center justify-center rounded-lg border text-xs font-semibold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      filled
                        ? "border-teal-400/60 bg-teal-900/50 text-teal-200"
                        : "border-line bg-ink-950 text-fog/70"
                    }`}
                  >
                    {course.minutesPerSession} min
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ol>
      <p className="sr-only">
        {course.weeks} weeks of {course.perWeek} sessions, {course.minutesPerSession} minutes each:{" "}
        {total} sessions and {total * course.minutesPerSession} minutes in total.
      </p>
      <p className="mt-6 text-sm leading-relaxed text-fog/75">{course.footnote}</p>
    </div>
  );
}
