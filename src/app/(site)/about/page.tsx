import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import CardMark from "@/components/CardMark";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TechCard from "@/components/TechCard";
import { about, advisors, founder, partners } from "@/content/site";

export const metadata: Metadata = {
  title: "About BioPhotonix",
  description:
    "BioPhotonix is a Glasgow medical technology company founded by an optometrist and orthoptist to bring active, clinician-led intervention for dry AMD into community eye care.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{about.hero.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{about.hero.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog">{about.hero.lede}</p>
        </div>
      </section>

      {/* Belief */}
      <section className="shell py-20 md:py-28">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-base text-fog">{about.belief.lead}</p>
          <p className="mt-6 font-display text-3xl font-semibold leading-tight text-fog md:text-5xl">{about.belief.statement}</p>
          <p className="lede mt-8 text-fog">{about.belief.body}</p>
        </Reveal>
      </section>

      {/* Origin */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow={about.origin.eyebrow} title={about.origin.title} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog">
              {about.origin.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-line">
              <Image src={founder.clinicImage} alt={founder.clinicAlt} fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={about.values.eyebrow} title={about.values.title} intro={about.values.intro} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.items.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <TechCard className="h-full p-7">
                <CardMark kind={v.mark} className="h-10 w-10" />
                <h3 className="mt-5 font-display text-lg font-semibold text-fog">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog">{v.body}</p>
              </TechCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[6/7] overflow-hidden rounded-2xl border border-line">
              <Image src={founder.image} alt={founder.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={founder.eyebrow} title={founder.name} />
            <Reveal>
              <p className="mt-2 text-base text-fog">
                {founder.role} &middot; {founder.qualifications.join(", ")}
              </p>
              <div className="mt-6 flex flex-col gap-4 text-fog">
                {founder.bio.map((p) => (
                  <p key={p} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-6 inline-block text-base text-fog hover:text-fog"
              >
                Adail on LinkedIn
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={advisors.eyebrow} title={advisors.title} intro={advisors.intro} />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {advisors.people.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <TechCard className="h-full overflow-hidden">
                <div className="relative aspect-square border-b border-line">
                  <Image src={p.image} alt={p.alt} fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="eyebrow">{p.area}</p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-fog">{p.name}</h3>
                  <p className="mt-1 text-sm text-fog">
                    {p.role}, {p.org}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-fog">{p.body}</p>
                </div>
              </TechCard>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 border-t border-line pt-10">
          <h3 className="eyebrow">{partners.title}</h3>
          <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {partners.names.map((p) => (
              <li key={p.name}>
                <p className="font-display text-lg font-semibold text-fog">{p.name}</p>
                <p className="text-sm text-fog">{p.role}</p>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mt-12">
          <Button href="/contact">Work with us</Button>
        </Reveal>
      </section>
    </>
  );
}
