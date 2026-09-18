/**
 * The figure that opens a weekly insight: a small declarative spec, drawn by
 * InsightFigure as an animated panel in the site's own style.
 *
 * The automation writes the spec from the article's numbers; nothing it
 * writes reaches the page as markup. One to three blocks, each one of six
 * kinds, every value a number or a short string checked here at build time.
 * The same rules are mirrored in the social repo's validator and in
 * scripts/add-insight.mjs; change all three together.
 */

export type FigureBlock =
  | { kind: "before-after"; label?: string; before: { label: string; value: number }; after: { label: string; value: number }; unit?: string; decimals?: number }
  | { kind: "bars"; label?: string; items: { label: string; value: number; emphasis?: boolean }[]; unit?: string; decimals?: number }
  | { kind: "change"; label?: string; items: { label: string; change: number }[] }
  | { kind: "stats"; label?: string; items: { value: string; label: string }[] }
  | { kind: "flow"; label?: string; steps: { label: string; note?: string }[] }
  | { kind: "share"; label?: string; value: number; text: string };

export type Figure = {
  title: string;
  caption?: string;
  source?: string;
  blocks: FigureBlock[];
};

/**
 * The photograph that goes with the LinkedIn post and the social card. No
 * source is stated on it anywhere, so only work that needs no credit is used
 * (public domain, CC0, Pexels); the licence is recorded for the file.
 */
export type PostImage = {
  /** Under /public, e.g. /images/insights/<slug>.jpg */
  src: string;
  alt: string;
  license: string;
};

export const FIGURE_KINDS = ["before-after", "bars", "change", "stats", "flow", "share"] as const;

function fail(where: string, what: string): never {
  throw new Error(`${where}: ${what}`);
}
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const text = (v: unknown, where: string, max: number): string => {
  if (typeof v !== "string" || v.trim() === "") fail(where, "must be a non-empty string");
  if (v.length > max) fail(where, `is longer than ${max} characters`);
  return v;
};
const optText = (v: unknown, where: string, max: number): string | undefined => (v === undefined ? undefined : text(v, where, max));
const num = (v: unknown, where: string): number => {
  if (typeof v !== "number" || !Number.isFinite(v)) fail(where, "must be a finite number");
  return v;
};
const list = (v: unknown, where: string, min: number, max: number): unknown[] => {
  if (!Array.isArray(v) || v.length < min || v.length > max) fail(where, `must be a list of ${min} to ${max} items`);
  return v;
};
const point = (v: unknown, where: string) => {
  if (!isRecord(v)) fail(where, "must be an object");
  return { label: text(v.label, `${where}.label`, 40), value: num(v.value, `${where}.value`) };
};

export function parseFigureBlock(v: unknown, where: string): FigureBlock {
  if (!isRecord(v)) fail(where, "must be an object");
  const label = optText(v.label, `${where}.label`, 60);
  switch (v.kind) {
    case "before-after": {
      const b = { kind: "before-after" as const, label, before: point(v.before, `${where}.before`), after: point(v.after, `${where}.after`), unit: optText(v.unit, `${where}.unit`, 12) };
      if (v.decimals !== undefined) {
        if (!Number.isInteger(v.decimals) || (v.decimals as number) < 0 || (v.decimals as number) > 3) fail(`${where}.decimals`, "must be 0 to 3");
        return { ...b, decimals: v.decimals as number };
      }
      return b;
    }
    case "bars": {
      const items = list(v.items, `${where}.items`, 2, 6).map((it, i) => {
        const p = point(it, `${where}.items[${i}]`);
        if (p.value < 0) fail(`${where}.items[${i}].value`, "bars cannot be negative; use a change block");
        return { ...p, ...(isRecord(it) && it.emphasis === true ? { emphasis: true } : {}) };
      });
      const b = { kind: "bars" as const, label, items, unit: optText(v.unit, `${where}.unit`, 12) };
      if (v.decimals !== undefined) {
        if (!Number.isInteger(v.decimals) || (v.decimals as number) < 0 || (v.decimals as number) > 3) fail(`${where}.decimals`, "must be 0 to 3");
        return { ...b, decimals: v.decimals as number };
      }
      return b;
    }
    case "change": {
      const items = list(v.items, `${where}.items`, 2, 6).map((it, i) => {
        if (!isRecord(it)) fail(`${where}.items[${i}]`, "must be an object");
        return { label: text(it.label, `${where}.items[${i}].label`, 40), change: num(it.change, `${where}.items[${i}].change`) };
      });
      return { kind: "change", label, items };
    }
    case "stats": {
      const items = list(v.items, `${where}.items`, 2, 4).map((it, i) => {
        if (!isRecord(it)) fail(`${where}.items[${i}]`, "must be an object");
        return { value: text(it.value, `${where}.items[${i}].value`, 16), label: text(it.label, `${where}.items[${i}].label`, 60) };
      });
      return { kind: "stats", label, items };
    }
    case "flow": {
      const steps = list(v.steps, `${where}.steps`, 3, 5).map((it, i) => {
        if (!isRecord(it)) fail(`${where}.steps[${i}]`, "must be an object");
        return { label: text(it.label, `${where}.steps[${i}].label`, 40), note: optText(it.note, `${where}.steps[${i}].note`, 60) };
      });
      return { kind: "flow", label, steps };
    }
    case "share": {
      const value = num(v.value, `${where}.value`);
      if (value < 0 || value > 100) fail(`${where}.value`, "must be between 0 and 100");
      return { kind: "share", label, value, text: text(v.text, `${where}.text`, 80) };
    }
    default:
      return fail(`${where}.kind`, `"${String(v.kind)}" is not one of ${FIGURE_KINDS.join(", ")}`);
  }
}

export function parseFigure(v: unknown, where: string): Figure {
  if (!isRecord(v)) fail(where, "must be an object");
  const blocks = list(v.blocks, `${where}.blocks`, 1, 3).map((b, i) => parseFigureBlock(b, `${where}.blocks[${i}]`));
  return {
    title: text(v.title, `${where}.title`, 90),
    caption: optText(v.caption, `${where}.caption`, 240),
    source: optText(v.source, `${where}.source`, 160),
    blocks,
  };
}

export function parseImage(v: unknown, where: string): PostImage {
  if (!isRecord(v)) fail(where, "must be an object");
  const src = text(v.src, `${where}.src`, 200);
  if (!/^\/images\/insights\/[a-z0-9-]+\.(jpg|png|webp)$/.test(src)) fail(`${where}.src`, "must be /images/insights/<slug>.jpg (or .png, .webp)");
  const license = text(v.license, `${where}.license`, 60);
  if (!/^(public domain|cc0|pdm|pexels)/i.test(license.trim())) fail(`${where}.license`, `"${license}" needs a credit or forbids this use; only public domain, CC0 or the Pexels licence qualify`);
  return { src, alt: text(v.alt, `${where}.alt`, 200), license };
}
