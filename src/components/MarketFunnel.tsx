"use client";

import { useState } from "react";
import { market, tiers, type Tier } from "@/content/market";
import { useRevealed } from "./useRevealed";

/**
 * TAM, SAM and SOM as three nested squares, drawn to scale.
 *
 * The squares carry the ratio in their AREA, not their width, so the side of
 * each is the square root of its share of the total. That is what keeps the
 * figure honest: the obtainable market is 0.066% of the total market by
 * value, which as a width would be invisible and as an area is a small but
 * findable square. A bar chart of £22.4bn against £14.8m would be a full bar
 * and a hairline, and a log scale would flatter the small number. Nesting is
 * also true to the meaning — each tier is a subset of the one outside it.
 *
 * Selecting a tier is the interaction: the squares, the rows beneath and the
 * readout are one control surface, so hover, click, tap and keyboard all do
 * the same thing. Nothing is hover-only.
 */

const OUTER = 100;

/** Side of each square, as a share of the outer one, from its area ratio. */
const sideOf = (t: Tier) => Math.sqrt(t.millions / tiers[0].millions) * OUTER;

/** Each tier's annual value as a percentage of the tier above it. */
const shareOfParent = (i: number) =>
  i === 0 ? null : `${((tiers[i].millions / tiers[i - 1].millions) * 100).toFixed(i === 1 ? 1 : 1)}%`;

export default function MarketFunnel() {
  const [active, setActive] = useState<Tier["id"] | null>(null);
  const { ref, state } = useRevealed<HTMLDivElement>();
  const shown = state !== "hidden";
  const current = tiers.find((t) => t.id === active) ?? null;

  return (
    <div ref={ref}>
      <figcaption>
        <p className="eyebrow">{market.eyebrow}</p>
        <p className="mt-2 font-display text-lg font-semibold leading-snug text-fog">{market.title}</p>
        <p className="mt-2 text-sm text-fog/75">{market.intro}</p>
      </figcaption>

      <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center">
        {/* The squares */}
        <svg
          viewBox={`0 0 ${OUTER} ${OUTER}`}
          className="mf-figure h-auto w-full max-w-[15rem]"
          role="img"
          aria-label={tiers
            .map((t, i) => `${t.label}, ${t.value} a year${i ? `, ${shareOfParent(i)} of the tier above` : ""}`)
            .join(". ")}
        >
          {tiers.map((t, i) => {
            const side = sideOf(t);
            const offset = (OUTER - side) / 2;
            const on = active === t.id;
            return (
              <rect
                key={t.id}
                x={offset}
                y={offset}
                width={side}
                height={side}
                rx={Math.min(3, side / 4)}
                className={`mf-square ${on ? "is-on" : ""} ${shown ? "is-in" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
                fill={`color-mix(in oklab, var(--color-teal-200) ${18 + i * 34}%, var(--color-teal-700))`}
                stroke="var(--color-ink-900)"
                strokeWidth={0.7}
                onPointerEnter={() => setActive(t.id)}
                onPointerLeave={() => setActive(null)}
              />
            );
          })}
          <text x={4.5} y={8.5} className="mf-leader-text" aria-hidden="true">
            TAM
          </text>
          {/* A leader to the innermost square, which is deliberately tiny. */}
          <g className="mf-leader" aria-hidden="true">
            <line x1={50 + sideOf(tiers[2]) / 2} y1={50} x2={78} y2={26} />
            <text x={79} y={24} className="mf-leader-text">
              SOM
            </text>
          </g>
        </svg>

        {/* The tiers, which are the real controls */}
        <ul className="flex flex-col gap-px overflow-hidden rounded-xl border border-line bg-line">
          {tiers.map((t, i) => (
            <li key={t.id}>
              <button
                type="button"
                className={`mf-row w-full bg-ink-900 px-4 py-3 text-left ${active === t.id ? "is-on" : ""}`}
                onPointerEnter={() => setActive(t.id)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(t.id)}
                onBlur={() => setActive(null)}
                aria-pressed={active === t.id}
                aria-label={`${t.abbr}, ${t.label}: ${t.value} a year, ${t.people} ${t.peopleNote}`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="figure text-xs font-semibold tracking-[0.12em] text-teal-400">{t.abbr}</span>
                  <span className="figure text-lg font-medium text-fog">{t.value}</span>
                </span>
                <span className="mt-0.5 block text-sm text-fog/75">{t.label}</span>
                {/* The population sits on the row rather than only in the
                    readout: on a touch screen there is no hover, and this is
                    the substance of the tier. */}
                <span className="figure mt-1 block text-xs text-fog/70">
                  {t.peopleShort}
                  {i > 0 && <> &middot; {shareOfParent(i)} of the tier above</>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* One readout for the whole control surface. */}
      <div aria-live="polite" className="mt-6 min-h-[6.5rem] rounded-xl border border-line bg-ink-950/60 px-5 py-4">
        {current ? (
          <>
            <p className="font-display text-base font-semibold text-fog">{current.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-fog/80">
              <span className="figure text-fog">{current.people}</span> {current.peopleNote}.
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-fog/80">
              <span className="figure text-fog">{current.value}</span> {current.valueNote}.
            </p>
          </>
        ) : (
          <>
            <p className="font-display text-base font-semibold text-fog">Five European markets</p>
            <p className="mt-2 text-sm leading-relaxed text-fog/80">{market.excluded}</p>
          </>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-fog/70">{market.footnote}</p>
    </div>
  );
}
