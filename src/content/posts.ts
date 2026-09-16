/**
 * Articles, carried over from the Wix blog.
 *
 * Content is stored as typed blocks rather than raw HTML so nothing can inject
 * markup into the page. Add a post by appending to the array below. The
 * cover art is drawn in code (see PostArt) rather than being a photograph.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export type ArtKind = "epidemic" | "safety" | "founding" | "prototype";

export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  readingMinutes: number;
  excerpt: string;
  art: ArtKind;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "the-silent-epidemic-addressing-the-unmet-need-in-dry-amd",
    title: "The Silent Epidemic: Addressing the Unmet Need in Dry AMD",
    date: "2026-02-06",
    readingMinutes: 3,
    excerpt:
      "Around 200 million people live with AMD today, and 85 to 90% of them have the dry form. For decades the innovation has gone to the other 10%.",
    art: "epidemic",
    body: [
      { type: "p", text: "In the world of global health, numbers often tell the story before the symptoms do. Today, approximately 200 million people worldwide are living with Age-Related Macular Degeneration (AMD). By 2040, that number is projected to reach 288 million." },
      { type: "p", text: "But the most critical statistic isn't the total prevalence; it is the disparity in care. 85 to 90% of these patients have the “dry” form of the disease. Yet, for decades, the vast majority of therapeutic innovation has focused on the “wet” form, leaving millions of dry AMD patients with a diagnosis but no destination." },
      { type: "p", text: "At BioPhotonix, we are driven by the urgency of this silent epidemic. We are looking beyond the diagnosis to understand the structural gaps that have left so many patients behind." },
      { type: "h2", text: "The cost of “watch and wait”" },
      { type: "p", text: "For patients diagnosed with early or intermediate dry AMD, the standard of care has historically been conservative: monitoring, lifestyle advice, and nutritional supplements. While valuable, these measures do not constitute active treatment." },
      { type: "p", text: "This “watch and wait” approach carries a heavy human and economic toll. Research indicates that the annual economic burden of AMD in the US alone approaches $49 billion, with the majority of costs driven not by medical treatment, but by lost productivity and quality of life." },
      { type: "p", text: "When patients lose their central vision, they don't just lose the ability to read or drive; they lose their independence. The anxiety of uncertain progression, waiting for vision to decline, is a burden that patients and their families carry daily." },
      { type: "h2", text: "A structural misalignment" },
      { type: "p", text: "Why has this gap persisted? Our analysis suggests a fundamental misalignment in care delivery." },
      { type: "p", text: "Dry AMD is typically diagnosed and monitored in community optometry, the primary care of the eye. However, traditional interventional technologies have been designed for hospitals and specialist centres. This disconnect creates a bottleneck: effective technologies exist, but they are often locked away in high-cost, low-access environments that cannot scale to meet the needs of millions of patients." },
      { type: "quote", text: "The market doesn't need another hospital-bound console. It needs a solution that fits where the patients are." },
      { type: "h2", text: "Bridging the gap" },
      { type: "p", text: "BioPhotonix is not just developing a device; we are engineering a solution to this structural problem. Our progress over the last year has been dedicated to validating a delivery model that brings active intervention out of the specialist clinic and into the community." },
      { type: "p", text: "We are building a future where:" },
      { type: "ul", items: [
        "Intervention is accessible: patients can access sight-preserving therapy in their local optometry practice, not just distant hospitals.",
        "Care is proactive: clinicians are empowered to treat early, rather than waiting for irreversible decline.",
        "Independence is preserved: we shift the goal from “managing blindness” to “maintaining sight”.",
      ] },
      { type: "p", text: "The technology to change the trajectory of dry AMD is within reach. The challenge now is accessibility. That is the challenge BioPhotonix is built to solve." },
    ],
  },
  {
    slug: "safety-without-compromise-building-a-regulatory-first-medical-company",
    title: "Safety Without Compromise: Building a Regulatory-First Medical Company",
    date: "2026-02-06",
    readingMinutes: 3,
    excerpt:
      "There is a clear line between consumer wellness gadgets and regulated medical devices. We have chosen our side of it with absolute clarity.",
    art: "safety",
    body: [
      { type: "p", text: "In the rapidly evolving landscape of health technology, there is a distinct line between consumer “wellness gadgets” and regulated medical devices. At BioPhotonix, we have chosen our side of that line with absolute clarity." },
      { type: "p", text: "We are not building a lifestyle accessory; we are engineering a Class IIa medical device intended to treat a progressive retinal disease. This distinction drives every decision we make, from the materials we select to the regulatory frameworks we follow." },
      { type: "h2", text: "Beyond “wellness”: a quality-first approach" },
      { type: "p", text: "The market is currently flooded with unregulated light-therapy products that often lack rigorous safety controls, repeatable dosing, or clinical oversight. While these may be suitable for general wellness, they are fundamentally inadequate for managing a complex condition like Age-Related Macular Degeneration (AMD)." },
      { type: "p", text: "BioPhotonix operates under a strict “Regulatory-First” philosophy. We are currently implementing a Quality Management System (QMS) aligned with ISO 13485, the gold standard for medical device manufacturing. This ensures that every aspect of our development, from design controls to risk management, meets the stringent requirements demanded by global health authorities." },
      { type: "h2", text: "The “CE-First” strategy" },
      { type: "p", text: "Our commitment to safety is reflected in our roadmap. We are pursuing a CE-First strategy, anchoring our regulatory approval within the robust European Medical Device Regulation (MDR) framework, alongside UKCA marking for the UK market." },
      { type: "p", text: "This pathway requires us to demonstrate not just that our device works, but that it is safe, effective, and manufactured to a consistent medical standard. This involves rigorous third-party testing against international standards for:" },
      { type: "ul", items: [
        "Optical safety: ensuring light output remains within safe limits for the eye (ISO 15004-2 and ANSI Z80.36).",
        "Electrical safety: meeting strict medical electrical equipment standards (IEC 60601-1).",
        "Biocompatibility: ensuring all patient-contact materials are safe for the skin (ISO 10993).",
      ] },
      { type: "h2", text: "Empowering the clinician" },
      { type: "p", text: "We believe that powerful technology requires expert guidance. That is why our platform is designed exclusively for clinician-supervised use." },
      { type: "p", text: "Unlike direct-to-consumer devices that leave patients to manage their own treatment, our system is designed to be initiated and monitored by qualified eye-care professionals. This ensures that patients are screened for eligibility, contraindications are managed, and treatment is delivered consistently within a structured clinical pathway." },
      { type: "h2", text: "Engineering trust" },
      { type: "p", text: "Safety is not a feature we add at the end; it is engineered into the core of the device. Our platform incorporates multiple layers of safety interlocks and adaptive gating to ensure that light is only delivered when specific physiological and positional criteria are met." },
      { type: "p", text: "By combining hospital-grade safety standards with the accessibility of community care, BioPhotonix is setting a new benchmark for retinal therapeutics. We are building more than a device; we are building trust." },
    ],
  },
  {
    slug: "from-observation-to-action-why-we-founded-biophotonix",
    title: "From Observation to Action: Why We Founded BioPhotonix",
    date: "2026-02-06",
    readingMinutes: 3,
    excerpt:
      "As an optometrist and orthoptist, the hardest part of a dry AMD diagnosis was never the diagnosis. It was the conversation that followed.",
    art: "founding",
    body: [
      { type: "p", text: "For decades, the standard of care for early and intermediate dry Age-Related Macular Degeneration (AMD) has been defined by a single, frustrating limitation: the gap between diagnosis and treatment." },
      { type: "p", text: "As an optometrist and orthoptist working on the front lines of eye care, I witnessed this narrative repeat itself daily. Patients would arrive for routine appointments, only to be diagnosed with a progressive condition that threatens their central vision and independence. But the hardest part wasn't the diagnosis itself. It was the conversation that followed." },
      { type: "p", text: "For the vast majority of these patients, the clinical pathway offered no active intervention. We could monitor the disease, advise on lifestyle changes, and recommend supplements, but ultimately, we had to tell them to “watch and wait”. We were observing a decline we had no tools to stop." },
      { type: "h2", text: "Changing the narrative" },
      { type: "p", text: "BioPhotonix was founded on a simple but powerful premise: passive monitoring is no longer enough." },
      { type: "p", text: "We knew that the science of photobiomodulation (PBM) held immense promise for retinal health, supported by a growing body of evidence demonstrating its ability to support cellular function and energy metabolism. Yet, despite this potential, the technology remained inaccessible to the millions of patients managed in community optometry. Existing solutions were often tethered to specialist hospital clinics, requiring significant infrastructure that simply doesn't fit the reality of primary care." },
      { type: "p", text: "We realised that to truly change patient outcomes, we didn't just need a new therapy; we needed a new delivery model. We needed to bridge the structural gap between hospital-grade technology and the community clinics where patients are actually seen." },
      { type: "h2", text: "Building the solution" },
      { type: "p", text: "This realisation marked the beginning of BioPhotonix. Our mission shifted from asking “what if” to building “how”." },
      { type: "p", text: "Over the last year, we have moved rapidly from concept to reality. We have transitioned from identifying the problem to engineering a scalable solution designed specifically for clinician-supervised use. By partnering with world-class industrial designers and engineering teams, we are translating complex optical science into a practical, medical-grade platform that empowers optometrists to intervene early." },
      { type: "h2", text: "Looking ahead" },
      { type: "p", text: "Today, BioPhotonix is no longer just a concept. We are building the future of dry AMD management: a future where “nothing can be done” is replaced with active, evidence-led intervention." },
      { type: "p", text: "We are dedicated to shifting the paradigm from observation to action, preserving independence for patients, and giving clinicians the tools they have been waiting for." },
      { type: "quote", text: "The journey is just beginning." },
    ],
  },
  {
    slug: "innovative-light-therapies-for-age-related-macular-degeneration",
    title: "Turning Science into Solutions: Our Journey from Concept to Prototype",
    date: "2025-12-31",
    updated: "2026-02-06",
    readingMinutes: 3,
    excerpt:
      "We have moved beyond proof of concept and into advanced prototype development. Here is how we are turning our vision into a medical reality.",
    art: "prototype",
    body: [
      { type: "p", text: "At BioPhotonix, we believe that ground-breaking science only creates value when it is translated into a deployable, real-world solution. Over the past twelve months, our focus has shifted from the theoretical, identifying the “delivery gap” in retinal care, to the physical engineering of a device capable of closing it." },
      { type: "p", text: "We are proud to announce that we have successfully moved beyond the “proof of concept” phase and are now entering advanced prototype development. Here is a look at how we are turning our vision into a medical reality." },
      { type: "h2", text: "Moving beyond the bench" },
      { type: "p", text: "Medical device development is a rigorous journey of risk reduction. In our early research (TRL 1–3), we confirmed that while the science of photobiomodulation was sound, existing delivery methods were fundamentally flawed for widespread community use." },
      { type: "p", text: "We identified that handheld devices lacked consistency, while large hospital consoles lacked accessibility. This drove our pivotal decision to engineer a headset-based architecture. This form factor allows us to guarantee precise source-to-eye geometry and repeatable dosimetry, ensuring that every patient receives the exact intended dose, regardless of which clinic they visit." },
      { type: "h2", text: "Building with world-class allies" },
      { type: "p", text: "No medical innovation is built in isolation. To ensure our platform meets the highest standards of safety and reliability, we have engaged with world-leading technical partners." },
      { type: "p", text: "Our collaboration with Med Design has been instrumental in fabricating our initial functional prototypes, allowing us to validate our ergonomic assumptions and ensure the device is comfortable for our core demographic: adults aged 50 and over. Furthermore, our engagement with optical engineering specialists at Fraunhofer and WideBlue is helping us refine our optical train to ensure absolute precision in light delivery." },
      { type: "p", text: "These partnerships have accelerated our progress through TRL 4 (Lab Validation), where we have rigorously tested thermal limits, output stability, and software logic." },
      { type: "h2", text: "Safety by design" },
      { type: "p", text: "Unlike consumer wellness gadgets, BioPhotonix is building a regulated Class IIa medical device. This distinction drives every engineering decision we make." },
      { type: "p", text: "We are currently approaching “Design Freeze” (TRL 5). This is a critical milestone where the hardware configuration, including our optical arrays, power subsystems, and safety interlocks, is locked down. This discipline ensures that the device we take into clinical validation is stable, safe, and ready for regulatory scrutiny under ISO 13485 quality standards." },
      { type: "h2", text: "What's next?" },
      { type: "p", text: "With our hardware configuration nearing finalisation, we are preparing for the next crucial phase: Pilot Clinical Evaluation. This will see our technology move out of the lab and into the hands of clinicians, marking the final step before we scale for regulatory approval." },
      { type: "quote", text: "We are not just building a device; we are engineering the future of community-based retinal care." },
    ],
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
