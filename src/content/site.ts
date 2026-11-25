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
  title: "Vision loss should not be accepted as inevitable.",
  /** Two paragraphs, as the company wrote them. */
  subtitle: [
    "At BioPhotonix, we are developing photonic systems to non-invasively stimulate retina cells and repair processes in the eye.",
    "Our technology treats declining visual function in patients with dry macular degeneration.",
  ],
  /* Audience buttons, paired: clinicians to the clinics page, investors to theirs. */
  primary: { label: "For clinicians", href: "/clinics" },
  secondary: { label: "For investors", href: "/investors" },
  deviceAlt:
    "Render of the Revolux binocular photobiomodulation device: two eyepieces with light-emitting rings on a handheld body",
};

/**
 * The landing page's pointers to the other pages. The landing page is the
 * front door: it says in full only what lives there (the problem, and the
 * shift from monitoring to treatment), and for everything else it says what
 * is on the page in a line and links to it, rather than repeating it. Each
 * piece of information has one home, so it is said once and changed once.
 */
export const home = {
  revolux: {
    /* What is on the technology page, not a second telling of the story above it. */
    body: ["How it is built, how it delivers light to both eyes, and the standards it is designed to meet."],
    cta: { label: "How Revolux works", href: "/technology" },
  },
  doors: {
    title: "Where would you like to start?",
    items: [
      {
        eyebrow: "For clinicians",
        title: "Revolux in your practice",
        body: "What offering Revolux could look like in your clinic: the treatment course, the workflow and the economics.",
        cta: { label: "For clinicians", href: "/clinics" },
      },
      {
        eyebrow: "For investors",
        title: "The investment case",
        body: "Where the programme stands, what comes next, and the case for investing in it.",
        cta: { label: "For investors", href: "/investors" },
      },
      {
        eyebrow: "About us",
        title: "The people behind it",
        body: "The clinician who founded BioPhotonix, the advisers working with us, and the partners behind the device.",
        cta: { label: "About the company", href: "/about" },
      },
    ],
  },
  insights: { eyebrow: "Latest insights", title: "From the team." },
  contact: { title: "Questions about Revolux?", cta: { label: "Get in touch", href: "/contact" } },
};

export const burden = {
  /** Used as the subheading on /vision; the landing page shows none. */
  eyebrow: "The unmet need",
  /** Two statements, each on a line of its own. */
  title: ["Millions have dry AMD.", "Their visual decline is inevitable."],
  intro: [
    "90% of people with age-related macular degeneration have the dry form.",
    "For most of them the standard of care is still monitoring, lifestyle advice and supplements, while their central vision declines.",
  ],
  /**
   * The facts gallery, with the UK cost below. Each says something nothing
   * else on the site says: the worldwide count and its growth to 2040 are the
   * growth figure's subheading, and the share that is dry is the intro's first
   * line, so the facts that restated them were taken out.
   */
  stats: [
    { value: 500, prefix: ">", suffix: "k", label: "people progress to severe vision loss from AMD each year" },
    { value: 2, prefix: "×", label: "higher risk of cognitive decline and dementia with vision impairment" },
    { value: 3, prefix: "Top ", label: "vision loss ranks among the three most feared health outcomes" },
  ],
  /**
   * The landing page's growth figure: one face, then hundreds, then grey with
   * a central scotoma. The numbers are Wong et al.'s, and are shown only
   * here. The photographs are stock illustrations, not people known to have
   * AMD; at the company's request the source line no longer says so.
   */
  crowd: {
    title: "People living with AMD worldwide",
    caption: "196 million people in 2020, and 288 million expected by 2040.",
    message: "Dry AMD can lead to blindness.",
    label:
      "One older person's portrait, then hundreds of faces as the view widens: the growing number of people living with AMD. The faces turn grey and a dark patch spreads over the centre of the picture. Dry AMD can lead to blindness.",
    source: "Wong et al., The Lancet Global Health, 2014.",
  },
  /**
   * One of the facts in the landing page's gallery, so it is the short form.
   * The source is not shown there; it is kept here as the figure's citation.
   */
  cost: {
    value: "£2.6bn",
    label: "a year is what AMD-related sight loss costs the UK",
    note: "£1.2 billion of it falls directly on healthcare.",
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
    "Retinal disease is now identified earlier than ever in community optometry, but hospital-grade interventions do not scale to that setting.",
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
  /** The device's description in its structured data (schema.ts); not shown on a page. */
  description:
    "Revolux is a binocular photobiomodulation system that actively stimulates compromised retinal cells and supports their repair, helping to preserve central vision in early and intermediate dry macular degeneration.",
  /** The device's own facts, for its structured data (schema.ts); not shown on a page. */
  facts: [
    { label: "Form factor", value: "Handheld binocular" },
    { label: "Supervision", value: "Clinician-initiated" },
  ],
};

export const anatomy = {
  eyebrow: "Inside Revolux",
  title: "Revolux, part by part.",
  intro: "Each part is described only as far as the published development record allows.",
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
      caption: "What the patient looks into.",
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
      caption: "The depth of the housing, in profile.",
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
      body: "Two eyepieces on a hinged bridge.",
    },
    {
      id: "emitters",
      label: "Emitter ring",
      side: "left" as const,
      anchor: [412, 156] as const,
      labelY: 224,
      body: "Red and near-infrared sources arranged in a ring around each aperture.",
    },
    {
      id: "optics",
      label: "Optical train",
      side: "right" as const,
      anchor: [550, 156] as const,
      labelY: 150,
      body: "The path the light takes from each source to the retina.",
    },
    {
      id: "control",
      label: "Control unit",
      side: "right" as const,
      anchor: [477, 392] as const,
      labelY: 396,
      body: "Power and control for every session.",
    },
    {
      id: "interlocks",
      label: "Safety interlocks",
      side: "left" as const,
      anchor: [477, 458] as const,
      labelY: 486,
      body: "The hardware behind gated delivery.",
    },
  ],
  note: "Renders of the current development prototype.",
};

export const course = {
  eyebrow: "The course",
  title: "Nine sessions over three weeks.",
  intro:
    "Three sessions a week. The schedule is designed to maximise cellular response while fitting into manageable clinic blocks.",
  weeks: 3,
  perWeek: 3,
  /**
   * No minutes per session: the register (DEV-04) holds the duration as not
   * yet fixed, so the diagram counts sessions, and the footnote under it says
   * why in the register's approved wording.
   */
  footnote: "Per-wavelength irradiance and duration are not yet fixed and will be selected by the parameter-optimisation study.",
};

export const explainer = {
  eyebrow: "Intelligent delivery",
  title: "Biological optimisation, with digital intelligence.",
  intro:
    "Standard devices simply emit light. Revolux controls how, when and whether light is delivered.",
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
      body: "Revolux combines the wavelengths with the strongest clinical effect.",
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
      body: "Every session is digitally logged, ready for reporting.",
    },
  ],
};

export const retina = {
  eyebrow: "The mechanism",
  title: "Light that restores cellular energy.",
  /* The term, defined. What the light does in the retina is the diagram's three steps. */
  body: ["Photobiomodulation uses selected wavelengths of light to stimulate biological processes in tissue. It is non-invasive and non-thermal."],
  steps: [
    { title: "Light enters the eye", body: "Controlled doses of red and near-infrared light pass through the pupil to the macula." },
    { title: "Mitochondria absorb it", body: "The light is absorbed inside retinal cells, where mitochondrial function is compromised in dry AMD." },
    { title: "Energy metabolism is supported", body: "Cellular energy production and repair processes are supported, helping to preserve central vision." },
  ],
};

/**
 * How Revolux is regulated: the one place the site says it. The interlocks and
 * the session log, which used to sit beside it, are tabs of the delivery
 * explainer above; the scrolling strip of standards repeated this paragraph
 * and listed standards the register says do not govern the device.
 */
export const regulation = {
  eyebrow: "Regulation",
  title: "Built as a medical device, not a wellness gadget.",
  body: "Revolux is being developed as a Class IIa medical device under an ISO 13485 quality management system, following a CE-first strategy under the EU Medical Device Regulation alongside UKCA marking for the UK.",
};

export const clinics = {
  eyebrow: "For optometrists and ophthalmologists",
  title: "Hospital-grade care, inside your consulting room.",
  intro:
    "Revolux integrates active dry AMD intervention into the workflows you already run, turning an unmet patient need into a scalable, high-value clinical service.",
  workflow: {
    title: "The clinical pathway",
    intro: "Five steps, all inside the practice. The device, the software and the protocol are designed around a standard appointment.",
    steps: [
      { title: "Identify", mark: "identify" as const, body: "Adults aged 50 and over with early or intermediate dry AMD, found during routine examination or imaging." },
      { title: "Screen", mark: "screen" as const, body: "Eligibility is confirmed and contraindications are managed before any treatment." },
      { title: "Treat", mark: "treat" as const, body: "A qualified clinician initiates and supervises every session. Revolux is not for unsupervised use at home." },
      { title: "Report", mark: "record" as const, body: "Clinician-ready reports and patient-friendly summaries are generated automatically." },
      { title: "Continue", mark: "continue" as const, body: "Courses can be repeated within a managed pathway." },
    ],
  },
  calculator: {
    eyebrow: "Practice economics",
    title: "A low break-even point.",
    intro:
      "Revolux is accessed through a rental and licensing model, with no upfront cost. One patient every three months covers the fixed monthly fee for the device.",
    /**
     * Fitted to the company's worked examples, shown under the chart: one, two
     * and three patients a month generate 700, 1,600 and 2,500 pounds of
     * monthly profit. That is a contribution of 900 pounds per patient over a
     * fixed monthly cost of 200.
     */
    perPatient: 900,
    fixed: 200,
    max: 10,
    published: [
      { patients: 1, profit: 700 },
      { patients: 2, profit: 1600 },
      { patients: 3, profit: 2500 },
    ],
    note: "Illustrative figures. Actual results depend on your pricing, case mix and local costs.",
  },
  cta: {
    title: "See how Revolux fits your practice.",
    body: "We are working with a small group of clinics ahead of pilot clinical evaluation. Tell us about your practice and we will be in touch.",
    label: "Register your interest",
    href: "/contact?as=clinic",
  },
};

/** The technology page's own words. */
export const technology = {
  title: "How Revolux works.",
  lede: "What the light does in the retina, how the device delivers it, and how it is regulated.",
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
      body: "",
    },
    {
      tag: "TRL 4",
      title: "Lab validation",
      status: "complete" as StageStatus,
      body: "Functional prototypes validated the ergonomic assumptions. Thermal limits, output stability and software logic tested.",
    },
    {
      tag: "TRL 5",
      title: "Design freeze",
      status: "current" as StageStatus,
      body: "Locking the hardware configuration: optical arrays, power subsystems and safety interlocks.",
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
      body: "Conformity assessment, with third-party testing against the optical, electrical and biocompatibility standards.",
    },
    {
      tag: "Launch",
      title: "Community deployment",
      status: "upcoming" as StageStatus,
      body: "Rollout to practices, with clinician training and post-market surveillance.",
    },
  ],
};

export const about = {
  hero: {
    eyebrow: "About BioPhotonix",
    title: "Bridging the gap in retinal care.",
    lede: "A Glasgow medical-technology company, founded by a clinician and built with specialists in medical physics, regulation and engineering.",
  },
  belief: {
    lead: "BioPhotonix was founded on a single, uncompromising belief:",
    statement: "Early intervention is the only way to preserve independence.",
  },
  values: {
    eyebrow: "How we work",
    title: "Safety and accessibility, in that order.",
    items: [
      {
        title: "Clinician-led",
        mark: "clinician-led" as const,
        body: "Powerful therapy requires expert supervision.",
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
    "Adail founded BioPhotonix to engineer a solution that fits the reality of clinical practice.",
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
      body: "Strategic guidance on our quality management system and regulatory pathways.",
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
    /* WideBlue, Compliance Solutions and the University of Dundee are
       introduced with their people, in the cards above this list. */
    { name: "Med Design", role: "Functional prototypes and ergonomics" },
    { name: "Fraunhofer", role: "Optical engineering" },
  ],
};

export const investors = {
  hero: {
    eyebrow: "For investors",
    title: "Building the infrastructure for the future of global eye health.",
    lede: "The market Revolux serves, how it earns, and the road to the clinic.",
  },
  thesis: {
    eyebrow: "The thesis",
    title: "The market does not need another hospital console.",
    /* The story behind it is the landing page's; the device, Technology's. */
    body: ["Revolux is built for where the patients are."],
  },
  model: {
    eyebrow: "Business model",
    title: "Recurring revenue that scales with patient volume.",
    body: ["Each course a patient completes earns revenue for the clinic and for BioPhotonix."],
    /** What a practice pays, and when it breaks even, is on Clinics. */
    link: { label: "What a practice pays", href: "/clinics#economics" },
  },
  /** A pointer: the team itself is introduced on About. */
  team: {
    eyebrow: "Team and partners",
    title: "Who is building it.",
    intro: "The founder, advisers and development partners are introduced on the About page.",
    cta: "Meet the team",
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
