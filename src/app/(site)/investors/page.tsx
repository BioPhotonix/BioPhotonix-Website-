import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/content/schema";
import type { Metadata } from "next";
import Button from "@/components/Button";
import MarketFunnel from "@/components/MarketFunnel";
import Reveal from "@/components/Reveal";
import Roadmap from "@/components/Roadmap";
import SectionHeading from "@/components/SectionHeading";
import { investors, roadmap } from "@/content/site";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "The investment case for BioPhotonix: a Class IIa photobiomodulation device for dry AMD, a structural market gap and recurring revenue in optometry.",
  alternates: { canonical: "/investors" },
};

export default function InvestorsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Investors", path: "/investors" }])} />
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{investors.hero.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{investors.hero.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog">{investors.hero.lede}</p>
        </div>
      </section>

      {/* Thesis */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={investors.thesis.eyebrow} title={investors.thesis.title} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog">
              {investors.thesis.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-7">
            <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
              <MarketFunnel />
            </figure>
          </div>
        </div>
      </section>

      {/* Business model. How Revolux is regulated is on Technology. */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionHeading eyebrow={investors.model.eyebrow} title={investors.model.title} />
            <Reveal className="mt-6 flex max-w-2xl flex-col gap-4 text-fog">
              {investors.model.body.map((p) => (
                <p key={p} className="lede">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal>
            <Button href={investors.model.link.href} variant="outline">
              {investors.model.link.label}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Roadmap: lives here, and only here. */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={roadmap.eyebrow} title={roadmap.title} intro={roadmap.intro} />
          </div>
          <div className="lg:col-span-7">
            <Roadmap />
          </div>
        </div>
      </section>

      {/* Team: the founder, advisers and partners are introduced on About. */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow={investors.team.eyebrow} title={investors.team.title} intro={investors.team.intro} />
          <Reveal>
            <Button href="/about" variant="outline">
              {investors.team.cta}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Data room */}
      <section id="data-room" className="shell scroll-mt-24 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">{investors.dataRoom.eyebrow}</p>
            <h2 className="h-section mt-4 text-fog">{investors.dataRoom.title}</h2>
            <p className="lede mt-6 max-w-md text-fog">{investors.dataRoom.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center md:justify-end">
            {/* The one form on the site is on Contact; this opens it as an investor enquiry. */}
            <Button href="/contact?as=investor">{investors.dataRoom.label}</Button>
          </Reveal>
        </div>
        <Reveal className="mt-16 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-fog">{investors.disclaimer}</p>
        </Reveal>
      </section>
    </>
  );
}
