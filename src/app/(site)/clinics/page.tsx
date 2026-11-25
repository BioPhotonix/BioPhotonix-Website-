import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/content/schema";
import type { Metadata } from "next";
import Button from "@/components/Button";
import RevenueCalculator from "@/components/RevenueCalculator";
import TreatmentCourse from "@/components/TreatmentCourse";
import CardMark from "@/components/CardMark";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { clinics, course } from "@/content/site";

export const metadata: Metadata = {
  /* Query-led, unlike the h1 below it. See "Search rankings" in the README. */
  title: "Dry AMD Photobiomodulation for Optometry Practices",
  description:
    "Bring active dry AMD treatment into your optometry practice: a five-step clinical pathway, no upfront cost, and revenue that scales with volume.",
  alternates: { canonical: "/clinics" },
};

export default function ClinicsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "For clinics", path: "/clinics" }])} />
      <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{clinics.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{clinics.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog">{clinics.intro}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/contact?as=clinic">{clinics.cta.label}</Button>
            <Button href="#economics" variant="outline">
              Practice economics
            </Button>
          </div>
        </div>
      </section>

      {/* Pathway */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow="In practice" title={clinics.workflow.title} intro={clinics.workflow.intro} />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-5">
            {clinics.workflow.steps.map((s, i) => (
              <Reveal key={s.title} as="li" delay={i * 0.08} className="bg-ink-950 p-6">
                <CardMark kind={s.mark} className="h-9 w-9" />
                <span className="mt-4 block text-xs font-semibold tracking-[0.13em] text-teal-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-fog">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Course */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={course.eyebrow} title={course.title} intro={course.intro} />
          </div>
          <Reveal delay={0.1} className="lg:col-span-7 lg:self-center">
            <TreatmentCourse />
          </Reveal>
        </div>
      </section>

      {/* Economics: what a practice pays, and earns, said here and only here. */}
      <section id="economics" className="scroll-mt-24 border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow={clinics.calculator.eyebrow} title={clinics.calculator.title} intro={clinics.calculator.intro} />
          <Reveal className="mt-12">
            <RevenueCalculator />
          </Reveal>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="shell scroll-mt-24 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">Register your interest</p>
            <h2 className="h-section mt-4 text-fog">{clinics.cta.title}</h2>
            <p className="lede mt-6 max-w-md text-fog">{clinics.cta.body}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center md:justify-end">
            {/* The one form on the site is on Contact; this opens it as a practice enquiry. */}
            <Button href="/contact?as=clinic">{clinics.cta.label}</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
