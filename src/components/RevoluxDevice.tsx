"use client";

import Image from "next/image";

/**
 * The front render with therapy light rising from both eyepieces.
 *
 * The glow is anchored to the apertures rather than eyeballed. Their centres
 * were found by detecting the teal-rimmed openings in the render itself:
 * (89.7, 147.4) and (214.9, 147.9) in its 305 x 660 pixels, which is
 * 29.4% / 22.3% and 70.5% / 22.4%, with an aperture radius of 9.7% of the
 * width. The wrapper carries the render's own aspect ratio, so those
 * percentages land on the apertures at every size. If the render is ever
 * replaced, re-measure: nothing here infers the position from the artwork at
 * runtime.
 *
 * The light builds over five seconds and then holds, rather than pulsing,
 * because that is what a treatment session does. Under reduced motion it is
 * simply present at full strength.
 */

/** Aperture centres, as a share of the render's width and height. */
const APERTURES = [
  { x: 29.42, y: 22.33 },
  { x: 70.47, y: 22.41 },
] as const;

type Props = {
  alt: string;
  /** Sizes hint for the image, since this is used at two different widths. */
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function RevoluxDevice({ alt, sizes, priority = false, className = "" }: Props) {
  return (
    <div className={`relative aspect-[305/660] ${className}`}>
      <Image
        src="/images/revolux-front.png"
        alt={alt}
        width={305}
        height={660}
        priority={priority}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(27,195,205,0.22)]"
      />

      {APERTURES.map((a) => (
        <span key={a.x} aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Halo: the light spilling out around the eyepiece. */}
          <span
            className="device-glow absolute aspect-square w-[62%] rounded-full"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              background:
                "radial-gradient(circle, rgba(255,86,56,0.62) 0%, rgba(255,72,44,0.3) 26%, rgba(255,64,40,0.12) 48%, rgba(255,60,38,0) 70%)",
            }}
          />
          {/* Source: the aperture itself, lit. */}
          <span
            className="device-glow device-glow-core absolute aspect-square w-[21%] rounded-full"
            style={{
              left: `${a.x}%`,
              top: `${a.y}%`,
              background:
                "radial-gradient(circle, rgba(255,176,150,0.92) 0%, rgba(255,104,70,0.8) 38%, rgba(255,80,50,0.34) 68%, rgba(255,74,46,0) 100%)",
            }}
          />
        </span>
      ))}
    </div>
  );
}
