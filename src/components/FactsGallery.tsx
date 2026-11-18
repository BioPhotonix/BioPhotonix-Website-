"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import CountUp from "./CountUp";
import StatCounter from "./StatCounter";
import { burden } from "@/content/site";

/**
 * The seven facts about AMD, three on screen at a time.
 *
 * The UK cost sits fixed in the centre and the other six rotate through the
 * slots either side of it in pairs, like a gallery. Seven boxes never tile:
 * a grid of them always leaves a ragged last row, and the cost used to sit
 * apart in a box of its own for that reason. Three at a time is always
 * balanced, whatever the number of facts.
 *
 * Each side slot stacks all of its facts in one grid cell and shows one, so
 * the slot is always as tall as its longest fact and the row never jumps as
 * they change.
 *
 * Moving content needs a way to stop it (WCAG 2.2.2), so there is a pause
 * button, rotation holds while the pointer or focus is on the gallery, and it
 * only runs while the gallery is on screen. Under reduced motion it never
 * starts on its own and the buttons swap facts without sliding. Screen
 * readers get all seven facts as one list instead of whichever two happen to
 * be showing.
 */

const EVERY = 5000;
const STATS = burden.stats;
const PAIRS = Math.ceil(STATS.length / 2);
const said = (s: (typeof STATS)[number]) => `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`;

export default function FactsGallery() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pair, setPair] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    if (reduce) setPaused(true);
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (to: number, d: number) => {
    setPrev(pair);
    setDir(d);
    setPair(((to % PAIRS) + PAIRS) % PAIRS);
  };

  /* A timeout that restarts on every change of pair, rather than an interval:
     after someone steps the gallery by hand they get a full five seconds
     before it moves on, and no state is set from inside another update. */
  useEffect(() => {
    if (paused || held || !onScreen) return;
    const id = window.setTimeout(() => go(pair + 1, 1), EVERY);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- go reads pair, which is listed
  }, [paused, held, onScreen, pair]);

  /** One side of the centre: every fact that can appear there, stacked. */
  const slot = (side: 0 | 1) => (
    <div className="grid overflow-hidden bg-ink-900">
      {Array.from({ length: PAIRS }, (_, k) => {
        const s = STATS[k * 2 + side];
        if (!s) return null;
        const phase = k === pair ? "in" : k === prev ? "out" : "wait";
        return (
          <div key={s.label} className="fact-slide p-7" data-phase={phase} style={{ ["--dir" as string]: dir }}>
            <span className="block text-4xl font-medium text-fog md:text-5xl">
              <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-fog">{s.label}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={ref}>
      {/* What a screen reader gets: all seven, in order, nothing moving. */}
      <dl className="sr-only">
        <dt>{burden.cost.label}</dt>
        <dd>
          {burden.cost.value}. {burden.cost.note} Source: {burden.cost.source}
        </dd>
        {STATS.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{said(s)}</dd>
          </div>
        ))}
      </dl>

      <div
        aria-hidden="true"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-[1fr_1.3fr_1fr]"
      >
        {slot(0)}
        {/* The cost: fixed, and first on a phone, where the slots stack below it. */}
        <div className="order-first flex flex-col justify-center bg-ink-800 p-7 sm:col-span-2 lg:order-none lg:col-span-1 md:p-9">
          <span className="block text-5xl font-medium text-ember-text md:text-6xl">
            <CountUp value={burden.cost.value} />
          </span>
          <span className="mt-3 block text-base leading-relaxed text-fog">{burden.cost.label}</span>
          <span className="mt-2 block text-sm leading-relaxed text-fog">{burden.cost.note}</span>
          <span className="mt-4 block text-xs leading-relaxed text-fog">Source: {burden.cost.source}</span>
        </div>
        {slot(1)}
      </div>

      <div
        className="mt-4 flex items-center justify-center gap-2"
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <button
          type="button"
          onClick={() => go(pair - 1, -1)}
          aria-label="Previous facts"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:border-line-strong"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        {Array.from({ length: PAIRS }, (_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => go(k, k >= pair ? 1 : -1)}
            aria-label={`Show facts ${k * 2 + 1} and ${k * 2 + 2} of ${STATS.length}`}
            aria-current={k === pair}
            className="flex h-9 w-6 items-center justify-center"
          >
            <span className={`block h-1.5 rounded-full transition-all ${k === pair ? "w-5 bg-teal-400" : "w-1.5 bg-line-strong"}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => go(pair + 1, 1)}
          aria-label="Next facts"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:border-line-strong"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="ml-2 rounded-full border border-line px-3.5 py-1.5 text-xs text-fog transition hover:border-line-strong"
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </div>
  );
}
