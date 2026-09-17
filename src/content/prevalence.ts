/**
 * AMD prevalence across the seven major pharmaceutical markets.
 *
 * Every figure here is transcribed from GlobalData, "Age-Related Macular
 * Degeneration: Epidemiology Forecast to 2034" (report GDHCER342-25,
 * September 2025), which BioPhotonix holds under licence via the Scottish
 * Enterprise Research Service. Total prevalent cases and growth rates are
 * Figure 17; diagnosed prevalent cases are Figure 3. Both are men and women
 * combined, aged 50 and over.
 *
 * Two honesty notes that should survive any edit:
 *
 * 1. This is seven countries, not the world. The report forecasts the 7MM
 *    only, so the map colours seven countries and leaves the rest of the
 *    world plainly uncoloured rather than implying an estimate we do not
 *    have. The global total alongside it is Wong et al. 2014, which is the
 *    source already used elsewhere on the site.
 * 2. The map is coloured by case counts, not by prevalence rate. A country
 *    with more people has more cases; that is what a market-size map is for,
 *    and the legend says "cases" rather than "prevalence" so it cannot be
 *    read as a rate.
 */

export type Market = {
  /** Numeric ISO 3166-1 code, matching the ids in world-map.ts. */
  id: string;
  name: string;
  /** Total prevalent cases of AMD, 2024. */
  total: number;
  /** Diagnosed prevalent cases, 2024. */
  diagnosed: number;
  /** Annual growth rate of total prevalent cases to 2034, percent. */
  agr: number;
};

export const markets: Market[] = [
  { id: "840", name: "United States", total: 23_514_756, diagnosed: 11_018_976, agr: 1.24 },
  { id: "392", name: "Japan", total: 16_353_437, diagnosed: 7_237_419, agr: 0.35 },
  { id: "380", name: "Italy", total: 15_968_480, diagnosed: 6_954_173, agr: 1.01 },
  { id: "250", name: "France", total: 12_570_578, diagnosed: 5_544_482, agr: 1.09 },
  { id: "826", name: "United Kingdom", total: 9_653_399, diagnosed: 5_018_647, agr: 1.29 },
  { id: "276", name: "Germany", total: 7_799_623, diagnosed: 2_797_657, agr: 0.66 },
  { id: "724", name: "Spain", total: 7_402_663, diagnosed: 3_356_562, agr: 2.05 },
];

export const prevalence = {
  eyebrow: "Where the need is",
  title: "Ninety-three million people, and more than half of them undiagnosed.",
  intro:
    "GlobalData's 2025 forecast counts AMD across the seven major markets. Hover a country for its numbers. The gap between the people who have AMD and the people who have been diagnosed with it is the gap community optometry is positioned to close.",
  legend: {
    label: "Total prevalent cases of AMD, 2024",
    low: "7.4M",
    high: "23.5M",
    none: "Outside the seven-market forecast",
  },
  totals: {
    /** 7MM totals, GlobalData Figure 17 and Figure 3. */
    total2024: 93_262_936,
    total2034: 103_016_570,
    diagnosed2024: 41_927_916,
    diagnosed2034: 54_132_433,
    agr: 1.05,
  },
  global:
    "Worldwide the figure is larger still: an estimated 196 million people were living with AMD in 2020, projected to reach 288 million by 2040.",
  sources: [
    "GlobalData, Age-Related Macular Degeneration: Epidemiology Forecast to 2034 (GDHCER342-25, September 2025). Total prevalent and diagnosed prevalent cases, both sexes, ages 50 and over.",
    "Wong et al., The Lancet Global Health, 2014, for the worldwide figures.",
  ],
};
