/**
 * The published literature on photobiomodulation in dry AMD.
 *
 * Rules for this file, which exist because getting them wrong on a medical
 * device company's website is a regulatory problem and not a style problem:
 *
 * 1. Every entry is a real paper. Bibliographic data (authors, journal,
 *    volume, pages, DOI, PMID) was taken from the NCBI E-utilities API, not
 *    written from memory. Do not add an entry by hand without checking it the
 *    same way.
 * 2. Every `finding` restates what that paper's own abstract says. Where no
 *    abstract was available, the finding restates the title and claims
 *    nothing further.
 * 3. Studies that do not support the approach are listed alongside those that
 *    do, with the same prominence. A library that only carries supportive
 *    work is marketing, and a clinical audience reads it as marketing.
 * 4. None of this is evidence about Revolux, which has not been through
 *    clinical investigation. The framing text says so, and must keep saying
 *    so until that changes.
 */

export type Direction = "supportive" | "mixed" | "cautionary" | "context";
export type Topic = "clinical" | "mechanism" | "economics" | "background";

export type Study = {
  id: string;
  title: string;
  authors: string;
  citation: string;
  year: number;
  doi: string;
  pmid: string;
  design: string;
  topic: Topic;
  direction: Direction;
  finding: string;
};

/**
 * The gate. While this is false the page carries a draft banner and is served
 * noindex, and it stays out of the sitemap. Flip it to true only once a
 * clinician has read every entry against its source.
 */
export const evidenceSignedOff = false;

export const evidence = {
  eyebrow: "The published record",
  title: "What the literature actually says.",
  intro:
    "Photobiomodulation in dry AMD has a real evidence base, and it is genuinely mixed. Everything published that we are aware of is below, including the meta-analysis that found no clinical benefit and the position statement from the German ophthalmological societies.",
  scope: {
    title: "What this page is not",
    body: [
      "None of these studies tested Revolux. Revolux has not been through clinical investigation, and we make no claim of clinical benefit for it. The trials below used other devices, principally the LumiThera Valeda Light Delivery System at 590, 660 and 850 nm.",
      "They are here because they are the evidence base our approach rests on, and because anyone assessing this company seriously should be able to read the unsupportive findings in the same place as the supportive ones.",
    ],
  },
  draftNotice: {
    title: "Draft, pending clinical sign-off",
    body: "Every citation on this page has been checked against the NCBI record, and every summary restates that paper's own abstract. The summaries have not yet been reviewed by our clinical advisers, so this page is not yet indexed by search engines.",
  },
  directions: [
    { id: "supportive", label: "Reports benefit" },
    { id: "mixed", label: "Mixed or qualified" },
    { id: "cautionary", label: "Reports no benefit" },
    { id: "context", label: "Background" },
  ],
  topics: [
    { id: "clinical", label: "Clinical studies" },
    { id: "mechanism", label: "Mechanism" },
    { id: "economics", label: "Health economics" },
    { id: "background", label: "Burden and standard of care" },
  ],
} as const;

export const studies: Study[] = [
  {
    id: "lightsite-iii-24",
    title: "Long-term efficacy and safety of photobiomodulation in dry age-related macular degeneration (LIGHTSITE III: 24-month analysis)",
    authors: "Jaffe GJ, Boyer D, Hu A, et al.",
    citation: "Retina. 2026;46(5):783-795.",
    year: 2026,
    doi: "10.1097/IAE.0000000000004822",
    pmid: "41791029",
    design: "Double-masked, randomised, sham-controlled trial",
    topic: "clinical",
    direction: "supportive",
    finding:
      "148 eyes in 100 subjects. Met its prespecified primary acuity endpoint at month 21 with a +6.2 letter gain after photobiomodulation (P = 0.0036). 61.5% of treated eyes gained at least 5 letters, 23.1% at least 10. A favourable safety profile was reported.",
  },
  {
    id: "lightsite-iii-13",
    title: "LIGHTSITE III: 13-month efficacy and safety evaluation of multiwavelength photobiomodulation in nonexudative (dry) age-related macular degeneration using the LumiThera Valeda Light Delivery System",
    authors: "Boyer D, Hu A, Warrow D, et al.",
    citation: "Retina. 2024;44(3):487-497.",
    year: 2024,
    doi: "10.1097/IAE.0000000000003980",
    pmid: "37972955",
    design: "Randomised, controlled trial",
    topic: "clinical",
    direction: "supportive",
    finding:
      "Nine sessions over three to five weeks, every four months. Met its primary acuity endpoint with a 2.4-letter difference between groups (P = 0.02), and a significant reduction in new-onset geographic atrophy (P = 0.024). Note that the sham group also improved, by 3.0 letters.",
  },
  {
    id: "lightsite-i",
    title: "A double-masked, randomized, sham-controlled, single-center study with photobiomodulation for the treatment of dry age-related macular degeneration",
    authors: "Markowitz SN, Devenyi RG, Munk MR, et al.",
    citation: "Retina. 2020;40(8):1471-1482.",
    year: 2020,
    doi: "10.1097/IAE.0000000000002632",
    pmid: "31404033",
    design: "Double-masked, randomised, sham-controlled trial",
    topic: "clinical",
    direction: "supportive",
    finding:
      "LIGHTSITE I. Thirty subjects, 46 eyes, treated in two series over a year. Around 50% of treated subjects improved by at least 5 letters at month 1, against 13.6% of sham-treated subjects.",
  },
  {
    id: "early-stage",
    title: "Multiwavelength photobiomodulation improves multiple aspects of visual function in early-stage dry age-related macular degeneration",
    authors: "Küçükerdönmez C, Tedford SE",
    citation: "Ophthalmol Ther. 2025;14(8):1843-1853.",
    year: 2025,
    doi: "10.1007/s40123-025-01183-2",
    pmid: "40549133",
    design: "Prospective interventional study",
    topic: "clinical",
    direction: "supportive",
    finding:
      "41 eyes in 27 participants with earlier-stage disease and better starting vision. Acuity, contrast sensitivity and electroretinography all improved, with larger effects after repeated treatment series. The authors note that earlier-stage populations may not show large effects because their starting vision is not seriously impaired.",
  },
  {
    id: "rassi-meta",
    title: "Photobiomodulation efficacy in age-related macular degeneration: a systematic review and meta-analysis of randomized clinical trials",
    authors: "Rassi TNO, Barbosa LM, Pereira S, et al.",
    citation: "Int J Retina Vitreous. 2024;10(1):54.",
    year: 2024,
    doi: "10.1186/s40942-024-00569-x",
    pmid: "39148091",
    design: "Systematic review and meta-analysis",
    topic: "clinical",
    direction: "mixed",
    finding:
      "Three randomised trials, 247 eyes. Pooled analysis found photobiomodulation significantly improved acuity (1.76 letters) and drusen volume. However, trial sequential analysis found the samples too small for reliable conclusions, every study was judged at high risk of bias, and the improvement fell below the minimal clinically important difference. The authors conclude that statistically significant improvements do not translate into clinical benefit and that larger trials are needed.",
  },
  {
    id: "chen-meta",
    title: "Is multiwavelength photobiomodulation effective and safe for age-related macular degeneration? A systematic review and meta-analysis",
    authors: "Chen KY, Lee HK, Chan HC, et al.",
    citation: "Ophthalmol Ther. 2025;14(5):969-987.",
    year: 2025,
    doi: "10.1007/s40123-025-01119-w",
    pmid: "40089957",
    design: "Systematic review and meta-analysis",
    topic: "clinical",
    direction: "cautionary",
    finding:
      "Six studies, 360 patients, 477 eyes. No significant improvement in acuity, drusen volume, geographic atrophy, central subfield thickness or microperimetry, with high heterogeneity between studies. The authors conclude that to date there is no significant clinical benefit demonstrated.",
  },
  {
    id: "dog-statement",
    title: "Photobiomodulation for AMD: statement of the German Society of Ophthalmology, the German Retina Society and the German Professional Association of Ophthalmologists, status 4 July 2025",
    authors: "Deutsche Ophthalmologische Gesellschaft (DOG), Retinologische Gesellschaft, Berufsverband der Augenärzte Deutschlands",
    citation: "Ophthalmologie. 2025;122(11):888-889.",
    year: 2025,
    doi: "10.1007/s00347-025-02303-w",
    pmid: "40888930",
    design: "Position statement of three professional bodies",
    topic: "clinical",
    direction: "cautionary",
    finding:
      "A joint position statement on photobiomodulation in AMD from the three German ophthalmological professional bodies. No abstract is indexed; it is listed here because a statement from three national professional bodies belongs in any honest reading of this field, and should be read in full.",
  },
  {
    id: "cost-effectiveness",
    title: "Cost-effectiveness of photobiomodulation for intermediate dry age-related macular degeneration: a model-based analysis using the LIGHTSITE III 24-month trial",
    authors: "Watane A, Witkin A, Heier J, et al.",
    citation: "Am J Ophthalmol. 2026;291:324-333.",
    year: 2026,
    doi: "10.1016/j.ajo.2026.07.035",
    pmid: "42501959",
    design: "Markov model, US payer perspective",
    topic: "economics",
    direction: "supportive",
    finding:
      "Ten-year horizon. An incremental cost-effectiveness ratio of $73,910 per quality-adjusted life year, below both the $100,000 and $150,000 US willingness-to-pay thresholds, driven mainly by a 71.7% relative reduction in incident geographic atrophy at 24 months. The authors support coverage consideration pending independent replication of that reduction.",
  },
  {
    id: "shinhmar-2020",
    title: "Optically improved mitochondrial function redeems aged human visual decline",
    authors: "Shinhmar H, Grewal M, Sivaprasad S, et al.",
    citation: "J Gerontol A Biol Sci Med Sci. 2020;75(9):e49-e52.",
    year: 2020,
    doi: "10.1093/gerona/glaa155",
    pmid: "32596723",
    design: "Psychophysical study in humans",
    topic: "mechanism",
    direction: "context",
    finding:
      "670 nm light used to improve photoreceptor performance, measured psychophysically in people aged 28 to 72. The paper sets out the rationale that mitochondrial density is greatest in photoreceptors, that retinal ATP falls by around 70% over life, and that wavelengths from 650 nm upwards improve mitochondrial complex activity.",
  },
  {
    id: "shinhmar-2021",
    title: "Weeklong improved colour contrasts sensitivity after single 670 nm exposures associated with enhanced mitochondrial function",
    authors: "Shinhmar H, Hogg C, Neveu M, et al.",
    citation: "Sci Rep. 2021;11(1):22872.",
    year: 2021,
    doi: "10.1038/s41598-021-02311-1",
    pmid: "34819619",
    design: "Interventional study in humans",
    topic: "mechanism",
    direction: "context",
    finding:
      "Reports improved colour contrast sensitivity lasting around a week after a single 670 nm exposure, associated with enhanced mitochondrial function.",
  },
  {
    id: "hamblin-2018",
    title: "Mechanisms and mitochondrial redox signaling in photobiomodulation",
    authors: "Hamblin MR",
    citation: "Photochem Photobiol. 2018;94(2):199-212.",
    year: 2018,
    doi: "10.1111/php.12864",
    pmid: "29164625",
    design: "Review",
    topic: "mechanism",
    direction: "context",
    finding:
      "A review of the proposed mechanisms of photobiomodulation and the mitochondrial redox signalling through which it is thought to act.",
  },
  {
    id: "siqueira-2026",
    title: "Molecular mechanisms of photobiomodulation in retinal diseases: cytochrome c oxidase, mitochondrial bioenergetics and cytoprotective signalling",
    authors: "Siqueira RC",
    citation: "Int J Mol Sci. 2026;27(13).",
    year: 2026,
    doi: "10.3390/ijms27135683",
    pmid: "42449957",
    design: "Review",
    topic: "mechanism",
    direction: "context",
    finding:
      "A review of the molecular mechanisms proposed for photobiomodulation in retinal disease, covering cytochrome c oxidase, mitochondrial bioenergetics and cytoprotective signalling.",
  },
  {
    id: "toro-2026",
    title: "Photobiomodulation for photoreceptor rescue in retinal disease: mitochondrial, redox, vascular, and translational perspectives — a narrative review",
    authors: "Toro MD, Avitabile A, Amato R, et al.",
    citation: "Antioxidants (Basel). 2026;15(8).",
    year: 2026,
    doi: "10.3390/antiox15081034",
    pmid: "42650298",
    design: "Narrative review",
    topic: "mechanism",
    direction: "context",
    finding:
      "A narrative review of photobiomodulation for photoreceptor rescue, covering mitochondrial, redox, vascular and translational perspectives.",
  },
  {
    id: "sivapathasuntharam-2019",
    title: "Improving mitochondrial function significantly reduces the rate of age related photoreceptor loss",
    authors: "Sivapathasuntharam C, Sivaprasad S, Hogg C, et al.",
    citation: "Exp Eye Res. 2019;185:107691.",
    year: 2019,
    doi: "10.1016/j.exer.2019.107691",
    pmid: "31181197",
    design: "Animal study",
    topic: "mechanism",
    direction: "context",
    finding:
      "Reports that improving mitochondrial function significantly reduces the rate of age-related photoreceptor loss.",
  },
  {
    id: "wong-2014",
    title: "Global prevalence of age-related macular degeneration and disease burden projection for 2020 and 2040: a systematic review and meta-analysis",
    authors: "Wong WL, Su X, Li X, et al.",
    citation: "Lancet Glob Health. 2014;2(2):e106-16.",
    year: 2014,
    doi: "10.1016/S2214-109X(13)70145-1",
    pmid: "25104651",
    design: "Systematic review and meta-analysis",
    topic: "background",
    direction: "context",
    finding:
      "The source of the prevalence and projection figures used elsewhere on this site: people living with AMD worldwide in 2020, and the projection to 2040.",
  },
  {
    id: "areds2",
    title: "Lutein + zeaxanthin and omega-3 fatty acids for age-related macular degeneration: the Age-Related Eye Disease Study 2 (AREDS2) randomized clinical trial",
    authors: "Age-Related Eye Disease Study 2 Research Group",
    citation: "JAMA. 2013;309(19):2005-15.",
    year: 2013,
    doi: "10.1001/jama.2013.4997",
    pmid: "23644932",
    design: "Randomised clinical trial",
    topic: "background",
    direction: "context",
    finding:
      "The trial behind the supplement formulation that is currently offered to most patients with intermediate dry AMD, and therefore the comparator any new intervention is judged against.",
  },
];
