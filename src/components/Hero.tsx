"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import Button from "./Button";
import DevicePhotons from "./DevicePhotons";
import RevoluxDevice from "./RevoluxDevice";
import { hero, recognition, revolux } from "@/content/site";

export default function Hero() {
  const reduce = useReducedMotion();

  // Always animate *to* the visible state. Only the duration changes under
  // reduced motion, so nothing can be left stranded at opacity 0.
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: reduce ? { duration: 0 } : { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <div aria-hidden="true" className="grid-bg absolute inset-0" />
      {/* Photons converge on the device's eyepieces wherever the layout puts
          them: beside the copy on a laptop, below it on a phone. */}
      <DevicePhotons className="absolute inset-0 h-full w-full" />
      {/* Teal bloom around the device and a faint ember at the focal point. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(27,195,205,0.16) 0%, rgba(27,195,205,0.05) 40%, transparent 68%)" }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <motion.h1 {...rise(0)} className="h-display max-w-3xl text-fog">
              {hero.title}
            </motion.h1>
            <motion.div {...rise(0.08)} className="mt-7 flex max-w-xl flex-col gap-4">
              {hero.subtitle.map((p) => (
                <p key={p} className="lede text-fog">
                  {p}
                </p>
              ))}
            </motion.div>
            <motion.div {...rise(0.16)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} variant="outline">
                {hero.secondary.label}
              </Button>
            </motion.div>

            {/* Recognition: one quiet line, here and nowhere else on the site.
                It sits under the buttons, not at the foot of the section,
                because the device makes the hero taller than a laptop screen
                and the foot is below the fold. The whole line links to
                Scottish EDGE, so the claim can be checked. On a phone the
                words go under the badges: beside them they broke over four
                lines. */}
            <motion.div {...rise(0.24)} className="mt-8 max-w-xl border-t border-line pt-5 sm:mt-10 sm:pt-6">
              <a
                href={recognition.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex shrink-0 gap-2">
                  {recognition.awards.map((a) => (
                    <Image
                      key={a.name}
                      src={a.image}
                      alt={a.alt}
                      width={72}
                      height={72}
                      sizes="(max-width: 640px) 64px, 72px"
                      className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
                    />
                  ))}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold leading-snug text-fog transition-colors group-hover:text-teal-300">
                    {recognition.title}
                  </span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-fog-dim">{recognition.detail}</span>
                </span>
              </a>
            </motion.div>
          </div>

          <motion.div
            className="relative lg:col-span-5"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Concentric rings, like the light-emitting rings in the eyepieces. */}
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              {[1, 0.78, 0.56].map((s, i) => (
                <motion.span
                  key={s}
                  className="absolute rounded-full border border-teal-400/20"
                  style={{ width: `${s * 100}%`, aspectRatio: "1 / 1" }}
                  animate={reduce ? undefined : { opacity: [0.35, 0.8, 0.35], scale: [1, 1.03, 1] }}
                  transition={reduce ? undefined : { duration: 6, delay: i * 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={reduce ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative mx-auto w-[62%] max-w-[22rem] lg:w-[68%]"
            >
              <RevoluxDevice
                alt={hero.deviceAlt}
                sizes="(max-width: 1024px) 60vw, 30vw"
                priority
                label={revolux.name}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="relative mt-20 h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    </section>
  );
}
