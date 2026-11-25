import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RetinaExplainer from "@/components/RetinaExplainer";
import RevoluxAnatomy from "@/components/RevoluxAnatomy";
import RevoluxDevice from "@/components/RevoluxDevice";
import Reveal from "@/components/Reveal";
import RevoluxExplainer from "@/components/RevoluxExplainer";
import SectionHeading from "@/components/SectionHeading";
import { breadcrumbSchema, medicalDeviceSchema } from "@/content/schema";
import { anatomy, explainer, regulation, retina, revolux, technology } from "@/content/site";

export const metadata: Metadata = {
  /* Query-led, unlike the h1 below it. See "Search rankings" in the README. */
  title: "Photobiomodulation for Dry AMD: How Revolux Works",
  description:
    "How Revolux delivers photobiomodulation for dry AMD: precision binocular geometry, soft-start dosing, targeted wavelengths and logged sessions.",
  alternates: { canonical: "/technology" },
};

export default function TechnologyPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Technology", path: "/technology" }])} />
      {/* The device is described here rather than site-wide: one page carries
          each entity, so nothing is declared twice. */}
      <JsonLd data={medicalDeviceSchema()} />

      <section className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">{revolux.eyebrow}</p>
            <h1 className="h-display mt-5 text-fog">{technology.title}</h1>
            <p className="lede mt-7 max-w-xl text-fog">{technology.lede}</p>
          </div>
          <Reveal className="relative lg:col-span-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(27,195,205,0.18) 0%, transparent 65%)" }}
            />
            <RevoluxDevice
              alt="Render of the Revolux device seen head on, with therapy light rising from both eyepieces"
              sizes="(max-width: 1024px) 55vw, 28vw"
              priority
              className="relative mx-auto w-[58%] max-w-[20rem] lg:w-[64%]"
            />
          </Reveal>
        </div>
      </section>

      {/* Each section says one thing, once: what the light does, how the
          device delivers it, what the device is made of, how it is regulated. */}

      {/* Mechanism: what the light does */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={retina.eyebrow} title={retina.title} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog">
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

      {/* Intelligent delivery: how the device delivers it */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={explainer.eyebrow} title={explainer.title} intro={explainer.intro} />
        <div className="mt-14">
          <RevoluxExplainer />
        </div>
      </section>

      {/* Anatomy: what it is made of */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading eyebrow={anatomy.eyebrow} title={anatomy.title} intro={anatomy.intro} />
          <div className="mt-14">
            <RevoluxAnatomy />
          </div>
        </div>
      </section>

      {/* Regulation: said here, and only here. */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={regulation.eyebrow} title={regulation.title} intro={regulation.body} />
      </section>
    </>
  );
}
