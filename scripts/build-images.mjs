/**
 * Turns the originals carried over from the Wix media library into web-sized
 * files in public/images. Run once with `npm run build:images` after dropping
 * a new original into source-images/ (which is not committed: the originals
 * run to 10MB each).
 */
import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";

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

/**
 * The Revolux V2 renders. They arrive on a transparent background inside a
 * fixed landscape frame, so sharp's `trim` cannot find them: it compares RGB
 * and the invisible pixels are not a uniform colour. Crop to the alpha
 * bounding box instead, which is what actually marks the device.
 */
const views = [
  ["revolux-v2-1.png", "revolux-three-quarter.png"],
  ["revolux-v2-2.png", "revolux-rear-quarter.png"],
  ["revolux-v2-3.png", "revolux-profile.png"],
  ["revolux-v2-4.png", "revolux-front.png"],
  ["revolux-v2-5.png", "revolux-patient.png"],
];

for (const [src, dest] of views) {
  const { data, info } = await sharp(`source-images/${src}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = Infinity, y0 = Infinity, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  const pad = 8;
  const left = Math.max(0, x0 - pad);
  const top = Math.max(0, y0 - pad);
  await sharp(`source-images/${src}`)
    .extract({
      left,
      top,
      width: Math.min(info.width - left, x1 - x0 + 1 + pad * 2),
      height: Math.min(info.height - top, y1 - y0 + 1 + pad * 2),
    })
    .resize({ height: 1100, withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(`${out}/${dest}`);
  console.log("wrote", dest);
}

// The brand mark, trimmed. The wordmark is set in type by the Logo component.
await sharp("source-images/mark.png").trim().resize({ width: 512 }).png({ compressionLevel: 9 }).toFile(`${out}/mark.png`);
console.log("wrote mark.png");

// The full logo as supplied, trimmed, for anyone who needs it on a light background.
await sharp("source-images/logo.png").trim().resize({ width: 1200 }).png({ compressionLevel: 9 }).toFile(`${out}/logo-light-bg.png`);
console.log("wrote logo-light-bg.png");

/**
 * The vision simulator's photographs. Pexels, under the Pexels licence (free
 * for commercial use, no attribution required; the site credits the
 * photographers anyway). Fetched by photo ID so the source is on record, and
 * cut to the simulator's 3:2 frame at the largest size its canvas ever draws.
 */
const photos = [
  ["8317710", "family.jpg"],
  ["5364788", "book.jpg"],
  ["109919", "street.jpg"],
];
await mkdir(`${out}/vision`, { recursive: true });
for (const [id, dest] of photos) {
  const src = `source-images/pexels-${id}.jpg`;
  if (!(await stat(src).catch(() => null))) {
    const res = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`);
    if (!res.ok) throw new Error(`Pexels ${id}: ${res.status}`);
    await writeFile(src, Buffer.from(await res.arrayBuffer()));
  }
  await sharp(src)
    .resize({ width: 1600, height: 1067, fit: "cover", position: "centre" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${out}/vision/${dest}`);
  console.log("wrote", `vision/${dest}`);
}
