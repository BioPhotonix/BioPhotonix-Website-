"use client";

import { useEffect, useRef, useState } from "react";
import { market, tiers, type Tier } from "@/content/market";

/**
 * TAM, SAM and SOM as a continuous zoom.
 *
 * The ratios here are brutal: £22.4bn to £753m to £14.8m, so the obtainable
 * market is 0.066% of the total by value. Every static form fails on that. A
 * bar chart is a full bar beside a hairline. A log scale flatters the small
 * number. Nested squares — which this was before — put a 2.5%-wide speck in
 * the middle of a big square and ask the reader to be impressed.
 *
 * So the figure does not compress the ratio, it travels through it. The three
 * markets are drawn once, concentric, at their true area-proportional sizes,
 * and the camera flies between them: about 39x from end to end. The viewer
 * does not read the scale drop off an axis, they watch it.
 *
 * Three things make that honest rather than merely showy:
 *
 *  - Area carries the value, so a tier's side is the square root of its
 *    share. Nesting is true to the meaning too — each tier is a subset of the
 *    one outside it.
 *  - Each tier has its own grid, ruled as a fraction of its own size, so
 *    detail resolves as you descend instead of the picture just getting
 *    bigger. The magnification readout says how deep you are.
 *  - At full zoom the obtainable market resolves into 1,895 marks, one per
 *    participating practice. The payoff for travelling is a real number.
 *
 * Colour is emphasis, not magnitude: size already carries the value, so
 * re-encoding it in colour would spend the channel twice. The outer tiers are
 * dim context and the active one is lit.
 */

/** World units. The frame is 16:10 and every tier keeps that aspect. */
const VIEW_W = 1000;
const VIEW_H = 625;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
/** How much of the frame the active tier fills. */
const FILL = 0.82;
/** Milliseconds each tier holds during the opening fly-through. */
const HOLD = 1500;

/** Fill per depth: lighter the further in, so the nesting reads at a glance. */
const TIER_FILL = ["var(--color-teal-900)", "var(--color-teal-600)", "var(--color-teal-300)"];

const sideOf = (t: Tier) => Math.sqrt(t.millions / tiers[0].millions) * VIEW_W;
const zoomOf = (t: Tier) => (VIEW_W * FILL) / sideOf(t);
const shareOfParent = (i: number) =>
  i === 0 ? null : `${((tiers[i].millions / tiers[i - 1].millions) * 100).toFixed(1)}%`;

/** A tier's rectangle in world coordinates, concentric with the frame. */
function rectOf(t: Tier) {
  const w = sideOf(t);
  const h = w * (VIEW_H / VIEW_W);
  return { x: CX - w / 2, y: CY - h / 2, w, h };
}

/** Grid lines ruled across a tier, in its own proportions. */
function gridOf(t: Tier, cols: number, rows: number) {
  const r = rectOf(t);
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 1; i < cols; i += 1) {
    const x = r.x + (r.w * i) / cols;
    lines.push({ x1: x, y1: r.y, x2: x, y2: r.y + r.h });
  }
  for (let i = 1; i < rows; i += 1) {
    const y = r.y + (r.h * i) / rows;
    lines.push({ x1: r.x, y1: y, x2: r.x + r.w, y2: y });
  }
  return lines;
}

/** One mark per participating practice, laid out inside the SOM rectangle. */
const PRACTICES = 1895;
const practiceDots = (() => {
  const r = rectOf(tiers[2]);
  const cols = Math.ceil(Math.sqrt(PRACTICES * (r.w / r.h)));
  const rows = Math.ceil(PRACTICES / cols);
  const dots: { cx: number; cy: number }[] = [];
  for (let i = 0; i < PRACTICES; i += 1) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    dots.push({
      cx: r.x + (r.w * (col + 0.5)) / cols,
      cy: r.y + (r.h * (row + 0.5)) / rows,
    });
  }
  return { dots, cell: r.w / cols };
})();

export default function MarketFunnel() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  /**
   * Whether the opening fly-through has run. A ref, not state, and
   * deliberately: flipping a state flag inside the effect that schedules the
   * timers would put that flag in the effect's own dependency list, so the
   * effect would re-run and its cleanup would clear the timers it had just
   * set.
   */
  const played = useRef(false);

  /**
   * The fly-through runs once, when the figure is actually on screen.
   *
   * This watches intersection directly rather than reusing the site's Reveal
   * state, which reports "idle" before it has measured anything. Keying off
   * that fired the animation at mount, while the figure was still below the
   * fold, and then cancelled it a tick later when the measurement came in —
   * so it played to nobody and never played again.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || played.current) return;
        played.current = true;
        observer.disconnect();
        timers.current = [
          window.setTimeout(() => setActive(1), HOLD),
          window.setTimeout(() => setActive(2), HOLD * 2),
        ];
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  /** Any manual selection cancels whatever the fly-through had queued. */
  const select = (i: number) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    played.current = true;
    setActive(i);
  };

  const tier = tiers[active];
  const zoom = zoomOf(tier);

  return (
    <div ref={ref}>
      <figcaption>
        <p className="eyebrow">{market.eyebrow}</p>
        <p className="mt-2 font-display text-lg font-semibold leading-snug text-fog">{market.title}</p>
        <p className="mt-2 text-sm text-fog">{market.intro}</p>
      </figcaption>

      <div className="mf-stage mt-7 overflow-hidden rounded-xl border border-line bg-ink-950">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={tiers
            .map((t, i) => `${t.label}: ${t.value} a year${i ? `, ${shareOfParent(i)} of the tier above` : ""}`)
            .join(". ")}
        >
          {/* The camera. Everything is concentric, so this is a pure zoom
              about the centre of the frame. */}
          <g
            className="mf-camera"
            style={{ transform: `translate(${CX}px, ${CY}px) scale(${zoom}) translate(${-CX}px, ${-CY}px)` }}
          >
            {tiers.map((t, i) => {
              const r = rectOf(t);
              const on = i === active;
              /* Negative: already passed, and now the surroundings. Positive:
                 still to come, and drawn as an invitation to go there. */
              const depth = i - active;
              return (
                <g key={t.id} className="mf-tier">
                  <rect
                    x={r.x}
                    y={r.y}
                    width={r.w}
                    height={r.h}
                    rx={r.w * 0.012}
                    /* Lighter the deeper it sits, so at the widest view the
                       three read as nested rooms rather than as a hole cut in
                       a panel. Depth, not magnitude — size already carries
                       the value. */
                    fill={TIER_FILL[i]}
                    stroke={on ? "var(--color-teal-200)" : "var(--color-teal-400)"}
                    strokeWidth={on ? 2 : 1.2}
                    strokeOpacity={on ? 1 : 0.5}
                    vectorEffect="non-scaling-stroke"
                  />
                  {/* Only the active tier is ruled. A passed tier's grid is
                      metres wide at this magnification and reads as stray
                      lines across the frame; an unreached tier's is a smudge.
                      Dropped too once the practices are drawn, which are the
                      finer structure. */}
                  {on && !(i === 2) && (
                    <g
                      stroke="var(--color-teal-200)"
                      strokeWidth={0.6}
                      vectorEffect="non-scaling-stroke"
                      opacity={0.3}
                    >
                      {gridOf(t, 16, 10).map((l, n) => (
                        <line key={n} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                      ))}
                    </g>
                  )}
                </g>
              );
            })}

            {/* The payoff at the bottom of the descent: one mark per practice.
                Only mounted at that depth — 1,895 nodes is not worth carrying
                while they are far too small to see. */}
            {active === 2 && (
              <g className="mf-practices" fill="var(--color-ink-950)" opacity={0.72}>
                {practiceDots.dots.map((d, i) => (
                  <circle key={i} cx={d.cx} cy={d.cy} r={practiceDots.cell * 0.17} />
                ))}
              </g>
            )}
          </g>

          {/* Chrome, in screen space so it never scales with the camera.
              The pins marking where the zoom goes next live here too, rather
              than inside the camera under a counter-scale: everything is
              concentric, so a world point maps to the screen by the one line
              below, and the label is then simply drawn at a fixed size. */}
          <g className="mf-chrome" aria-hidden="true">
            {tiers.map((t, i) => {
              if (i <= active) return null;
              const r = rectOf(t);
              const sx = CX + (r.x - CX) * zoom;
              const sy = CY + (r.y - CY) * zoom;
              if (sx < 8 || sy < 24 || sx > VIEW_W - 60) return null;
              return (
                <text key={t.id} x={sx} y={sy - 9} className="mf-pin">
                  {t.abbr}
                </text>
              );
            })}
            <text x={22} y={38} className="mf-abbr">
              {tier.abbr}
            </text>
            <text x={VIEW_W - 22} y={38} className="mf-zoom" textAnchor="end">
              ×{zoom < 10 ? zoom.toFixed(1) : Math.round(zoom)}
            </text>
          </g>
        </svg>
      </div>

      {/* The stepper is the control: clickable, tabbable, and the same thing
          the fly-through drives, so there is never a hidden second state. */}
      <div role="group" aria-label="Market tier" className="mt-4 flex gap-2">
        {tiers.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => select(i)}
            aria-pressed={i === active}
            className={`mf-step flex-1 rounded-lg border px-3 py-2 text-left ${
              i === active ? "is-on border-teal-400" : "border-line hover:border-line-strong"
            }`}
          >
            <span className="figure block text-xs font-semibold tracking-[0.12em] text-teal-400">{t.abbr}</span>
            <span className="figure mt-0.5 block text-lg font-medium text-fog">{t.value}</span>
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 min-h-[7.5rem]">
        <p className="font-display text-base font-semibold text-fog">{tier.label}</p>
        <p className="mt-2 text-sm leading-relaxed text-fog">
          <span className="figure text-fog">{tier.people}</span> {tier.peopleNote}.
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-fog">
          <span className="figure text-fog">{tier.value}</span> {tier.valueNote}
          {active > 0 && <> — {shareOfParent(active)} of the tier above</>}.
        </p>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-fog">{market.footnote}</p>
    </div>
  );
}
