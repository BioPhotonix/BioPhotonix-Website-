"use client";

import { useEffect, useRef, useState } from "react";
import PORTRAITS from "@/content/portraits.json";
import { burden } from "@/content/site";

/**
 * How many people AMD reaches, drawn as people.
 *
 * It opens on one older person's face. The view then widens, and every step
 * out shows more faces, until the frame holds hundreds. Then the
 * crowd turns grey, and a dark patch spreads over the middle of the picture
 * with the message inside it: the central scotoma of advanced dry AMD, laid
 * over the people the disease is growing among.
 *
 * Drawn on a canvas rather than as a grid of images, so that each face is
 * drawn at the size it is shown: the opening close-up from a 1200px
 * photograph, the crowd from a sheet of 256px tiles, both sharp at every step
 * of a zoom that runs from one face filling the frame to faces under 40px.
 * The width shrinks geometrically, so the zoom reads as steady rather than
 * fast-then-slow.
 *
 * Neighbouring faces fade in over the first fifth of the zoom, so it really
 * does start with one person. There are 56 different people, the same face
 * never appears twice within two places of itself, and the opening face does
 * not reappear near the centre.
 *
 * It plays once, when half of it is on screen, and offers a replay. Under
 * reduced motion it shows the finished picture. The photographs only load as
 * the figure nears the screen.
 */

/* About twelve seconds end to end. The grey and scotoma stages match the
   transitions on .crowd-canvas and .crowd-scotoma in globals.css. */
const T = { hold: 1000, zoom: 7000, rest: 500, grey: 1600, scotoma: 2000 } as const;
type Stage = "idle" | "zoom" | "grey" | "scotoma" | "done";

const { cols, tile, ids } = PORTRAITS;
const COUNT = ids.length;

/**
 * Which face sits at each grid position, decided once and fixed.
 *
 * The 48 places round the opening face all get different people: those
 * rings are what the eye is on as the view first widens, and the same face
 * either side of the first one reads as a copy at once. Further out, each
 * face differs from every face within two places of it, so no one repeats
 * near themselves, and the opening face is kept out of the inner rings.
 */
const SPAN = 61;
const HALF = (SPAN - 1) / 2;
const GRID = (() => {
  let seed = 20261118;
  const next = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
  const g: number[][] = Array.from({ length: SPAN }, () => Array(SPAN).fill(-1));
  const ring = (r: number, c: number) => Math.max(Math.abs(r - HALF), Math.abs(c - HALF));

  // The inner seven-by-seven, centre excepted: distinct faces, never the opening one.
  const pool = Array.from({ length: COUNT - 1 }, (_, i) => i + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const k = Math.floor(next() * (i + 1));
    [pool[i], pool[k]] = [pool[k], pool[i]];
  }
  for (let r = HALF - 3; r <= HALF + 3; r++)
    for (let c = HALF - 3; c <= HALF + 3; c++) g[r][c] = r === HALF && c === HALF ? 0 : pool.pop()!;

  // Everywhere else: differ from every face already placed within two places.
  for (let r = 0; r < SPAN; r++) {
    for (let c = 0; c < SPAN; c++) {
      if (g[r][c] >= 0) continue;
      const avoid = new Set<number>();
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
        const v = g[r + dr]?.[c + dc];
        if (v !== undefined && v >= 0) avoid.add(v);
      }
      let pick = 0;
      for (let tries = 0; tries < 200; tries++) {
        pick = Math.floor(next() * COUNT);
        if (!avoid.has(pick) && !(pick === 0 && ring(r, c) <= 6)) break;
      }
      g[r][c] = pick;
    }
  }
  return g;
})();
const faceAt = (i: number, j: number) =>
  GRID[(((j + HALF) % SPAN) + SPAN) % SPAN][(((i + HALF) % SPAN) + SPAN) % SPAN];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2);

export default function PortraitCrowd() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<{ sheet: HTMLImageElement; centre: HTMLImageElement } | null>(null);
  const progress = useRef(0);
  const timers = useRef<number[]>([]);
  const raf = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  const [size, setSize] = useState({ w: 0, h: 0 });
  /* Read after mount, so the server and the first client render agree. */
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  /** Draw the crowd at zoom progress p, from 0 (one face) to 1 (the crowd). */
  const draw = (p: number) => {
    const canvas = canvasRef.current;
    const img = imgs.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#080f12";
    ctx.fillRect(0, 0, W, H);
    ctx.imageSmoothingQuality = "high";

    const short = Math.min(W, H);
    const start = short * 0.9;
    /* About twice as many faces at the end as a cell of short / 13 gave:
       the cell is 1 / sqrt(2) the width, so twice as many fit. */
    const end = Math.max(18, Math.min(37, short / 18.4));
    const cell = start * (end / start) ** easeInOut(p);
    const gap = cell * 0.06;
    const others = smooth(0.02, 0.22, p);
    const reachX = Math.ceil(W / 2 / cell) + 1;
    const reachY = Math.ceil(H / 2 / cell) + 1;

    for (let j = -reachY; j <= reachY; j++) {
      for (let i = -reachX; i <= reachX; i++) {
        const x = W / 2 + i * cell - cell / 2 + gap / 2;
        const y = H / 2 + j * cell - cell / 2 + gap / 2;
        const s = cell - gap;
        if (x > W || y > H || x + s < 0 || y + s < 0) continue;
        if (i === 0 && j === 0) {
          ctx.globalAlpha = 1;
          ctx.drawImage(img.centre, x, y, s, s);
          continue;
        }
        if (others <= 0) continue;
        const k = faceAt(i, j);
        ctx.globalAlpha = others;
        ctx.drawImage(img.sheet, (k % cols) * tile, Math.floor(k / cols) * tile, tile, tile, x, y, s, s);
      }
    }
    ctx.globalAlpha = 1;
  };

  // Load the photographs once the figure is near the screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || imgs.current) return;
        io.disconnect();
        const load = (src: string) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const im = new Image();
            im.onload = () => resolve(im);
            im.onerror = reject;
            im.src = src;
          });
        Promise.all([load("/images/portraits/sheet.webp"), load("/images/portraits/centre.webp")])
          .then(([sheet, centre]) => {
            imgs.current = { sheet, centre };
            setLoaded(true);
          })
          .catch(() => {});
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Start when half of it is on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Keep the canvas's backing store matched to its box.
  useEffect(() => {
    const el = frameRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      setSize({ w: r.width, h: r.height });
      draw(progress.current);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draw only reads refs
  }, []);

  useEffect(() => {
    if (loaded) draw(progress.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- draw only reads refs
  }, [loaded]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    cancelAnimationFrame(raf.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progress.current = 1;
      draw(1);
      setStage("done");
      return;
    }
    progress.current = 0;
    draw(0);
    setStage("zoom");
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0 - T.hold) / T.zoom));
      progress.current = p;
      draw(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    const grey = T.hold + T.zoom + T.rest;
    timers.current = [
      window.setTimeout(() => setStage("grey"), grey),
      window.setTimeout(() => setStage("scotoma"), grey + T.grey),
      window.setTimeout(() => setStage("done"), grey + T.grey + T.scotoma),
    ];
  };

  useEffect(() => {
    if (loaded && visible && stage === "idle") play();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play only reads refs
  }, [loaded, visible, stage]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      cancelAnimationFrame(raf.current);
    },
    [],
  );

  const greyed = stage === "grey" || stage === "scotoma" || stage === "done";
  const patch = stage === "scotoma" || stage === "done";
  /* The patch's opaque core is about 60% of its width; the message is kept
     inside that, so no letter sits over a face. Wider than the frame is
     tall: only the soft edge is cut off, and the dark centre covers most of
     the picture's height. */
  const diameter = Math.min(size.w, size.h) * 1.2;

  return (
    <figure className="rounded-2xl border border-line bg-ink-900 p-6 md:p-8">
      <figcaption>
        <h3 className="font-display text-2xl font-semibold text-fog md:text-3xl">{burden.crowd.title}</h3>
        <p className="mt-2 text-base text-fog-dim md:text-lg">{burden.crowd.caption}</p>
      </figcaption>

      <div className="relative mt-6">
        <div
          ref={frameRef}
          role="img"
          aria-label={burden.crowd.label}
          className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-950 sm:aspect-[16/10] lg:aspect-[2/1]"
        >
          <canvas ref={canvasRef} className="crowd-canvas absolute inset-0 h-full w-full" data-grey={greyed} />
          <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
            <div className="crowd-scotoma" data-on={patch} style={{ width: diameter, height: diameter }} />
            <span
              className="crowd-message absolute text-balance text-center font-display text-2xl leading-snug text-fog sm:text-3xl md:text-4xl"
              data-on={patch}
              style={{ maxWidth: diameter * 0.56 }}
            >
              {burden.crowd.message}
            </span>
          </div>
        </div>
        {/* Nothing to replay when the finished picture is all there is. */}
        {stage === "done" && !reduced && (
          <button
            type="button"
            onClick={play}
            className="absolute bottom-3 right-3 rounded-full border border-line-strong bg-ink-950/80 px-3.5 py-1.5 text-xs text-fog backdrop-blur transition hover:border-teal-400"
          >
            Replay
          </button>
        )}
      </div>

      <p className="mt-5 text-xs text-fog">Source: {burden.crowd.source}</p>
    </figure>
  );
}
