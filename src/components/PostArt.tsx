"use client";

import type { ArtKind } from "@/content/posts";
import { useRevealed } from "./useRevealed";

/**
 * Cover art for an article, drawn rather than photographed, so nothing on the
 * news pages can be mistaken for a patient image or a device that does not
 * yet exist. One motif per article kind; the four insight motifs (imaging,
 * evidence, world, signal) are drawn from the same 2px line and palette.
 *
 * Each draws itself once as the card arrives, and the part of the motif that
 * carries the point keeps moving afterwards: the ten wet-AMD figures, the
 * light at the centre of the interlocks, the emitters on the prototype.
 */

const grid = (
  <g stroke="rgba(232,241,243,0.06)" strokeWidth="1">
    {Array.from({ length: 11 }, (_, i) => (
      <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="240" />
    ))}
    {Array.from({ length: 7 }, (_, i) => (
      <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
    ))}
  </g>
);

function Motif({ kind }: { kind: ArtKind }) {
  if (kind === "epidemic") {
    // A hundred people; ninety with the dry form.
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        {Array.from({ length: 100 }, (_, i) => {
          const dry = i < 90;
          return (
            <rect
              key={i}
              x={70 + (i % 20) * 13.5}
              y={62 + Math.floor(i / 20) * 24}
              width="9"
              height="16"
              rx="2"
              fill={dry ? "#12a3ad" : "#e0503a"}
              data-art-pop
              {...(dry ? {} : { "data-art-pulse": true })}
              style={{ animationDelay: `${(dry ? i * 0.006 : 0.6 + (i - 90) * 0.12)}s` }}
            />
          );
        })}
      </>
    );
  }
  if (kind === "safety") {
    // Interlock rings around a source that only runs when they close.
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <g fill="none" stroke="#12a3ad" strokeWidth="1.5">
          <circle cx="200" cy="120" r="30" strokeOpacity="0.9" data-art-draw />
          <circle cx="200" cy="120" r="52" strokeOpacity="0.55" strokeDasharray="10 8" />
          <circle cx="200" cy="120" r="76" strokeOpacity="0.35" strokeDasharray="4 10" />
          <circle cx="200" cy="120" r="100" strokeOpacity="0.2" data-art-draw />
        </g>
        <circle cx="200" cy="120" r="10" fill="#e0503a" opacity="0.85" data-art-pulse />
        {[0, 120, 240].map((a, i) => (
          <circle
            key={a}
            cx={200 + Math.cos((a * Math.PI) / 180) * 76}
            cy={120 + Math.sin((a * Math.PI) / 180) * 76}
            r="5"
            fill="#12a3ad"
            data-art-pop
            style={{ animationDelay: `${0.5 + i * 0.16}s` }}
          />
        ))}
      </>
    );
  }
  if (kind === "founding") {
    // The path that used to end in waiting, and the branch that does not.
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <path d="M 40 120 H 170 C 210 120, 220 170, 260 170 H 360" fill="none" stroke="rgba(232,241,243,0.25)" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 40 120 H 170 C 210 120, 220 70, 260 70 H 360" fill="none" stroke="#12a3ad" strokeWidth="2.5" data-art-draw />
        <circle cx="40" cy="120" r="6" fill="#e8f1f3" data-art-pop />
        <circle cx="360" cy="170" r="5" fill="rgba(232,241,243,0.3)" data-art-pop style={{ animationDelay: "0.9s" }} />
        <circle cx="360" cy="70" r="6" fill="#12a3ad" data-art-pop style={{ animationDelay: "1.1s" }} />
        <circle cx="360" cy="70" r="14" fill="none" stroke="#12a3ad" strokeOpacity="0.4" data-art-pulse />
      </>
    );
  }
  if (kind === "imaging") {
    // An OCT cross-section: the inner layers dip at the fovea, the outer ones
    // stay flat, and a scan line reads across them. The drusen sits where a
    // clinician would look for it, under the RPE.
    const layers = [
      { y: 84, dip: 46, o: 0.9 },
      { y: 98, dip: 36, o: 0.5 },
      { y: 112, dip: 26, o: 0.75 },
      { y: 128, dip: 15, o: 0.45 },
      { y: 144, dip: 6, o: 0.8 },
    ];
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <g fill="none" stroke="#12a3ad" strokeWidth="1.8">
          {layers.map((l, i) => (
            <path
              key={l.y}
              d={`M 20 ${l.y} C 150 ${l.y}, 168 ${l.y + l.dip}, 200 ${l.y + l.dip} S 250 ${l.y}, 380 ${l.y}`}
              strokeOpacity={l.o}
              data-art-draw
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </g>
        <path d="M 20 164 H 380" fill="none" stroke="#e8f1f3" strokeOpacity="0.75" strokeWidth="2.5" data-art-draw style={{ animationDelay: "0.6s" }} />
        <path d="M 258 164 Q 274 146 290 164 Z" fill="#e0503a" opacity="0.9" data-art-pop data-art-pulse style={{ animationDelay: "1.2s" }} />
        <line x1="200" y1="52" x2="200" y2="190" stroke="#6fe3ea" strokeWidth="1.5" strokeOpacity="0.9" data-art-pop data-art-pulse style={{ animationDelay: "0.9s" }} />
      </>
    );
  }
  if (kind === "evidence") {
    // A forest plot: five studies with their confidence intervals, the line of
    // no effect, and the pooled estimate as the diamond beneath them.
    const rows = [
      { y: 60, x: 214, lo: 150, hi: 292, w: 8 },
      { y: 84, x: 232, lo: 190, hi: 280, w: 12 },
      { y: 108, x: 196, lo: 118, hi: 262, w: 6 },
      { y: 132, x: 240, lo: 205, hi: 286, w: 14 },
      { y: 156, x: 226, lo: 176, hi: 274, w: 10 },
    ];
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <line x1="180" y1="40" x2="180" y2="206" stroke="rgba(232,241,243,0.35)" strokeWidth="1.5" strokeDasharray="6 6" />
        {rows.map((r, i) => (
          <g key={r.y}>
            <line x1={r.lo} y1={r.y} x2={r.hi} y2={r.y} stroke="#e8f1f3" strokeOpacity="0.6" strokeWidth="1.5" data-art-draw style={{ animationDelay: `${i * 0.1}s` }} />
            <rect x={r.x - r.w / 2} y={r.y - r.w / 2} width={r.w} height={r.w} fill="#12a3ad" data-art-pop style={{ animationDelay: `${0.4 + i * 0.1}s` }} />
          </g>
        ))}
        <path d="M 196 190 L 228 181 L 260 190 L 228 199 Z" fill="#12a3ad" data-art-pop data-art-pulse style={{ animationDelay: "1.1s" }} />
      </>
    );
  }
  if (kind === "world") {
    // A globe of points, and the region this week's news comes from. An
    // orthographic projection: parallels every 15 degrees, points every 15
    // degrees of longitude, fading towards the limb.
    const R = 92;
    const dots: { x: number; y: number; o: number; hot: boolean }[] = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      const la = (lat * Math.PI) / 180;
      for (let lon = -90; lon <= 90; lon += 15) {
        const lo = (lon * Math.PI) / 180;
        const x = 200 + R * Math.cos(la) * Math.sin(lo);
        const y = 120 - R * Math.sin(la);
        const o = 0.18 + 0.62 * Math.cos(lo) * Math.cos(la);
        const hot = (lat === 30 || lat === 45) && (lon === 45 || lon === 60);
        dots.push({ x, y, o, hot });
      }
    }
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <circle cx="200" cy="120" r={R} fill="none" stroke="rgba(232,241,243,0.3)" strokeWidth="1.5" data-art-draw />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x.toFixed(1)}
            cy={d.y.toFixed(1)}
            r={d.hot ? 3.4 : 2.2}
            fill={d.hot ? "#e0503a" : "#12a3ad"}
            opacity={d.hot ? 1 : d.o}
            data-art-pop
            {...(d.hot ? { "data-art-pulse": true } : {})}
            style={{ animationDelay: `${0.2 + (i % 13) * 0.05 + Math.floor(i / 13) * 0.04}s` }}
          />
        ))}
      </>
    );
  }
  if (kind === "signal") {
    // Light from a source, through a lens, to a focus.
    const rays = [70, 95, 120, 145, 170];
    return (
      <>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <g fill="none" stroke="#12a3ad" strokeWidth="1.5">
          {[22, 42, 62].map((r, i) => (
            <path key={r} d={`M 60 ${120 - r} A ${r} ${r} 0 0 1 60 ${120 + r}`} strokeOpacity={0.9 - i * 0.25} data-art-draw style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </g>
        <g fill="none" stroke="#12a3ad" strokeOpacity="0.55" strokeWidth="1.5">
          {rays.map((y, i) => (
            <path key={y} d={`M 60 120 L 200 ${y} L 330 120`} data-art-draw style={{ animationDelay: `${0.5 + i * 0.08}s` }} />
          ))}
        </g>
        <path d="M 200 58 C 224 78, 224 162, 200 182 C 176 162, 176 78, 200 58 Z" fill="rgba(18,163,173,0.08)" stroke="#e8f1f3" strokeOpacity="0.75" strokeWidth="2" data-art-draw style={{ animationDelay: "0.3s" }} />
        <circle cx="60" cy="120" r="5" fill="#e8f1f3" data-art-pop />
        <circle cx="330" cy="120" r="7" fill="#e0503a" data-art-pop data-art-pulse style={{ animationDelay: "1.3s" }} />
        <circle cx="330" cy="120" r="16" fill="none" stroke="#e0503a" strokeOpacity="0.4" data-art-pulse />
      </>
    );
  }
  // prototype: the binocular head, in outline.
  return (
    <>
      <rect width="400" height="240" fill="#080f12" />
      {grid}
      <g fill="none" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="2">
        <path d="M 168 96 Q 200 80 232 96" data-art-draw />
        <circle cx="150" cy="112" r="40" data-art-draw />
        <circle cx="250" cy="112" r="40" data-art-draw />
        <path d="M 190 146 L 210 146 L 208 180 L 192 180 Z" data-art-draw />
        <rect x="193" y="180" width="14" height="40" rx="4" data-art-draw />
      </g>
      {[150, 250].map((cx) =>
        Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <circle
              key={`${cx}-${i}`}
              cx={cx + Math.cos(a) * 31}
              cy={112 + Math.sin(a) * 31}
              r="2.5"
              fill="#12a3ad"
              data-art-pop
              data-art-pulse
              style={{ animationDelay: `${0.8 + i * 0.07}s` }}
            />
          );
        }),
      )}
    </>
  );
}

export default function PostArt({ kind, className = "" }: { kind: ArtKind; className?: string }) {
  const { ref, state } = useRevealed<HTMLSpanElement>();
  return (
    <span ref={ref} aria-hidden="true" className={`art ${state === "hidden" ? "" : "is-live"} block h-full w-full ${className}`}>
      <svg viewBox="0 0 400 240" className="h-full w-full" focusable="false">
        <Motif kind={kind} />
      </svg>
    </span>
  );
}
