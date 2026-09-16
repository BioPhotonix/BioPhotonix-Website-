"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { explainer } from "@/content/site";

/**
 * Five aspects of how Revolux delivers light, each with its own drawing of
 * the binocular head. Tabs step through them; they also advance on their own
 * until someone touches them.
 */
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
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <div ref={tabsRef} role="tablist" aria-label="How Revolux delivers light" aria-orientation="vertical" onKeyDown={onKey} className="flex flex-col gap-1">
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
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                className={`group relative flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors duration-300 ${
                  selected ? "bg-ink-800 text-fog" : "text-fog/75 hover:text-fog"
                }`}
              >
                <span className={`figure text-xs ${selected ? "text-teal-400" : "text-fog/70"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-lg font-semibold">{s.title}</span>
                {selected && !reduce && !touched && (
                  <motion.span
                    key={`bar-${s.id}`}
                    aria-hidden="true"
                    className="absolute bottom-0 left-4 right-4 h-px origin-left bg-teal-400/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5.2, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" id="rx-panel" aria-labelledby={`rx-tab-${step.id}`} className="mt-8 min-h-[7rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={step.id}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-base leading-relaxed text-fog/75"
            >
              {step.body}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="lg:col-span-7">
        <div className="tech-card rounded-2xl p-4 md:p-6">
          <svg viewBox="0 0 640 400" className="h-auto w-full" role="img" aria-label={`Diagram: ${step.title}. ${step.body}`}>
            <defs>
              <radialGradient id="rx-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#ff5a3c" stopOpacity="0.9" />
                <stop offset="55%" stopColor="#ff5a3c" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="rx-glow-teal" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#6fe3ea" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6fe3ea" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="rx-ramp" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1bc3cd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1bc3cd" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Faint drawing grid */}
            <g stroke="rgba(232,241,243,0.06)" strokeWidth="1">
              {Array.from({ length: 15 }, (_, i) => (
                <line key={`v${i}`} x1={i * 45 + 5} y1="0" x2={i * 45 + 5} y2="400" />
              ))}
              {Array.from({ length: 9 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 50} x2="640" y2={i * 50} />
              ))}
            </g>

            {/* The binocular head, seen from the patient's side: two eyepieces
                on a bridge, a handle beneath. */}
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
                  {/* Fixed source-to-eye distance, drawn as a dimension line */}
                  <g stroke="#1bc3cd" strokeWidth="1.5" fill="none">
                    <line x1="220" y1="290" x2="220" y2="370" strokeDasharray="4 4" strokeOpacity="0.6" />
                    <line x1="420" y1="290" x2="420" y2="370" strokeDasharray="4 4" strokeOpacity="0.6" />
                    <line x1="220" y1="355" x2="420" y2="355" />
                    <path d="M 226 350 L 220 355 L 226 360 M 414 350 L 420 355 L 414 360" />
                    <circle cx="220" cy="180" r="12" strokeOpacity="0.9" />
                    <circle cx="420" cy="180" r="12" strokeOpacity="0.9" />
                    <line x1="220" y1="168" x2="220" y2="192" strokeOpacity="0.9" />
                    <line x1="208" y1="180" x2="232" y2="180" strokeOpacity="0.9" />
                    <line x1="420" y1="168" x2="420" y2="192" strokeOpacity="0.9" />
                    <line x1="408" y1="180" x2="432" y2="180" strokeOpacity="0.9" />
                  </g>
                  <text x="320" y="345" textAnchor="middle" fontSize="15" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    FIXED SOURCE-TO-EYE GEOMETRY
                  </text>
                  <text x="320" y="60" textAnchor="middle" fontSize="15" fill="#e8f1f3" fillOpacity="0.6" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    ALIGNED, REPEATABLE, BOTH EYES
                  </text>
                </motion.g>
              )}

              {step.id === "priming" && (
                <motion.g key="priming" {...fade}>
                  {/* Output ramping up over the first seconds of a session */}
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
                  <g transform="translate(60, 290)">
                    <line x1="0" y1="80" x2="520" y2="80" stroke="rgba(232,241,243,0.25)" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="80" stroke="rgba(232,241,243,0.25)" strokeWidth="1" />
                    <motion.path
                      d="M 0 80 C 60 80, 90 78, 130 60 S 200 12, 260 8 L 520 8"
                      fill="none"
                      stroke="url(#rx-ramp)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: 1 }}
                      transition={reduce ? { duration: 0 } : { duration: 2.4, ease: "easeOut" }}
                    />
                    <text x="8" y="-8" fontSize="15" fill="#e8f1f3" fillOpacity="0.6" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      OUTPUT
                    </text>
                    <text x="520" y="98" textAnchor="end" fontSize="15" fill="#e8f1f3" fillOpacity="0.6" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      TIME
                    </text>
                    <text x="270" y="-8" fontSize="15" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      SOFT-START, THEN STABLE
                    </text>
                  </g>
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
                          fill={red ? "#ff5a3c" : "#b8402c"}
                          animate={reduce ? { opacity: 0.9 } : { opacity: [0.4, 1, 0.4] }}
                          transition={reduce ? undefined : { duration: 2.2, delay: i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                        />
                      );
                    }),
                  )}
                  <g transform="translate(120, 300)">
                    <circle cx="0" cy="0" r="6" fill="#ff5a3c" />
                    <text x="16" y="5" fontSize="15" fill="#e8f1f3" fillOpacity="0.8" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      RED
                    </text>
                    <circle cx="90" cy="0" r="6" fill="#b8402c" />
                    <text x="106" y="5" fontSize="15" fill="#e8f1f3" fillOpacity="0.8" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      NEAR-INFRARED
                    </text>
                  </g>
                  <text x="320" y="345" textAnchor="middle" fontSize="15" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    TARGET: MITOCHONDRIAL FUNCTION
                  </text>
                  <text x="320" y="60" textAnchor="middle" fontSize="15" fill="#e8f1f3" fillOpacity="0.6" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    WAVELENGTHS WITH THE STRONGEST CLINICAL EFFECT
                  </text>
                </motion.g>
              )}

              {step.id === "gating" && (
                <motion.g key="gating" {...fade}>
                  {/* Three interlocks; light is only on when all three are satisfied */}
                  {[
                    { x: 90, label: "POSITION" },
                    { x: 320, label: "DISTANCE" },
                    { x: 550, label: "PHYSIOLOGY" },
                  ].map((g, i) => (
                    <g key={g.label} transform={`translate(${g.x}, 320)`}>
                      <motion.circle
                        r="9"
                        fill="#1bc3cd"
                        animate={reduce ? { opacity: 1 } : { opacity: [0.3, 1, 1, 0.3] }}
                        transition={reduce ? undefined : { duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <circle r="16" fill="none" stroke="#1bc3cd" strokeOpacity="0.4" />
                      <text y="40" textAnchor="middle" fontSize="15" fill="#e8f1f3" fillOpacity="0.7" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
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
                  <text x="320" y="60" textAnchor="middle" fontSize="15" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    LIGHT ONLY WHEN EVERY CRITERION IS MET
                  </text>
                </motion.g>
              )}

              {step.id === "reporting" && (
                <motion.g key="reporting" {...fade}>
                  <g transform="translate(470, 240)">
                    <rect x="0" y="0" width="150" height="130" rx="10" fill="#0d1519" stroke="#1bc3cd" strokeOpacity="0.6" />
                    <text x="14" y="26" fontSize="12" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                      SESSION LOG
                    </text>
                    {Array.from({ length: 9 }, (_, i) => (
                      <motion.g
                        key={i}
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.18, duration: 0.3 }}
                      >
                        <circle cx={26 + (i % 3) * 40} cy={56 + Math.floor(i / 3) * 30} r="8" fill="none" stroke="#1bc3cd" strokeOpacity="0.5" />
                        <path d={`M ${21 + (i % 3) * 40} ${56 + Math.floor(i / 3) * 30} l 3 3 l 6 -6`} fill="none" stroke="#1bc3cd" strokeWidth="1.8" strokeLinecap="round" />
                      </motion.g>
                    ))}
                  </g>
                  <motion.path
                    d="M 340 240 C 380 240, 400 300, 470 300"
                    fill="none"
                    stroke="#1bc3cd"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={reduce ? { duration: 0 } : { duration: 1.2 }}
                  />
                  <text x="120" y="330" fontSize="15" fill="#e8f1f3" fillOpacity="0.7" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    CLINICIAN-INITIATED
                  </text>
                  <text x="120" y="352" fontSize="15" fill="#e8f1f3" fillOpacity="0.7" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    DIGITALLY LOGGED
                  </text>
                  <text x="320" y="60" textAnchor="middle" fontSize="15" fill="#1bc3cd" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.12em">
                    9 SESSIONS, 3 WEEKS, EVERY ONE RECORDED
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </div>
      </div>
    </div>
  );
}
