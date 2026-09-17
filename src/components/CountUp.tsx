"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a figure up the first time it scrolls into view, for values written
 * as text rather than numbers.
 *
 * Only a value with exactly one number in it is animated: "200M" and "£2.6bn"
 * count, while "85-90%" and "Class IIa" are rendered as they are. Counting
 * the first of two numbers in a range would be worse than not counting at all.
 * The real value is rendered on the server, so it is never stuck at zero.
 *
 * A decimal is one number, so the match allows one point inside the digits and
 * the count keeps however many places the value was written with. Both halves
 * matter: an integer-only match silently drops "£2.6bn" to a static figure,
 * and counting it without the precision would land the tile on "£3bn", which
 * is a different claim from the one the content file makes.
 */
export default function CountUp({ value, durationMs = 1500 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* Matched in here rather than in the component body, and deliberately.
       `exec` returns a new array on every render, so as a dependency of this
       effect it counted as changed on every frame the animation painted: the
       cleanup cancelled the run it had just started, and the re-run then met
       the already-visible guard below and returned for good. The figure stuck
       a frame or two in, showing a number that was not the real one. */
    const match = /^(\D*)(\d+(?:\.\d+)?)(\D*)$/.exec(value);
    if (!match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const isPastOrVisible = () => el.getBoundingClientRect().top < window.innerHeight;
    if (isPastOrVisible()) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);
    const places = digits.includes(".") ? digits.length - digits.indexOf(".") - 1 : 0;
    const at = (n: number) => `${prefix}${n.toFixed(places)}${suffix}`;
    setDisplay(at(0));

    let raf = 0;
    const run = () => {
      /* Timed from the first frame's own timestamp, not from a
         performance.now() taken before scheduling it: a rAF timestamp is the
         frame's start time and can predate that call, which made the first
         step negative and painted "-0". */
      let t0: number | null = null;
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        const t = Math.min(1, (now - t0) / durationMs);
        setDisplay(at(target * (1 - Math.pow(1 - t, 3))));
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
  }, [value, durationMs]);

  /* data-count-to is the figure this should read once it has settled. The
     browser suite asserts the rendered text equals it: a count that stalls
     part way leaves a real-looking but wrong number on the page, which no
     other check in the suite can see. */
  return (
    <span ref={ref} data-count-to={value}>
      {display}
    </span>
  );
}
