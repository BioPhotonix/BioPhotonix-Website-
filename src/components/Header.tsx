"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Logo from "./Logo";
import { headerCta, nav, site } from "@/content/site";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled || open ? "border-b border-line bg-ink-950/80 backdrop-blur-xl" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="shell flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} home`} className="relative z-10 shrink-0">
          <Logo className="h-8" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname.startsWith(item.href)}
              className="link-underline text-sm text-fog hover:text-fog"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={headerCta.href}
            className="rounded-full bg-teal-400 px-5 py-2.5 text-sm font-medium text-ink-950 transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal-300 hover:shadow-[0_0_28px_rgba(27,195,205,0.35)]"
          >
            {headerCta.label}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="relative z-10 -mr-2 flex h-11 w-11 items-center justify-center rounded-full text-fog lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="flex h-4 w-6 flex-col justify-between">
            <span className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`h-[2px] w-full rounded bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`h-[2px] w-full rounded bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden"
          >
            <div className="shell flex h-[calc(100dvh-4.5rem)] flex-col gap-1 overflow-y-auto border-t border-line pb-10 pt-4">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="border-b border-line py-4 font-display text-2xl font-semibold text-fog">
                  {item.label}
                </Link>
              ))}
              <Link href={headerCta.href} className="mt-5 rounded-full bg-teal-400 px-6 py-4 text-center font-medium text-ink-950">
                {headerCta.label}
              </Link>
              <a href={site.phoneHref} className="mt-3 rounded-full border border-line-strong px-6 py-4 text-center font-medium text-fog">
                Call {site.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
