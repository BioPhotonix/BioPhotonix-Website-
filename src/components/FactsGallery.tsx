"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import CountUp from "./CountUp";
import StatCounter from "./StatCounter";
import { burden } from "@/content/site";

/**
 * The facts about AMD as a gallery: up to three on screen on a laptop, two
 * on a tablet, one on a phone, changing every few seconds.
 *
 * Every fact takes its turn, the UK cost included, and all are set the same
 * way. Each change moves on by as many facts as are showing, wrapping round,
 * so the row is always full. No more than half the facts show at once, so
 * each change brings in facts that were not just on screen: with four, two at
 * a time on anything wider than a phone, alternating.
 *
 * The change is a focus pull, in the site's own manner: the facts on screen
 * soften and fade, and the next ones come into focus as they rise into
 * place, a box at a time, with the same easing as everything that rises into
 * view on the page. A thin teal line along the bottom fills over the time a
 * set is shown, so the change is never a surprise, and it stands still
 * whenever the gallery does. (It replaced a red laser sweep, which did not
 * belong to the rest of the site.) Each slot stacks every fact in one grid
 * cell and shows one, so the row is always as tall as its longest fact and
 * never changes height.
 *
 * Moving content needs a way to stop it (WCAG 2.2.2), so there is a pause
 * button, it only runs while on screen, and it holds while a mouse pointer is
 * over it or keyboard focus is in its controls. Only those: a phone reports a
 * tap as the pointer arriving and never reports it leaving, so holding on any
 * pointer froze the gallery for good after one touch. On a phone it takes a
 * sideways swipe. Under reduced motion it never moves on by itself, there is
 * no line, and the buttons change the facts at once. Screen readers get every
 * fact as one list instead of whichever happen to be showing.
 */

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
/** At most three on screen, and never more than half of them. */
const SLOTS = Math.max(1, Math.min(3, Math.floor(N / 2)));

const wrap = (n: number) => ((n % N) + N) % N;

/** How long a set stays before the next: shorter where fewer show at once. */
const dwell = (per: number) => 1800 + 1000 * per;
/* The focus pull, in ms: the old set softens over OUT; each new fact comes
   into focus over IN, starting LEAD after the change begins, one STAGGER
   after the box before it. Matched by .fact[data-role] in globals.css. */
const OUT = 420;
const LEAD = 180;
const IN = 760;
const STAGGER = 110;
const settle = (per: number) => LEAD + STAGGER * (per - 1) + IN;

/** How many slots are on screen: one on a phone, two from 40rem, three from 64rem. */
function usePerView() {
  const [per, setPer] = useState(1);
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 40rem)");
    const lg = window.matchMedia("(min-width: 64rem)");
    const update = () => setPer(Math.min(SLOTS, lg.matches ? 3 : sm.matches ? 2 : 1));
    update();
    sm.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      sm.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);
  return per;
}

type Change = { to: number; dir: 1 | -1 };

export default function FactsGallery() {
  const reduce = useReducedMotion();
  const per = usePerView();
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [change, setChange] = useState<Change | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  /** Counts finished changes, so the timing line starts afresh after each. */
  const [shown, setShown] = useState(0);
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

  /** Show the facts from `to` onwards: at once under reduced motion, otherwise by focus pull. */
  const show = (to: number, dir: 1 | -1) => {
    const target = wrap(to);
    if (change || target === start) return;
    if (reduce) {
      setStart(target);
      setShown((n) => n + 1);
      return;
    }
    setChange({ to: target, dir });
  };

  const step = (d: 1 | -1) => show(start + d * per, d);

  /* Once the new set is in focus, it becomes the set on screen. */
  useEffect(() => {
    if (!change) return;
    const id = window.setTimeout(() => {
      setStart(change.to);
      setChange(null);
      setShown((n) => n + 1);
    }, settle(per));
    return () => window.clearTimeout(id);
  }, [change, per]);

  /* The timing line runs only while the gallery would move on by itself. Its
     own end moves the gallery on, so the line and the change cannot drift
     apart; when it stops, it stops where it is and resumes from there. */
  const running = !paused && !hovered && !focused && onScreen && !change;

  return (
    <div ref={ref}>
      {/* What a screen reader gets: every fact, in order, nothing moving. */}
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
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") touchX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (touchX.current === null) return;
          const dx = e.clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          touchX.current = null;
        }}
        className={`facts-viewport relative grid overflow-hidden rounded-2xl border border-line bg-ink-900 ${SLOTS >= 2 ? "sm:grid-cols-2" : ""} ${SLOTS >= 3 ? "lg:grid-cols-3" : ""}`}
      >
        {Array.from({ length: SLOTS }, (_, k) => {
          const current = wrap(start + k);
          const incoming = change ? wrap(change.to + k) : null;
          /* A box at a time, in the direction of travel. */
          const order = change && change.dir < 0 ? per - 1 - k : k;
          const timing = { "--slot-delay": `${order * STAGGER}ms` } as CSSProperties;
          return (
            <div
              key={k}
              className={`fact-slot grid ${k === 1 ? "hidden border-l border-line sm:grid" : ""} ${k === 2 ? "hidden border-l border-line lg:grid" : ""}`}
              style={timing}
            >
              {FACTS.map((f, i) => {
                const role = i === incoming ? "in" : i === current ? (change ? "out" : "on") : "off";
                return (
                  <div key={f.key} className="fact flex flex-col p-7 md:p-8" data-role={role}>
                    <span className="block text-4xl font-medium text-fog md:text-5xl">{f.value}</span>
                    <span className="mt-3 block text-sm leading-relaxed text-fog">{f.label}</span>
                    {f.note && <span className="mt-2 block text-sm leading-relaxed text-fog">{f.note}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}

        {!reduce && (
          <span
            key={`${shown}-${per}`}
            className="facts-progress"
            data-running={running}
            data-paused={paused}
            data-changing={change !== null}
            style={{ "--dwell": `${dwell(per)}ms` } as CSSProperties}
            onAnimationEnd={() => step(1)}
          />
        )}
      </div>

      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) setFocused(true);
        }}
        onBlur={() => setFocused(false)}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous facts"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog transition hover:border-line-strong"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        {FACTS.map((f, k) => {
          const showing = wrap(k - start) < per;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => show(k, wrap(k - start) <= N / 2 ? 1 : -1)}
              aria-label={`Show fact ${k + 1} of ${N}`}
              aria-current={k === start}
              className="flex h-9 w-5 items-center justify-center"
            >
              <span className={`block h-1.5 rounded-full transition-all ${showing ? "w-4 bg-teal-400" : "w-1.5 bg-line-strong"}`} />
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => step(1)}
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
