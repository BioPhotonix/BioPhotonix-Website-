"use client";

import { useEffect, useId, useState } from "react";
import { burden } from "@/content/site";
import { useRevealed } from "./useRevealed";

const COLS = 16;

/**
 * A frame of people, each figure standing for two million, that fills as the
 * years advance from the first published figure to the second. The people
 * added after the first year light in a paler step of the same hue, so the
 * growth stays visible once the sweep has finished. The head of
 * every affected figure has a dark centre: the central vision that dry AMD
 * takes. It plays once when it scrolls into view, then the year can be
 * dragged. Under reduced motion it shows the final year with no sweep.
 *
 * The two labelled years are the published figures. Years between them are a
 * straight line between the two, and the caption says so.
 */
export default function PrevalenceFrame() {
  const { perFigure, start, end } = burden.prevalence;
  const total = Math.round(end.millions / perFigure);
  const rows = Math.ceil(total / COLS);
  const span = end.year - start.year;

  const [year, setYear] = useState(start.year);
  const [touched, setTouched] = useState(false);
  const [run, setRun] = useState(0);
  const { ref, state } = useRevealed<HTMLDivElement>();
  const id = useId();

  const millions = start.millions + ((end.millions - start.millions) * (year - start.year)) / span;
  const lit = Math.round(millions / perFigure);
  const base = Math.round(start.millions / perFigure);
  const shownYear = Math.round(year);
  const shownMillions = Math.round(millions);

  useEffect(() => {
    if (touched || state === "hidden") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setYear(end.year);
      return;
    }
    const hold = 700;
    const duration = 4200;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0 - hold) / duration));
      // Ease in and out, so the sweep gathers pace and then settles.
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setYear(start.year + span * e);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, touched, run, start.year, end.year, span]);

  const replay = () => {
    setTouched(false);
    setYear(start.year);
    setRun((r) => r + 1);
  };

  return (
    <div ref={ref}>
      <div className="flex items-end justify-between gap-6">
        <p className="leading-none">
          <span className="block text-4xl font-semibold text-fog md:text-5xl">{shownMillions}</span>
          <span className="mt-2 block text-sm text-fog">million people living with AMD</span>
        </p>
        <p className="text-right leading-none">
          <span className="block text-3xl font-medium text-fog md:text-4xl">{shownYear}</span>
          <span className="mt-2 block text-sm text-fog">{shownYear === start.year || shownYear === end.year ? "published" : "interpolated"}</span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${COLS * 40} ${rows * 40}`}
        className="mt-6 h-auto w-full"
        role="img"
        aria-label={`${shownMillions} million people living with age-related macular degeneration in ${shownYear}, shown as ${lit} of ${total} figures.`}
      >
        {Array.from({ length: total }, (_, i) => {
          const cx = (i % COLS) * 40 + 20;
          const cy = Math.floor(i / COLS) * 40 + 21;
          return (
            <g key={i} className={i < lit ? (i < base ? "pf-on" : "pf-on pf-new") : "pf-off"} transform={`translate(${cx} ${cy})`}>
              <circle cy="-9" r="5.5" className="pf-head" />
              <path d="M -9 8 a 9 9 0 0 1 18 0 v 8 a 2 2 0 0 1 -2 2 h -14 a 2 2 0 0 1 -2 -2 z" className="pf-body" />
              <circle cy="-9" r="2.4" className="pf-scotoma" />
            </g>
          );
        })}
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fog" aria-label="Key">
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-teal-500" />
          Living with AMD in {start.year}
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-teal-300" />
          Added by {end.year}: {end.millions - start.millions} million
        </li>
      </ul>

      <div className="mt-5">
        <label htmlFor={id} className="sr-only">
          Year
        </label>
        <input
          id={id}
          type="range"
          min={start.year}
          max={end.year}
          step={1}
          value={shownYear}
          onChange={(e) => {
            setTouched(true);
            setYear(Number(e.target.value));
          }}
          aria-valuetext={`${shownYear}: ${shownMillions} million people`}
          className="w-full"
        />
        <div className="figure mt-1.5 flex items-center justify-between text-xs text-fog">
          <span>{start.year}</span>
          <button type="button" onClick={replay} className="rounded-full px-3 py-1 text-fog transition hover:text-fog">
            Replay
          </button>
          <span>{end.year}</span>
        </div>
      </div>

      <details className="mt-4 text-xs text-fog">
        <summary className="cursor-pointer select-none">The figures behind this chart</summary>
        <table className="figure mt-3 w-full text-left">
          <thead>
            <tr className="text-fog">
              <th className="py-1 pr-4 font-medium">Year</th>
              <th className="py-1 font-medium">People with AMD</th>
            </tr>
          </thead>
          <tbody className="text-fog">
            <tr>
              <td className="py-1 pr-4">{start.year}</td>
              <td className="py-1">{start.millions} million</td>
            </tr>
            <tr>
              <td className="py-1 pr-4">{end.year}</td>
              <td className="py-1">{end.millions} million</td>
            </tr>
          </tbody>
        </table>
      </details>
    </div>
  );
}
