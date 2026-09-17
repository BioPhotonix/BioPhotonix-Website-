/**
 * Generates src/content/world-map.ts: the world's coastlines as SVG paths.
 *
 *   node scripts/build-world-map.mjs
 *
 * Source is Natural Earth 110m via the world-atlas package, which is public
 * domain. It arrives as TopoJSON, which is quantized and delta-encoded and
 * shares arcs between neighbours, so it has to be decoded before it can be
 * drawn. That decode is ~40 lines and is done here rather than at runtime, so
 * the site ships plain path strings and no TopoJSON library.
 *
 * Projection is Equal Earth (Savric, Patterson & Jenny, 2018). Equal-area
 * matters here: the map is coloured by case counts, and a Mercator-style
 * projection would inflate exactly the high-latitude countries the data is
 * about. It is also the reason Antarctica is dropped — no data, and it eats
 * the bottom quarter of the frame.
 *
 * The output is simplified hard: rings below a minimum area go, and points
 * closer together than MIN_STEP are dropped. At the size this renders it is
 * indistinguishable from the full-resolution outline, and it keeps the
 * generated module small enough to serve as markup.
 */
import { writeFile } from "node:fs/promises";

const SRC = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const OUT = "src/content/world-map.ts";

/** Width of the generated viewBox, in user units. */
const WIDTH = 1000;
/** Drop rings whose projected bounding box is smaller than this, in units. */
const MIN_RING = 1.4;
/** Drop a point within this distance of the last one kept, in units. */
const MIN_STEP = 0.7;
/** Antarctica: no data and a quarter of the frame. */
const SKIP = new Set(["010"]);

// --- TopoJSON decode ------------------------------------------------------

function decodeArcs(topology) {
  const { scale, translate } = topology.transform;
  return topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/**
 * Split a ring wherever it jumps the antimeridian.
 *
 * Russia's far east and Fiji both straddle 180 degrees, so their rings run
 * off one edge of the map and back on at the other. Projected naively that
 * draws a streak right across the world. Cutting the ring at any step of
 * more than 180 degrees of longitude leaves each piece on its own side.
 */
function splitAtDateline(points) {
  const pieces = [];
  let current = [];
  for (let i = 0; i < points.length; i += 1) {
    if (i > 0 && Math.abs(points[i][0] - points[i - 1][0]) > 180) {
      if (current.length > 2) pieces.push(current);
      current = [];
    }
    current.push(points[i]);
  }
  if (current.length > 2) pieces.push(current);
  return pieces;
}

/** Stitch a geometry's arc indices into rings of lon/lat pairs. */
function ringsOf(geometry, arcs) {
  const polygons = geometry.type === "Polygon" ? [geometry.arcs] : geometry.arcs;
  const out = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const points = [];
      for (const index of ring) {
        // A negative index means that arc traversed backwards.
        const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
        // Arcs share endpoints, so drop the joint.
        points.push(...(points.length ? arc.slice(1) : arc));
      }
      out.push(...splitAtDateline(points));
    }
  }
  return out;
}

// --- Projection -----------------------------------------------------------

const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const SQRT3 = Math.sqrt(3);

function equalEarth(lon, lat) {
  const l = (lon * Math.PI) / 180;
  const p = (lat * Math.PI) / 180;
  const theta = Math.asin((SQRT3 / 2) * Math.sin(p));
  const t2 = theta * theta;
  const t6 = t2 * t2 * t2;
  const x =
    (2 * SQRT3 * l * Math.cos(theta)) /
    (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  // Screen y grows downwards.
  return [x, -y];
}

// --- Build ----------------------------------------------------------------

const res = await fetch(SRC);
if (!res.ok) throw new Error(`${SRC}: ${res.status}`);
const topology = await res.json();
const arcs = decodeArcs(topology);
const geometries = topology.objects.countries.geometries;

// Project everything first so the extent can be measured, then scale to fit.
const projected = [];
for (const geometry of geometries) {
  const id = String(geometry.id).padStart(3, "0");
  if (SKIP.has(id)) continue;
  const rings = ringsOf(geometry, arcs).map((ring) => ring.map(([lon, lat]) => equalEarth(lon, lat)));
  projected.push({ id, name: geometry.properties?.name ?? id, rings });
}

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (const { rings } of projected) {
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
const k = WIDTH / (maxX - minX);
const HEIGHT = Math.round((maxY - minY) * k);
const to = ([x, y]) => [(x - minX) * k, (y - minY) * k];

function pathOf(rings) {
  const parts = [];
  for (const ring of rings) {
    const pts = ring.map(to);
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const [x, y] of pts) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    if (Math.max(x1 - x0, y1 - y0) < MIN_RING) continue;

    const kept = [];
    for (const p of pts) {
      const last = kept[kept.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= MIN_STEP) kept.push(p);
    }
    if (kept.length < 3) continue;
    const n = (v) => {
      const r = Math.round(v * 10) / 10;
      return Number.isInteger(r) ? String(r) : r.toFixed(1);
    };
    parts.push(`M${n(kept[0][0])} ${n(kept[0][1])}` + kept.slice(1).map((p) => `L${n(p[0])} ${n(p[1])}`).join("") + "Z");
  }
  return parts.join("");
}

const countries = projected
  .map(({ id, name, rings }) => ({ id, name, d: pathOf(rings) }))
  .filter((c) => c.d.length > 0)
  .sort((a, b) => a.id.localeCompare(b.id));

const body = `/**
 * GENERATED by scripts/build-world-map.mjs — do not edit by hand.
 *
 * Natural Earth 110m coastlines (public domain), projected with Equal Earth
 * and simplified for display at this size. \`id\` is the numeric ISO 3166-1
 * country code, which is what the prevalence data is keyed by.
 */
export const WORLD_VIEWBOX = "0 0 ${WIDTH} ${HEIGHT}";

export type CountryShape = { id: string; name: string; d: string };

export const WORLD: CountryShape[] = ${JSON.stringify(countries, null, 0)
  .replace(/\},\{/g, "},\n  {")
  .replace(/^\[/, "[\n  ")
  .replace(/\]$/, ",\n]")};
`;

await writeFile(OUT, body);
console.log(`wrote ${OUT}: ${countries.length} countries, ${(body.length / 1024).toFixed(1)}KB, viewBox 0 0 ${WIDTH} ${HEIGHT}`);
