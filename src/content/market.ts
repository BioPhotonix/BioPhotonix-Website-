/**
 * The market model: total, serviceable and obtainable.
 *
 * The population figures are derived from GlobalData's AMD Epidemiology
 * Forecast to 2034; the values are BioPhotonix's own per-course licensing
 * model. The footnote says exactly that and should stay, because the two have
 * different standing: one is a licensed third-party forecast, the other is
 * the company's own commercial modelling.
 *
 * The scope is five European markets, and both absences from the forecast are
 * named on the page rather than left to be noticed. The United States is the
 * largest AMD market in it and the patent position there is not open to us;
 * Japan is outside the territory this plan addresses. `excluded` used to
 * account for the United States alone, which read as though it were the only
 * omission — the precise impression the paragraph exists to prevent, and the
 * one a reader who knows the forecast covers seven markets would catch.
 *
 * `share` is each tier's annual value as a fraction of the tier above, and it
 * is what the figure draws: the squares are scaled so their AREA carries the
 * ratio. That is the whole argument of the graphic — the obtainable market is
 * a very small square inside a very large one, which is the case for the
 * forecast being credible rather than the reverse.
 */

export type Tier = {
  id: "tam" | "sam" | "som";
  abbr: string;
  label: string;
  people: string;
  /** The population figure alone, shown on the tier row at rest. */
  peopleShort: string;
  peopleNote: string;
  value: string;
  valueNote: string;
  /** Annual value in millions of pounds, used to scale the squares. */
  millions: number;
};

export const tiers: Tier[] = [
  {
    id: "tam",
    abbr: "TAM",
    label: "Total addressable market",
    people: "49.7 million",
    peopleShort: "49.7 million people",
    peopleNote:
      "people across the UK, Germany, France, Italy and Spain living with early or intermediate dry AMD, rising to 55.2 million by 2034",
    value: "£22.4bn",
    valueNote: "annual value",
    millions: 22_400,
  },
  {
    id: "sam",
    abbr: "SAM",
    label: "Serviceable addressable market",
    people: "1.67 million",
    peopleShort: "1.67 million people",
    peopleNote:
      "of those people are diagnosed, clinically suitable, and able to access privately funded care in community optometry",
    value: "£753m",
    valueNote: "annual value, of which the UK is £136 million across 302,000 people",
    millions: 753,
  },
  {
    id: "som",
    abbr: "SOM",
    label: "Serviceable obtainable market",
    people: "23,000 patients",
    peopleShort: "23,000 patients a year",
    peopleNote:
      "a year in the UK launch market by year five, across 1,895 participating optometry practices",
    value: "£14.8m",
    valueNote: "annual recurring revenue, which is 2% of the serviceable market",
    millions: 14.8,
  },
];

export const market = {
  eyebrow: "The opportunity",
  title: "A small share of a serviceable market is a substantial business.",
  intro:
    "Three nested markets, drawn to scale by annual value. The obtainable market is the small square: the year-five forecast asks for two per cent of what is serviceable, not for the whole of it.",
  excluded:
    "These figures cover five European markets: the UK, Germany, France, Italy and Spain. GlobalData's forecast also covers the United States and Japan. The United States is the largest AMD market in it, and the patent position there is not open to us, so it is left out of the model rather than counted and discounted. Japan is outside the territory this plan addresses.",
  footnote:
    "Population figures derived from GlobalData's AMD Epidemiology Forecast to 2034; values based on BioPhotonix's per-course licensing model.",
};
