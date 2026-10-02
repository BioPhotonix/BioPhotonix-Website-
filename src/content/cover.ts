/**
 * A cover drawn for one insight alone, kept as data in insights.json and
 * drawn by PostArt.
 *
 * Every insight has a cover no other article has had (Adail, 1 and 2 October
 * 2026: "Every post should have a different dynamic image, without repeating
 * or recycling previous ones"). The six fixed insight designs in PostArt ran
 * out in two weeks, and each new one meant a change to this code, so a cover
 * now travels with its article instead: a small list of shapes in the site's
 * palette, each with the way it arrives and whether it keeps moving. The
 * automation writes it; nothing it writes reaches the page as markup.
 *
 * The rules are in ./cover-rules.mjs, shared with scripts/add-insight.mjs.
 */
import { coverProblems, shapeD as pathOf, TONES as tones } from "./cover-rules.mjs";

export type Tone = "ink" | "teal" | "red" | "pale" | "glow";
export const TONES: Record<Tone, string> = tones;

type Paint = {
  stroke?: Tone;
  fill?: Tone;
  /** Stroke width; 1.5 when not given. */
  sw?: number;
  /** Stroke, fill and overall opacity. */
  so?: number;
  fo?: number;
  o?: number;
  dash?: string;
  cap?: "round" | "square" | "butt";
  /** draw: the stroke traces itself in; pop: the shape scales into place; pulse: it keeps breathing. */
  fx?: ("draw" | "pop" | "pulse")[];
  /** Seconds after the card arrives. */
  delay?: number;
};

export type CoverShape =
  | (Paint & { t: "line"; x1: number; y1: number; x2: number; y2: number })
  | (Paint & { t: "circle"; cx: number; cy: number; r: number })
  | (Paint & { t: "ellipse"; cx: number; cy: number; rx: number; ry: number })
  | (Paint & { t: "rect"; x: number; y: number; w: number; h: number; rx?: number })
  | (Paint & { t: "path"; d: string });

export type Cover = {
  /** Never used by another article. */
  name: string;
  /** What the drawing shows and why it fits the article. Not shown: the cover is decoration to a screen reader. */
  about: string;
  shapes: CoverShape[];
};

/** A checked cover, or the build fails here naming the entry and the first thing wrong. */
export function parseCover(v: unknown, where: string): Cover {
  const problems: string[] = coverProblems(v);
  if (problems.length) {
    throw new Error(`insights.json, ${where}: ${problems[0]}${problems.length > 1 ? ` (and ${problems.length - 1} more)` : ""}`);
  }
  return v as Cover;
}

/** Any shape as path data, starting where the browser starts it, for the shapes that trace themselves in. */
export const shapeD: (s: CoverShape) => string = pathOf;
