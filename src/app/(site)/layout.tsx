import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { founder, site } from "@/content/site";

/** The public website. The route group keeps the header and footer in one place. */

function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}/images/mark.png`,
    email: site.email,
    telephone: "+447380903272",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.city,
      postalCode: site.address.postcode,
      addressCountry: "GB",
    },
    founder: {
      "@type": "Person",
      name: founder.name,
      jobTitle: founder.role,
      sameAs: [founder.linkedin],
    },
    description: site.description,
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StructuredData />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-teal-400 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink-950"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
