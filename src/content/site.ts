/**
 * Single source of truth for every piece of copy on the site.
 * Edit this file to change wording. You should not need to touch a component.
 *
 * Every figure here was carried over from the Wix site or the company's own
 * articles. Check them before a release aimed at investors: the README lists
 * the ones that need a source.
 */

export const site = {
  name: "BioPhotonix",
  legalName: "BioPhotonix Limited",
  tagline: "Photobiomodulation medical technology for dry age-related macular degeneration.",
  description:
    "BioPhotonix develops Revolux, a clinician-supervised photobiomodulation platform for early and intermediate dry AMD, built as a Class IIa medical device for community optometry.",
  /**
   * The live domain. Canonical tags, Open Graph URLs and the sitemap are all
   * built from this, so it has to be the domain that actually serves the site.
   */
  url: "https://www.biophotonix.co.uk",
  email: "info@biophotonix.co.uk",
  phone: "07380 903272",
  phoneHref: "tel:+447380903272",
  address: {
    line1: "TheBeyond, SkyPark",
    line2: "8 Elliot Street",
    city: "Glasgow",
    postcode: "G3 8EP",
    country: "Scotland",
  },
  /** The founder's own profile. There is no company page yet. */
  founderLinkedin: "https://www.linkedin.com/in/adail-islam-483ab9187/",
} as const;

export const nav = [
  { label: "Technology", href: "/technology" },
  { label: "Clinics", href: "/clinics" },
  { label: "About", href: "/about" },
  { label: "Investors", href: "/investors" },
  { label: "News", href: "/news" },
] as const;

export const headerCta = { label: "Get in touch", href: "/contact" };

export const hero = {
  status: "Class IIa medical device in development",
  title: "Vision loss should not be accepted as inevitable.",
  subtitle:
    "We develop photonic systems that safely stimulate retinal cells and support repair processes, helping to preserve central vision and independence for people living with dry macular degeneration.",
  primary: { label: "Explore Revolux", href: "/technology" },
  secondary: { label: "For investors", href: "/investors" },
  deviceAlt:
    "Render of the Revolux binocular photobiomodulation device: two eyepieces with light-emitting rings on a handheld body",
  /** The three lines that sit under the device. Short, so they read as a spec. */
  specs: [
    { label: "Indication", value: "Early and intermediate dry AMD" },
    { label: "Session", value: "5 minutes, binocular" },
    { label: "Setting", value: "Community optometry" },
  ],
};

export const burden = {
  eyebrow: "The unmet need",
  title: "A silent epidemic, treated by waiting.",
  intro:
    "Nine in ten people with age-related macular degeneration have the dry form. For most of them the standard of care is still monitoring, lifestyle advice and supplements, while their central vision declines.",
  stats: [
    { value: 200, suffix: "M", label: "people worldwide living with age-related macular degeneration" },
    { value: 90, suffix: "%", label: "of AMD is the dry form, with limited approved treatment options" },
    { value: 500, prefix: ">", suffix: "k", label: "people progress to severe vision loss from AMD each year" },
    { value: 47, prefix: "+", suffix: "%", label: "increase in AMD prevalence expected between 2020 and 2040" },
    { value: 2, prefix: "×", label: "higher risk of cognitive decline and dementia with vision impairment" },
    { value: 3, prefix: "Top ", label: "vision loss ranks among the three most feared health outcomes" },
  ],
  prevalence: {
    title: "People living with AMD worldwide",
    /** Million people per figure in the frame. */
    perFigure: 2,
    start: { year: 2020, millions: 196 },
    end: { year: 2040, millions: 288 },
    note: "Each figure is two million people. The dark centre of every head is the central vision that dry AMD takes.",
    source: "Wong et al., The Lancet Global Health, 2014. Years between the two published figures are a straight line between them.",
  },
  split: {
    title: "Where the innovation has gone",
    dry: { label: "Dry AMD", share: 90, note: "Most patients. Few options." },
    wet: { label: "Wet AMD", share: 10, note: "Most of the therapeutic investment." },
  },
  cost: {
    value: "$49B",
    label: "annual economic burden of AMD in the US alone, driven mostly by lost productivity and quality of life rather than treatment",
  },
};

export const shift = {
  eyebrow: "From observation to intervention",
  title: "Stop monitoring. Start treating.",
  body: [
    "As diagnostic technology in community optometry has advanced, retinal disease is identified earlier than ever. Yet for millions of patients an early diagnosis is followed by “watch and wait”, because hospital-grade interventions do not scale to the community setting.",
    "BioPhotonix exists to close that gap. By translating photobiomodulation into a regulated, portable medical platform, we give optometrists the means to intervene early, in the same room where the diagnosis was made.",
  ],
  today: {
    title: "The pathway today",
    steps: ["Diagnosis in community optometry", "Watch and wait", "Progressive decline", "Late referral"],
  },
  future: {
    title: "The pathway with Revolux",
    steps: ["Diagnosis in community optometry", "Eligibility screening", "Treatment in clinic", "Monitored response", "Independence preserved"],
  },
};

export const revolux = {
  eyebrow: "Revolux",
  name: "Revolux",
  tagline: "Engineered by BioPhotonix.",
  body: [
    "Revolux is a binocular photobiomodulation system that actively stimulates compromised retinal cells and supports their repair, helping to preserve central vision in early and intermediate dry macular degeneration.",
    "Each session takes five minutes. It fits a standard consulting room, needs no dedicated infrastructure, and turns an unmet patient need into a structured, evidence-led clinical pathway.",
  ],
  pillars: [
    {
      title: "Treat early",
      body: "Intervene when it matters most, in the years before irreversible vision loss occurs.",
    },
    {
      title: "Any room, any time",
      body: "A portable binocular design that fits standard consulting rooms. No dedicated space, no fixed installation.",
    },
    {
      title: "Precision dosing",
      body: "Unlike desktop systems, Revolux guarantees exact source-to-eye geometry for every patient, every time.",
    },
  ],
  facts: [
    { label: "Session length", value: "5 min" },
    { label: "Course", value: "9 sessions over 3 weeks" },
    { label: "Form factor", value: "Handheld binocular" },
    { label: "Supervision", value: "Clinician-initiated" },
  ],
  cta: { label: "Explore the technology", href: "/technology" },
};

export const explainer = {
  eyebrow: "Intelligent delivery",
  title: "Biological optimisation, with digital intelligence.",
  intro:
    "Standard devices simply emit light. Revolux controls how, when and whether light is delivered, and records every session it does.",
  steps: [
    {
      id: "geometry",
      short: "Geometry",
      title: "Precision geometry",
      body: "The binocular architecture fixes the distance and alignment between each light source and each eye, so the dose reaching the retina is repeatable from patient to patient and clinic to clinic.",
    },
    {
      id: "priming",
      short: "Soft-start",
      title: "Soft-start priming",
      body: "Proprietary soft-start and stability algorithms bring the output up gradually, so the retina is metabolically prepared to receive treatment and the cellular response is maximised.",
    },
    {
      id: "wavelengths",
      short: "Wavelengths",
      title: "Targeted wavelengths",
      body: "Revolux combines the wavelengths with the strongest clinical effect, aimed at the key driver of dry AMD: mitochondrial dysfunction in the retinal cells that matter for central vision.",
    },
    {
      id: "gating",
      short: "Interlocks",
      title: "Gated delivery",
      body: "Intelligent inhibition logic means light is only delivered when specific positional and physiological criteria are met. Dosage and irradiance are strictly controlled and monitored throughout.",
    },
    {
      id: "reporting",
      short: "Reporting",
      title: "Logged and reported",
      body: "Every session is clinician-initiated and digitally logged. Integrated software turns the treatment data into clinician-ready reports and patient-friendly summaries.",
    },
  ],
};

export const retina = {
  eyebrow: "The mechanism",
  title: "Light that restores cellular energy.",
  body: [
    "Photobiomodulation uses selected wavelengths of red and near-infrared light to stimulate biological processes in tissue. In the retina, the target is the mitochondria: the structures that produce the energy retinal cells need to function and to clear waste.",
    "In dry AMD those mitochondria become dysfunctional. Revolux is designed to boost and restore their function, supporting the cells rather than replacing them, in a treatment that is non-invasive and non-thermal.",
  ],
  steps: [
    { title: "Light enters the eye", body: "Controlled doses of red and near-infrared light pass through the pupil to the macula." },
    { title: "Mitochondria absorb it", body: "The light is absorbed inside retinal cells, where mitochondrial function is compromised in dry AMD." },
    { title: "Energy metabolism is supported", body: "Cellular energy production and repair processes are supported, helping to preserve central vision." },
  ],
};

export const safety = {
  eyebrow: "Safety you can audit",
  title: "Built as a medical device, not a wellness gadget.",
  intro:
    "Revolux is developed on a foundation of rigorous quality management and regulatory compliance, to meet the demands of modern healthcare environments.",
  items: [
    {
      title: "Medical device validation",
      body: "Developed under an ISO 13485 quality management system, Revolux is engineered to meet Class IIa medical device standards under the EU MDR and UKCA, with validated optical, electrical and biological safety.",
    },
    {
      title: "Active safety interlocks",
      body: "Multiple layers of interlocks and adaptive gating ensure light is only delivered when positional and physiological criteria are met. Dosage and irradiance are controlled and monitored for every treatment.",
    },
    {
      title: "Auditable care",
      body: "Unlike unsupervised consumer devices, Revolux is designed for accountability. Every session is clinician-initiated and digitally logged, keeping patients inside a managed, traceable care pathway.",
    },
  ],
  standards: [
    { code: "ISO 13485", name: "Quality management system" },
    { code: "EU MDR", name: "Class IIa, CE-first strategy" },
    { code: "UKCA", name: "UK market conformity" },
    { code: "ISO 15004-2", name: "Ophthalmic optical safety" },
    { code: "ANSI Z80.36", name: "Light hazard protection" },
    { code: "IEC 60601-1", name: "Medical electrical safety" },
    { code: "ISO 10993", name: "Biocompatibility" },
  ],
};

export const clinics = {
  eyebrow: "For optometrists and ophthalmologists",
  title: "Hospital-grade care, inside your consulting room.",
  intro:
    "Revolux integrates active dry AMD intervention into the workflows you already run, turning an unmet patient need into a scalable, high-value clinical service.",
  props: [
    {
      title: "Beyond generic light therapy",
      body: "Bespoke treatment protocols optimise retinal stimulation beyond generic or fixed photobiomodulation.",
    },
    {
      title: "Continuous revenue",
      body: "Repeatable treatment cycles generate sustainable recurring revenue that scales linearly with patient volume.",
    },
    {
      title: "Integrated workflows",
      body: "Therapy slots into existing clinical workflows without dedicated space or fixed infrastructure.",
    },
    {
      title: "Intelligent insights",
      body: "Integrated software simplifies clinical reporting and supports decisions, reducing administrative burden.",
    },
    {
      title: "Consistent delivery",
      body: "Continuous care models replace passive management, keeping patients engaged with therapy over time.",
    },
    {
      title: "No upfront cost",
      body: "A low-friction subscription model eliminates high upfront costs, so the service is profitable from the start.",
    },
  ],
  workflow: {
    title: "The clinical pathway",
    intro: "Five steps, all inside the practice. The device, the software and the protocol are designed around a standard appointment.",
    steps: [
      { title: "Identify", body: "Adults aged 50 and over with early or intermediate dry AMD, found during routine examination or imaging." },
      { title: "Screen", body: "Eligibility is confirmed and contraindications are managed by the supervising clinician before any treatment." },
      { title: "Treat", body: "Nine five-minute binocular sessions over three weeks, three sessions a week, in a standard consulting room." },
      { title: "Report", body: "Every session is logged. Clinician-ready reports and patient-friendly summaries are generated automatically." },
      { title: "Continue", body: "Ongoing care replaces passive monitoring, with repeatable cycles delivered within a managed pathway." },
    ],
  },
  calculator: {
    eyebrow: "Practice economics",
    title: "A low break-even point.",
    intro:
      "Revolux is offered on subscription with no upfront cost. Just one patient every three months covers the device subscription, which makes it a low-risk addition to a practice.",
    /**
     * Fitted to the figures published in the FAQ: one, two and three patients a
     * month generate 700, 1,600 and 2,500 pounds of monthly profit. That is a
     * contribution of 900 pounds per patient over a fixed monthly cost of 200.
     */
    perPatient: 900,
    fixed: 200,
    max: 10,
    published: [
      { patients: 1, profit: 700 },
      { patients: 2, profit: 1600 },
      { patients: 3, profit: 2500 },
    ],
    note: "Illustrative figures based on BioPhotonix's published examples. Actual results depend on your pricing, case mix and local costs.",
  },
  cta: {
    title: "See how Revolux fits your practice.",
    body: "We are working with a small group of clinics ahead of pilot clinical evaluation. Tell us about your practice and we will be in touch.",
    label: "Register your interest",
    href: "/contact?as=clinic",
  },
};

export const faq = {
  eyebrow: "You ask, we answer",
  title: "Frequently asked questions",
  intro: "Answers to the questions optometrists and ophthalmologists ask most about Revolux and what it means for their patients.",
  items: [
    {
      q: "Who is the Revolux system intended for?",
      a: "Revolux is indicated for adult patients aged 50 and over diagnosed with early or intermediate dry AMD. It allows clinicians to offer active intervention during the years where patients were previously told to simply watch and wait.",
    },
    {
      q: "Is the treatment invasive?",
      a: "No. Photobiomodulation is a non-invasive, non-thermal light therapy. Patients sit comfortably holding the binocular device for approximately five minutes. There are no injections, no eye drops and no contact with the cornea.",
    },
    {
      q: "Can patients use this at home on their own?",
      a: "No. Revolux is a prescription medical device designed for clinician-supervised use only. It can be used in a controlled home visit by a professional, but it is not an unsupervised consumer product.",
    },
    {
      q: "What is the treatment schedule?",
      a: "The standard therapy course consists of nine sessions delivered over three weeks, three sessions per week. This schedule is designed to maximise cellular response while fitting into manageable clinic blocks.",
    },
    {
      q: "How much can my clinic earn with Revolux?",
      a: "Revolux offers a scalable revenue stream with a low break-even point. On BioPhotonix's published figures, one patient a month generates around £700 in monthly profit, two patients around £1,600 and three around £2,500. One patient every three months covers the device subscription.",
    },
    {
      q: "What regulatory pathway is Revolux following?",
      a: "Revolux is being developed as a Class IIa medical device under an ISO 13485 quality management system, following a CE-first strategy under the EU Medical Device Regulation alongside UKCA marking for the UK.",
    },
  ],
};

export type StageStatus = "complete" | "current" | "upcoming";

export const roadmap = {
  eyebrow: "Development roadmap",
  title: "From concept to clinic.",
  intro:
    "Medical device development is a disciplined journey of risk reduction. Each stage below locks something down before the next begins.",
  stages: [
    {
      tag: "TRL 1–3",
      title: "Research and problem definition",
      status: "complete" as StageStatus,
      body: "Confirmed that the science of photobiomodulation is sound, and that existing delivery methods fail community use: handheld devices lack consistency, hospital consoles lack accessibility.",
    },
    {
      tag: "Architecture",
      title: "Binocular platform selected",
      status: "complete" as StageStatus,
      body: "A headset-based architecture chosen to guarantee precise source-to-eye geometry and repeatable dosimetry, so every patient receives the intended dose whichever clinic they visit.",
    },
    {
      tag: "TRL 4",
      title: "Lab validation",
      status: "complete" as StageStatus,
      body: "Functional prototypes fabricated with Med Design validated the ergonomic assumptions for adults over 50. Thermal limits, output stability and software logic tested.",
    },
    {
      tag: "TRL 5",
      title: "Design freeze",
      status: "current" as StageStatus,
      body: "Locking the hardware configuration: optical arrays, power subsystems and safety interlocks, under ISO 13485 quality standards, with optical engineering input from Fraunhofer and WideBlue.",
    },
    {
      tag: "Next",
      title: "Pilot clinical evaluation",
      status: "upcoming" as StageStatus,
      body: "Revolux moves out of the lab and into the hands of clinicians: the final step before scaling for regulatory approval.",
    },
    {
      tag: "Regulatory",
      title: "CE and UKCA marking",
      status: "upcoming" as StageStatus,
      body: "Class IIa conformity under the EU MDR, then UKCA for the UK market, with third-party testing against the optical, electrical and biocompatibility standards.",
    },
    {
      tag: "Launch",
      title: "Community deployment",
      status: "upcoming" as StageStatus,
      body: "Subscription rollout to community optometry, with clinician training, integrated reporting and post-market surveillance.",
    },
  ],
};

export const about = {
  hero: {
    eyebrow: "About BioPhotonix",
    title: "Bridging the gap in retinal care.",
    lede: "BioPhotonix is ending the era of passive observation. We are engineering the shift from monitoring disease to active, accessible intervention for the world's second leading cause of blindness.",
  },
  belief: {
    lead: "BioPhotonix was founded on a single, uncompromising belief:",
    statement: "Early intervention is the only way to preserve independence.",
    body: "We are building the world's first scalable, system-optimised photobiomodulation platform, converting “nothing can be done” into a structured, evidence-led clinical pathway.",
  },
  origin: {
    eyebrow: "Our origin",
    title: "The current care pathway for dry AMD is structurally broken.",
    body: [
      "As diagnostic technology in community optometry has advanced, we are identifying retinal disease earlier than ever before. Yet for millions of patients this early diagnosis is followed by a “watch and wait” approach. Patients are monitored as their vision inevitably declines, simply because effective hospital-grade interventions are not scalable to the community setting.",
      "We were established to close this gap. By translating the science of photobiomodulation into a regulated, portable medical platform, we are empowering optometrists to intervene early, preserving vision and independence for the ageing population.",
      "With the global economic burden of AMD exceeding $49 billion annually and millions losing their independence, BioPhotonix is not just building a device. We are building the infrastructure for the future of global eye health.",
    ],
  },
  values: {
    eyebrow: "How we work",
    title: "Safety and accessibility, in that order.",
    intro: "We are not a wellness company. BioPhotonix is built on the principles of regulated medical technology.",
    items: [
      {
        title: "Clinician-led",
        body: "Powerful therapy requires expert supervision. Our technology is designed to be initiated and monitored by eye-care professionals.",
      },
      {
        title: "Evidence-first",
        body: "We prioritise clinical validation and regulatory compliance over speed to market.",
      },
      {
        title: "Patient-centric",
        body: "We measure success not just by clinical biomarkers, but by the preservation of patient independence.",
      },
      {
        title: "Regulatory-first",
        body: "A Class IIa device, an ISO 13485 quality system and a CE-first strategy. Safety is engineered in from the start, not added at the end.",
      },
    ],
  },
};

export const founder = {
  eyebrow: "Leadership",
  name: "Adail Islam",
  role: "Founder and Director",
  qualifications: ["BSc Optometry", "BSc Orthoptics"],
  bio: [
    "Adail is an optometrist and orthoptist with extensive clinical experience managing macular disease across both hospital ophthalmology pathways and community optometry settings.",
    "His direct experience on the front lines of eye care revealed the limitations of existing treatments: hospital-bound technologies could not scale to meet the needs of the millions of patients managed in primary care. Adail founded BioPhotonix to engineer a solution that fits the reality of clinical practice: a device that is clinically rigorous, regulator-ready, and accessible enough to be deployed in every community clinic.",
  ],
  image: "/images/adail-portrait.jpg",
  alt: "Portrait of Adail Islam, founder of BioPhotonix",
  clinicImage: "/images/adail-clinic.jpg",
  clinicAlt: "Adail Islam examining a patient at a slit lamp",
  linkedin: site.founderLinkedin,
};

export const advisors = {
  eyebrow: "Strategic advisors and development partners",
  title: "Built with world-class allies.",
  intro: "No medical innovation is built in isolation. Our scientific, regulatory and engineering partners keep Revolux grounded in evidence and built to standard.",
  people: [
    {
      name: "Dr Nikola Krstajic",
      role: "PhD, Lecturer in Medical Physics",
      org: "University of Dundee",
      area: "Scientific and clinical advisory",
      body: "Ensures our device parameters are grounded in the latest photobiological research and retinal safety standards.",
      image: "/images/nikola-krstajic.jpg",
      alt: "Portrait of Dr Nikola Krstajic",
    },
    {
      name: "Edwin Lindsay",
      role: "Managing Director",
      org: "Compliance Solutions Life Sciences",
      area: "Regulatory and compliance",
      body: "Strategic guidance on our ISO 13485 quality management system and our UKCA and CE regulatory pathways.",
      image: "/images/edwin-lindsay.jpg",
      alt: "Portrait of Edwin Lindsay",
    },
    {
      name: "Martin Pacitti",
      role: "Project Manager",
      org: "WideBlue",
      area: "Engineering partner",
      body: "Our development roadmap is executed with leading medical design houses, so Revolux is built to rigorous industrial and ergonomic standards.",
      image: "/images/martin-pacitti.jpg",
      alt: "Portrait of Martin Pacitti",
    },
  ],
};

export const partners = {
  title: "Development partners",
  names: [
    { name: "Med Design", role: "Functional prototypes and ergonomics" },
    { name: "Fraunhofer", role: "Optical engineering" },
    { name: "WideBlue", role: "Product development" },
    { name: "Compliance Solutions", role: "Quality and regulatory" },
    { name: "University of Dundee", role: "Medical physics advisory" },
  ],
};

export const investors = {
  hero: {
    eyebrow: "For investors",
    title: "Building the infrastructure for the future of global eye health.",
    lede: "A regulated medical device, a structural gap in a market of 200 million people, and a recurring-revenue model that scales with every patient treated.",
  },
  thesis: {
    eyebrow: "The thesis",
    title: "The market does not need another hospital console.",
    body: [
      "Dry AMD is diagnosed and monitored in community optometry. Interventional technology has been designed for hospitals and specialist centres. That mismatch has left effective approaches locked in high-cost, low-access environments while the majority of patients are told to wait.",
      "Revolux is built for where the patients are. A Class IIa binocular photobiomodulation platform, portable enough for a standard consulting room, rigorous enough for a regulated clinical pathway, and sold as a subscription so a practice can start with no upfront cost.",
    ],
  },
  highlights: [
    { value: "200M", label: "People with AMD worldwide", body: "Projected to reach 288 million by 2040." },
    { value: "85–90%", label: "Dry AMD share", body: "The form with the fewest approved treatments." },
    { value: "$49B", label: "Annual US economic burden", body: "Driven mostly by lost productivity and quality of life." },
    { value: "Class IIa", label: "Regulatory classification", body: "CE-first under the EU MDR, then UKCA." },
  ],
  model: {
    eyebrow: "Business model",
    title: "Recurring revenue that scales with patient volume.",
    body: [
      "Clinics subscribe to Revolux rather than buying capital equipment. Each treatment course is nine sessions over three weeks, and repeatable cycles mean revenue for the clinic, and for BioPhotonix, scales linearly with the number of patients treated.",
    ],
    points: [
      "Subscription model with no upfront cost to the clinic",
      "One patient every three months covers a practice's subscription",
      "Integrated software for reporting, compliance and post-market data",
      "Designed for community optometry, the setting where dry AMD is actually managed",
    ],
  },
  regulatory: {
    eyebrow: "Regulatory strategy",
    title: "CE-first, safety by design.",
    body: [
      "We are implementing a quality management system aligned with ISO 13485 and pursuing CE marking under the EU Medical Device Regulation, alongside UKCA for the UK. The pathway requires third-party testing against international standards for optical safety, electrical safety and biocompatibility.",
    ],
    points: [
      "ISO 13485 quality management system",
      "ISO 15004-2 and ANSI Z80.36 optical safety",
      "IEC 60601-1 medical electrical safety",
      "ISO 10993 biocompatibility",
    ],
  },
  dataRoom: {
    eyebrow: "Next step",
    title: "Request the data room.",
    body: "Our data room holds the technical, regulatory and commercial detail behind this page. Tell us who you are and we will follow up directly.",
    label: "Request access",
  },
  disclaimer:
    "This page is provided for information only. It is not an offer to sell or a solicitation of an offer to buy any securities, and nothing here constitutes investment advice. Figures are drawn from published sources and the company's own development records and may be updated.",
};

export const contact = {
  eyebrow: "Get in touch",
  title: "Talk to BioPhotonix.",
  body: "Whether you run a practice, treat retinal disease in hospital, or are looking at the company as an investor, we would like to hear from you.",
  formTitle: "Send us a message",
  roles: [
    { value: "optometrist", label: "Optometrist" },
    { value: "ophthalmologist", label: "Ophthalmologist" },
    { value: "clinic", label: "Practice owner or manager" },
    { value: "investor", label: "Investor" },
    { value: "partner", label: "Industry or research partner" },
    { value: "press", label: "Press" },
    { value: "other", label: "Other" },
  ],
  responseNote: "We aim to reply within two working days.",
};

export const news = {
  eyebrow: "News and insights",
  title: "From the front line of retinal care.",
  intro: "Articles from the BioPhotonix team on the science, the regulation and the business of treating dry AMD in the community.",
};

export const footer = {
  blurb:
    "We develop photonic systems that safely stimulate retinal cells and support repair processes, helping to preserve central vision and independence for people living with macular degeneration.",
};
