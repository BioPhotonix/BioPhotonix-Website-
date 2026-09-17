import type { Metadata } from "next";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How BioPhotonix Limited collects, uses and protects personal data across its website, the Revolux platform and participating clinics.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return (
    <article className="shell pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="h-section mt-4 text-fog">Privacy policy</h1>
        <p className="mt-4 text-sm text-fog">Last updated: {privacy.lastUpdated}</p>

        {privacy.sections.map((s) => (
          <section key={s.title} className="mt-12">
            <h2 className="font-display text-2xl font-semibold text-fog">{s.title}</h2>
            {s.blocks.map((b, i) => {
              if (b.type === "h3") {
                return (
                  <h3 key={i} className="mt-6 font-display text-lg font-semibold text-fog">
                    {b.text}
                  </h3>
                );
              }
              if (b.type === "ul") {
                return (
                  <ul key={i} className="mt-4 flex flex-col gap-2.5">
                    {b.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-fog">
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="mt-4 leading-relaxed text-fog">
                  {b.text}
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </article>
  );
}
