import { faq, revolux, site } from "./site";

/**
 * Structured data for search engines and for the assistants that increasingly
 * answer questions about companies without anyone visiting the site.
 *
 * The regulatory status is stated three times on purpose: in the description,
 * in `disambiguatingDescription`, and in `legalStatus`. An assistant
 * summarising this device from the graph has to work hard to leave out the
 * fact that it is not approved and not for sale. There is deliberately no
 * Product or Offer markup anywhere, because both assert something that can be
 * bought, and nothing here can be.
 */

const STATUS =
  "Revolux is an investigational medical device in development. It is not CE marked or UKCA marked, has not been approved by any regulator, and is not available for sale or for clinical use.";

export function medicalDeviceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalDevice",
    "@id": `${site.url}/technology#revolux`,
    name: revolux.name,
    alternateName: "Revolux binocular photobiomodulation system",
    url: `${site.url}/technology`,
    description: `${STATUS} ${revolux.body[0]}`,
    disambiguatingDescription: STATUS,
    legalStatus: STATUS,
    purpose: "https://schema.org/Therapeutic",
    relevantSpecialty: { "@type": "MedicalSpecialty", name: "Ophthalmologic" },
    indication: {
      "@type": "MedicalIndication",
      name: "Early and intermediate dry age-related macular degeneration in adults aged 50 and over",
    },
    manufacturer: {
      "@type": "Organization",
      name: site.legalName,
      url: site.url,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.address.city,
        addressCountry: "GB",
      },
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Regulatory classification", value: "Class IIa, intended, in development" },
      { "@type": "PropertyValue", name: "Regulatory pathway", value: "CE marking under the EU Medical Device Regulation, with UKCA for the UK" },
      { "@type": "PropertyValue", name: "Mechanism", value: "Photobiomodulation" },
      ...revolux.facts.map((f) => ({ "@type": "PropertyValue", name: f.label, value: f.value })),
    ],
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * The site as an entity, and the trail to the page you are on.
 *
 * The Organization already carried the company's details but had no identity
 * a second block could point at, so each block stood alone. Both now use a
 * stable @id, which is what lets a search engine read the WebSite, the
 * Organization and a page's breadcrumb as statements about one thing rather
 * than three unrelated ones.
 */
export const ORG_ID = `${site.url}/#organization`;
export const SITE_ID = `${site.url}/#website`;

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: site.name,
    alternateName: site.legalName,
    url: site.url,
    inLanguage: "en-GB",
    publisher: { "@id": ORG_ID },
  };
}

/**
 * `trail` is the path from the home page to this one, in order, excluding the
 * page's own entry when it is the last crumb — pass it and it is included.
 * Breadcrumbs are what replace a raw URL in a result with a readable path.
 */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "" }, ...trail].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${site.url}${c.path}`,
    })),
  };
}
