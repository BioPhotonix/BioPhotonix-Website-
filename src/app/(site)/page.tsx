import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import PathwayDiagram from "@/components/PathwayDiagram";
import PortraitCrowd from "@/components/PortraitCrowd";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import FactsGallery from "@/components/FactsGallery";
import TechCard from "@/components/TechCard";
import { latestPosts } from "@/content/posts";
import { burden, home, revolux, shift } from "@/content/site";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/*
 * The front door. It says in full only what lives here, the problem and the
 * shift from monitoring to treatment, and points to the page that holds
 * everything else rather than repeating it: the device to Technology, the
 * practice offer to Clinics, the programme and roadmap to Investors, the
 * founder and team to About, the articles to News, the form to Contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      {/* The burden of dry AMD: lives here, and only here. */}
      <section className="shell py-20 md:py-28">
        <SectionHeading title={burden.title} intro={burden.intro} />
        <Reveal className="mt-14">
          <FactsGallery />
        </Reveal>
        <div className="mt-6">
          <PortraitCrowd />
        </div>
      </section>

      {/* The shift from monitoring to treatment: lives here, and only here. */}
      <section className="relative border-y border-line bg-ink-900 py-20 md:py-28">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading title={shift.title} />
              <Reveal className="mt-6 flex flex-col gap-4 text-fog">
                {shift.body.map((p) => (
                  <p key={p} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <PathwayDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* Revolux, in brief: the device itself is described on Technology. */}
      <section className="shell py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative lg:col-span-4">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(27,195,205,0.18) 0%, transparent 65%)" }}
            />
            <Image
              src="/images/revolux-profile.png"
              alt="Side view of the Revolux device, showing the eyepiece and the handle"
              width={240}
              height={657}
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="relative mx-auto h-auto w-1/2 max-w-[14rem] drop-shadow-[0_30px_60px_rgba(27,195,205,0.2)] lg:w-3/5"
            />
          </Reveal>
          {/* Eight columns, not seven: "Engineered by BioPhotonix." needs 723px
              to stay on one line at this size, and seven give it 673. */}
          <div className="lg:col-span-8">
            <SectionHeading title={[`${revolux.name}.`, revolux.tagline]} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog">
              {home.revolux.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal className="mt-8">
              <Button href={home.revolux.cta.href}>{home.revolux.cta.label}</Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Three doors, each saying what is behind it rather than repeating it. */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <SectionHeading title={home.doors.title} />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {home.doors.items.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.08}>
                <TechCard className="flex h-full flex-col p-7">
                  <p className="eyebrow">{d.eyebrow}</p>
                  <h3 className="mt-4 font-display text-xl font-semibold text-fog">{d.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-fog">{d.body}</p>
                  <div className="mt-6">
                    <Button href={d.cta.href} variant="outline">
                      {d.cta.label}
                    </Button>
                  </div>
                </TechCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Latest insights: titles only; the articles and their summaries are on News. */}
      <section className="shell py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={home.insights.eyebrow} title={home.insights.title} />
          <Reveal>
            <Link href="/news" className="link-underline text-base text-fog hover:text-fog">
              All articles
            </Link>
          </Reveal>
        </div>
        <Reveal as="div" className="mt-10">
          <ul className="divide-y divide-line border-y border-line">
            {latestPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/news/${p.slug}`}
                  className="group flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-8"
                >
                  <span className="figure shrink-0 text-xs uppercase tracking-[0.13em] text-fog sm:w-44">
                    {formatDate(p.date)}
                  </span>
                  <span className="font-display text-lg font-semibold leading-snug text-fog transition-colors group-hover:text-teal-300">
                    {p.title}
                  </span>
                  <span aria-hidden="true" className="ml-auto hidden text-fog transition-transform group-hover:translate-x-1 sm:block">
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Contact: the details and the form are on the Contact page. */}
      <section className="border-t border-line bg-ink-900 py-16 md:py-20">
        <Reveal className="shell flex flex-wrap items-center justify-between gap-6">
          <h2 className="h-section text-fog">{home.contact.title}</h2>
          <Button href={home.contact.cta.href}>{home.contact.cta.label}</Button>
        </Reveal>
      </section>
    </>
  );
}
