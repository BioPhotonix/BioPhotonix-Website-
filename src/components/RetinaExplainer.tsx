"use client";

import { motion, useReducedMotion } from "motion/react";
import { retina } from "@/content/site";

/** Rays enter across the pupil and cross there, so the fan inverts on the way to the retina. */
const RAYS = [
  { from: 104, to: 268 },
  { from: 136, to: 248 },
  { from: 168, to: 228 },
  { from: 200, to: 205 },
  { from: 232, to: 182 },
  { from: 264, to: 162 },
  { from: 296, to: 142 },
];

/**
 * Cross-section of an eye. Red and near-infrared light enters through the
 * pupil, spreads across the retina, and is absorbed by mitochondria inside a
 * retinal cell.
 */
export default function RetinaExplainer() {
  const reduce = useReducedMotion();
  const pulse = (duration: number, delay = 0) =>
    reduce ? undefined : { duration, delay, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div>
      <svg
        viewBox="0 0 640 470"
        className="h-auto w-full"
        role="img"
        aria-label="Cross-section of an eye. A broad beam of red and near-infrared light enters through the pupil, crosses, and spreads across the retina at the back, where it is absorbed by mitochondria inside a retinal cell."
      >
        <defs>
          <linearGradient id="rt-cone" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff7a4d" stopOpacity="0.08" />
            <stop offset="45%" stopColor="#ff5a3c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ff3f3f" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="rt-ray" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff9d6b" stopOpacity="0.3" />
            <stop offset="40%" stopColor="#ff5a3c" stopOpacity="1" />
            <stop offset="100%" stopColor="#ff2f2f" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="rt-macula" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ff5a3c" stopOpacity="0.85" />
            <stop offset="45%" stopColor="#ff5a3c" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff5a3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rt-pupil" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffd2b0" stopOpacity="1" />
            <stop offset="40%" stopColor="#ff6a4d" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#ff6a4d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rt-retina" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1bc3cd" />
            <stop offset="100%" stopColor="#0a5f66" />
          </linearGradient>
          <clipPath id="rt-globe">
            <ellipse cx="300" cy="205" rx="170" ry="145" />
          </clipPath>
        </defs>

        <motion.g animate={reduce ? { opacity: 0.9 } : { opacity: [0.6, 1, 0.6] }} transition={pulse(2.8)}>
          <path d="M -4 96 L 156 186 L 156 224 L -4 314 Z" fill="url(#rt-cone)" />
          <g clipPath="url(#rt-globe)">
            <path d="M 156 186 L 458 130 L 458 280 L 156 224 Z" fill="url(#rt-cone)" />
          </g>
        </motion.g>

        <ellipse cx="300" cy="205" rx="170" ry="145" fill="none" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="2" />
        <path d="M 449 88 A 170 145 0 0 1 449 322" fill="none" stroke="url(#rt-retina)" strokeWidth="14" strokeLinecap="round" />
        <motion.ellipse cx="452" cy="205" rx="96" ry="104" fill="url(#rt-macula)" animate={reduce ? { opacity: 0.7 } : { opacity: [0.4, 0.92, 0.4] }} transition={pulse(2.8)} />
        <circle cx="452" cy="205" r="7" fill="#04080a" stroke="#6fe3ea" strokeWidth="2" />

        {RAYS.map((r, i) => (
          <path key={`b-${i}`} d={`M -4 ${r.from} L 156 205 L 452 ${r.to}`} fill="none" stroke="url(#rt-ray)" strokeWidth={i === 3 ? 4 : 2.8} strokeLinecap="round" opacity="0.3" />
        ))}
        {RAYS.map((r, i) => (
          <motion.path
            key={i}
            d={`M -4 ${r.from} L 156 205 L 452 ${r.to}`}
            fill="none"
            stroke="url(#rt-ray)"
            strokeWidth={i === 3 ? 4 : 2.8}
            strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 0.95 : 0 }}
            animate={reduce ? { pathLength: 1, opacity: 0.95 } : { pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
            transition={reduce ? { duration: 0 } : { duration: 2.6, delay: i * 0.13, repeat: Infinity, repeatDelay: 0.35, ease: "easeInOut" }}
          />
        ))}

        <path d="M 150 122 Q 108 205 150 288" fill="none" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
        <path d="M 152 126 L 152 176" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="7" strokeLinecap="round" />
        <path d="M 152 234 L 152 284" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="178" cy="205" rx="16" ry="40" fill="#6fe3ea" opacity="0.12" stroke="#6fe3ea" strokeOpacity="0.6" strokeWidth="1.5" />
        <motion.circle cx="156" cy="205" r="34" fill="url(#rt-pupil)" animate={reduce ? { opacity: 0.85 } : { opacity: [0.5, 1, 0.5] }} transition={pulse(2.8)} />

        <path d="M 460 252 L 508 352" stroke="#6fe3ea" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <g transform="translate(496, 348)">
          <rect x="0" y="0" width="132" height="100" rx="24" fill="#0d1519" stroke="#6fe3ea" strokeOpacity="0.7" strokeWidth="1.5" />
          {[
            { x: 30, y: 30, d: 0 },
            { x: 70, y: 56, d: 0.4 },
            { x: 94, y: 26, d: 0.8 },
          ].map((m, i) => (
            <motion.g key={i} animate={reduce ? { opacity: 0.95 } : { opacity: [0.4, 1, 0.4] }} transition={pulse(2.4, m.d)}>
              <ellipse cx={m.x} cy={m.y} rx="16" ry="9" fill="#ff5a3c" opacity="0.3" />
              <ellipse cx={m.x} cy={m.y} rx="11" ry="5.5" fill="#ff5a3c" />
            </motion.g>
          ))}
          <text x="66" y="88" textAnchor="middle" fontSize="15" fill="#e8f1f3" opacity="0.85" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">
            MITOCHONDRIA
          </text>
        </g>

        <text x="4" y="352" fontSize="16" fill="#e8f1f3" opacity="0.8" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">
          RED + NEAR-INFRARED
        </text>
        <text x="4" y="372" fontSize="15" fill="#e8f1f3" opacity="0.55" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">
          CONTROLLED DOSE
        </text>
        <text x="452" y="62" textAnchor="middle" fontSize="16" fill="#6fe3ea" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">
          RETINA
        </text>
        <text x="156" y="316" textAnchor="middle" fontSize="15" fill="#e8f1f3" opacity="0.6" fontFamily="var(--font-sans)" fontWeight="600" letterSpacing="0.1em">
          PUPIL
        </text>
      </svg>

      <ol className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-3">
        {retina.steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="figure mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-teal-400/50 text-xs text-teal-300">
              {i + 1}
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold leading-snug text-fog">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-fog/75">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
