import Link from "next/link";
import Logo from "./Logo";
import { nav, site } from "@/content/site";

const columns = [
  {
    title: "Company",
    links: [
      { label: "Technology", href: "/technology" },
      { label: "What patients see", href: "/vision" },
      { label: "For clinics", href: "/clinics" },
      { label: "About", href: "/about" },
      { label: "Investors", href: "/investors" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy policy", href: "/privacy-policy" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950 text-fog">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <Logo className="h-8" />
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h2 className="eyebrow">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-base">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-underline text-fog hover:text-fog">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {site.legalName}. Registered in Scotland.</p>
          <p className="figure text-xs uppercase tracking-[0.13em]">Revolux is a medical device in development and is not yet available for sale.</p>
        </div>
      </div>
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} aria-hidden="true" />
      <nav aria-label="Footer utility" className="sr-only">
        {nav.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
