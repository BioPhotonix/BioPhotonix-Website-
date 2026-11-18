"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import CountUp from "./CountUp";
import StatCounter from "./StatCounter";
import { burden } from "@/content/site";

/**
 * The seven facts about AMD as a gallery: three on screen on a laptop, two on
 * a tablet, one on a phone, and every few seconds a red laser line sweeps
 * across and beams the next ones in.
 *
 * Every fact takes its turn, the UK cost included, and all are set the same
 * way. Seven boxes never tile, and a gallery does not need them to: each step
 * moves on by as many facts as are showing, wrapping round, so the row is
 * always full and everything showing is new. The cost starts second, so on a
 * laptop it opens in the centre.
 *
 * The beam is one line crossing the whole row at an even speed. Behind it the
 * next facts are revealed, slot by slot, with a brief red glow as if just
 * lit; ahead of it the old ones remain. Each slot stacks every fact in one
 * grid cell and shows one, so the row is always as tall as its longest fact
 * and never changes height.
 *
 * Moving content needs a way to stop it (WCAG 2.2.2), so there is a pause
 * button, it only runs while on screen, and it holds while a mouse pointer is
 * over it or keyboard focus is in its controls. Only those: a phone reports a
 * tap as the pointer arriving and never reports it leaving, so holding on any
 * pointer froze the gallery for good after one touch. On a phone it takes a
 * sideways swipe. Under reduced motion it never starts on its own and the
 * buttons change the facts without a beam. Screen readers get all seven as
 * one list instead of whichever happen to be showing.
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
const SLOTS = 3;

const wrap = (n: number) => ((n % N) + N) % N;

/** How long the facts stay before the next beam: shorter where fewer show at once. */
const dwell = (per: number) => 1800 + 1000 * per;
/** How long the beam takes to cross the row. */
const sweep = (per: number) => 450 + 200 * per;

/** How many slots are on screen: one on a phone, two from 40rem, three from 64rem. */
function usePerView() {
  const [per, setPer] = useState(1);
  useEffect(() => {
    const sm = window.matchMedia("(min-width: 40rem)");
    const lg = window.matchMedia("(min-width: 64rem)");
    const update = () => setPer(lg.matches ? 3 : sm.matches ? 2 : 1);
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

type Beam = { id: number; to: number; dir: 1 | -1 };

export default function FactsGallery() {
  const reduce = useReducedMotion();
  const per = usePerView();
  const ref = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [beam, setBeam] = useState<Beam | null>(null);
  /** The last beam's direction, and whether one has landed yet: the facts it
      lit keep their animation until it has finished, rather than losing it
      the moment the beam leaves. */
  const [lastDir, setLastDir] = useState<1 | -1>(1);
  const [lit, setLit] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const touchX = useRef<number | null>(null);
  const beams = useRef(0);

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

  /** Show the facts from `to` onwards: at once under reduced motion, otherwise by beam. */
  const show = (to: number, dir: 1 | -1) => {
    const target = wrap(to);
    if (beam || target === start) return;
    if (reduce) {
      setStart(target);
      return;
    }
    beams.current += 1;
    setLastDir(dir);
    setBeam({ id: beams.current, to: target, dir });
  };

  const step = (d: 1 | -1) => show(start + d * per, d);

  const landed = () => {
    if (!beam) return;
    setStart(beam.to);
    setBeam(null);
    setLit(true);
  };

  /* A timeout that restarts after every change, rather than an interval:
     after someone steps the gallery by hand they get the full pause before it
     moves on. */
  useEffect(() => {
    if (paused || hovered || focused || !onScreen || beam) return;
    const id = window.setTimeout(() => step(1), dwell(per));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- step reads start, per and beam, all listed
  }, [paused, hovered, focused, onScreen, beam, start, per]);

  const duration = sweep(per);

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
        className="facts-viewport relative grid overflow-hidden rounded-2xl border border-line bg-ink-900 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: SLOTS }, (_, k) => {
          const current = wrap(start + k);
          const incoming = beam ? wrap(beam.to + k) : null;
          /* Each visible slot is revealed in its own share of the sweep. */
          const order = (beam?.dir ?? lastDir) < 0 ? per - 1 - k : k;
          const timing = {
            "--slot-d": `${duration / per}ms`,
            "--slot-delay": `${(order * duration) / per}ms`,
          } as CSSProperties;
          return (
            <div
              key={k}
              className={`fact-slot grid ${k === 1 ? "hidden border-l border-line sm:grid" : ""} ${k === 2 ? "hidden border-l border-line lg:grid" : ""}`}
              data-dir={(beam?.dir ?? lastDir) === -1 ? "rtl" : "ltr"}
              style={timing}
            >
              {FACTS.map((f, i) => {
                const role = i === incoming ? "in" : i === current ? (beam ? "out" : "on") : "off";
                return (
                  <div key={f.key} className="fact flex flex-col p-7 md:p-8" data-role={role} data-lit={lit}>
                    <span className="block text-4xl font-medium text-fog md:text-5xl">{f.value}</span>
                    <span className="mt-3 block text-sm leading-relaxed text-fog">{f.label}</span>
                    {f.note && <span className="mt-2 block text-sm leading-relaxed text-fog">{f.note}</span>}
                  </div>
                );
              })}
            </div>
          );
        })}

        {beam && (
          <span
            key={beam.id}
            className="laser-run"
            data-dir={beam.dir === -1 ? "rtl" : "ltr"}
            style={{ "--sweep": `${duration}ms` } as CSSProperties}
            onAnimationEnd={(e) => {
              if (e.target === e.currentTarget && e.animationName.startsWith("laser-run")) landed();
            }}
          >
            <span className="laser-beam" />
          </span>
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
