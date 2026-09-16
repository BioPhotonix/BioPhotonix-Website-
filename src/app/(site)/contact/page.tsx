import type { Metadata } from "next";
import ContactForm, { type Kind } from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { contact, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with BioPhotonix in Glasgow: ${site.email}, ${site.phone}.`,
  alternates: { canonical: "/contact" },
};

type Search = { searchParams: Promise<{ as?: string }> };

export default async function ContactPage({ searchParams }: Search) {
  const { as } = await searchParams;
  const kind: Kind = as === "clinic" ? "clinic" : as === "investor" ? "investor" : "general";
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      <div className="shell relative grid gap-12 md:grid-cols-2 md:gap-16">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1 className="h-display mt-5 text-fog">{contact.title}</h1>
          <p className="lede mt-7 max-w-md text-fog/75">{contact.body}</p>
          <div className="mt-10 flex flex-col gap-3 text-lg">
            <a href={site.phoneHref} className="link-underline w-fit text-fog">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="link-underline w-fit break-all text-fog">
              {site.email}
            </a>
          </div>
          <address className="mt-8 text-base not-italic leading-relaxed text-fog/75">
            {site.legalName}
            <br />
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            {site.address.city} {site.address.postcode}, {site.address.country}
          </address>
          <p className="mt-8 text-sm text-fog/70">{contact.responseNote}</p>
        </div>
        <Reveal delay={0.1}>
          <h2 className="font-display text-2xl font-semibold text-fog">{contact.formTitle}</h2>
          <div className="mt-6">
            <ContactForm kind={kind} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
