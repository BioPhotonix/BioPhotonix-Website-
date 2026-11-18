/**
 * The portraits for the landing page's "People living with AMD worldwide"
 * figure: one sheet of small faces for the crowd, and one large face for the
 * opening close-up.
 *
 *   node scripts/build-portraits.mjs
 *
 * Every photograph is from Pexels, fetched by id from its CDN, under the
 * Pexels licence (free to use and modify, no attribution required). The ids
 * were chosen by eye from a contact sheet: older people, one per photograph,
 * face visible, in colour, nobody shown in distress. Each is cropped square
 * on its most salient region, which on a portrait is the face.
 *
 * Writes public/images/portraits/sheet.webp (COLS x ROWS tiles of TILE px, in
 * the order of ids) and public/images/portraits/centre.webp. Both read the
 * list and the layout from src/content/portraits.json, the one place to change
 * them.
 */
import fs from "node:fs";
import sharp from "sharp";
import PORTRAITS from "../src/content/portraits.json" with { type: "json" };

const OUT = "public/images/portraits";
const { ids, centre, cols, rows, tile } = PORTRAITS;

async function fetchPhoto(id, width) {
  const res = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`);
  if (!res.ok) throw new Error(`pexels ${id}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const square = (buf, size) =>
  sharp(buf).resize(size, size, { fit: "cover", position: sharp.strategy.attention }).toBuffer();

fs.mkdirSync(OUT, { recursive: true });

const tiles = [];
for (const [i, id] of ids.entries()) {
  tiles.push({ input: await square(await fetchPhoto(id, 900), tile), left: (i % cols) * tile, top: Math.floor(i / cols) * tile });
  process.stdout.write(".");
}
await sharp({ create: { width: cols * tile, height: rows * tile, channels: 3, background: "#080f12" } })
  .composite(tiles)
  .webp({ quality: 72 })
  .toFile(`${OUT}/sheet.webp`);

await sharp(await square(await fetchPhoto(centre, 1800), 1200)).webp({ quality: 78 }).toFile(`${OUT}/centre.webp`);

for (const f of ["sheet.webp", "centre.webp"]) console.log(`\n${f}: ${(fs.statSync(`${OUT}/${f}`).size / 1024).toFixed(0)} KB`);
