"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { anatomy } from "@/content/site";
import { useRevealed } from "./useRevealed";

/**
 * The device, from five angles, with technical callouts over the front view.
 *
 * The callouts arrive one at a time once the section is on screen and then
 * stay, the way a labelled figure in a paper builds up. Hovering or focusing
 * a part emphasises it and dims the others. Under reduced motion every
 * callout is present from the start.
 *
 * The overlay is a single 960 x 700 coordinate space with the front render
 * occupying x 318 to 642 inside it, so the anchors and leader lines scale with
 * the image and never drift. The written labels are HTML positioned against
 * the same coordinates rather than SVG text: SVG text scales with its
 * container, which put these at about 13px on screen, below the 16px floor the
 * rest of the site holds.
 *
 * Callouts belong to the front view alone, so switching to another angle shows
 * that view's caption instead. Below the medium breakpoint there is no room
 * for labels beside the device, so only the numbered anchors show and the list
 * underneath carries the names.
 */

/** Where the written labels line up, in the overlay's own coordinates. */
const RAIL_LEFT = 300;
const RAIL_RIGHT = 660;

const IMAGE_LEFT = 318 / 960;
const IMAGE_WIDTH = 324 / 960;

export default function RevoluxAnatomy() {
  const { ref, state } = useRevealed<HTMLDivElement>();
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [view, setView] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const parts = anatomy.parts;
  const views = anatomy.views;
  const current = views[view];
  const isFront = current.id === "front";

  useEffect(() => {
    if (state === "hidden") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(parts.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= parts.length) window.clearInterval(id);
    }, 480);
    return () => window.clearInterval(id);
  }, [state, parts.length]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const last = views.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = view === last ? 0 : view + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = view === 0 ? last : view - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setView(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="relative mx-auto aspect-[5/7] w-full max-w-xs md:aspect-[960/700] md:max-w-2xl">
          {views.map((v, i) => (
            <div
              key={v.id}
              className="absolute inset-y-0 left-0 w-full transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:left-[var(--img-left)] md:w-[var(--img-width)]"
              style={
                {
                  "--img-left": `${IMAGE_LEFT * 100}%`,
                  "--img-width": `${IMAGE_WIDTH * 100}%`,
                  opacity: i === view ? 1 : 0,
                  pointerEvents: i === view ? undefined : "none",
                } as React.CSSProperties
              }
              aria-hidden={i === view ? undefined : true}
            >
              <Image
                src={v.src}
                alt={i === view ? v.alt : ""}
                width={v.width}
                height={v.height}
                priority={i === 0}
                sizes="(max-width: 1024px) 45vw, 22vw"
                className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(27,195,205,0.18)]"
              />
            </div>
          ))}

          {isFront && (
            <>
              <svg viewBox="0 0 960 700" className="absolute inset-0 hidden h-full w-full md:block" aria-hidden="true">
                {parts.map((part, i) => {
                  const [ax, ay] = part.anchor;
                  const left = part.side === "left";
                  const railX = left ? RAIL_LEFT : RAIL_RIGHT;
                  const elbowX = left ? railX + 40 : railX - 40;
                  const on = i < shown;
                  const emphasised = active === part.id;
                  const dim = active !== null && !emphasised;
                  return (
                    <g
                      key={part.id}
                      className="transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ opacity: on ? (dim ? 0.32 : 1) : 0 }}
                    >
                      <path
                        d={`M ${railX} ${part.labelY} H ${elbowX} L ${ax} ${ay}`}
                        fill="none"
                        stroke="var(--color-teal-300)"
                        strokeWidth={emphasised ? 2.4 : 1.5}
                        strokeOpacity="0.8"
                        className="hidden md:block"
                      />
                      {emphasised && <circle cx={ax} cy={ay} r="28" fill="var(--color-teal-400)" fillOpacity="0.18" />}
                      <circle
                        cx={ax}
                        cy={ay}
                        r="15"
                        fill="var(--color-ink-950)"
                        fillOpacity="0.9"
                        stroke="var(--color-teal-300)"
                        strokeWidth={emphasised ? 2.6 : 1.8}
                      />
                      <text
                        x={ax}
                        y={ay + 7}
                        textAnchor="middle"
                        fontSize="20"
                        fontWeight="600"
                        fill="var(--color-teal-200)"
                        fontFamily="var(--font-sans)"
                      >
                        {i + 1}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Written labels, in HTML so they keep their real size. */}
              {parts.map((part, i) => {
                const left = part.side === "left";
                const on = i < shown;
                const emphasised = active === part.id;
                const dim = active !== null && !emphasised;
                return (
                  <span
                    key={part.id}
                    onMouseEnter={() => setActive(part.id)}
                    onMouseLeave={() => setActive(null)}
                    className={`absolute hidden -translate-y-1/2 whitespace-nowrap transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:block ${
                      left ? "pr-3 text-right" : "pl-3 text-left"
                    }`}
                    style={{
                      top: `${(part.labelY / 700) * 100}%`,
                      ...(left
                        ? { right: `${(1 - RAIL_LEFT / 960) * 100}%` }
                        : { left: `${(RAIL_RIGHT / 960) * 100}%` }),
                      opacity: on ? (dim ? 0.4 : 1) : 0,
                    }}
                  >
                    <span className={`block text-base font-semibold ${emphasised ? "text-teal-200" : "text-fog"}`}>
                      {part.label}
                    </span>
                  </span>
                );
              })}
            </>
          )}
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Choose a view of the device"
          onKeyDown={onTabKey}
          className="mx-auto mt-8 flex w-fit max-w-full flex-wrap justify-center gap-1.5 rounded-full border border-line p-1.5"
        >
          {views.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              type="button"
              aria-selected={i === view}
              tabIndex={i === view ? 0 : -1}
              onClick={() => setView(i)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                i === view ? "bg-teal-400 text-ink-950" : "text-fog hover:text-fog"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <p aria-live="polite" className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-fog">
          {current.caption}
        </p>
        <p className="mx-auto mt-3 max-w-md text-center text-xs leading-relaxed text-fog">{anatomy.note}</p>
      </div>

      <ol className="lg:col-span-5 lg:self-center">
        {parts.map((part, i) => (
          <li
            key={part.id}
            onMouseEnter={() => setActive(part.id)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(part.id)}
            onBlur={() => setActive(null)}
            tabIndex={0}
            className={`block rounded-xl px-4 py-4 transition-colors duration-300 ${active === part.id ? "bg-ink-800" : ""}`}
          >
            <p className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-300 ${
                  active === part.id
                    ? "border-teal-300 bg-teal-400 text-ink-950"
                    : "border-teal-300/60 text-teal-200"
                }`}
              >
                {i + 1}
              </span>
              <span className="font-display text-xl font-semibold text-fog">{part.label}</span>
            </p>
            <p className="mt-2 pl-10 text-sm leading-relaxed text-fog">{part.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
