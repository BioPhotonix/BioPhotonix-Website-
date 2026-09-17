"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Cross-fades between routes and carries the device across with them.
 *
 * React ships a <ViewTransition> component, and Next has an
 * `experimental.viewTransition` flag to enable it, but on React 19.3 stable
 * the export is absent at runtime: the flag builds cleanly and then nothing
 * transitions. So this drives the View Transitions API directly.
 *
 * Navigation is the one thing on a site that must never break, so the rules
 * here are all about giving up rather than getting clever:
 *
 *   - Only a plain left-click, on a same-origin anchor, to a different path,
 *     with no modifier key, no target, no download attribute.
 *   - Only when the browser has the API and the visitor has not asked for
 *     reduced motion. Everything else navigates exactly as it did before.
 *   - The click is taken in the capture phase and stopped there, so Next's own
 *     handler never sees it and the route is never pushed twice.
 *   - A transition holds the old frame on screen until its promise resolves,
 *     so a navigation that never completes would leave the page apparently
 *     frozen. The timeout below bounds that: worst case the transition ends
 *     by itself and the navigation carries on underneath.
 */

/** Longest a transition may wait for the new route before giving up on it. */
const SETTLE_TIMEOUT = 900;

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<{ resolve: () => void; timer: number } | null>(null);

  // The new route has committed, so the browser can take its snapshot.
  useEffect(() => {
    const p = pending.current;
    if (!p) return;
    pending.current = null;
    window.clearTimeout(p.timer);
    p.resolve();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (typeof document.startViewTransition !== "function") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const target = e.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same page: an in-page anchor, or a link back to where we already are.
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();

      const to = `${url.pathname}${url.search}${url.hash}`;
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            const timer = window.setTimeout(() => {
              pending.current = null;
              resolve();
            }, SETTLE_TIMEOUT);
            pending.current = { resolve, timer };
            router.push(to);
          }),
      );
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
