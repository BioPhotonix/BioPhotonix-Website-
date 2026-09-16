import type { NextConfig } from "next";

/**
 * Paths from the Wix site that are indexed or sit in old emails and LinkedIn
 * posts. Permanent redirects, so the ranking those URLs carry follows them.
 */
const legacyRedirects = [
  { source: "/post/:slug", destination: "/news/:slug", permanent: true },
  { source: "/blog", destination: "/news", permanent: true },
  { source: "/blog-feed.xml", destination: "/news", permanent: true },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
