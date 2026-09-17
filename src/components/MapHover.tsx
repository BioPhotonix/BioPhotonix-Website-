"use client";

import { useState, type ReactNode } from "react";
import { markets, prevalence } from "@/content/prevalence";

/**
 * The readout over the prevalence map.
 *
 * It wraps the server-rendered SVG as `children` so the coastline geometry
 * never reaches the client bundle, and reads each country's figures off the
 * data attributes the server put on the path. That keeps this component
 * independent of the map's size: it would work the same over a map of two
 * hundred countries or two.
 *
 * Pointer and keyboard are handled by the same delegated listeners, so
 * tabbing through the coloured countries gives exactly what hovering does.
 */

type Hovered = { name: string; total: string; diagnosed: string; agr: string };

const fmt = (n: number) => `${(n / 1_000_000).toFixed(1)}M`;

export default function MapHover({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const read = (el: Element) => {
    const path = el.closest("[data-market]");
    if (!(path instanceof SVGElement)) return setHovered(null);
    setHovered({
      name: path.getAttribute("data-name") ?? "",
      total: path.getAttribute("data-total") ?? "",
      diagnosed: path.getAttribute("data-diagnosed") ?? "",
      agr: path.getAttribute("data-agr") ?? "",
    });
  };

  return (
    <div>
      <div
        className="wm-frame"
        onPointerOver={(e) => read(e.target as Element)}
        onPointerLeave={() => setHovered(null)}
        onFocusCapture={(e) => read(e.target as Element)}
        onBlurCapture={() => setHovered(null)}
      >
        {children}
      </div>

      {/* The readout. Pinned under the map rather than floating at the
          country: the frame is short and wide, so a tooltip placed by a
          country would hang outside it more often than not. Pinned, it never
          needs flipping or clamping, it reads the same on hover, keyboard
          focus and touch, and with nothing selected it does useful work by
          showing the seven-market totals. */}
      <div aria-live="polite" className="mt-5 min-h-[4.5rem] rounded-xl border border-line bg-ink-950/60 px-5 py-4">
        <p className="font-display text-base font-semibold text-fog">{hovered ? hovered.name : "All seven markets"}</p>
        <dl className="mt-2 flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-fog/70">Living with AMD</dt>
            <dd className="figure text-base text-fog">{hovered ? hovered.total : fmt(prevalence.totals.total2024)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-fog/70">Diagnosed</dt>
            <dd className="figure text-base text-fog">{hovered ? hovered.diagnosed : fmt(prevalence.totals.diagnosed2024)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-sm text-fog/70">Growth a year</dt>
            <dd className="figure text-base text-fog">
              {hovered ? hovered.agr : `${prevalence.totals.agr.toFixed(2)}%`}
            </dd>
          </div>
        </dl>
      </div>

      {/* Legend. A single sequential ramp, so the gradient is the key. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        <div>
          <p className="figure text-xs text-fog/70">{prevalence.legend.label}</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="figure text-sm text-fog/85">{prevalence.legend.low}</span>
            <span
              aria-hidden="true"
              className="h-2.5 w-36 rounded-full"
              style={{ background: "linear-gradient(to right in oklab, var(--color-teal-700), var(--color-teal-200))" }}
            />
            <span className="figure text-sm text-fog/85">{prevalence.legend.high}</span>
          </div>
        </div>
        <p className="flex items-center gap-2.5 text-sm text-fog/70">
          <span aria-hidden="true" className="h-3.5 w-3.5 rounded-[3px] bg-ink-600 ring-1 ring-line" />
          {prevalence.legend.none}
        </p>
      </div>

      <details className="mt-6 text-sm text-fog/70">
        <summary className="cursor-pointer select-none">The figures behind this map</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="figure w-full min-w-[30rem] text-left">
            <thead>
              <tr className="text-fog/70">
                <th className="py-1.5 pr-4 font-medium">Market</th>
                <th className="py-1.5 pr-4 text-right font-medium">Living with AMD</th>
                <th className="py-1.5 pr-4 text-right font-medium">Diagnosed</th>
                <th className="py-1.5 text-right font-medium">Growth a year</th>
              </tr>
            </thead>
            <tbody className="text-fog/85">
              {markets.map((m) => (
                <tr key={m.id} className="border-t border-line">
                  <td className="py-1.5 pr-4">{m.name}</td>
                  <td className="py-1.5 pr-4 text-right">{m.total.toLocaleString("en-GB")}</td>
                  <td className="py-1.5 pr-4 text-right">{m.diagnosed.toLocaleString("en-GB")}</td>
                  <td className="py-1.5 text-right">{m.agr.toFixed(2)}%</td>
                </tr>
              ))}
              <tr className="border-t border-line-strong text-fog">
                <td className="py-1.5 pr-4 font-medium">Seven markets</td>
                <td className="py-1.5 pr-4 text-right font-medium">{prevalence.totals.total2024.toLocaleString("en-GB")}</td>
                <td className="py-1.5 pr-4 text-right font-medium">{prevalence.totals.diagnosed2024.toLocaleString("en-GB")}</td>
                <td className="py-1.5 text-right font-medium">{prevalence.totals.agr.toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl">
          By 2034 the seven-market total is forecast to reach {fmt(prevalence.totals.total2034)} cases, of which{" "}
          {fmt(prevalence.totals.diagnosed2034)} diagnosed.
        </p>
        <ul className="mt-3 flex max-w-2xl flex-col gap-1.5">
          {prevalence.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
