"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger position when several Reveals sit in a row, in seconds. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fades and lifts its children the first time they scroll into view.
 *
 * Fail-safe by design: the server renders the content visible, the hidden
 * state is only applied after hydration and only to elements below the fold,
 * and prefers-reduced-motion skips the whole mechanism.
 */
export default function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isPastOrVisible = () => el.getBoundingClientRect().top < window.innerHeight;
    if (isPastOrVisible()) return;

    el.dataset.reveal = "hidden";

    const show = () => {
      el.dataset.reveal = "shown";
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

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
