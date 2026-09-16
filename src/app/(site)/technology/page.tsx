import type { Metadata } from "next";
import Image from "next/image";
import Accordion from "@/components/Accordion";
import Button from "@/components/Button";
import CardMark from "@/components/CardMark";
import RetinaExplainer from "@/components/RetinaExplainer";
import RevoluxAnatomy from "@/components/RevoluxAnatomy";
import Reveal from "@/components/Reveal";
import RevoluxExplainer from "@/components/RevoluxExplainer";
import SectionHeading from "@/components/SectionHeading";
import StandardsTicker from "@/components/StandardsTicker";
import TechCard from "@/components/TechCard";
import TreatmentCourse from "@/components/TreatmentCourse";
import { anatomy, course, explainer, faq, retina, revolux, safety, shift } from "@/content/site";

export const metadata: Metadata = {
  title: "Revolux Technology",
  description:
    "How Revolux delivers photobiomodulation for dry AMD: binocular precision geometry, soft-start dosing, targeted wavelengths, safety interlocks and logged, clinician-initiated sessions.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{revolux.eyebrow}</p>
            <h1 className="h-display mt-5 text-fog">{shift.title}</h1>
            <p className="lede mt-7 max-w-xl text-fog/75">
              Preserving vision and independence through advanced photobiomodulation, engineered as a Class IIa medical device for the community clinic.
            </p>
            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
              {revolux.facts.map((f) => (
                <div key={f.label} className="bg-ink-950/80 px-4 py-3.5">
                  <dt className="figure text-xs uppercase tracking-[0.13em] text-fog/70">{f.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-fog">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Reveal className="relative lg:col-span-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(27,195,205,0.18) 0%, transparent 65%)" }}
            />
            <Image
              src="/images/revolux-front.png"
              alt="Render of the Revolux binocular device with its two light-emitting eyepieces"
              width={678}
              height={1306}
              priority
              sizes="(max-width: 1024px) 55vw, 28vw"
              className="relative mx-auto h-auto w-[58%] max-w-[20rem] drop-shadow-[0_30px_60px_rgba(27,195,205,0.25)] lg:w-[64%]"
            />
          </Reveal>
        </div>
        <div className="shell mt-20">
          <Reveal className="grid gap-4 border-t border-line pt-10 md:grid-cols-3">
            {revolux.pillars.map((p) => (
              <div key={p.title}>
                <h2 className="font-display text-lg font-semibold text-fog">{p.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-fog/75">{p.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Anatomy */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow={anatomy.eyebrow} title={anatomy.title} intro={anatomy.intro} />
          <div className="mt-14">
            <RevoluxAnatomy />
          </div>
        </div>
      </section>

      {/* Intelligent delivery */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={explainer.eyebrow} title={explainer.title} intro={explainer.intro} />
        <div className="mt-14">
          <RevoluxExplainer />
        </div>
      </section>

      {/* Mechanism */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={retina.eyebrow} title={retina.title} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog/75">
              {retina.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
          <Reveal delay={0.1} className="lg:col-span-7">
            <RetinaExplainer />
          </Reveal>
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

      {/* Safety */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={safety.eyebrow} title={safety.title} intro={safety.intro} />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {safety.items.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <TechCard className="h-full p-7">
                <CardMark kind={s.mark} className="h-10 w-10" />
                <h3 className="mt-5 font-display text-lg font-semibold text-fog">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fog/75">{s.body}</p>
              </TechCard>
            </Reveal>
          ))}
        </div>
      </section>
      <StandardsTicker />

      {/* FAQ */}
      <section className="shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={faq.eyebrow} title={faq.title} intro={faq.intro} />
            <Reveal className="mt-8">
              <Button href="/contact">Ask us something else</Button>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <Accordion items={faq.items} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
