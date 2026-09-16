import type { Metadata } from "next";
import Image from "next/image";
import BurdenChart from "@/components/BurdenChart";
import ContactForm from "@/components/ContactForm";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import Roadmap from "@/components/Roadmap";
import SectionHeading from "@/components/SectionHeading";
import StandardsTicker from "@/components/StandardsTicker";
import TechCard from "@/components/TechCard";
import { advisors, founder, investors, partners, roadmap } from "@/content/site";

export const metadata: Metadata = {
  title: "Investors",
  description:
    "The investment case for BioPhotonix: a Class IIa photobiomodulation platform for dry AMD, a structural gap in a market of 200 million people, and a recurring-revenue model for community optometry.",
  alternates: { canonical: "/investors" },
};

export default function InvestorsPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{investors.hero.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{investors.hero.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog/75">{investors.hero.lede}</p>
          <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {investors.highlights.map((h) => (
              <div key={h.label} className="bg-ink-950/80 p-6">
                <dt className="figure text-xs uppercase tracking-[0.13em] text-fog/50">{h.label}</dt>
                <dd>
                  <span className="mt-2 block text-3xl font-medium text-fog">
                    <CountUp value={h.value} />
                  </span>
                  <span className="mt-2 block text-sm text-fog/60">{h.body}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Thesis */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={investors.thesis.eyebrow} title={investors.thesis.title} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog/75">
              {investors.thesis.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <BurdenChart layout="stack" />
          </div>
        </div>
      </section>

      {/* Model and regulatory */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-5 lg:grid-cols-2">
          {[investors.model, investors.regulatory].map((block, i) => (
            <Reveal key={block.title} delay={i * 0.1}>
              <TechCard className="h-full p-8 md:p-10">
                <p className="eyebrow">{block.eyebrow}</p>
                <h2 className="mt-4 font-display text-2xl font-semibold text-fog md:text-3xl">{block.title}</h2>
                {block.body.map((p) => (
                  <p key={p} className="mt-5 leading-relaxed text-fog/75">
                    {p}
                  </p>
                ))}
                <ul className="mt-7 flex flex-col gap-3">
                  {block.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-sm text-fog/80">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </TechCard>
            </Reveal>
          ))}
        </div>
      </section>
      <StandardsTicker />

      {/* Roadmap */}
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

      {/* Team */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow="Team and partners" title="A clinician founder, with the specialists a medical device needs." />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: founder.name, role: `${founder.role}, ${founder.qualifications.join(", ")}`, image: founder.image, alt: founder.alt },
              ...advisors.people.map((p) => ({ name: p.name, role: `${p.area}. ${p.role}, ${p.org}.`, image: p.image, alt: p.alt })),
            ].map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <TechCard className="h-full overflow-hidden">
                  <div className="relative aspect-square border-b border-line">
                    <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover object-top" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-fog">{p.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fog/60">{p.role}</p>
                  </div>
                </TechCard>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
            <span className="figure text-xs uppercase tracking-[0.13em] text-fog/50">{partners.title}</span>
            {partners.names.map((p) => (
              <span key={p.name} className="text-sm text-fog/80">
                {p.name}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Data room */}
      <section id="data-room" className="shell scroll-mt-24 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">{investors.dataRoom.eyebrow}</p>
            <h2 className="h-section mt-4 text-fog">{investors.dataRoom.title}</h2>
            <p className="lede mt-6 max-w-md text-fog/75">{investors.dataRoom.body}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <ContactForm kind="investor" />
          </Reveal>
        </div>
        <Reveal className="mt-16 border-t border-line pt-8">
          <p className="max-w-3xl text-xs leading-relaxed text-fog/45">{investors.disclaimer}</p>
        </Reveal>
      </section>
    </>
  );
}
