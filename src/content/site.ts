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
    "BioPhotonix builds Revolux: a clinician-supervised photobiomodulation device for early and intermediate dry AMD, made for community optometry.",
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
  { label: "What patients see", href: "/vision" },
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
    { label: "Session", value: "12 minutes, binocular" },
    { label: "Setting", value: "Community optometry, domiciliary optometry and hospital clinics" },
  ],
};

export const burden = {
  eyebrow: "The unmet need",
  title: "A silent epidemic, treated by waiting.",
  intro:
    "90% of people with age-related macular degeneration have the dry form. For most of them the standard of care is still monitoring, lifestyle advice and supplements, while their central vision declines.",
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
  cost: {
    value: "£2.6bn",
    label:
      "a year is what AMD-related sight loss costs the UK, of which £1.2 billion falls directly on healthcare and the rest on informal care, lost productivity and lost quality of life",
    source:
      "Fight for Sight, Time to Focus (2020), as cited in the Royal College of Ophthalmologists' AMD Commissioning Guidance, June 2021.",
  },
};

/**
 * The vision simulator. Staging follows the standard clinical classification
 * of dry AMD, and the descriptions are written to match what patients report
 * rather than what a fundus photograph shows.
 *
 * The simulation itself is deliberately unsubtle. Central vision loss is
 * drawn as it is in the simulations clinicians and patient charities use: a
 * dark, ragged patch over the point of fixation, straight lines bending
 * around it, colour and contrast draining from the surround. Patients more
 * often describe grey or absence than darkness, and the caveat says so, but a
 * simulation that errs towards subtlety reads as nothing happening, which
 * understates the disease far more than a dark patch overstates it.
 */
export const vision = {
  eyebrow: "What is actually lost",
  title: "The years before anyone notices.",
  intro:
    "Dry AMD does not announce itself. Long before small print becomes unreadable, it takes away the ability to tell one shade from the next: faces flatten, edges stop separating, and a lamp that was bright enough last winter is not bright enough now. Move through the stages, and move your pointer over the picture — the loss goes wherever you look.",
  sceneLabel: "What you are looking at",
  stageLabel: "Stage of disease",
  hint: "Move your pointer over the picture and the lost area follows it, the way a real scotoma follows the eye. On a phone, tap where you want to look.",
  scenes: [
    {
      id: "family",
      label: "A grandchild",
      src: "/images/vision/family.jpg",
      caption: "Recognising a face depends on exactly the part of the retina AMD takes. The edges of the room stay clear. The person in front of you does not.",
    },
    {
      id: "book",
      label: "A book",
      src: "/images/vision/book.jpg",
      caption:
        "What a reader sees looking down at their own hands. Reading is the loss patients report first: letters bend, then go missing from the middle of words, while the edge of the page stays sharp.",
    },
    {
      id: "street",
      label: "Crossing the road",
      src: "/images/vision/street.jpg",
      caption: "Signals, signs and the faces of people walking towards you all sit in the central field. Peripheral vision is spared, which is why someone with advanced AMD can still get about and still cannot read the sign.",
    },
    {
      id: "amsler",
      label: "Amsler grid",
      caption: "The clinical reference. Patients fix on the dot and report lines that look wavy, blurred or missing.",
    },
  ],
  stages: [
    {
      id: "healthy",
      short: "Healthy",
      title: "Healthy retina",
      body: "Fine detail, colour and contrast are all intact at the point of fixation. This is the baseline everything below is measured against.",
    },
    {
      id: "early",
      short: "Early",
      title: "Early dry AMD",
      body: "Medium drusen have formed beneath the retina. Acuity usually tests as normal and most people notice nothing at all, though some say they need more light to read, and a few see the first slight bending of straight lines on an Amsler grid.",
    },
    {
      id: "intermediate",
      short: "Intermediate",
      title: "Intermediate dry AMD",
      body: "Large drusen, often with pigment change. The difference between one shade and the next drains out of the centre of vision, straight lines bend, and a faint smudge sits over whatever is looked at directly. Reading in dim light becomes hard and faces look washed out long before the eye chart changes.",
    },
    {
      id: "atrophy",
      short: "Atrophy",
      title: "Geographic atrophy",
      body: "Areas of retina have died. A dense patch now sits in the centre of vision, ragged at its edges, and it moves with the eye, so it cannot be looked around. Letters vanish from the middle of words while the edge of the page stays sharp.",
    },
    {
      id: "advanced",
      short: "Advanced",
      title: "Advanced geographic atrophy",
      body: "The atrophy has spread across the fovea. Whatever a person looks at directly is now inside the lost area. Faces cannot be recognised, print cannot be read at ordinary size, and peripheral vision is all that is left for getting about.",
    },
  ],
  /** Shown on the two stages Revolux is indicated for. */
  indicated: {
    stages: ["early", "intermediate"],
    label: "Where Revolux is designed to act",
    body: "These are the two stages where the patient notices least, and the two stages where they have historically been told to watch and wait.",
  },
  caveat: {
    title: "What this simulation cannot show",
    body: "The lost area is drawn dark so that it can be seen. Patients more often describe grey, blur or simple absence, because the brain fills the gap in, which is part of why early disease goes unreported. Here the area follows your pointer; in life it follows the eye, and no amount of looking around moves it aside. The severity shown is representative of each stage, not a measurement of any patient, and both eyes are usually affected at different rates, which masks the loss further.",
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
    "Each session takes twelve minutes. It fits a standard consulting room, needs no dedicated infrastructure, and turns an unmet patient need into a structured, evidence-led clinical pathway.",
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
    { label: "Session length", value: "12 min" },
    { label: "Course", value: "9 sessions over 3 weeks" },
    { label: "Form factor", value: "Handheld binocular" },
    { label: "Supervision", value: "Clinician-initiated" },
  ],
  cta: { label: "Explore the technology", href: "/technology" },
};

export const anatomy = {
  eyebrow: "Inside Revolux",
  title: "Built part by part around a repeatable dose.",
  intro:
    "Every element of the platform exists to put a known quantity of light on the retina, the same way, in every clinic. Each part is described here only as far as the published development record allows.",
  /**
   * The development prototype from five angles. The callouts are measured
   * against one render — the straight-on emitter face, which is what the
   * patient looks into — so that view carries `callouts` and the others show
   * their caption instead. The flag travels with the image rather than with a
   * view id, because which angle sits in which tab has changed once already.
   */
  views: [
    {
      id: "front",
      label: "Front",
      src: "/images/revolux-patient.png",
      width: 296,
      height: 663,
      alt: "The Revolux prototype seen head on from the clinician's side, showing the two eyecup faces above the session controls",
      caption: "The clinician's side. The two eyecup faces, with the session controls on the unit beneath them.",
    },
    {
      id: "patient",
      label: "Patient's side",
      src: "/images/revolux-front.png",
      width: 305,
      height: 660,
      alt: "The Revolux prototype seen from the patient's side, showing both apertures with their rings of emitters around them",
      caption: "What the patient looks into. A ring of emitters around each aperture, held at a fixed separation, for a twelve-minute session.",
      /** The callouts are measured against this render, so they belong to it. */
      callouts: true,
    },
    {
      id: "profile",
      label: "Profile",
      src: "/images/revolux-profile.png",
      width: 240,
      height: 657,
      alt: "The Revolux prototype in profile, showing the depth of the eyepiece housing above the control unit and handle",
      caption: "In profile the depth of the housing is visible: the distance the light travels is fixed by the body itself.",
    },
    {
      id: "three-quarter",
      label: "Three-quarter",
      src: "/images/revolux-three-quarter.png",
      width: 354,
      height: 669,
      alt: "The Revolux prototype at three-quarters, showing the eyepieces, the hinged bridge, the control unit and the handle",
      caption: "The whole instrument: hinged bridge, control unit and handle, held in one hand.",
    },
    {
      id: "rear",
      label: "Rear",
      src: "/images/revolux-rear-quarter.png",
      width: 357,
      height: 658,
      alt: "The Revolux prototype from behind, showing the controls on the back of the control unit",
      caption: "The controls sit on the back of the unit, under the clinician's thumb.",
    },
  ],
  /**
   * Callouts over the front view. Coordinates are in the overlay's own
   * 960 x 700 space, in which that render occupies x 318 to 642. `anchor` is
   * the point on the device; `labelY` is where the label sits in its column.
   * Nothing here claims more about the internals than the company has
   * already published.
   */
  parts: [
    {
      id: "head",
      label: "Binocular head",
      side: "left" as const,
      anchor: [482, 22] as const,
      labelY: 74,
      body: "Two eyepieces on a hinged bridge. This architecture is what holds the same source-to-eye distance and alignment for every patient, which is what makes the dose repeatable between clinics.",
    },
    {
      id: "emitters",
      label: "Emitter ring",
      side: "left" as const,
      anchor: [412, 156] as const,
      labelY: 224,
      body: "Red and near-infrared sources arranged in a ring around each aperture. Revolux combines the wavelengths with the strongest clinical effect on mitochondrial function in the retina.",
    },
    {
      id: "optics",
      label: "Optical train",
      side: "right" as const,
      anchor: [550, 156] as const,
      labelY: 150,
      body: "The path from each source to the retina, refined with optical engineering partners so that the light arriving at the macula is precise and repeatable rather than approximate.",
    },
    {
      id: "control",
      label: "Control unit",
      side: "right" as const,
      anchor: [477, 392] as const,
      labelY: 396,
      body: "Power and control. Dosage and irradiance are regulated and monitored for the whole of every session, and the soft-start profile is run from here.",
    },
    {
      id: "interlocks",
      label: "Safety interlocks",
      side: "left" as const,
      anchor: [477, 458] as const,
      labelY: 486,
      body: "Positional and physiological gating. Light is delivered only while every criterion is met, and each session is recorded against the clinician who initiated it.",
    },
  ],
  note: "Renders of the current development prototype. The hardware configuration is approaching design freeze.",
};

export const course = {
  eyebrow: "The course",
  title: "Nine sessions over three weeks.",
  intro:
    "Three sessions a week, twelve minutes each. The schedule is designed to maximise cellular response while fitting into manageable clinic blocks.",
  weeks: 3,
  perWeek: 3,
  minutesPerSession: 12,
  footnote: "One hundred and eight minutes of treatment in total, across three weeks of ordinary appointments.",
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
      mark: "validated" as const,
      body: "Developed under an ISO 13485 quality management system, Revolux is engineered to meet Class IIa medical device standards under the EU MDR and UKCA, with validated optical, electrical and biological safety.",
    },
    {
      title: "Active safety interlocks",
      mark: "interlocks" as const,
      body: "Multiple layers of interlocks and adaptive gating ensure light is only delivered when positional and physiological criteria are met. Dosage and irradiance are controlled and monitored for every treatment.",
    },
    {
      title: "Auditable care",
      mark: "auditable" as const,
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
      mark: "tuned" as const,
      body: "Bespoke treatment protocols optimise retinal stimulation beyond generic or fixed photobiomodulation.",
    },
    {
      title: "Continuous revenue",
      mark: "recurring" as const,
      body: "Repeatable treatment cycles generate sustainable recurring revenue that scales linearly with patient volume.",
    },
    {
      title: "Integrated workflows",
      mark: "slots-in" as const,
      body: "Therapy slots into existing clinical workflows without dedicated space or fixed infrastructure.",
    },
    {
      title: "Intelligent insights",
      mark: "report" as const,
      body: "Integrated software simplifies clinical reporting and supports decisions, reducing administrative burden.",
    },
    {
      title: "Consistent delivery",
      mark: "consistent" as const,
      body: "Continuous care models replace passive management, keeping patients engaged with therapy over time.",
    },
    {
      title: "No upfront cost",
      mark: "no-upfront" as const,
      body: "A low-friction subscription model eliminates high upfront costs, so the service is profitable from the start.",
    },
  ],
  workflow: {
    title: "The clinical pathway",
    intro: "Five steps, all inside the practice. The device, the software and the protocol are designed around a standard appointment.",
    steps: [
      { title: "Identify", mark: "identify" as const, body: "Adults aged 50 and over with early or intermediate dry AMD, found during routine examination or imaging." },
      { title: "Screen", mark: "screen" as const, body: "Eligibility is confirmed and contraindications are managed by the supervising clinician before any treatment." },
      { title: "Treat", mark: "treat" as const, body: "Nine twelve-minute binocular sessions over three weeks, three sessions a week, in a standard consulting room." },
      { title: "Report", mark: "record" as const, body: "Every session is logged. Clinician-ready reports and patient-friendly summaries are generated automatically." },
      { title: "Continue", mark: "continue" as const, body: "Ongoing care replaces passive monitoring, with repeatable cycles delivered within a managed pathway." },
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
      a: "No. Photobiomodulation is a non-invasive, non-thermal light therapy. Patients sit comfortably holding the binocular device for approximately twelve minutes. There are no injections, no eye drops and no contact with the cornea.",
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
      "With AMD-related sight loss costing the UK alone £2.6 billion a year, and tens of millions losing their independence worldwide, BioPhotonix is not just building a device. We are building the infrastructure for the future of global eye health.",
    ],
  },
  values: {
    eyebrow: "How we work",
    title: "Safety and accessibility, in that order.",
    intro: "We are not a wellness company. BioPhotonix is built on the principles of regulated medical technology.",
    items: [
      {
        title: "Clinician-led",
        mark: "clinician-led" as const,
        body: "Powerful therapy requires expert supervision. Our technology is designed to be initiated and monitored by eye-care professionals.",
      },
      {
        title: "Evidence-first",
        mark: "evidence" as const,
        body: "We prioritise clinical validation and regulatory compliance over speed to market.",
      },
      {
        title: "Patient-centric",
        mark: "patient" as const,
        body: "We measure success not just by clinical biomarkers, but by the preservation of patient independence.",
      },
      {
        title: "Regulatory-first",
        mark: "regulatory" as const,
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
    { value: "£2.6bn", label: "Annual UK cost of AMD sight loss", body: "£1.2 billion of it falls directly on healthcare." },
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
  intro:
    "Articles from the BioPhotonix team on the science, the regulation and the business of treating dry AMD in the community, and a weekly insight: one piece of new research or news in eye care, from anywhere in the world, read for what it means in practice.",
  /** The label on a weekly insight, on the cards and above the headline. */
  insightLabel: "Weekly insight",
  /**
   * Under every weekly insight. It is a digest of other people's research,
   * written for professionals, and the company had no part in the studies.
   */
  insightNote:
    "The weekly insight summarises published research and news for eye-care professionals. It is not clinical advice, and BioPhotonix had no part in the work described unless the article says so.",
  /** Over the two to four one-line points under an insight's figure. */
  keyPointsLabel: "In brief",
  /** Over the questions at the end of an insight: the ones people type into a search box, answered. */
  faqHeading: "Questions this raises",
};

export const footer = {
  blurb:
    "We develop photonic systems that safely stimulate retinal cells and support repair processes, helping to preserve central vision and independence for people living with macular degeneration.",
};

/**
 * The line of copy on each page's social card.
 *
 * Held here with the rest of the copy rather than in the image component,
 * which draws the card but writes none of it. Each entry is the eyebrow and
 * the headline, chosen to be the sentence you would want quoted if someone
 * pasted the link into a message and nothing else came with it.
 */
export const ogCards: Record<string, { eyebrow: string; title: string }> = {
  home: { eyebrow: "Photobiomodulation for dry AMD", title: "Vision loss should not be accepted as inevitable." },
  technology: { eyebrow: "Revolux", title: "Light that restores cellular energy." },
  vision: { eyebrow: "What patients see", title: "The years before anyone notices." },
  clinics: { eyebrow: "For optometrists and ophthalmologists", title: "Hospital-grade care, inside your consulting room." },
  investors: { eyebrow: "For investors", title: "Building the infrastructure for the future of global eye health." },
  about: { eyebrow: "About BioPhotonix", title: "Founded by a clinician who ran out of things to offer." },
  news: { eyebrow: "News and insights", title: "From the front line of retinal care." },
  contact: { eyebrow: "Contact", title: "Talk to BioPhotonix." },
  article: { eyebrow: "Insight", title: "" },
};
