"use client";

import { motion, useReducedMotion } from "motion/react";
import Button from "./Button";
import PhotonField from "./PhotonField";
import RevoluxDevice from "./RevoluxDevice";
import { hero } from "@/content/site";

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
      <PhotonField className="absolute inset-0 h-full w-full" />
      {/* Teal bloom around the device and a faint ember at the focal point. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[40rem] w-[40rem] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(27,195,205,0.16) 0%, rgba(27,195,205,0.05) 40%, transparent 68%)" }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <motion.p {...rise(0)} className="eyebrow flex items-center gap-3">
              <span className="pulse-ring relative inline-block h-2 w-2 rounded-full bg-teal-400 text-teal-400" />
              {hero.status}
            </motion.p>
            <motion.h1 {...rise(0.08)} className="h-display mt-6 max-w-3xl text-fog">
              {hero.title}
            </motion.h1>
            <motion.p {...rise(0.16)} className="lede mt-7 max-w-xl text-fog/75">
              {hero.subtitle}
            </motion.p>
            <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} variant="outline">
                {hero.secondary.label}
              </Button>
            </motion.div>

            <motion.dl {...rise(0.34)} className="mt-14 grid max-w-xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {hero.specs.map((s) => (
                <div key={s.label} className="bg-ink-950/80 px-4 py-3.5 backdrop-blur">
                  <dt className="figure text-xs uppercase tracking-[0.13em] text-fog/70">{s.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-fog">{s.value}</dd>
                </div>
              ))}
            </motion.dl>
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
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div aria-hidden="true" className="relative mt-20 h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    </section>
  );
}
