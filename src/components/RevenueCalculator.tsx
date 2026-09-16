"use client";

import { useId, useState } from "react";
import { clinics } from "@/content/site";

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;

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
  const pct = ((patients - 1) / (max - 1)) * 100;

  return (
    <div className="tech-card rounded-2xl p-6 md:p-8">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <label htmlFor={id} className="flex items-baseline justify-between gap-4">
            <span className="text-base text-fog/80">Patients starting treatment each month</span>
            <span className="mono text-3xl font-medium text-teal-300">{patients}</span>
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
          <div className="mono mt-2 flex justify-between text-xs text-fog/45">
            <span>1</span>
            <span>{max}</span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            <div className="bg-ink-950 p-5">
              <p className="mono text-xs uppercase tracking-[0.16em] text-fog/50">Monthly profit</p>
              <p className="mono mt-2 text-2xl font-medium text-fog md:text-3xl" aria-live="polite">
                {gbp(monthly)}
              </p>
            </div>
            <div className="bg-ink-950 p-5">
              <p className="mono text-xs uppercase tracking-[0.16em] text-fog/50">Annual profit</p>
              <p className="mono mt-2 text-2xl font-medium text-fog md:text-3xl">{gbp(annual)}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-6">
          <p className="mono text-xs uppercase tracking-[0.16em] text-fog/50">Monthly profit by caseload</p>
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
                    className={`w-full rounded-t-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${on ? "bg-teal-400" : "bg-ink-600 group-hover:bg-ink-500"}`}
                    style={{ height: `${h}%` }}
                  />
                </button>
              );
            })}
          </div>
          <div className="mono mt-2 flex justify-between text-xs text-fog/45" aria-hidden="true">
            <span>1 patient</span>
            <span>{max} patients</span>
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {published.map((p) => (
              <div key={p.patients} className="rounded-lg border border-line px-3 py-2.5">
                <dt className="text-xs text-fog/55">{p.patients} a month</dt>
                <dd className="mono mt-0.5 text-sm text-fog">{gbp(p.profit)}</dd>
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
