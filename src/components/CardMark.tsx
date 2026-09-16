"use client";

import { useRevealed } from "./useRevealed";

/**
 * Small drawn marks for the cards that would otherwise carry nothing but a
 * number and a paragraph.
 *
 * Every mark shows the thing its card is about rather than decorating it, and
 * all of them are built from the same 2px stroked line as the larger diagrams,
 * so a page of cards reads as one drawing set. Each draws itself once, when
 * its card arrives; `prefers-reduced-motion` leaves them drawn.
 */

export type MarkKind =
  // Clinic propositions
  | "tuned"
  | "recurring"
  | "slots-in"
  | "report"
  | "consistent"
  | "no-upfront"
  // Values
  | "clinician-led"
  | "evidence"
  | "patient"
  | "regulatory"
  // Safety
  | "validated"
  | "interlocks"
  | "auditable"
  // Clinical pathway
  | "identify"
  | "screen"
  | "treat"
  | "record"
  | "continue";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const marks: Record<MarkKind, React.ReactNode> = {
  // A shaped, tuned pulse over the flat output of a generic device.
  tuned: (
    <>
      <path d="M4 34 H44" {...S} strokeWidth={1.5} opacity={0.3} />
      <path d="M4 34 C 12 34, 13 14, 20 14 S 30 30, 36 22 44 12 44 12" {...S} />
    </>
  ),
  // Repeating cycles, each taller than the last.
  recurring: (
    <>
      <path d="M6 38 v-8 M17 38 v-14 M28 38 v-20 M39 38 v-26" {...S} />
      <path d="M4 42 H44" {...S} strokeWidth={1.5} opacity={0.35} />
    </>
  ),
  // A new path joining a line that was already running.
  "slots-in": (
    <>
      <path d="M4 34 H44" {...S} strokeWidth={1.5} opacity={0.35} />
      <circle cx="11" cy="34" r="4" {...S} />
      <circle cx="37" cy="34" r="4" {...S} />
      <circle cx="24" cy="34" r="4" {...S} strokeDasharray="3 3" />
      <path d="M24 10 v12 M20 18 l4 4 l4 -4" {...S} />
    </>
  ),
  // A report sheet with a reading drawn on it.
  report: (
    <>
      <path d="M11 6 h26 a2 2 0 0 1 2 2 v32 a2 2 0 0 1 -2 2 h-26 a2 2 0 0 1 -2 -2 v-32 a2 2 0 0 1 2 -2 z" {...S} />
      <path d="M16 32 L22 25 L27 29 L33 18" {...S} />
      <path d="M16 13 h16" {...S} strokeWidth={1.5} opacity={0.45} />
    </>
  ),
  // The same pulse, delivered again and again without drift.
  consistent: (
    <>
      <path d="M4 24 h6 l3 -10 l4 20 l3 -10 h4" {...S} />
      <path d="M24 24 h6 l3 -10 l4 20 l3 -10 h4" {...S} />
    </>
  ),
  // Nothing to pay at the start; value from the first month on.
  "no-upfront": (
    <>
      <path d="M4 38 H44" {...S} strokeWidth={1.5} opacity={0.35} />
      <path d="M6 38 C 16 38, 20 30, 26 24 S 36 12, 42 10" {...S} />
      <circle cx="6" cy="38" r="3.5" {...S} />
    </>
  ),
  // A clinician, with the eye they are supervising.
  "clinician-led": (
    <>
      <circle cx="17" cy="14" r="6" {...S} />
      <path d="M7 40 a10 10 0 0 1 20 0" {...S} />
      <path d="M28 24 c 5 -6, 13 -6, 18 0 c -5 6, -13 6, -18 0 z" {...S} />
      <circle cx="37" cy="24" r="2.5" {...S} />
    </>
  ),
  // Readings accumulating into a conclusion.
  evidence: (
    <>
      <path d="M8 40 V26 M18 40 V18 M28 40 V28" {...S} />
      <path d="M4 44 H44" {...S} strokeWidth={1.5} opacity={0.35} />
      <path d="M33 16 l4 4 l7 -9" {...S} />
    </>
  ),
  // The patient at the centre of the pathway.
  patient: (
    <>
      <circle cx="24" cy="18" r="6" {...S} />
      <path d="M14 36 a10 10 0 0 1 20 0" {...S} />
      <path d="M6 24 a18 18 0 0 1 4 -11" {...S} strokeWidth={1.5} opacity={0.5} />
      <path d="M42 24 a18 18 0 0 0 -4 -11" {...S} strokeWidth={1.5} opacity={0.5} />
    </>
  ),
  // Conformity, stamped.
  regulatory: (
    <>
      <path d="M24 5 L40 11 v12 c0 10 -7 17 -16 20 c -9 -3 -16 -10 -16 -20 V11 z" {...S} />
      <path d="M17 23 l5 5 l10 -11" {...S} />
    </>
  ),
  // A validated device: the instrument, and its certificate.
  validated: (
    <>
      <path d="M8 10 h22 a2 2 0 0 1 2 2 v24 a2 2 0 0 1 -2 2 h-22 a2 2 0 0 1 -2 -2 v-24 a2 2 0 0 1 2 -2 z" {...S} />
      <path d="M12 18 h14 M12 25 h9" {...S} strokeWidth={1.5} opacity={0.45} />
      <circle cx="36" cy="32" r="8" {...S} />
      <path d="M32.5 32 l2.5 2.5 l5 -5.5" {...S} />
    </>
  ),
  // Three gates; the beam passes only when all three are open.
  interlocks: (
    <>
      <path d="M4 24 H44" {...S} strokeDasharray="5 4" opacity={0.55} />
      <path d="M13 12 v8 M13 28 v8 M24 12 v8 M24 28 v8 M35 12 v8 M35 28 v8" {...S} />
    </>
  ),
  // An unbroken record of what happened, and when.
  auditable: (
    <>
      <path d="M8 12 h32 M8 24 h32 M8 36 h32" {...S} strokeWidth={1.5} opacity={0.35} />
      <circle cx="14" cy="12" r="3.5" {...S} />
      <circle cx="26" cy="24" r="3.5" {...S} />
      <circle cx="36" cy="36" r="3.5" {...S} />
      <path d="M14 15.5 V20.5 M26 27.5 V32.5" {...S} />
    </>
  ),
  // Drusen found on a routine scan.
  identify: (
    <>
      <path d="M4 24 c 6 -9, 14 -13, 20 -13 s 14 4, 20 13 c -6 9, -14 13, -20 13 S 10 33, 4 24 z" {...S} />
      <circle cx="24" cy="24" r="7" {...S} />
      <circle cx="22" cy="22" r="1.6" {...S} strokeWidth={1.5} />
      <circle cx="27" cy="26" r="1.6" {...S} strokeWidth={1.5} />
    </>
  ),
  // Eligibility: some pass, some do not.
  screen: (
    <>
      <path d="M7 9 h34 L29 24 v14 l-10 5 V24 z" {...S} />
      <path d="M36 34 l3 3 l6 -7" {...S} strokeWidth={1.8} />
    </>
  ),
  // The binocular head, delivering.
  treat: (
    <>
      <circle cx="15" cy="22" r="9" {...S} />
      <circle cx="33" cy="22" r="9" {...S} />
      <path d="M22 17 q 2 -3 4 0" {...S} strokeWidth={1.5} />
      <path d="M24 31 v6 M15 38 h18" {...S} strokeWidth={1.5} opacity={0.5} />
      <circle cx="15" cy="22" r="3" {...S} strokeWidth={1.5} />
      <circle cx="33" cy="22" r="3" {...S} strokeWidth={1.5} />
    </>
  ),
  // Every session written down.
  record: (
    <>
      <path d="M11 6 h26 a2 2 0 0 1 2 2 v32 a2 2 0 0 1 -2 2 h-26 a2 2 0 0 1 -2 -2 v-32 a2 2 0 0 1 2 -2 z" {...S} />
      <path d="M16 16 l2.5 2.5 l5 -5.5 M16 26 l2.5 2.5 l5 -5.5" {...S} strokeWidth={1.8} />
      <path d="M28 16 h5 M28 26 h5 M16 35 h17" {...S} strokeWidth={1.5} opacity={0.45} />
    </>
  ),
  // Care that comes round again.
  continue: (
    <>
      <path d="M40 24 a16 16 0 1 1 -5 -11.5" {...S} />
      <path d="M35 5 v8 h-8" {...S} />
      <circle cx="24" cy="24" r="4" {...S} strokeWidth={1.5} opacity={0.6} />
    </>
  ),
};

type Props = { kind: MarkKind; className?: string };

export default function CardMark({ kind, className = "" }: Props) {
  const { ref, state } = useRevealed<HTMLSpanElement>();
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`mark ${state === "hidden" ? "" : "is-drawn"} block text-teal-400 ${className}`}
    >
      <svg viewBox="0 0 48 48" className="h-full w-full">
        {marks[kind]}
      </svg>
    </span>
  );
}
