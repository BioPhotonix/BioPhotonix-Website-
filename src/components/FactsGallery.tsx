"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import CountUp from "./CountUp";
import StatCounter from "./StatCounter";
import { burden } from "@/content/site";

/**
 * The seven facts about AMD as a gallery that slides one fact at a time:
 * three on screen on a laptop, two on a tablet, one on a phone.
 *
 * Every fact takes its turn, the UK cost included, and all are set the same
 * way. Seven boxes never tile, and a gallery does not need them to: whatever
 * the count, the row is always full. The cost starts second, so on a laptop
 * it opens in the centre.
 *
 * The track carries copies of the first three facts at its end, so it can
 * keep moving the same way for ever: once it has slid onto the copies it jumps
 * back to the originals, which look identical, without animating. Going back
 * from the first fact does the reverse. Every card stretches to the tallest
 * one, so the row never changes height.
 *
 * Moving content needs a way to stop it (WCAG 2.2.2), so there is a pause
 * button, it holds while the pointer or focus is on it, and it only runs
 * while on screen. Under reduced motion it never starts on its own and the
 * buttons step without sliding. Screen readers get all seven as one list
 * instead of whichever happen to be showing.
 */

const EVERY = 4500;

type Fact = { key: string; value: ReactNode; said: string; label: string; note?: string };

const STAT_FACTS: Fact[] = burden.stats.map((s) => ({
  key: s.label,
  value: <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />,
  said: `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`,
  label: s.label,
}));

const COST: Fact = {
  key: "cost",
  value: <CountUp value={burden.cost.value} />,
  said: burden.cost.value,
  label: burden.cost.label,
  note: burden.cost.note,
};

const FACTS: Fact[] = [STAT_FACTS[0], COST, ...STAT_FACTS.slice(1)];
const N = FACTS.length;
/** As many copies as the most cards ever on screen at once. */
const COPIES = 3;
const TRACK = [...FACTS, ...FACTS.slice(0, COPIES)];

const wrap = (n: number) => ((n % N) + N) % N;

export default function FactsGallery() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [slide, setSlide] = useState(true);
  /** Counts moves, so the timer restarts after each one but not after a silent jump. */
  const [moves, setMoves] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const touchX = useRef<number | null>(null);

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

  /** Slide to a position on the track, first jumping silently off the copies if need be. */
  const moveTo = (target: (from: number) => number) => {
    setMoves((m) => m + 1);
    if (reduce) {
      setSlide(false);
      setPos((p) => wrap(target(wrap(p))));
      return;
    }
    const from = pos >= N ? pos - N : pos;
    const to = target(from);
    // Going back from the first fact: start from its copy at the end instead.
    const start = to < 0 ? from + N : from;
    const end = to < 0 ? to + N : to;
    if (start === pos && slide) {
      setPos(end);
      return;
    }
    setSlide(false);
    setPos(start);
    // Two frames, so the jump is painted before the slide starts from it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setSlide(true);
        setPos(end);
      }),
    );
  };

  const step = (d: 1 | -1) => moveTo((from) => from + d);

  /* A timeout that restarts after every move, rather than an interval: after
     someone steps the gallery by hand they get the full pause before it moves
     on. */
  useEffect(() => {
    if (paused || held || !onScreen) return;
    const id = window.setTimeout(() => step(1), EVERY);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- step reads pos and slide, which only change with moves
  }, [paused, held, onScreen, moves]);

  const onSlid = () => {
    if (pos < N) return;
    setSlide(false);
    setPos(pos - N);
  };

  const current = wrap(pos);

  return (
    <div ref={ref}>
      {/* What a screen reader gets: all seven, in order, nothing moving. */}
      <dl className="sr-only">
        {FACTS.map((f) => (
          <div key={f.key}>
            <dt>{f.label}</dt>
            <dd>
              {f.said}
              {f.note ? `. ${f.note}` : ""}
            </dd>
          </div>
        ))}
      </dl>

      <div
        aria-hidden="true"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") touchX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (touchX.current === null) return;
          const dx = e.clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
        className="facts-viewport overflow-hidden rounded-2xl border border-line bg-ink-900"
      >
        <div
          className="facts-track flex"
          data-slide={slide}
          style={{ ["--i" as string]: pos }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) onSlid();
          }}
        >
          {TRACK.map((f, k) => (
            <div key={`${f.key}-${k}`} className="facts-card flex flex-col border-l border-line p-7 md:p-8">
              <span className="block text-4xl font-medium text-fog md:text-5xl">{f.value}</span>
              <span className="mt-3 block text-sm leading-relaxed text-fog">{f.label}</span>
              {f.note && <span className="mt-2 block text-sm leading-relaxed text-fog">{f.note}</span>}
            </div>
          ))}
        </div>
      </div>

      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous fact"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:border-line-strong"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        {FACTS.map((f, k) => (
          <button
            key={f.key}
            type="button"
            onClick={() => moveTo(() => k)}
            aria-label={`Show fact ${k + 1} of ${N}`}
            aria-current={k === current}
            className="flex h-9 w-5 items-center justify-center"
          >
            <span className={`block h-1.5 rounded-full transition-all ${k === current ? "w-4 bg-teal-400" : "w-1.5 bg-line-strong"}`} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next fact"
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
