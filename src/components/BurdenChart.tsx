import { burden } from "@/content/site";
import PrevalenceFrame from "./PrevalenceFrame";

/**
 * How many people have AMD.
 *
 * The market figure used to sit beside this one and now lives on the investors
 * page alone. The two were only ever paired for layout: this is the clinical
 * case, which every reader needs, while the size of the opportunity is an
 * argument addressed to one reader in particular, and the home page is not
 * where that conversation belongs.
 */
export default function BurdenChart() {
  return (
    <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
      <figcaption>
        <p className="eyebrow">{burden.prevalence.title}</p>
        <p className="mt-2 text-sm text-fog">{burden.prevalence.note}</p>
      </figcaption>
      <div className="mt-8">
        <PrevalenceFrame />
      </div>
      <p className="mt-4 text-xs text-fog">Source: {burden.prevalence.source}</p>
    </figure>
  );
}
