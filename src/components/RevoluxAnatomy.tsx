"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { anatomy } from "@/content/site";
import { useRevealed } from "./useRevealed";

/**
 * The device render with technical callouts drawn over it.
 *
 * The callouts arrive one at a time once the section is on screen and then
 * stay, the way a labelled figure in a paper builds up. Hovering or focusing
 * a part emphasises it and dims the others. Under reduced motion every
 * callout is present from the start.
 *
 * The overlay is a single 1198 x 1306 coordinate space with the render
 * occupying x 260 to 938 inside it, so the leader lines and labels scale with
 * the image and never drift. Below the medium breakpoint there is no room for
 * labels beside the device, so the numbered list underneath carries them and
 * the overlay shows only the anchor points.
 */
export default function RevoluxAnatomy() {
  const { ref, state } = useRevealed<HTMLDivElement>();
  const [shown, setShown] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const parts = anatomy.parts;

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

  return (
    <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="relative mx-auto w-full max-w-2xl" style={{ aspectRatio: "1198 / 1306" }}>
          {/* The render sits in the middle of the overlay's coordinate space. */}
          <div className="absolute" style={{ left: "21.7%", width: "56.6%", top: 0, height: "100%" }}>
            <Image
              src="/images/revolux-front.png"
              alt="Render of the Revolux binocular device, seen from the front"
              width={678}
              height={1306}
              sizes="(max-width: 1024px) 60vw, 34vw"
              className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(27,195,205,0.18)]"
            />
          </div>

          <svg viewBox="0 0 1198 1306" className="absolute inset-0 h-full w-full" aria-hidden="true">
            {parts.map((part, i) => {
              const [ax, ay] = part.anchor;
              const left = part.side === "left";
              const railX = left ? 248 : 950;
              const elbowX = left ? railX + 70 : railX - 70;
              const on = i < shown;
              const dim = active !== null && active !== part.id;
              return (
                <g
                  key={part.id}
                  className="transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ opacity: on ? (dim ? 0.28 : 1) : 0 }}
                >
                  {/* Leader: along the rail, then in to the part. */}
                  <path
                    d={`M ${railX} ${part.labelY} H ${elbowX} L ${ax} ${ay}`}
                    fill="none"
                    stroke="var(--color-teal-400)"
                    strokeWidth="1.5"
                    strokeOpacity="0.55"
                    className="hidden md:block"
                  />
                  <circle cx={ax} cy={ay} r="7" fill="none" stroke="var(--color-teal-400)" strokeWidth="2" />
                  <circle cx={ax} cy={ay} r="2.5" fill="var(--color-teal-400)" />
                  <text
                    x={left ? railX - 14 : railX + 14}
                    y={part.labelY - 6}
                    textAnchor={left ? "end" : "start"}
                    className="hidden md:block"
                    fontSize="27"
                    fontWeight="600"
                    fill="var(--color-fog)"
                    fontFamily="var(--font-sans)"
                  >
                    {part.label}
                  </text>
                  <text
                    x={left ? railX - 14 : railX + 14}
                    y={part.labelY + 24}
                    textAnchor={left ? "end" : "start"}
                    className="hidden md:block"
                    fontSize="22"
                    fontWeight="600"
                    letterSpacing="0.13em"
                    fill="var(--color-teal-400)"
                    fontFamily="var(--font-sans)"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-fog/70">{anatomy.note}</p>
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
            className={`block rounded-xl px-4 py-4 transition-colors duration-300 ${
              active === part.id ? "bg-ink-800" : ""
            }`}
          >
            <p className="flex items-baseline gap-3">
              <span className="text-xs font-semibold tracking-[0.13em] text-teal-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-display text-xl font-semibold text-fog">{part.label}</span>
            </p>
            <p className="mt-2 pl-8 text-sm leading-relaxed text-fog/75">{part.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
