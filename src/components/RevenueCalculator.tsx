"use client";

import { useEffect, useId, useRef, useState } from "react";
import { clinics } from "@/content/site";

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

/**
 * Follows a value rather than jumping to it, so dragging the slider reads as
 * the money moving. Snaps straight to the target under reduced motion.
 */
function useTween(target: number, ms = 320) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      from.current = target;
      setValue(target);
      return;
    }
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / ms);
      const next = start + (target - start) * (1 - Math.pow(1 - t, 3));
      from.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}

/**
 * Monthly and annual profit for a given number of patients a month, using the
 * contribution and fixed cost fitted to the figures BioPhotonix has published.
 */
export default function RevenueCalculator() {
  const { perPatient, fixed, max, published, note } = clinics.calculator;
  const [patients, setPatients] = useState(2);
  const id = useId();
  const monthly = perPatient * patients - fixed;
  const annual = monthly * 12;
  const shownMonthly = Math.round(useTween(monthly));
  const shownAnnual = Math.round(useTween(annual));
  const pct = ((patients - 1) / (max - 1)) * 100;

  return (
    <div className="tech-card rounded-2xl p-6 md:p-8">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <label htmlFor={id} className="flex items-baseline justify-between gap-4">
            <span className="text-base text-fog/80">Patients starting treatment each month</span>
            <span className="text-3xl font-medium text-teal-300">{patients}</span>
          </label>
          <input
            id={id}
            type="range"
            min={1}
            max={max}
            step={1}
            value={patients}
            onChange={(e) => setPatients(Number(e.target.value))}
            className="mt-5 w-full"
            aria-valuetext={`${patients} patients a month`}
          />
          <div className="figure mt-2 flex justify-between text-xs text-fog/45">
            <span>1</span>
            <span>{max}</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            <div className="bg-ink-950 p-5">
              <p className="figure text-xs uppercase tracking-[0.13em] text-fog/50">Monthly profit</p>
              <p className="mt-2 text-2xl font-medium text-fog md:text-3xl" aria-live="polite">
                {gbp(shownMonthly)}
              </p>
            </div>
            <div className="bg-ink-950 p-5">
              <p className="figure text-xs uppercase tracking-[0.13em] text-fog/50">Annual profit</p>
              <p className="mt-2 text-2xl font-medium text-fog md:text-3xl">{gbp(shownAnnual)}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-6">
          <p className="figure text-xs uppercase tracking-[0.13em] text-fog/50">Monthly profit by caseload</p>
          <div className="mt-4 flex h-44 items-end gap-1.5 border-b border-line" role="img" aria-label={`Monthly profit rises from ${gbp(perPatient - fixed)} at one patient a month to ${gbp(perPatient * max - fixed)} at ${max}.`}>
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
              const value = perPatient * n - fixed;
              const h = (value / (perPatient * max - fixed)) * 100;
              const on = n <= patients;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPatients(n)}
                  aria-label={`${n} patients: ${gbp(value)} a month`}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <span
                    className={`w-full rounded-t-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      n === patients
                        ? "bg-teal-300 shadow-[0_0_20px_rgba(27,195,205,0.45)]"
                        : on
                          ? "bg-teal-500"
                          : "bg-ink-600 group-hover:bg-ink-500"
                    }`}
                    style={{ height: `${h}%` }}
                  />
                </button>
              );
            })}
          </div>
          <div className="figure mt-2 flex justify-between text-xs text-fog/45" aria-hidden="true">
            <span>1 patient</span>
            <span>{max} patients</span>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {published.map((p) => (
              <div key={p.patients} className="rounded-lg border border-line px-3 py-2.5">
                <dt className="text-xs text-fog/55">{p.patients} a month</dt>
                <dd className="figure mt-0.5 text-sm text-fog">{gbp(p.profit)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="mt-8 text-xs leading-relaxed text-fog/45">{note}</p>
      <span className="sr-only">{`Slider at ${pct.toFixed(0)} percent.`}</span>
    </div>
  );
}
