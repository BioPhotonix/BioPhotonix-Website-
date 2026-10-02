/**
 * The rules for a cover drawn for one insight alone, in plain JavaScript so
 * the build (src/content/cover.ts) and scripts/add-insight.mjs read the same
 * ones. The social repo's tools/cover.mjs holds the same rules and also checks
 * a new cover against every earlier one, the fixed designs included, so a
 * reworked copy never reaches this file; change both together.
 *
 * A cover is { name, about, shapes }: SVG primitives on the 400 x 240 canvas
 * PostArt draws, in the site's five tones, each arriving by "draw" or "pop"
 * and the part with the point kept moving by "pulse" (the .art rules in
 * globals.css). Nothing here reaches the page as markup: PostArt builds each
 * element from the checked numbers and names.
 */

export const TONES = { ink: "#080f12", teal: "#12a3ad", red: "#e0503a", pale: "#e8f1f3", glow: "#6fe3ea" };
/** The site's fixed designs, drawn in PostArt's own code. A drawn cover never takes one of their names. */
export const LEGACY = ["epidemic", "safety", "founding", "prototype", "imaging", "evidence", "world", "signal", "survey", "binocular"];
export const LIMITS = { shapes: 600, pathChars: 4000, bytes: 60000, delay: 4, nameChars: 60 };

const GEOMETRY = { line: ["x1", "y1", "x2", "y2"], circle: ["cx", "cy", "r"], ellipse: ["cx", "cy", "rx", "ry"], rect: ["x", "y", "w", "h"], path: ["d"] };
const OPTIONAL = { rect: ["rx"] };
const PAINT = ["t", "stroke", "fill", "sw", "so", "fo", "o", "dash", "cap", "fx", "delay"];
const PATH_CHARS = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;
const ARGS = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
const X = [-50, 450];
const Y = [-50, 290];

/* ------------------------------------------------------------------ rules */

/** What is wrong with a cover, as sentences; empty when it can go on the site. */
export function coverProblems(c) {
  const out = [];
  const bad = (m) => out.push(m);
  if (!c || typeof c !== "object" || Array.isArray(c)) return ["cover must be an object"];
  for (const k of Object.keys(c)) if (!["name", "about", "shapes"].includes(k)) bad(`cover.${k} is not a cover field (name, about, shapes)`);
  if (typeof c.name !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.name) || c.name.length > LIMITS.nameChars) {
    bad(`cover.name must be lower-case words joined by hyphens, at most ${LIMITS.nameChars} characters`);
  } else if (LEGACY.includes(c.name)) bad(`cover.name "${c.name}" is one of the site's fixed designs; a drawn cover needs a name of its own`);
  if (typeof c.about !== "string" || c.about.trim().length < 30 || c.about.length > 400) {
    bad("cover.about must say, in 30 to 400 characters, what the drawing shows and why it fits the article");
  }
  if (!Array.isArray(c.shapes) || c.shapes.length < 3 || c.shapes.length > LIMITS.shapes) {
    bad(`cover.shapes must be a list of 3 to ${LIMITS.shapes} shapes`);
    return out;
  }
  let arrives = 0;
  let keeps = 0;
  c.shapes.forEach((s, i) => {
    const where = `cover.shapes[${i}]`;
    if (!s || typeof s !== "object" || Array.isArray(s)) return bad(`${where} must be an object`);
    if (!Object.hasOwn(GEOMETRY, s.t)) return bad(`${where}.t must be one of ${Object.keys(GEOMETRY).join(", ")}`);
    const allowed = new Set([...PAINT, ...GEOMETRY[s.t], ...(OPTIONAL[s.t] || [])]);
    for (const k of Object.keys(s)) if (!allowed.has(k)) bad(`${where}.${k} is not a field of a ${s.t}`);
    const num = (k, lo, hi, required = true) => {
      const v = s[k];
      if (v === undefined) { if (required) bad(`${where}.${k} is missing`); return; }
      if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi) bad(`${where}.${k} must be a number from ${lo} to ${hi}`);
    };
    if (s.t === "line") { num("x1", ...X); num("y1", ...Y); num("x2", ...X); num("y2", ...Y); }
    if (s.t === "circle") { num("cx", ...X); num("cy", ...Y); num("r", 0.1, 300); }
    if (s.t === "ellipse") { num("cx", ...X); num("cy", ...Y); num("rx", 0.1, 300); num("ry", 0.1, 300); }
    if (s.t === "rect") { num("x", ...X); num("y", ...Y); num("w", 0.1, 500); num("h", 0.1, 340); num("rx", 0, 100, false); }
    if (s.t === "path") {
      if (typeof s.d !== "string" || !PATH_CHARS.test(s.d) || !/^\s*[Mm]/.test(s.d) || s.d.length > LIMITS.pathChars) {
        bad(`${where}.d must be SVG path data (M L H V C S Q T A Z and numbers) starting with M, at most ${LIMITS.pathChars} characters`);
      } else {
        try { parsePath(s.d); } catch (e) { bad(`${where}.d: ${e.message}`); }
      }
    }
    for (const k of ["stroke", "fill"]) if (s[k] !== undefined && !Object.hasOwn(TONES, s[k])) bad(`${where}.${k} must be one of ${Object.keys(TONES).join(", ")}`);
    if (s.stroke === undefined && s.fill === undefined) bad(`${where} needs a stroke or a fill`);
    num("sw", 0.25, 8, false);
    num("so", 0, 1, false);
    num("fo", 0, 1, false);
    num("o", 0, 1, false);
    num("delay", 0, LIMITS.delay, false);
    if (s.sw !== undefined && s.stroke === undefined) bad(`${where}.sw is set but the shape has no stroke`);
    if (s.so !== undefined && s.stroke === undefined) bad(`${where}.so is set but the shape has no stroke`);
    if (s.fo !== undefined && s.fill === undefined) bad(`${where}.fo is set but the shape has no fill`);
    if (s.dash !== undefined && (typeof s.dash !== "string" || !/^\d+(\.\d+)?( \d+(\.\d+)?){1,5}$/.test(s.dash))) bad(`${where}.dash must be lengths separated by spaces, like "4 5"`);
    if (s.cap !== undefined && !["round", "square", "butt"].includes(s.cap)) bad(`${where}.cap must be round, square or butt`);
    if (s.fx !== undefined) {
      if (!Array.isArray(s.fx) || s.fx.some((f) => !["draw", "pop", "pulse"].includes(f)) || new Set(s.fx).size !== s.fx.length) {
        bad(`${where}.fx must be a list of draw, pop and pulse, each at most once`);
      } else {
        if (s.fx.includes("draw") && s.fx.includes("pop")) bad(`${where}.fx: "draw" and "pop" are both a way of arriving; pick one`);
        if (s.fx.includes("draw") && s.stroke === undefined) bad(`${where}.fx: "draw" traces the stroke and this shape has none`);
        if (s.fx.includes("draw") && s.dash !== undefined) bad(`${where}.fx: "draw" takes over the dash pattern while it runs; a dashed shape pops instead`);
        if (s.fx.includes("draw") || s.fx.includes("pop")) arrives++;
        if (s.fx.includes("pulse")) keeps++;
      }
    }
  });
  if (!arrives) bad('cover: nothing arrives. Give the shapes that build the picture "draw" or "pop", so it draws itself as the card comes into view');
  if (!keeps) bad('cover: nothing keeps moving. Give the part that carries the point "pulse"');
  const bytes = JSON.stringify(c).length;
  if (bytes > LIMITS.bytes) bad(`cover is ${bytes} characters as JSON; at most ${LIMITS.bytes}`);
  return out;
}

/* ------------------------------------------------------------------ geometry */

/** Path data as [command, ...numbers] segments. Throws on anything malformed. Arc flags must be separate numbers. */
export function parsePath(d) {
  const toks = String(d).match(/[A-Za-z]|-?(?:\d+\.?\d*|\.\d+)/g) || [];
  const segs = [];
  let i = 0;
  let cmd = null;
  while (i < toks.length) {
    if (/[A-Za-z]/.test(toks[i])) {
      cmd = toks[i++];
      if (!Object.hasOwn(ARGS, cmd.toUpperCase())) throw new Error(`"${cmd}" is not a path command`);
    } else if (!cmd) throw new Error("numbers must follow a command");
    const n = ARGS[cmd.toUpperCase()];
    if (n === 0) { segs.push([cmd]); cmd = null; continue; }
    const args = toks.slice(i, i + n);
    if (args.length < n || args.some((a) => /[A-Za-z]/.test(a))) throw new Error(`"${cmd}" needs ${n} numbers`);
    segs.push([cmd, ...args.map(Number)]);
    i += n;
    if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";
  }
  if (!segs.length || segs[0][0].toUpperCase() !== "M") throw new Error("path data must start with M");
  return segs;
}

const r2 = (n) => Math.round(n * 100) / 100;

/** Any shape as path data, drawn from the same start and in the same direction as the browser draws the shape itself. */
export function shapeD(s) {
  if (s.t === "path") return s.d;
  if (s.t === "line") return `M ${r2(s.x1)} ${r2(s.y1)} L ${r2(s.x2)} ${r2(s.y2)}`;
  if (s.t === "circle" || s.t === "ellipse") {
    const rx = s.t === "circle" ? s.r : s.rx;
    const ry = s.t === "circle" ? s.r : s.ry;
    return `M ${r2(s.cx + rx)} ${r2(s.cy)} A ${r2(rx)} ${r2(ry)} 0 1 1 ${r2(s.cx - rx)} ${r2(s.cy)} A ${r2(rx)} ${r2(ry)} 0 1 1 ${r2(s.cx + rx)} ${r2(s.cy)}`;
  }
  const { x, y, w, h } = s;
  const k = Math.min(Number(s.rx) || 0, w / 2, h / 2);
  if (!k) return `M ${r2(x)} ${r2(y)} H ${r2(x + w)} V ${r2(y + h)} H ${r2(x)} Z`;
  return `M ${r2(x + k)} ${r2(y)} H ${r2(x + w - k)} A ${r2(k)} ${r2(k)} 0 0 1 ${r2(x + w)} ${r2(y + k)} V ${r2(y + h - k)} A ${r2(k)} ${r2(k)} 0 0 1 ${r2(x + w - k)} ${r2(y + h)} H ${r2(x + k)} A ${r2(k)} ${r2(k)} 0 0 1 ${r2(x)} ${r2(y + h - k)} V ${r2(y + k)} A ${r2(k)} ${r2(k)} 0 0 1 ${r2(x + k)} ${r2(y)} Z`;
}
