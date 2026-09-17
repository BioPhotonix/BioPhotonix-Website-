import type { Metadata } from "next";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VisionSimulator from "@/components/VisionSimulator";
import { burden, vision } from "@/content/site";

export const metadata: Metadata = {
  title: "What dry AMD takes",
  description:
    "An interactive simulation of vision through each stage of dry age-related macular degeneration, from early drusen to geographic atrophy, and why the stages patients notice least are the ones that matter most.",
  alternates: { canonical: "/vision" },
};

export default function VisionPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{vision.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{vision.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog/75">{vision.intro}</p>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <Reveal className="mx-auto max-w-4xl">
          <VisionSimulator titleAs="h2" />
        </Reveal>
      </section>

      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-10 border-t border-line pt-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={burden.eyebrow} title="Why this is the window that matters." />
          </div>
          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-4 text-fog/75">
              <p>
                The two stages where a patient reports least are the two stages where the retina is
                still there to protect. By the time atrophy reaches the fovea, the photoreceptors it
                took are gone and no therapy returns them.
              </p>
              <p>
                That gap between when the disease is detectable and when the patient notices it is
                exactly where community optometry already sees these people, and exactly where
                &ldquo;watch and wait&rdquo; has been the only thing on offer.
              </p>
            </Reveal>
            <Reveal className="mt-8 flex flex-wrap gap-3">
              <Button href="/technology">How Revolux intervenes</Button>
              <Button href="/evidence" variant="outline">
                The published evidence
              </Button>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
