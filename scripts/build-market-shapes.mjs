/**
 * Generates src/content/market-shapes.ts: the outline of each of the seven
 * major markets, at a common scale, with its polygon area.
 *
 *   npm run build:map
 *
 * This replaced a full world map. Only seven countries carry data, and on a
 * world map they occupy a few per cent of the frame while the other 169
 * countries take the rest — a lot of space spent saying "no data here". So
 * the basemap is gone and the seven are drawn on their own, sized by their
 * caseload rather than by geography.
 *
 * Source is Natural Earth 110m via world-atlas, which is public domain. It
 * arrives as TopoJSON: quantized, delta-encoded, and sharing arcs between
 * neighbours, so it is decoded here rather than at runtime. Projection is
 * Equal Earth (Savric, Patterson & Jenny 2018), equal-area, so the `area`
 * this writes out is comparable between countries — which is what lets the
 * component scale each one to its case count.
 *
 * Outlying territory is dropped: rings whose centroid sits far from the
 * country's main landmass. Without that, Alaska and Hawaii stretch the United
 * States across a third of the world, and French Guiana does the same to
 * France. Japan keeps all of its islands, because they are all close enough
 * to the main cluster.
 */
import { writeFile } from "node:fs/promises";

const SRC = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const OUT = "src/content/market-shapes.ts";

/** Numeric ISO 3166-1 codes of the seven markets GlobalData forecasts. */
const MARKETS = ["840", "392", "380", "250", "826", "276", "724"];

/** Units in the shared projected space; sets the precision of the output. */
const SCALE = 900;
/**
 * Keep a ring only if adding it grows the country's bounding box by less than
 * this factor.
 *
 * Distance was tried first and cannot do this job: Alaska sits 1.4 main-widths
 * from the contiguous United States while Hokkaido sits 1.6 from Honshu, so
 * any distance threshold that drops Alaska also drops Hokkaido. Bounding-box
 * growth separates them cleanly, because an outlying territory is what makes a
 * country's frame explode — Alaska more than doubles the US box, Hokkaido adds
 * about a third to Japan's.
 */
const MAX_BOX_GROWTH = 1.6;
/** Drop a ring smaller than this share of the country's largest ring. */
const MIN_SHARE = 0.004;
/** Drop a point within this distance of the last one kept. */
const MIN_STEP = 0.45;

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

function ringsOf(geometry, arcs) {
  const polygons = geometry.type === "Polygon" ? [geometry.arcs] : geometry.arcs;
  const out = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      const points = [];
      for (const index of ring) {
        const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
        points.push(...(points.length ? arc.slice(1) : arc));
      }
      out.push(points);
    }
  }
  return out;
}

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
  const x = (2 * SQRT3 * l * Math.cos(theta)) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
  const y = theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  return [x * SCALE, -y * SCALE];
}

/** Twice the signed area, by the shoelace formula. */
function shoelace(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    sum += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  }
  return sum / 2;
}

function centroid(ring) {
  let x = 0;
  let y = 0;
  for (const [px, py] of ring) {
    x += px;
    y += py;
  }
  return [x / ring.length, y / ring.length];
}

const res = await fetch(SRC);
if (!res.ok) throw new Error(`${SRC}: ${res.status}`);
const topology = await res.json();
const arcs = decodeArcs(topology);

const shapes = [];
for (const geometry of topology.objects.countries.geometries) {
  const id = String(geometry.id).padStart(3, "0");
  if (!MARKETS.includes(id)) continue;

  let rings = ringsOf(geometry, arcs).map((r) => r.map(([lon, lat]) => equalEarth(lon, lat)));
  rings = rings.map((r) => ({ points: r, area: Math.abs(shoelace(r)), centre: centroid(r) }));
  rings.sort((a, b) => b.area - a.area);

  // Largest ring first, then take each in turn if it does not blow out the box.
  const boxOf = (list) => {
    let a = Infinity;
    let b = Infinity;
    let c = -Infinity;
    let d = -Infinity;
    for (const r of list) {
      for (const [x, y] of r.points) {
        if (x < a) a = x;
        if (x > c) c = x;
        if (y < b) b = y;
        if (y > d) d = y;
      }
    }
    return { x0: a, y0: b, x1: c, y1: d, size: (c - a) * (d - b) };
  };

  const main = rings[0];
  const kept = [main];
  for (const r of rings.slice(1)) {
    if (r.area / main.area < MIN_SHARE) continue;
    const grown = boxOf([...kept, r]).size / boxOf(kept).size;
    if (grown <= MAX_BOX_GROWTH) kept.push(r);
    if (process.env.DEBUG_RINGS) {
      console.log(`    ${id} ring area=${r.area.toFixed(0).padStart(7)} share=${(r.area / main.area).toFixed(4)} boxGrowth=${grown.toFixed(2)} ${grown <= MAX_BOX_GROWTH ? "KEEP" : "drop"}`);
    }
  }

  // Re-origin to the kept rings' own bounding box.
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const r of kept) {
    for (const [x, y] of r.points) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }

  const n = (v) => {
    const r = Math.round(v * 10) / 10;
    return Number.isInteger(r) ? String(r) : r.toFixed(1);
  };
  const parts = [];
  for (const r of kept) {
    const pts = r.points.map(([x, y]) => [x - x0, y - y0]);
    const thin = [];
    for (const p of pts) {
      const last = thin[thin.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= MIN_STEP) thin.push(p);
    }
    if (thin.length < 3) continue;
    parts.push(`M${n(thin[0][0])} ${n(thin[0][1])}` + thin.slice(1).map((p) => `L${n(p[0])} ${n(p[1])}`).join("") + "Z");
  }

  shapes.push({
    id,
    d: parts.join(""),
    w: +(x1 - x0).toFixed(1),
    h: +(y1 - y0).toFixed(1),
    area: +kept.reduce((a, r) => a + r.area, 0).toFixed(1),
    rings: kept.length,
  });
}

shapes.sort((a, b) => MARKETS.indexOf(a.id) - MARKETS.indexOf(b.id));

const body = `/**
 * GENERATED by scripts/build-market-shapes.mjs — do not edit by hand.
 *
 * The seven major markets' outlines, Natural Earth 110m (public domain),
 * projected with Equal Earth. Each path is in its own coordinate space with
 * the origin at its bounding box; \`w\` and \`h\` are that box, and \`area\` is the
 * true projected polygon area. Because the projection is equal-area, \`area\`
 * is comparable between countries, which is what lets the component size each
 * one by its caseload instead of its geography.
 */
export type MarketShape = { id: string; d: string; w: number; h: number; area: number };

export const SHAPES: MarketShape[] = [
${shapes.map((s) => `  ${JSON.stringify({ id: s.id, d: s.d, w: s.w, h: s.h, area: s.area })},`).join("\n")}
];
`;

await writeFile(OUT, body);
console.log(`wrote ${OUT}: ${shapes.length} markets, ${(body.length / 1024).toFixed(1)}KB`);
for (const s of shapes) console.log(`  ${s.id} ${String(s.rings).padStart(2)} rings  bbox ${s.w}x${s.h}  area ${s.area}`);
