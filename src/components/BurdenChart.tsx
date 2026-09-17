import { burden } from "@/content/site";
import { prevalence } from "@/content/prevalence";
import PrevalenceFrame from "./PrevalenceFrame";
import PrevalenceMap from "./PrevalenceMap";

/**
 * The two figures under "the unmet need": how many people have AMD and where
 * they are.
 *
 * A server component, which matters — it lets the map's ~110KB of coastline
 * geometry render as markup instead of shipping to the browser as JavaScript.
 * The animated waffle that used to fill the right panel is what forced this
 * to be a client component; it is gone, and with it the "use client".
 */
type Props = {
  /** Side by side where there is room for two full-width cards; stacked in a narrower column. */
  layout?: "side" | "stack";
};

export default function BurdenChart({ layout = "side" }: Props) {
  return (
    <div className={`grid gap-6 ${layout === "side" ? "md:grid-cols-2" : ""}`}>
      {/* How many */}
      <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <figcaption>
          <p className="eyebrow">{burden.prevalence.title}</p>
          <p className="mt-2 text-sm text-fog/75">{burden.prevalence.note}</p>
        </figcaption>
        <div className="mt-8">
          <PrevalenceFrame />
        </div>
        <p className="mt-4 text-xs text-fog/70">Source: {burden.prevalence.source}</p>
      </figure>

      {/* Where */}
      <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <figcaption>
          <p className="eyebrow">{prevalence.legend.label}</p>
          <p className="mt-2 text-sm text-fog/75">
            Seven major markets, the ones GlobalData forecasts. Hover or tab through a country for its figures.
          </p>
        </figcaption>
        <div className="mt-8">
          <PrevalenceMap />
        </div>
      </figure>
    </div>
  );
}
