import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import BurdenChart from "@/components/BurdenChart";
import ContactForm from "@/components/ContactForm";
import Hero from "@/components/Hero";
import PathwayDiagram from "@/components/PathwayDiagram";
import PostArt from "@/components/PostArt";
import Reveal from "@/components/Reveal";
import Roadmap from "@/components/Roadmap";
import SectionHeading from "@/components/SectionHeading";
import StandardsTicker from "@/components/StandardsTicker";
import StatCounter from "@/components/StatCounter";
import TechCard from "@/components/TechCard";
import { posts } from "@/content/posts";
import { burden, clinics, contact, founder, revolux, roadmap, shift, site } from "@/content/site";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function HomePage() {
  const latest = posts.slice(0, 3);
  return (
    <>
      <Hero />

      {/* The burden of dry AMD */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={burden.eyebrow} title={burden.title} intro={burden.intro} />
        <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {burden.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="bg-ink-900 p-7">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="mono block text-4xl font-medium text-fog md:text-5xl">
                  <StatCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-fog/65">{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
        <div className="mt-6">
          <BurdenChart />
        </div>
        <Reveal className="mt-6 flex flex-col gap-3 rounded-2xl border border-line bg-ink-900 p-7 md:flex-row md:items-center md:gap-8">
          <span className="mono text-4xl font-medium text-ember md:text-5xl">{burden.cost.value}</span>
          <p className="text-base leading-relaxed text-fog/70">{burden.cost.label}</p>
        </Reveal>
      </section>

      {/* From observation to intervention */}
      <section className="relative border-y border-line bg-ink-900 py-20 md:py-28">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="shell relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow={shift.eyebrow} title={shift.title} />
              <Reveal className="mt-6 flex flex-col gap-4 text-fog/75">
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

      {/* Revolux */}
      <section className="shell py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="relative lg:col-span-5">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(27,195,205,0.18) 0%, transparent 65%)" }}
            />
            <Image
              src="/images/revolux-side.png"
              alt="Side view of the Revolux device, showing the eyepiece and the handle"
              width={448}
              height={1282}
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="relative mx-auto h-auto w-1/2 max-w-[14rem] drop-shadow-[0_30px_60px_rgba(27,195,205,0.2)] lg:w-3/5"
            />
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={revolux.eyebrow} title={`${revolux.name}. ${revolux.tagline}`} />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog/75">
              {revolux.body.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {revolux.pillars.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <TechCard className="h-full p-6">
                    <h3 className="font-display text-lg font-semibold text-fog">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fog/65">{p.body}</p>
                  </TechCard>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8">
              <Button href={revolux.cta.href}>{revolux.cta.label}</Button>
            </Reveal>
          </div>
        </div>
      </section>

      <StandardsTicker />

      {/* For clinics */}
      <section className="shell py-20 md:py-28">
        <SectionHeading eyebrow={clinics.eyebrow} title={clinics.title} intro={clinics.intro} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.props.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.08}>
              <TechCard className="h-full p-7">
                <span className="mono text-xs text-teal-400">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-lg font-semibold text-fog">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fog/65">{p.body}</p>
              </TechCard>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 flex flex-wrap gap-3">
          <Button href="/clinics">Revolux for your practice</Button>
          <Button href="/clinics#economics" variant="outline">
            Practice economics
          </Button>
        </Reveal>
      </section>

      {/* Roadmap */}
      <section className="border-y border-line bg-ink-900 py-20 md:py-28">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={roadmap.eyebrow} title={roadmap.title} intro={roadmap.intro} />
            <Reveal className="mt-8">
              <Button href="/investors" variant="outline">
                Read the investor overview
              </Button>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Roadmap />
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="shell py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[6/7] overflow-hidden rounded-2xl border border-line">
              <Image src={founder.image} alt={founder.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover object-top" />
            </div>
          </Reveal>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={founder.eyebrow} title="Founded by a clinician who ran out of things to offer." />
            <Reveal className="mt-6 flex flex-col gap-4 text-fog/75">
              {founder.bio.map((p) => (
                <p key={p} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal className="mt-8">
              <p className="font-display text-xl font-semibold text-fog">{founder.name}</p>
              <p className="text-sm text-fog/60">
                {founder.role} &middot; {founder.qualifications.join(", ")}
              </p>
              <div className="mt-6">
                <Button href="/about" variant="outline">
                  About the company
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="border-t border-line bg-ink-900 py-20 md:py-28">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Latest insights" title="From the team." />
            <Reveal>
              <Link href="/news" className="link-underline text-base text-fog/80 hover:text-fog">
                All articles
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {latest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08} as="article">
                <Link href={`/news/${p.slug}`} className="group block h-full">
                  <TechCard className="h-full overflow-hidden">
                    <div className="aspect-[5/3] overflow-hidden border-b border-line">
                      <PostArt kind={p.art} className="transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <div className="p-6">
                      <p className="mono text-xs uppercase tracking-[0.16em] text-fog/50">
                        {formatDate(p.date)} &middot; {p.readingMinutes} min
                      </p>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-fog">{p.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-fog/65">{p.excerpt}</p>
                    </div>
                  </TechCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-24 border-t border-line py-20 md:py-28">
        <div className="shell grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 className="h-section mt-4 text-fog">{contact.title}</h2>
            <p className="lede mt-6 max-w-md text-fog/75">{contact.body}</p>
            <div className="mt-10 flex flex-col gap-3 text-lg">
              <a href={site.phoneHref} className="link-underline w-fit text-fog">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="link-underline w-fit break-all text-fog">
                {site.email}
              </a>
              <address className="text-base not-italic leading-relaxed text-fog/65">
                {site.address.line1}, {site.address.line2}
                <br />
                {site.address.city} {site.address.postcode}, {site.address.country}
              </address>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="font-display text-2xl font-semibold text-fog">{contact.formTitle}</h3>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
