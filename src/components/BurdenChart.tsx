import { burden } from "@/content/site";
import PrevalenceFrame from "./PrevalenceFrame";
import MarketFunnel from "./MarketFunnel";

/**
 * The two figures under "the unmet need": how many people have AMD, and how
 * much of that is a market this company can actually reach.
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

      {/* What of it is reachable */}
      <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
        <MarketFunnel />
      </figure>
    </div>
  );
}
