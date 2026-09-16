import type { ArtKind } from "@/content/posts";

/**
 * Cover art for an article, drawn rather than photographed, so nothing on the
 * news pages can be mistaken for a patient image or a device that does not
 * yet exist. One motif per article kind.
 */
export default function PostArt({ kind, className = "" }: { kind: ArtKind; className?: string }) {
  const common = { className: `h-full w-full ${className}`, viewBox: "0 0 400 240", "aria-hidden": true as const, focusable: false as const };
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

  if (kind === "epidemic") {
    // A hundred people; ninety with the dry form.
    return (
      <svg {...common}>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        {Array.from({ length: 100 }, (_, i) => (
          <rect key={i} x={70 + (i % 20) * 13.5} y={62 + Math.floor(i / 20) * 24} width="9" height="16" rx="2" fill={i < 90 ? "#1bc3cd" : "#ff5a3c"} opacity={i < 90 ? 0.75 : 0.9} />
        ))}
      </svg>
    );
  }
  if (kind === "safety") {
    // Interlock rings around a source that stays dark until they close.
    return (
      <svg {...common}>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <g fill="none" stroke="#1bc3cd" strokeWidth="1.5">
          <circle cx="200" cy="120" r="30" strokeOpacity="0.9" />
          <circle cx="200" cy="120" r="52" strokeOpacity="0.55" strokeDasharray="10 8" />
          <circle cx="200" cy="120" r="76" strokeOpacity="0.35" strokeDasharray="4 10" />
          <circle cx="200" cy="120" r="100" strokeOpacity="0.2" />
        </g>
        <circle cx="200" cy="120" r="10" fill="#ff5a3c" opacity="0.85" />
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={200 + Math.cos((a * Math.PI) / 180) * 76} cy={120 + Math.sin((a * Math.PI) / 180) * 76} r="5" fill="#1bc3cd" />
        ))}
      </svg>
    );
  }
  if (kind === "founding") {
    // The path that used to end in waiting, and the branch that does not.
    return (
      <svg {...common}>
        <rect width="400" height="240" fill="#080f12" />
        {grid}
        <path d="M 40 120 H 170 C 210 120, 220 170, 260 170 H 360" fill="none" stroke="rgba(232,241,243,0.25)" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 40 120 H 170 C 210 120, 220 70, 260 70 H 360" fill="none" stroke="#1bc3cd" strokeWidth="2.5" />
        <circle cx="40" cy="120" r="6" fill="#e8f1f3" />
        <circle cx="360" cy="170" r="5" fill="rgba(232,241,243,0.3)" />
        <circle cx="360" cy="70" r="6" fill="#1bc3cd" />
        <circle cx="360" cy="70" r="14" fill="none" stroke="#1bc3cd" strokeOpacity="0.4" />
      </svg>
    );
  }
  // prototype: the binocular head, in outline.
  return (
    <svg {...common}>
      <rect width="400" height="240" fill="#080f12" />
      {grid}
      <g fill="none" stroke="#e8f1f3" strokeOpacity="0.85" strokeWidth="2">
        <path d="M 168 96 Q 200 80 232 96" />
        <circle cx="150" cy="112" r="40" />
        <circle cx="250" cy="112" r="40" />
        <path d="M 190 146 L 210 146 L 208 180 L 192 180 Z" />
        <rect x="193" y="180" width="14" height="40" rx="4" />
      </g>
      {[150, 250].map((cx) =>
        Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={`${cx}-${i}`} cx={cx + Math.cos(a) * 31} cy={112 + Math.sin(a) * 31} r="2.5" fill="#1bc3cd" />;
        }),
      )}
    </svg>
  );
}
