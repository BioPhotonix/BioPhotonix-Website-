/**
 * The portraits for the landing page's "People living with AMD worldwide"
 * figure: sheets of small faces for the crowd, and one large face for the
 * opening close-up.
 *
 *   node scripts/build-portraits.mjs
 *
 * Every photograph is from Pexels, fetched by id from its CDN, under the
 * Pexels licence (free to use and modify, no attribution required). The ids
 * were chosen by eye from contact sheets: older people, one per photograph,
 * face visible, in colour, nobody shown in distress, and no one twice. Each is
 * cropped square on its most salient region, which on a portrait is the face.
 *
 * Writes one webp per sheet in src/content/portraits.json (its tiles in the
 * order of its ids, `cols` to a row) and public/images/portraits/centre.webp.
 * The first sheet has larger tiles because its faces are the ones drawn
 * round the opening face, at the largest sizes; the second only ever appears
 * further out, small. The JSON is the one place to change any of it.
 */
import fs from "node:fs";
import sharp from "sharp";
import PORTRAITS from "../src/content/portraits.json" with { type: "json" };

const OUT = "public/images/portraits";

async function fetchPhoto(id, width) {
  const res = await fetch(`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`);
  if (!res.ok) throw new Error(`pexels ${id}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

const square = (buf, size) =>
  sharp(buf).resize(size, size, { fit: "cover", position: sharp.strategy.attention }).toBuffer();

fs.mkdirSync(OUT, { recursive: true });

for (const { file, tile, cols, ids } of PORTRAITS.sheets) {
  const rows = Math.ceil(ids.length / cols);
  const tiles = [];
  for (const [i, id] of ids.entries()) {
    tiles.push({ input: await square(await fetchPhoto(id, 900), tile), left: (i % cols) * tile, top: Math.floor(i / cols) * tile });
    process.stdout.write(".");
  }
  await sharp({ create: { width: cols * tile, height: rows * tile, channels: 3, background: "#080f12" } })
    .composite(tiles)
    .webp({ quality: 72 })
    .toFile(`${OUT}/${file}`);
  console.log(`\n${file}: ${ids.length} faces, ${(fs.statSync(`${OUT}/${file}`).size / 1024).toFixed(0)} KB`);
}

await sharp(await square(await fetchPhoto(PORTRAITS.centre, 1800), 1200)).webp({ quality: 78 }).toFile(`${OUT}/centre.webp`);
console.log(`centre.webp: ${(fs.statSync(`${OUT}/centre.webp`).size / 1024).toFixed(0)} KB`);
