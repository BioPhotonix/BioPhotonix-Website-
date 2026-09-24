"use client";

import { useEffect, useState } from "react";
import type { Figure, FigureBlock } from "@/content/figure";
import { useRevealed, type RevealState } from "./useRevealed";

/**
 * The figure that opens a weekly insight: the article's own numbers, drawn as
 * an animated panel in the site's style rather than a stock picture.
 *
 * The spec is declarative (src/content/figure.ts), so the automation that
 * writes it can never put markup on the page. Six block kinds cover what a
 * research digest needs to show: a before-and-after pair, a set of bars, a
 * set of signed changes, a row of headline stats, a pathway, and a share of
 * a hundred. Bars grow, numbers count and steps light up the first time the
 * panel scrolls into view; the server renders every final value, and
 * prefers-reduced-motion leaves them there.
 *
 * Marks follow the site's chart conventions: bars no thicker than 18px with
 * a rounded data end, one hue for one series, the accent only on the item the
 * story is about, and text in the text colours rather than the data colour.
 */

const fmt = (n: number, decimals = 0) => n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/* Counts from zero to `target` once the panel is shown. Hidden means waiting
   below the fold, so the number sits at zero with the bars; idle means the
   panel was already on screen (or motion is reduced), so the real value stays. */
function useCount(target: number, state: RevealState, decimals: number, delayMs = 0, durationMs = 1400) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (state === "idle") { setValue(target); return; }
    if (state === "hidden") { setValue(0); return; }
    let raf = 0;
    let t0: number | null = null;
    const timer = window.setTimeout(() => {
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        const t = Math.min(1, (now - t0) / durationMs);
        setValue(t < 1 ? target * (1 - Math.pow(1 - t, 3)) : target);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delayMs);
    return () => { window.clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [target, state, delayMs, durationMs, decimals]);
  return value;
}

/* A number written as text ("1,220,082", "£116", "5.99%") counted the same way. */
function CountText({ text, state, delayMs = 0, className = "" }: { text: string; state: RevealState; delayMs?: number; className?: string }) {
  const m = /^(\D*)([\d,]+(?:\.\d+)?)(\D*)$/.exec(text);
  const digits = m ? m[2].replace(/,/g, "") : "";
  const target = m ? Number(digits) : 0;
  const decimals = digits.includes(".") ? digits.length - digits.indexOf(".") - 1 : 0;
  const v = useCount(target, state, decimals, delayMs);
  const shown = !m ? text : state === "shown" && v !== target ? `${m[1]}${fmt(v, decimals)}${m[3]}` : text;
  return <span className={className} data-count-to={text}>{shown}</span>;
}

function Num({ value, unit = "", decimals = 0, state, delayMs = 0, className = "" }: { value: number; unit?: string; decimals?: number; state: RevealState; delayMs?: number; className?: string }) {
  const v = useCount(value, state, decimals, delayMs);
  const final = `${fmt(value, decimals)}${unit}`;
  return <span className={className} data-count-to={final}>{state === "shown" && v !== value ? `${fmt(v, decimals)}${unit}` : final}</span>;
}

const grow = (state: RevealState, delayMs: number, axis: "x" | "y" = "x") => ({
  transform: state === "hidden" ? `scale${axis.toUpperCase()}(0)` : "none",
  transformOrigin: axis === "x" ? "left center" : "center bottom",
  transition: `transform 1.1s ${EASE} ${delayMs}ms`,
});
const fade = (state: RevealState, delayMs: number) => ({
  opacity: state === "hidden" ? 0 : 1,
  transform: state === "hidden" ? "translateY(8px)" : "none",
  transition: `opacity .6s ease ${delayMs}ms, transform .6s ${EASE} ${delayMs}ms`,
});

function BlockLabel({ text }: { text?: string }) {
  return text ? <p className="figure text-xs uppercase tracking-[0.13em] text-fog-dim">{text}</p> : null;
}

function BeforeAfter({ b, state }: { b: Extract<FigureBlock, { kind: "before-after" }>; state: RevealState }) {
  const unit = b.unit ?? "";
  const dec = b.decimals ?? 0;
  const max = Math.max(b.before.value, b.after.value, 1e-9);
  const rel = b.before.value !== 0 ? (b.after.value - b.before.value) / Math.abs(b.before.value) : null;
  const delta = rel === null ? null : rel >= 1 ? `×${fmt(b.after.value / b.before.value, 1)}` : `${rel >= 0 ? "+" : ""}${fmt(rel * 100, 0)}%`;
  return (
    <div>
      <BlockLabel text={b.label} />
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        {[b.before, b.after].map((p, i) => (
          <div key={i} className={i === 1 ? "text-right" : ""}>
            <p className="text-sm text-fog-dim">{p.label}</p>
            <p className="mt-1 font-display text-3xl font-semibold leading-none text-fog md:text-4xl">
              <Num value={p.value} unit={unit} decimals={dec} state={state} delayMs={i * 250} />
            </p>
            <div className={`mt-3 h-[6px] overflow-hidden rounded-full bg-ink-600 ${i === 1 ? "ml-auto" : ""}`} style={{ width: `${Math.max(8, (p.value / max) * 100)}%` }}>
              <div className={`h-full rounded-full ${i === 1 ? "bg-teal-400" : "bg-fog-dim"}`} style={grow(state, 150 + i * 250)} />
            </div>
          </div>
        ))}
        <div className="row-start-1 col-start-2 self-center pb-6 text-center" style={fade(state, 700)}>
          <span aria-hidden="true" className="block text-2xl text-teal-400">&rarr;</span>
          {delta && <span className="figure mt-1 inline-block rounded-full border border-line px-2 py-0.5 text-xs text-fog">{delta}</span>}
        </div>
      </div>
    </div>
  );
}

function Bars({ b, state }: { b: Extract<FigureBlock, { kind: "bars" }>; state: RevealState }) {
  const unit = b.unit ?? "";
  const dec = b.decimals ?? 0;
  const max = Math.max(...b.items.map((i) => i.value), 1e-9);
  const anyEmphasis = b.items.some((i) => i.emphasis);
  return (
    <div>
      <BlockLabel text={b.label} />
      <ul className="mt-3 flex flex-col gap-2.5">
        {b.items.map((it, i) => (
          <li key={it.label} className="grid grid-cols-[minmax(0,38%)_1fr] items-center gap-3" title={`${it.label}: ${fmt(it.value, dec)}${unit}`}>
            <span className="text-sm leading-snug text-fog-dim">{it.label}</span>
            <span className="flex items-center gap-2">
              <span className="block h-[18px] overflow-hidden rounded-r-[4px]" style={{ width: `${Math.max(2, (it.value / max) * 100)}%` }}>
                <span className={`block h-full ${anyEmphasis && !it.emphasis ? "bg-ink-500" : "bg-teal-400"}`} style={grow(state, 100 + i * 120)} />
              </span>
              <span className="figure shrink-0 text-sm text-fog"><Num value={it.value} unit={unit} decimals={dec} state={state} delayMs={100 + i * 120} /></span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Change({ b, state }: { b: Extract<FigureBlock, { kind: "change" }>; state: RevealState }) {
  const max = Math.max(...b.items.map((i) => Math.abs(i.change)), 1e-9);
  const hasNeg = b.items.some((i) => i.change < 0);
  return (
    <div>
      <BlockLabel text={b.label} />
      <ul className="mt-3 flex flex-col gap-2.5">
        {b.items.map((it, i) => {
          const w = Math.abs(it.change) / max;
          const sign = it.change > 0 ? "+" : "";
          return (
            <li key={it.label} className="grid grid-cols-[minmax(0,38%)_1fr] items-center gap-3" title={`${it.label}: ${sign}${fmt(it.change)}%`}>
              <span className="text-sm leading-snug text-fog-dim">{it.label}</span>
              <span className={`relative flex h-[18px] items-center ${hasNeg ? "pl-[50%]" : ""}`}>
                {hasNeg && <span aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px bg-line-strong" />}
                {it.change === 0 ? (
                  <span className="flex items-center gap-2 text-sm text-fog" style={fade(state, 100 + i * 120)}>
                    <span aria-hidden="true" className="block h-[18px] w-[3px] rounded-full bg-fog-dim" />
                    <span className="figure">no change</span>
                  </span>
                ) : it.change > 0 ? (
                  <span className="flex items-center gap-2" style={{ width: "100%" }}>
                    <span className="block h-[18px] overflow-hidden rounded-r-[4px]" style={{ width: `${Math.max(2, w * 100)}%`, maxWidth: "calc(100% - 3.5rem)" }}>
                      <span className="block h-full bg-teal-400" style={grow(state, 100 + i * 120)} />
                    </span>
                    <span className="figure shrink-0 text-sm text-fog"><Num value={it.change} unit="%" state={state} delayMs={100 + i * 120} className="before:content-['+']" /></span>
                  </span>
                ) : (
                  <span className="absolute right-1/2 flex items-center gap-2" style={{ width: "50%", justifyContent: "flex-end" }}>
                    <span className="figure shrink-0 text-sm text-fog"><Num value={it.change} unit="%" state={state} delayMs={100 + i * 120} /></span>
                    <span className="block h-[18px] overflow-hidden rounded-l-[4px]" style={{ width: `${Math.max(2, w * 100)}%`, maxWidth: "calc(100% - 3.5rem)" }}>
                      <span className="block h-full bg-ember-deep" style={{ ...grow(state, 100 + i * 120), transformOrigin: "right center" }} />
                    </span>
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stats({ b, state, blocks }: { b: Extract<FigureBlock, { kind: "stats" }>; state: RevealState; blocks: number }) {
  /* Tiles sit side by side only when the block has the width for it: the
     whole panel, or half of it. In a third they stack, or the long labels
     run into each other. */
  const cols = blocks === 1 ? "grid-cols-2 md:grid-cols-4" : blocks === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-1";
  return (
    <div>
      <BlockLabel text={b.label} />
      <dl className={`mt-3 grid gap-4 ${cols}`}>
        {b.items.map((it, i) => (
          <div key={it.label} style={fade(state, 150 + i * 180)}>
            <dd className="font-display text-3xl font-semibold leading-none text-fog"><CountText text={it.value} state={state} delayMs={150 + i * 180} /></dd>
            <dt className="mt-2 text-sm leading-snug text-fog-dim [overflow-wrap:anywhere]">{it.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Flow({ b, state }: { b: Extract<FigureBlock, { kind: "flow" }>; state: RevealState }) {
  return (
    <div>
      <BlockLabel text={b.label} />
      <ol className="mt-3 flex flex-col gap-0 md:flex-row md:items-start md:gap-0">
        {b.steps.map((s, i) => (
          <li key={s.label} className="relative flex gap-3 md:flex-1 md:flex-col md:gap-2" style={fade(state, 200 + i * 320)}>
            <span className="flex flex-col items-center md:flex-row md:w-full">
              <span aria-hidden="true" className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border ${i === b.steps.length - 1 ? "border-teal-400 bg-teal-400 text-ink-950" : "border-teal-400 text-teal-300"} figure text-xs`}>{i + 1}</span>
              {i < b.steps.length - 1 && <span aria-hidden="true" className="mt-1 h-8 w-px bg-line-strong md:mt-0 md:ml-1 md:h-px md:w-full" />}
            </span>
            <span className="pb-4 md:pb-0 md:pr-4">
              <span className="block text-sm font-semibold leading-snug text-fog">{s.label}</span>
              {s.note && <span className="mt-0.5 block text-sm leading-snug text-fog-dim">{s.note}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Share({ b, state }: { b: Extract<FigureBlock, { kind: "share" }>; state: RevealState }) {
  const filled = Math.round(b.value);
  return (
    <div>
      <BlockLabel text={b.label} />
      <div className="mt-3 flex items-center gap-5">
        <div aria-hidden="true" className="grid shrink-0 grid-cols-10 gap-[3px]">
          {Array.from({ length: 100 }, (_, i) => (
            <span key={i} className={`block h-[9px] w-[9px] rounded-[2px] ${i < filled ? "bg-teal-400" : "bg-ink-600"}`} style={i < filled ? fade(state, 100 + i * 14) : undefined} />
          ))}
        </div>
        <div>
          <p className="font-display text-3xl font-semibold leading-none text-fog md:text-4xl"><Num value={b.value} unit="%" decimals={Number.isInteger(b.value) ? 0 : 2} state={state} /></p>
          <p className="mt-2 text-sm leading-snug text-fog-dim">{b.text}</p>
        </div>
      </div>
    </div>
  );
}

function Block({ b, state, blocks }: { b: FigureBlock; state: RevealState; blocks: number }) {
  switch (b.kind) {
    case "before-after": return <BeforeAfter b={b} state={state} />;
    case "bars": return <Bars b={b} state={state} />;
    case "change": return <Change b={b} state={state} />;
    case "stats": return <Stats b={b} state={state} blocks={blocks} />;
    case "flow": return <Flow b={b} state={state} />;
    case "share": return <Share b={b} state={state} />;
  }
}

export default function InsightFigure({ figure }: { figure: Figure }) {
  const { ref, state } = useRevealed<HTMLElement>();
  const n = figure.blocks.length;
  return (
    <figure ref={ref} className="m-0">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-900">
        <div aria-hidden="true" className="grid-bg absolute inset-0" />
        <div className="relative p-6 md:p-8">
          <p className="font-display text-xl font-semibold leading-snug text-fog md:text-2xl">{figure.title}</p>
          <div className={`mt-6 grid gap-7 ${n === 1 ? "" : n === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {figure.blocks.map((b, i) => (
              <div key={i} className={i > 0 ? "border-t border-line pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0" : ""}>
                <Block b={b} state={state} blocks={n} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {(figure.caption || figure.source) && (
        <figcaption className="mt-3 text-sm leading-relaxed text-fog-dim">
          {figure.caption}
          {figure.source && <span>{figure.caption ? " " : ""}Source: {figure.source}</span>}
        </figcaption>
      )}
    </figure>
  );
}
