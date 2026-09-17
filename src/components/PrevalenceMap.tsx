import { markets, prevalence } from "@/content/prevalence";
import { WORLD, WORLD_VIEWBOX } from "@/content/world-map";
import MapHover from "./MapHover";

/**
 * AMD prevalent cases across the seven major markets, on an Equal Earth map.
 *
 * This is a server component on purpose. The coastline paths are ~110KB of
 * static geometry; rendered here they ship as markup, which compresses well
 * and costs the visitor no JavaScript. Only the hover readout is a client
 * component, and it wraps this markup as children rather than importing the
 * geometry itself.
 *
 * Colour is sequential: one hue, interpolated in OKLab between two steps of
 * the site's own teal ramp, so lightness rises monotonically with the case
 * count. On a dark surface more-is-brighter, which is the opposite anchor
 * from a light-surface ramp and the right one here. Countries the forecast
 * does not cover are left in the surface grey — not the palest teal, which
 * would read as "very few cases" rather than "no data".
 */

const LOW = Math.min(...markets.map((m) => m.total));
const HIGH = Math.max(...markets.map((m) => m.total));
/** Floor of the ramp, so the smallest market still reads as coloured. */
const FLOOR = 0.18;

function fillFor(total: number) {
  const t = FLOOR + (1 - FLOOR) * ((total - LOW) / (HIGH - LOW));
  return `color-mix(in oklab, var(--color-teal-200) ${(t * 100).toFixed(1)}%, var(--color-teal-700))`;
}

const byId = new Map(markets.map((m) => [m.id, m]));
const fmt = (n: number) => `${(n / 1_000_000).toFixed(1)}M`;

export default function PrevalenceMap() {
  return (
    <MapHover>
      <svg
        viewBox={WORLD_VIEWBOX}
        className="h-auto w-full"
        role="img"
        aria-label={`World map. Total prevalent cases of AMD in 2024 across the seven major markets: ${markets
          .map((m) => `${m.name}, ${fmt(m.total)}`)
          .join("; ")}.`}
      >
        <g strokeLinejoin="round">
          {/* Coastlines. Countries in the forecast are drawn again below with a
              fat transparent stroke, because several of them are only a few
              pixels across at this size and would be unhoverable otherwise. */}
          {WORLD.map((c) => {
            const market = byId.get(c.id);
            return (
              <path
                key={c.id}
                d={c.d}
                className={market ? "wm-market" : "wm-rest"}
                fill={market ? fillFor(market.total) : "var(--color-ink-600)"}
                stroke="var(--color-ink-950)"
                strokeWidth={market ? 1.1 : 0.6}
                {...(market
                  ? {
                      "data-market": market.id,
                      "data-name": market.name,
                      "data-total": fmt(market.total),
                      "data-diagnosed": fmt(market.diagnosed),
                      "data-agr": `${market.agr.toFixed(2)}%`,
                      tabIndex: 0,
                      role: "button",
                      "aria-label": `${market.name}: ${fmt(market.total)} total prevalent cases, ${fmt(
                        market.diagnosed,
                      )} diagnosed, growing ${market.agr.toFixed(2)}% a year`,
                    }
                  : { "aria-hidden": "true" })}
              />
            );
          })}
        </g>

        {/* Hit areas, over the top so they take the pointer. They carry the
            same data attributes as the painted path, because the readout
            reads whichever element the pointer actually landed on. */}
        <g fill="none" strokeWidth="9" strokeLinejoin="round">
          {markets.map((m) => {
            const shape = WORLD.find((c) => c.id === m.id);
            if (!shape) return null;
            return (
              <path
                key={m.id}
                d={shape.d}
                className="wm-hit"
                aria-hidden="true"
                data-market={m.id}
                data-name={m.name}
                data-total={fmt(m.total)}
                data-diagnosed={fmt(m.diagnosed)}
                data-agr={`${m.agr.toFixed(2)}%`}
              />
            );
          })}
        </g>
      </svg>
    </MapHover>
  );
}

export { fmt, prevalence };
