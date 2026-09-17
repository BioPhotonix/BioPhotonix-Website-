"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { explainer } from "@/content/site";

/**
 * Five aspects of how Revolux delivers light, each with its own drawing of
 * the binocular head. Tabs step through them; they also advance on their own
 * until someone touches them.
 *
 * Layout. On a phone the tabs are a horizontal row of short labels above the
 * diagram, so the drawing is on screen as soon as a tab is chosen. A vertical
 * list of full titles would push it a screen and a half down. From the large
 * breakpoint the tabs and the description share the left column and the
 * diagram sits beside them.
 *
 * The drawing. The device occupies the top two thirds and every annotation
 * sits in a clear band beneath it, because the handle runs down the middle and
 * anything written across it collides. Annotation text is sized in CSS rather
 * than by attribute so it can be larger, in user units, on a narrow screen:
 * a 640-unit viewBox on a 350px phone halves everything, and a label set for
 * the desktop ends up at about 8px.
 */

/** Annotation type: bigger in user units on a phone, so it lands near 15px either way. */
const CAP = "text-[27px] font-semibold tracking-[0.1em] md:text-[18px]";
const CAP_SM = "text-[24px] font-semibold tracking-[0.1em] md:text-[17px]";

export default function RevoluxExplainer() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduce = useReducedMotion();
  const tabsRef = useRef<HTMLDivElement>(null);
  const steps = explainer.steps;

  useEffect(() => {
    if (touched || reduce) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % steps.length), 5200);
    return () => window.clearInterval(id);
  }, [touched, reduce, steps.length]);

  const choose = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const last = steps.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  const step = steps[active];
  const fade = {
    initial: reduce ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: reduce ? undefined : { opacity: 0 },
    transition: { duration: 0.45 },
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-14">
      {/* Tabs. DOM order puts them first, so a phone gets tabs, diagram, text. */}
      <div className="min-w-0 lg:col-start-1 lg:col-end-6 lg:row-start-1">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="How Revolux delivers light"
          onKeyDown={onKey}
          className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-x-visible lg:px-0"
        >
          {steps.map((s, i) => {
            const selected = i === active;
            return (
              <button
                key={s.id}
                role="tab"
                type="button"
                id={`rx-tab-${s.id}`}
                aria-selected={selected}
                aria-controls="rx-panel"
                aria-label={s.title}
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-left whitespace-nowrap transition-colors duration-300 lg:w-full lg:gap-4 lg:px-4 lg:py-3.5 ${
                  selected ? "bg-ink-800 text-fog" : "text-fog hover:text-fog"
                }`}
              >
                <span className={`text-xs font-semibold ${selected ? "text-teal-400" : "text-fog"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base font-semibold lg:hidden">{s.short}</span>
                <span className="hidden font-display text-lg font-semibold lg:inline">{s.title}</span>
                {selected && !reduce && !touched && (
                  <motion.span
                    key={`bar-${s.id}`}
                    aria-hidden="true"
                    className="absolute bottom-0 left-3 right-3 h-px origin-left bg-teal-400/70 lg:left-4 lg:right-4"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5.2, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagram */}
      <div className="min-w-0 lg:col-start-6 lg:col-end-13 lg:row-start-1 lg:row-end-3">
        <div className="tech-card rounded-2xl p-4 md:p-6">
          <svg viewBox="0 0 640 530" className="h-auto w-full" role="img" aria-label={`Diagram: ${step.title}. ${step.body}`}>
            <defs>
              <radialGradient id="rx-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#ff5a3c" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#ff5a3c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="rx-ramp" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1bc3cd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1bc3cd" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Faint drawing grid */}
            <g stroke="rgba(232,241,243,0.06)" strokeWidth="1">
              {Array.from({ length: 15 }, (_, i) => (
                <line key={`v${i}`} x1={i * 45 + 5} y1="0" x2={i * 45 + 5} y2="530" />
              ))}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="640" y2={i * 50} />
              ))}
            </g>

            {/* The binocular head, seen from the patient's side: two eyepieces
                on a bridge, a handle beneath. Everything written about it goes
                below y=400, clear of the handle. */}
            <g fill="none" stroke="#e8f1f3" strokeOpacity="0.9" strokeWidth="2">
              <path d="M 258 150 Q 320 120 382 150" />
              <circle cx="220" cy="180" r="70" />
              <circle cx="420" cy="180" r="70" />
              <circle cx="220" cy="180" r="44" strokeOpacity="0.45" />
              <circle cx="420" cy="180" r="44" strokeOpacity="0.45" />
              <path d="M 300 235 L 340 235 L 336 300 L 304 300 Z" />
              <rect x="306" y="300" width="28" height="80" rx="6" />
            </g>

            {/* Light-emitting rings: twelve emitters around each eyepiece */}
            {[220, 420].map((cx) =>
              Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <circle key={`${cx}-${i}`} cx={cx + Math.cos(a) * 57} cy={180 + Math.sin(a) * 57} r="3" fill="#e8f1f3" fillOpacity="0.5" />;
              }),
            )}

            <AnimatePresence mode="wait" initial={false}>
              {step.id === "geometry" && (
                <motion.g key="geometry" {...fade}>
                  {/* Source-to-eye separation, dimensioned below the device */}
                  <g stroke="#1bc3cd" strokeWidth="1.5" fill="none">
                    <line x1="220" y1="255" x2="220" y2="432" strokeDasharray="4 5" strokeOpacity="0.55" />
                    <line x1="420" y1="255" x2="420" y2="432" strokeDasharray="4 5" strokeOpacity="0.55" />
                    <line x1="220" y1="440" x2="420" y2="440" />
                    <path d="M 228 433 L 220 440 L 228 447 M 412 433 L 420 440 L 412 447" />
                    <circle cx="220" cy="180" r="12" strokeOpacity="0.9" />
                    <circle cx="420" cy="180" r="12" strokeOpacity="0.9" />
                    <line x1="220" y1="166" x2="220" y2="194" strokeOpacity="0.9" />
                    <line x1="206" y1="180" x2="234" y2="180" strokeOpacity="0.9" />
                    <line x1="420" y1="166" x2="420" y2="194" strokeOpacity="0.9" />
                    <line x1="406" y1="180" x2="434" y2="180" strokeOpacity="0.9" />
                  </g>
                  <text x="320" y="500" textAnchor="middle" className={CAP} fill="#1bc3cd" fontFamily="var(--font-sans)">
                    FIXED SOURCE-TO-EYE GEOMETRY
                  </text>
                  <text x="320" y="58" textAnchor="middle" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                    ALIGNED, REPEATABLE, BOTH EYES
                  </text>
                </motion.g>
              )}

              {step.id === "priming" && (
                <motion.g key="priming" {...fade}>
                  {[220, 420].map((cx) => (
                    <motion.circle
                      key={cx}
                      cx={cx}
                      cy="180"
                      r="62"
                      fill="url(#rx-glow)"
                      initial={{ opacity: 0.1 }}
                      animate={reduce ? { opacity: 0.6 } : { opacity: [0.1, 0.3, 0.55, 0.75, 0.75, 0.1] }}
                      transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.55, 0.8, 0.9, 1] }}
                    />
                  ))}
                  {/* Output against time, in the band below the device */}
                  <g transform="translate(76, 412)">
                    <line x1="0" y1="78" x2="500" y2="78" stroke="rgba(232,241,243,0.28)" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="78" stroke="rgba(232,241,243,0.28)" strokeWidth="1" />
                    <motion.path
                      d="M 0 78 C 58 78, 86 76, 124 58 S 192 12, 250 8 L 500 8"
                      fill="none"
                      stroke="url(#rx-ramp)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={reduce ? { duration: 0 } : { duration: 2.4, ease: "easeOut" }}
                    />
                    <text x="0" y="-14" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                      OUTPUT
                    </text>
                    <text x="500" y="102" textAnchor="end" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                      TIME
                    </text>
                  </g>
                  <text x="320" y="58" textAnchor="middle" className={CAP} fill="#1bc3cd" fontFamily="var(--font-sans)">
                    SOFT-START, THEN STABLE
                  </text>
                </motion.g>
              )}

              {step.id === "wavelengths" && (
                <motion.g key="wavelengths" {...fade}>
                  {[220, 420].map((cx) =>
                    Array.from({ length: 12 }, (_, i) => {
                      const a = (i / 12) * Math.PI * 2;
                      const red = i % 2 === 0;
                      return (
                        <motion.circle
                          key={`${cx}-${i}`}
                          cx={cx + Math.cos(a) * 57}
                          cy={180 + Math.sin(a) * 57}
                          r="5"
                          fill={red ? "#ff7a5e" : "#b8402c"}
                          animate={reduce ? { opacity: 0.9 } : { opacity: [0.4, 1, 0.4] }}
                          transition={reduce ? undefined : { duration: 2.2, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                        />
                      );
                    }),
                  )}
                  <g transform="translate(150, 436)">
                    <circle cx="0" cy="-6" r="8" fill="#ff7a5e" />
                    <text x="20" y="0" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                      RED
                    </text>
                    <circle cx="0" cy="38" r="8" fill="#b8402c" />
                    <text x="20" y="44" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                      NEAR-INFRARED
                    </text>
                  </g>
                  <text x="320" y="512" textAnchor="middle" className={CAP} fill="#1bc3cd" fontFamily="var(--font-sans)">
                    TARGET: MITOCHONDRIAL FUNCTION
                  </text>
                  <text x="320" y="58" textAnchor="middle" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                    THE STRONGEST CLINICAL EFFECT
                  </text>
                </motion.g>
              )}

              {step.id === "gating" && (
                <motion.g key="gating" {...fade}>
                  {/* Three interlocks, in the band below the device */}
                  {[
                    { x: 108, label: "POSITION" },
                    { x: 320, label: "DISTANCE" },
                    { x: 532, label: "PHYSIOLOGY" },
                  ].map((g, i) => (
                    <g key={g.label} transform={`translate(${g.x}, 430)`}>
                      <motion.circle
                        r="11"
                        fill="#1bc3cd"
                        animate={reduce ? { opacity: 1 } : { opacity: [0.3, 1, 1, 0.3] }}
                        transition={reduce ? undefined : { duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <circle r="19" fill="none" stroke="#1bc3cd" strokeOpacity="0.4" />
                      <text y="54" textAnchor="middle" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                        {g.label}
                      </text>
                    </g>
                  ))}
                  <motion.g
                    animate={reduce ? { opacity: 0.8 } : { opacity: [0, 0.8, 0.8, 0] }}
                    transition={reduce ? undefined : { duration: 3, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <circle cx="220" cy="180" r="62" fill="url(#rx-glow)" />
                    <circle cx="420" cy="180" r="62" fill="url(#rx-glow)" />
                  </motion.g>
                  <text x="320" y="58" textAnchor="middle" className={CAP} fill="#1bc3cd" fontFamily="var(--font-sans)">
                    LIGHT ONLY WHEN EVERY CRITERION IS MET
                  </text>
                </motion.g>
              )}

              {step.id === "reporting" && (
                <motion.g key="reporting" {...fade}>
                  <g transform="translate(372, 386)">
                    <rect x="0" y="0" width="230" height="136" rx="12" fill="#0d1519" stroke="#1bc3cd" strokeOpacity="0.6" />
                    <text x="18" y="32" className={CAP_SM} fill="#1bc3cd" fontFamily="var(--font-sans)">
                      SESSION LOG
                    </text>
                    {Array.from({ length: 9 }, (_, i) => (
                      <motion.g
                        key={i}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.18, duration: 0.3 }}
                      >
                        <circle cx={40 + (i % 3) * 76} cy={64 + Math.floor(i / 3) * 30} r="11" fill="none" stroke="#1bc3cd" strokeOpacity="0.55" />
                        <path
                          d={`M ${33 + (i % 3) * 76} ${64 + Math.floor(i / 3) * 30} l 5 5 l 9 -10`}
                          fill="none"
                          stroke="#1bc3cd"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </motion.g>
                    ))}
                  </g>
                  <motion.path
                    d="M 320 392 C 320 424, 340 442, 372 448"
                    fill="none"
                    stroke="#1bc3cd"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 1.2 }}
                  />
                  <text x="36" y="452" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                    CLINICIAN-INITIATED
                  </text>
                  <text x="36" y="492" className={CAP_SM} fill="#e8f1f3" fontFamily="var(--font-sans)">
                    DIGITALLY LOGGED
                  </text>
                  <text x="320" y="58" textAnchor="middle" className={CAP} fill="#1bc3cd" fontFamily="var(--font-sans)">
                    9 SESSIONS, 3 WEEKS, ALL LOGGED
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>

      {/* Description */}
      <div role="tabpanel" id="rx-panel" aria-labelledby={`rx-tab-${step.id}`} className="min-h-[7rem] min-w-0 lg:col-start-1 lg:col-end-6 lg:row-start-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base leading-relaxed text-fog"
          >
            {step.body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
