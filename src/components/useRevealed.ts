"use client";

import { useEffect, useRef, useState } from "react";

export type RevealState = "idle" | "hidden" | "shown";

/**
 * The same fail-safe logic as Reveal, for components that drive their own
 * animation with motion variants. Content starts visible ("idle"). After
 * hydration, and only for elements below the fold, it is hidden and then
 * shown the first time it scrolls into view. prefers-reduced-motion leaves it
 * visible throughout, as does an element already on screen.
 *
 * Use `animate={state === "hidden" ? "hidden" : "shown"}` with
 * `initial={false}`, and give the hidden variant a zero-length transition so
 * the step into hiding never flashes.
 */
export function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState<RevealState>("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isPastOrVisible = () => el.getBoundingClientRect().top < window.innerHeight;
    if (isPastOrVisible()) return;

    setState("hidden");
    const show = () => {
      setState("shown");
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      { threshold: 0 },
    );
    observer.observe(el);
    const onScroll = () => {
      if (isPastOrVisible()) show();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { ref, state };
}
