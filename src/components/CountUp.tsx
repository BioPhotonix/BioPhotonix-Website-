"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up the first time it scrolls into view, for values written
 * as text rather than numbers.
 *
 * Only a value with exactly one number in it is animated: "200M" and "$49B"
 * count, while "85-90%" and "Class IIa" are rendered as they are. Counting
 * the first of two numbers in a range would be worse than not counting at all.
 * The real value is rendered on the server, so it is never stuck at zero.
 */
export default function CountUp({ value, durationMs = 1500 }: { value: string; durationMs?: number }) {
  const match = /^(\D*)(\d+)(\D*)$/.exec(value);
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isPastOrVisible = () => el.getBoundingClientRect().top < window.innerHeight;
    if (isPastOrVisible()) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    setDisplay(`${prefix}0${suffix}`);

    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / durationMs);
        setDisplay(`${prefix}${Math.round(target * (1 - Math.pow(1 - t, 3)))}${suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      run();
    };
    const observer = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) start();
    }, { threshold: 0 });
    observer.observe(el);
    const onScroll = () => {
      if (isPastOrVisible()) start();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [value, durationMs, match]);

  return <span ref={ref}>{display}</span>;
}
