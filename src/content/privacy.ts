/**
 * The privacy notice, carried over from the Wix site. Plain text blocks so the
 * page can render it in the site's own type without any raw HTML.
 */

export type PrivacyBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] };

export type PrivacySection = { title: string; blocks: PrivacyBlock[] };

export const privacy = {
  lastUpdated: "23 September 2026",
  sections: [
    {
      title: "1. Who we are",
      blocks: [
        { type: "p", text: "BioPhotonix Limited (“BioPhotonix”, “we”, “us”) develops and supplies the Revolux photobiomodulation medical device and associated digital services for the management of early and intermediate dry age-related macular degeneration." },
        { type: "p", text: "Our registered office is: BioPhotonix Limited, TheBeyond, SkyPark, 8 Elliot Street, Glasgow G3 8EP." },
        { type: "p", text: "We are the controller for personal data we collect through our website and, in some cases, for data processed through our devices and digital platforms. For many aspects of patient care, the treating clinic will be the controller and BioPhotonix will act as a processor (see section 4)." },
        { type: "p", text: "We do not currently appoint a Data Protection Officer. You can contact us about privacy or data-protection matters at info@biophotonix.co.uk." },
        { type: "p", text: "This notice is governed by the law of Scotland, and any disputes will be subject to the jurisdiction of the Scottish courts, without affecting your statutory rights across the UK." },
      ],
    },
    {
      title: "2. Scope of this notice",
      blocks: [
        { type: "p", text: "This notice explains how we handle personal data when:" },
        { type: "ul", items: [
          "You visit or use our website or any related online services.",
          "Clinics and clinicians use the Revolux clinician portal, APIs and connected services.",
          "Patients receive Revolux treatment in participating clinics and their data is processed via our platform.",
        ] },
        { type: "p", text: "Our website and core services are hosted in the UK, with primary hosting located in data centres in Scotland (Glasgow). We provide information and services across the UK." },
      ],
    },
    {
      title: "3. What data we collect",
      blocks: [
        { type: "h3", text: "3.1 Website and enquiry data" },
        { type: "ul", items: [
          "Contact details that you choose to provide (for example via contact forms), such as name, email address, phone number, organisation and message content.",
          "Technical information from your device, including IP address, browser type and version, device type, operating system and basic diagnostic information, to keep the site secure and functioning.",
          "Limited usage data about visits to our website, such as the page visited, the site that sent you to it, your approximate location and your device type, operating system and browser, collected by Vercel Web Analytics without cookies (see section 9).",
        ] },
        { type: "h3", text: "3.2 Clinic and professional data" },
        { type: "ul", items: [
          "Clinic information (name, address, contact details, practice type, identifiers).",
          "Clinician and staff details (name, role, professional registration, business contact details, user accounts, activity logs).",
        ] },
        { type: "h3", text: "3.3 Patient-related data" },
        { type: "p", text: "Revolux is designed to operate with minimal directly identifiable patient information on our systems, using pseudonymised identifiers where possible. Through our platform we may process:" },
        { type: "ul", items: [
          "Clinic-assigned identifiers (e.g. patient ID or record number, appointment ID) instead of names or NHS numbers wherever feasible.",
          "Limited demographic information (such as age band and sex) where entered by the clinic.",
          "Clinical context recorded by the clinician, such as diagnosis of early or intermediate dry age-related macular degeneration, best-corrected visual acuity ranges and eligibility or contraindication flags.",
          "Treatment data generated during Revolux sessions (for example dates and times of sessions, which eye(s) were treated, therapy phases completed, clinician overrides, distance-sensor status and chronotherapy-window flags).",
          "Physiological telemetry used to gate treatment, stored as session metadata only and not used to provide diagnoses.",
        ] },
        { type: "p", text: "Revolux is not intended for paediatric patients, and we do not knowingly process children's data through the platform." },
      ],
    },
    {
      title: "4. Roles and responsibilities (clinics and BioPhotonix)",
      blocks: [
        { type: "p", text: "For most aspects of patient care:" },
        { type: "ul", items: [
          "The treating clinic (for example an optometry practice or eye clinic) is the controller of the patient's clinical record, including decisions about eligibility, treatment and follow-up.",
          "BioPhotonix acts as a processor, providing the device and platform under a data-processing agreement, and processing patient-related data on the clinic's documented instructions.",
        ] },
        { type: "p", text: "For some activities, such as platform security, product improvement using pseudonymised data, regulatory compliance and operation of our own website, BioPhotonix may act as an independent or joint controller." },
        { type: "p", text: "If you are a patient and have questions about your clinical record or wish to exercise your data-protection rights, you should usually contact your treating clinic in the first instance. We will support clinics in responding to any data-subject requests that involve our systems." },
      ],
    },
    {
      title: "5. Why we use personal data and our legal bases",
      blocks: [
        { type: "p", text: "Under UK GDPR we must have a lawful basis for each use of personal data, and an additional condition for any “special category” data such as health information." },
        { type: "h3", text: "5.1 Providing our website and responding to enquiries" },
        { type: "p", text: "Purposes: operating and securing our website and online forms; responding to questions, support requests and other enquiries. Legal bases: our legitimate interests in operating a secure website and responding to enquiries about our business. Where we enter into a contract (for example with a clinic), processing may also be necessary to take steps at your request or to perform that contract." },
        { type: "h3", text: "5.2 Providing Revolux and related clinical services" },
        { type: "p", text: "Purposes: operating the Revolux device, app and clinician portal in line with their intended use, including recording treatment sessions, safety-gating (distance, priming, chronotherapy window) and generating clinical reports; supporting clinics with deployment, training and troubleshooting. Legal bases: for clinics and clinicians, performance of a contract with the clinic and our legitimate interests in providing and maintaining the service. For patient health data, processing is necessary for the purposes of medical diagnosis, the provision of health or social care or treatment, or the management of health systems and services (UK GDPR Article 9(2)(h)), carried out under the responsibility of health professionals and subject to applicable UK law." },
        { type: "h3", text: "5.3 Safety, quality and regulatory compliance" },
        { type: "p", text: "Purposes: ensuring device and platform safety, quality and performance, including calibration, post-market surveillance and vigilance; meeting our obligations under medical-device regulation, product-safety law and related guidance. Legal bases: compliance with legal obligations (e.g. regulatory reporting and record-keeping); substantial public interest in patient safety and high standards of quality and safety of health care and medical devices, where supported by UK law." },
        { type: "h3", text: "5.4 Security, misuse prevention and governance" },
        { type: "p", text: "Purposes: protecting the confidentiality, integrity and availability of data and services, including secure boot, encryption, access control, logging and incident response; preventing misuse or fraud, for example through clinician-presence attestation, geofencing of devices to registered clinics and immutable audit trails. Legal bases: our legitimate interests in securing our systems, preventing misuse and protecting patients, clinics and our business. For any health-related data implicated, substantial public interest in maintaining security and preventing harm, as permitted under UK law." },
        { type: "h3", text: "5.5 Product improvement, analytics and research-like activities" },
        { type: "p", text: "Purposes: analysing anonymised or pseudonymised treatment data to understand usage, refine protocols, evaluate chronotherapy effects and improve design and workflow; supporting regulatory submissions and evidence generation using aggregated data. Legal bases: our legitimate interests in improving our products and services, balanced against the privacy rights of patients and clinicians. For special-category data, where applicable, research or public-health-related conditions under UK GDPR and relevant UK law, with appropriate safeguards such as pseudonymisation and access controls." },
        { type: "p", text: "Where we rely on consent (for example, for a specific optional study or to send marketing emails to individuals), you can withdraw that consent at any time; this will not affect processing already carried out." },
        { type: "h3", text: "5.6 Communications and marketing to professional contacts" },
        { type: "p", text: "Purposes: managing relationships with clinics and professional contacts, including service updates, clinical training and, where permitted, information about new features or programmes. Legal bases: our legitimate interests in running and developing our business. Where electronic direct marketing to individuals is involved, we will obtain consent where required by PECR and provide an easy way to opt out. We do not currently use your data for third-party advertising or behavioural profiling." },
      ],
    },
    {
      title: "6. How we share personal data",
      blocks: [
        { type: "p", text: "We may share personal data with:" },
        { type: "ul", items: [
          "Treating clinics and clinicians, to provide treatment records and reports and to support clinical decision-making within the clinic's responsibility.",
          "Service providers who process data on our behalf (for example hosting providers, security and monitoring services, support tools), under written contracts that meet UK GDPR requirements.",
          "Regulatory bodies, notified bodies, auditors, insurers or legal advisers where necessary to meet regulatory, safety or legal obligations, or to establish, exercise or defend legal claims.",
          "Successors or potential acquirers, in the context of a corporate transaction, subject to appropriate safeguards and, where required, additional notifications or consents.",
        ] },
        { type: "p", text: "We do not sell individual patient data, and we do not share clinical data with third parties for unrelated advertising. Any public reports or presentations use de-identified or aggregated information." },
      ],
    },
    {
      title: "7. International transfers",
      blocks: [
        { type: "p", text: "Our core hosting for UK clinics and the website is located in the UK, currently with primary infrastructure in Scotland." },
        { type: "p", text: "If we transfer personal data outside the UK (for example if a supplier uses an overseas support team or backup location), we will ensure that appropriate safeguards are in place, such as UK adequacy regulations for the destination country, or standard contractual clauses or equivalent safeguards, plus technical and organisational measures to protect the data." },
      ],
    },
    {
      title: "8. How long we keep your data",
      blocks: [
        { type: "p", text: "We keep personal data only for as long as reasonably necessary for the purposes set out in this notice and to meet legal, regulatory and accounting requirements. Indicatively:" },
        { type: "ul", items: [
          "Clinical and device-related records needed for safety and regulatory purposes may be retained for the lifetime of the product and for a period afterwards, in line with medical-device and health-record requirements (commonly 7 to 10 years or more, depending on the context).",
          "Security logs and telemetry are kept for periods appropriate to monitoring, incident investigation and compliance obligations.",
          "Website and enquiry data is held for as long as needed to respond and for a reasonable period afterwards, or longer where required by law or to resolve disputes.",
          "Marketing and professional-contact data is held while you remain engaged with us and for a reasonable period afterwards, unless you object or opt out sooner.",
        ] },
        { type: "p", text: "More specific retention periods may be set out in our agreements with clinics." },
      ],
    },
    {
      title: "9. Cookies and similar technologies",
      blocks: [
        { type: "p", text: "We use cookies and similar technologies on our website and portals to make the site work (for example session management, security and load balancing) and to remember certain preferences." },
        { type: "h3", text: "9.1 Website analytics" },
        { type: "p", text: "Our website uses Vercel Web Analytics, a service of Vercel Inc., to count visits, to see which pages are read and to see which sites people arrive from, such as LinkedIn. It sets no cookies and stores nothing on your device. For each page view it records the time, the page address, the referring site, your approximate location (country, region and city), and your device type, operating system and browser. Visits are counted using a hash created from the incoming request, which Vercel discards after 24 hours; it is not used to follow anyone across other websites. We see only totals, such as how many people read an article and how many of them came from LinkedIn." },
        { type: "p", text: "We use these totals in our legitimate interest in knowing which articles are useful and improving the site. If your browser sends a Global Privacy Control or Do Not Track signal, the analytics does not run and your visit is not counted." },
        { type: "h3", text: "9.2 Advertising and other trackers" },
        { type: "p", text: "We do not use advertising cookies or third-party marketing trackers. Any further analytics tools we introduce will be configured to minimise personal data and, where required, will only run with your consent." },
        { type: "p", text: "Under UK GDPR and the Privacy and Electronic Communications Regulations (PECR), strictly necessary cookies can be set without consent, and non-essential cookies (such as most analytics cookies) require your prior consent. You can also manage cookies through your browser settings." },
      ],
    },
    {
      title: "10. Your rights",
      blocks: [
        { type: "p", text: "Under UK GDPR you have a number of rights in relation to your personal data, subject to certain conditions and exemptions:" },
        { type: "ul", items: [
          "Right to be informed about how your data is used.",
          "Right of access to your personal data.",
          "Right to rectification of inaccurate or incomplete data.",
          "Right to erasure in certain circumstances.",
          "Right to restrict processing in certain circumstances.",
          "Right to data portability where processing is based on consent or contract and carried out by automated means.",
          "Right to object to certain processing, including processing based on legitimate interests or direct marketing.",
          "Rights in relation to automated decision-making and profiling, where applicable.",
        ] },
        { type: "p", text: "For clinical records, you will usually exercise your rights through your treating clinic, which is responsible for your clinical care and record. We will support clinics in dealing with such requests where our systems are involved. To exercise your rights in relation to data for which BioPhotonix is controller, please contact us using the details in section 11." },
        { type: "p", text: "You also have the right to complain to the Information Commissioner's Office (ICO) if you are unhappy with how we have handled your personal data: ico.org.uk, helpline 0303 123 1113. We would appreciate the chance to address your concerns before you contact the ICO, so please consider contacting us first." },
      ],
    },
    {
      title: "11. Contact us",
      blocks: [
        { type: "p", text: "If you have questions about this notice or how we handle your personal data, or if you wish to exercise your rights, please contact BioPhotonix Limited, TheBeyond, SkyPark, 8 Elliot Street, Glasgow G3 8EP, or email info@biophotonix.co.uk." },
        { type: "p", text: "For patient-specific clinical questions, please contact your treating clinic, which can liaise with us where necessary." },
      ],
    },
    {
      title: "12. Changes to this notice",
      blocks: [
        { type: "p", text: "We may update this privacy notice from time to time, for example if our services or legal obligations change. When we make significant changes, we will update the “Last updated” date and, where appropriate (for example for clinics using our platform), provide additional notice through our website or portals." },
      ],
    },
  ] as PrivacySection[],
};
