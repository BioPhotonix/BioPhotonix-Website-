import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

/**
 * The social card every page shares.
 *
 * Links to this site were rendering as bare text everywhere they were posted:
 * LinkedIn, WhatsApp, Slack, an email preview. For a company whose links get
 * sent to clinicians and investors by hand, that was the most visible thing
 * missing from the site's search and social presence.
 *
 * One template, in the site's own palette, taking an eyebrow and a title. The
 * cards are generated at build time — every route that uses this is static —
 * so they cost nothing at runtime and never render late for a crawler.
 *
 * The two faces are committed under this folder rather than fetched. The
 * generator needs TrueType, next/font emits woff2, and a build that reaches
 * out to Google Fonts to draw an image is a build that breaks when that call
 * fails. Both are SIL OFL 1.1, which permits redistribution.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const read = (p: string) => fs.readFileSync(path.join(process.cwd(), p));
const sans = read("src/app/_og/SourceSans3-SemiBold.ttf");
const serif = read("src/app/_og/SourceSerif4-SemiBold.ttf");
const mark = `data:image/png;base64,${read("public/images/mark.png").toString("base64")}`;

const INK = "#04080a";
const FOG = "#e8f1f3";
const TEAL = "#1bc3cd";

export function ogCard(eyebrow: string, title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          // The same teal wash that sits behind the device on the site.
          backgroundImage: "radial-gradient(circle at 78% 12%, rgba(27,195,205,0.22) 0%, rgba(4,8,10,0) 58%)",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={mark} width={54} height={54} alt="" />
          <div
            style={{
              marginLeft: 20,
              fontFamily: "Sans",
              fontSize: 26,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: FOG,
            }}
          >
            BioPhotonix
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Sans",
              fontSize: 24,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: TEAL,
              marginBottom: 22,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Serif",
              fontSize: title.length > 52 ? 62 : 74,
              lineHeight: 1.12,
              color: FOG,
              maxWidth: 940,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 96, height: 4, background: TEAL }} />
          <div style={{ marginLeft: 24, fontFamily: "Sans", fontSize: 24, color: FOG }}>
            biophotonix.co.uk
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Sans", data: sans, style: "normal", weight: 600 },
        { name: "Serif", data: serif, style: "normal", weight: 600 },
      ],
    },
  );
}
