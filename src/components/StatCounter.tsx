"use client";

import { useEffect, useRef, useState } from "react";

type Props = { value: number; prefix?: string; suffix?: string; durationMs?: number };

/**
 * Counts up from zero the first time it scrolls into view. Renders the real
 * figure on the server so the number is never stuck at 0 without JavaScript.
 */
export default function StatCounter({ value, prefix = "", suffix = "", durationMs = 1500 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isPastOrVisible = () => el.getBoundingClientRect().top < window.innerHeight;
    if (isPastOrVisible()) return;

    setDisplay(0);
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      run();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) start();
      },
      { threshold: 0 },
    );
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
  }, [value, durationMs]);

  /* See CountUp for what data-count-to is for. */
  return (
    <span ref={ref} className="tabular-nums" data-count-to={`${prefix}${value}${suffix}`}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
