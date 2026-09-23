import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { site } from "@/content/site";
import "./globals.css";

/**
 * Source Serif 4 and Source Sans 3: a superfamily designed to work together,
 * with a long history in scientific and medical publishing. The serif carries
 * the headlines, the sans everything else including the small letterspaced
 * labels that used to be set in a monospace code face.
 */
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Source_Sans_3({ subsets: ["latin"], variable: "--font-sans-3", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Photobiomodulation for Dry AMD | BioPhotonix",
    template: "%s | BioPhotonix",
  },
  description: site.description,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: site.url,
    title: "Photobiomodulation for Dry AMD | BioPhotonix",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04080a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
