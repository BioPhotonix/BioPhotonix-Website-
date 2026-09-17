import type { Metadata } from "next";
import Button from "@/components/Button";
import EvidenceLibrary from "@/components/EvidenceLibrary";
import Reveal from "@/components/Reveal";
import { evidence, evidenceSignedOff } from "@/content/evidence";

export const metadata: Metadata = {
  title: "Evidence",
  description:
    "The published literature on photobiomodulation in dry age-related macular degeneration, including the trials that report benefit, the meta-analysis that found none, and the position statement of the German ophthalmological societies.",
  alternates: { canonical: "/evidence" },
  // Not indexed until a clinician has signed the summaries off against source.
  robots: evidenceSignedOff ? { index: true, follow: true } : { index: false, follow: true },
};

export default function EvidencePage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 md:pt-40">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <p className="eyebrow">{evidence.eyebrow}</p>
          <h1 className="h-display mt-5 max-w-4xl text-fog">{evidence.title}</h1>
          <p className="lede mt-7 max-w-2xl text-fog/75">{evidence.intro}</p>
        </div>
      </section>

      <section className="shell py-14 md:py-20">
        <Reveal className="max-w-3xl border-l-2 border-teal-400 pl-6">
          <h2 className="eyebrow">{evidence.scope.title}</h2>
          <div className="mt-4 flex flex-col gap-4 text-fog/80">
            {evidence.scope.body.map((p) => (
              <p key={p} className="leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {!evidenceSignedOff && (
          <Reveal className="mt-8 max-w-3xl rounded-2xl border border-line-strong bg-ink-900 p-6">
            <h2 className="eyebrow text-ember-text">{evidence.draftNotice.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-fog/80">{evidence.draftNotice.body}</p>
          </Reveal>
        )}

        <div className="mt-14">
          <EvidenceLibrary />
        </div>

        <Reveal className="mt-12 flex flex-wrap gap-3">
          <Button href="/technology">How Revolux works</Button>
          <Button href="/contact" variant="outline">
            Ask us about the evidence
          </Button>
        </Reveal>
      </section>
    </>
  );
}
