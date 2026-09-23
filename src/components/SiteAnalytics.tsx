"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";

type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean };

/** A browser that asks not to be tracked, by Global Privacy Control or the older Do Not Track. */
function asksNotToBeTracked() {
  const n = navigator as PrivacyNavigator;
  return n.globalPrivacyControl === true || n.doNotTrack === "1";
}

/**
 * Vercel Web Analytics: page views and the site a reader came from, with no
 * cookies. It only starts once the browser has been asked, so a visitor who
 * has said no is never counted (privacy policy, section 9).
 */
export function SiteAnalytics() {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(!asksNotToBeTracked());
  }, []);
  return allowed ? <Analytics /> : null;
}
