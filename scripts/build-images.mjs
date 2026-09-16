/**
 * Turns the originals carried over from the Wix media library into web-sized
 * files in public/images. Run once with `npm run build:images` after dropping
 * a new original into source-images/ (which is not committed: the originals
 * run to 10MB each).
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const out = "public/images";
await mkdir(out, { recursive: true });

const jobs = [
  // Portraits. Square crops, so the team grid lines up.
  ["adail-portrait.jpg", "adail-portrait.jpg", { width: 1200, height: 1400, fit: "cover", position: "top" }],
  ["adail-clinic.png", "adail-clinic.jpg", { width: 1400 }],
  ["nikola-krstajic.jpg", "nikola-krstajic.jpg", { width: 800, height: 800, fit: "cover" }],
  ["edwin-lindsay.jpg", "edwin-lindsay.jpg", { width: 800, height: 800, fit: "cover" }],
  ["martin-pacitti.jpg", "martin-pacitti.jpg", { width: 800, height: 800, fit: "cover" }],
];

for (const [src, dest, resize] of jobs) {
  await sharp(`source-images/${src}`).rotate().resize(resize).jpeg({ quality: 82, mozjpeg: true }).toFile(`${out}/${dest}`);
  console.log("wrote", dest);
}

// Device renders have transparent backgrounds. Trim the empty space and keep alpha.
for (const [src, dest] of [["revolux-side.png", "revolux-side.png"], ["revolux-front.png", "revolux-front.png"]]) {
  await sharp(`source-images/${src}`).trim().resize({ width: 1400, withoutEnlargement: true }).png({ compressionLevel: 9, palette: false }).toFile(`${out}/${dest}`);
  console.log("wrote", dest);
}

// The brand mark, trimmed. The wordmark is set in type by the Logo component.
await sharp("source-images/mark.png").trim().resize({ width: 512 }).png({ compressionLevel: 9 }).toFile(`${out}/mark.png`);
console.log("wrote mark.png");

// The full logo as supplied, trimmed, for anyone who needs it on a light background.
await sharp("source-images/logo.png").trim().resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-light-bg.png`);
console.log("wrote logo-light-bg.png");
