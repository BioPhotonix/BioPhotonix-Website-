/**
 * The vision simulator's renderer.
 *
 * Everything is drawn to one canvas. The first version of this simulator used
 * CSS backdrop-filters over live DOM, which could blur and desaturate but
 * could not bend a straight line, could not give the lost area a ragged edge,
 * and could not move without re-running the filters on every frame. Dry AMD
 * is metamorphopsia, a scotoma that travels with the eye, and a surround that
 * loses colour before it loses detail. This renders all three.
 *
 * How it stays fast: the expensive work (warping, blurring and desaturating
 * the whole scene, and drawing the ragged scotoma) is done once per stage, at
 * half resolution because it is blurred anyway, and cached. Each frame then
 * composites four cheap layers: the clean scene, the affected scene through a
 * soft radial mask at the point of fixation, a grey haze, and the scotoma.
 * Moving the fixation point, which follows the pointer, only moves the mask
 * and the blob, so following a mouse at 60fps costs a few drawImage calls.
 *
 * Nothing here depends on CSS filters, SVG filter caching or backdrop-filter
 * support; the pixel loops behave identically in every browser.
 */

export type Stage = {
  id: string;
  /** Radius of the affected surround, as a fraction of frame width. */
  region: number;
  /** Peak displacement of the metamorphopsia warp, fraction of width. */
  warp: number;
  /** Blur radius over the affected surround, fraction of width. */
  blur: number;
  saturate: number;
  brightness: number;
  /** Opacity and diameter (fraction of width) of the grey haze. */
  haze: number;
  hazeSize: number;
  /** Opacity and diameter (fraction of width) of the dark scotoma. */
  core: number;
  coreSize: number;
  /** How ragged the scotoma's edge is, 0 to 1. */
  rough: number;
};

/**
 * Indexed to `vision.stages` in the content file. The numbers were tuned by
 * looking at the result against the simulations the Macular Society and the
 * US National Eye Institute publish, not derived from anything measurable.
 */
export const STAGES: Stage[] = [
  { id: "healthy", region: 0, warp: 0, blur: 0, saturate: 1, brightness: 1, haze: 0, hazeSize: 0, core: 0, coreSize: 0, rough: 0 },
  { id: "early", region: 0.27, warp: 0.007, blur: 0.0012, saturate: 0.84, brightness: 0.97, haze: 0.16, hazeSize: 0.3, core: 0, coreSize: 0, rough: 0 },
  { id: "intermediate", region: 0.35, warp: 0.016, blur: 0.003, saturate: 0.6, brightness: 0.9, haze: 0.42, hazeSize: 0.42, core: 0.42, coreSize: 0.15, rough: 0.9 },
  { id: "atrophy", region: 0.41, warp: 0.022, blur: 0.0042, saturate: 0.45, brightness: 0.84, haze: 0.5, hazeSize: 0.5, core: 0.9, coreSize: 0.27, rough: 1 },
  { id: "advanced", region: 0.48, warp: 0.028, blur: 0.006, saturate: 0.35, brightness: 0.78, haze: 0.55, hazeSize: 0.62, core: 0.97, coreSize: 0.44, rough: 0.75 },
];

export type SceneSource = { kind: "image"; src: string } | { kind: "amsler" };

/** Per-scene scaling of the stage parameters. */
type SceneTuning = { warp: number; blur: number };
const TUNING: Record<SceneSource["kind"], SceneTuning> = {
  image: { warp: 1, blur: 1 },
  // The grid exists to show distortion: bend it more, smear it less.
  amsler: { warp: 1.35, blur: 0.4 },
};

type Cached = { affected: HTMLCanvasElement; blob: HTMLCanvasElement | null };

const MAX_WIDTH = 1600;
const SCOTOMA_RGB = "26, 24, 22";
const HAZE_RGB = "150, 146, 140";

/** Deterministic PRNG, so a stage looks the same on every visit. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Smooth value noise on a lattice. Returns a sampler over lattice
 * coordinates; callers divide pixel coordinates by their cell size.
 */
function makeNoise(seed: number, size = 64) {
  const rand = mulberry32(seed);
  const lattice = new Float32Array(size * size);
  for (let i = 0; i < lattice.length; i += 1) lattice[i] = rand();
  const at = (x: number, y: number) => lattice[((y % size) + size) % size * size + (((x % size) + size) % size)];
  return (x: number, y: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    let fx = x - x0;
    let fy = y - y0;
    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);
    const a = at(x0, y0);
    const b = at(x0 + 1, y0);
    const c = at(x0, y0 + 1);
    const d = at(x0 + 1, y0 + 1);
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  };
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

function ctx2d(c: HTMLCanvasElement, readback = false) {
  const ctx = readback ? c.getContext("2d", { willReadFrequently: true }) : c.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  return ctx;
}

/** Whether this browser honours CanvasRenderingContext2D.filter. */
function supportsCanvasFilter(ctx: CanvasRenderingContext2D) {
  if (typeof ctx.filter !== "string") return false;
  ctx.filter = "blur(1px)";
  const ok = ctx.filter === "blur(1px)";
  ctx.filter = "none";
  return ok;
}

/**
 * Draws `src` into a fresh canvas of `w` x `h`, blurred by `radius` pixels.
 * Uses the canvas filter where the browser has it, and otherwise approximates
 * a Gaussian by scaling the image down and back up twice, which is what
 * bilinear resampling does for free.
 */
function blurred(src: HTMLCanvasElement, w: number, h: number, radius: number) {
  const out = canvas(w, h);
  const octx = ctx2d(out);
  octx.imageSmoothingQuality = "high";
  if (radius < 0.5) {
    octx.drawImage(src, 0, 0, w, h);
    return out;
  }
  if (supportsCanvasFilter(octx)) {
    octx.filter = `blur(${radius}px)`;
    octx.drawImage(src, 0, 0, w, h);
    octx.filter = "none";
    return out;
  }
  const factor = Math.max(1.5, radius / 1.2);
  let cur: HTMLCanvasElement = src;
  for (let pass = 0; pass < 2; pass += 1) {
    const small = canvas(Math.max(8, w / factor), Math.max(8, h / factor));
    const sctx = ctx2d(small);
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(cur, 0, 0, small.width, small.height);
    cur = small;
  }
  octx.drawImage(cur, 0, 0, w, h);
  return out;
}

export class VisionRenderer {
  private el: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private W = 0;
  private H = 0;
  private scale = 1;
  private base: HTMLCanvasElement | null = null;
  private sceneKey = "";
  private source: SceneSource | null = null;
  private image: HTMLImageElement | null = null;
  private stage = 0;
  private cache = new Map<string, Cached>();
  private tmp: HTMLCanvasElement | null = null;
  private lesion = { x: 0.5, y: 0.5 };
  /** Where the lesion was last drawn, so sub-pixel drift does not redraw. */
  private drawn = { x: -1, y: -1 };
  private pointer: { x: number; y: number } | null = null;
  private previous: { frame: HTMLCanvasElement; at: number } | null = null;
  private raf = 0;
  private running = false;
  private visible = true;
  private dirty = true;
  private idle = 0;
  private readonly reduce: boolean;
  private lastTick = 0;
  private clock = 0;
  private disposed = false;

  constructor(el: HTMLCanvasElement) {
    this.el = el;
    this.ctx = ctx2d(el);
    this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Fit the backing store to the element. Rebuilds everything on a change. */
  resize() {
    const rect = this.el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.min(MAX_WIDTH, Math.round(rect.width * dpr));
    const H = Math.round((W * rect.height) / rect.width);
    if (W === this.W && H === this.H) return;
    this.W = W;
    this.H = H;
    this.scale = W / rect.width;
    this.el.width = W;
    this.el.height = H;
    this.tmp = canvas(W, H);
    this.cache.clear();
    this.buildBase();
    this.invalidate();
  }

  setScene(source: SceneSource) {
    const key = source.kind === "image" ? source.src : "amsler";
    if (key === this.sceneKey) return;
    this.sceneKey = key;
    this.source = source;
    this.cache.clear();
    this.base = null;
    this.image = null;
    if (source.kind === "image") {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (this.disposed || this.sceneKey !== key) return;
        this.image = img;
        this.buildBase();
        this.invalidate();
      };
      img.src = source.src;
    } else {
      this.buildBase();
      this.invalidate();
    }
  }

  setStage(index: number) {
    if (index === this.stage) return;
    // Keep the outgoing frame so the change cross-fades instead of snapping.
    if (!this.reduce && this.base) {
      const frame = canvas(this.W, this.H);
      ctx2d(frame).drawImage(this.el, 0, 0);
      this.previous = { frame, at: performance.now() };
    }
    this.stage = index;
    this.invalidate();
  }

  /** Pointer position in element coordinates, or null when it has left. */
  setPointer(p: { x: number; y: number } | null) {
    if (!p) {
      this.pointer = null;
      return;
    }
    const rect = this.el.getBoundingClientRect();
    this.pointer = {
      x: Math.min(1, Math.max(0, (p.x - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (p.y - rect.top) / rect.height)),
    };
    if (this.reduce) {
      // No easing under reduced motion: the area goes straight to the pointer.
      this.lesion = { ...this.pointer };
      this.invalidate();
    }
    this.wake();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
    else this.sleep();
  }

  start() {
    this.wake();
  }

  destroy() {
    this.disposed = true;
    this.sleep();
    if (this.idle) {
      if (window.cancelIdleCallback) window.cancelIdleCallback(this.idle);
      else clearTimeout(this.idle);
    }
    this.cache.clear();
  }

  // --- internals ---------------------------------------------------------

  private invalidate() {
    this.dirty = true;
    this.wake();
  }

  private wake() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.lastTick = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private sleep() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private tick = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, (now - this.lastTick) / 1000);
    this.lastTick = now;
    this.clock += dt;

    let moved = false;
    if (!this.reduce) {
      // Where the eye is: the pointer if there is one, otherwise a slow
      // wander about the centre, because a real eye is never still.
      const target = this.pointer ?? {
        x: 0.5 + 0.035 * Math.sin(this.clock * 0.37),
        y: 0.5 + 0.03 * Math.sin(this.clock * 0.53 + 1.3),
      };
      const k = this.pointer ? 1 - Math.pow(0.001, dt) : 1 - Math.pow(0.05, dt);
      this.lesion = {
        x: this.lesion.x + (target.x - this.lesion.x) * k,
        y: this.lesion.y + (target.y - this.lesion.y) * k,
      };
      // Redraw only once the lesion has travelled half a pixel: the wander
      // is slow enough that most frames would otherwise repaint for nothing.
      moved = Math.hypot((this.lesion.x - this.drawn.x) * this.W, (this.lesion.y - this.drawn.y) * this.H) > 0.5;
    }

    const fading = this.previous !== null;
    if (this.dirty || moved || fading) this.draw(now);

    // Keep ticking while the visitor can see it and motion is allowed: the
    // wander never settles, and each frame is a handful of drawImage calls.
    // Reduced motion draws on demand only.
    if (this.visible && !this.reduce) {
      this.raf = requestAnimationFrame(this.tick);
    } else {
      this.running = false;
    }
  };

  private buildBase() {
    if (!this.W || !this.source) return;
    const { W, H } = this;
    const base = canvas(W, H);
    const bctx = ctx2d(base);
    if (this.source.kind === "amsler") {
      bctx.fillStyle = "#fafafa";
      bctx.fillRect(0, 0, W, H);
      const size = H * 0.84;
      const step = size / 20;
      const x0 = (W - size) / 2;
      const y0 = (H - size) / 2;
      bctx.strokeStyle = "#1d2126";
      bctx.lineWidth = Math.max(1, W / 1100);
      bctx.beginPath();
      for (let i = 0; i <= 20; i += 1) {
        const p = i * step;
        bctx.moveTo(x0 + p, y0);
        bctx.lineTo(x0 + p, y0 + size);
        bctx.moveTo(x0, y0 + p);
        bctx.lineTo(x0 + size, y0 + p);
      }
      bctx.stroke();
    } else {
      if (!this.image) return;
      const img = this.image;
      const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      bctx.imageSmoothingQuality = "high";
      bctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }
    this.base = base;
    this.cache.clear();
    this.scheduleWarmup();
  }

  /**
   * Build the other stages while the visitor is looking at this one, one
   * stage per idle slot so the work never lands in a single long frame.
   */
  private scheduleWarmup() {
    const key = this.sceneKey;
    const width = this.W;
    let next = 1;
    const run = () => {
      if (this.disposed || !this.base || this.sceneKey !== key || this.W !== width) return;
      this.cached(next);
      next += 1;
      if (next < STAGES.length) schedule();
    };
    const schedule = () => {
      const ric = window.requestIdleCallback;
      this.idle = ric ? ric(run, { timeout: 1500 }) : window.setTimeout(run, 250);
    };
    schedule();
  }

  private cached(stageIndex: number): Cached | null {
    const stage = STAGES[stageIndex];
    if (!this.base || stageIndex === 0) return null;
    const key = `${this.sceneKey}:${stage.id}:${this.W}`;
    const hit = this.cache.get(key);
    if (hit) return hit;
    const built = { affected: this.buildAffected(stage), blob: this.buildBlob(stage) };
    this.cache.set(key, built);
    return built;
  }

  /**
   * The scene as the affected retina sees it: warped by a smooth noise field
   * (metamorphopsia), drained of colour and light, then blurred. Computed at
   * half resolution, which the blur hides completely.
   */
  private buildAffected(stage: Stage) {
    const base = this.base!;
    const { W, H } = this;
    const hw = Math.max(320, Math.round(W / 2));
    const hh = Math.round((hw * H) / W);
    const half = canvas(hw, hh);
    const hctx = ctx2d(half, true);
    hctx.imageSmoothingQuality = "high";
    hctx.drawImage(base, 0, 0, hw, hh);

    const src = hctx.getImageData(0, 0, hw, hh);
    const out = hctx.createImageData(hw, hh);
    const s = src.data;
    const d = out.data;
    const tune = TUNING[this.source?.kind ?? "image"];
    const amp = stage.warp * tune.warp * hw;
    // Long, gentle waves: metamorphopsia bends lines, it does not shred them.
    const cell = Math.max(24, hw / 7);
    const nx = makeNoise(11);
    const ny = makeNoise(23);
    const sat = stage.saturate;
    const bright = stage.brightness;

    for (let y = 0; y < hh; y += 1) {
      for (let x = 0; x < hw; x += 1) {
        const u = x / cell;
        const v = y / cell;
        const sx = Math.min(hw - 1.001, Math.max(0, x + (nx(u, v) - 0.5) * 2 * amp));
        const sy = Math.min(hh - 1.001, Math.max(0, y + (ny(u, v) - 0.5) * 2 * amp));
        const x0 = sx | 0;
        const y0 = sy | 0;
        const fx = sx - x0;
        const fy = sy - y0;
        const i00 = (y0 * hw + x0) * 4;
        const i10 = i00 + 4;
        const i01 = i00 + hw * 4;
        const i11 = i01 + 4;
        const o = (y * hw + x) * 4;
        for (let c = 0; c < 3; c += 1) {
          const top = s[i00 + c] + (s[i10 + c] - s[i00 + c]) * fx;
          const bottom = s[i01 + c] + (s[i11 + c] - s[i01 + c]) * fx;
          d[o + c] = top + (bottom - top) * fy;
        }
        const l = 0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2];
        d[o] = (l + (d[o] - l) * sat) * bright;
        d[o + 1] = (l + (d[o + 1] - l) * sat) * bright;
        d[o + 2] = (l + (d[o + 2] - l) * sat) * bright;
        d[o + 3] = 255;
      }
    }
    hctx.putImageData(out, 0, 0);
    return blurred(half, W, H, stage.blur * tune.blur * W);
  }

  /**
   * The scotoma: a dark patch whose edge is pushed in and out by noise so it
   * is lobed and ragged rather than a disc, then softened.
   */
  private buildBlob(stage: Stage) {
    if (stage.core <= 0 || stage.coreSize <= 0) return null;
    const R = (stage.coreSize * this.W) / 2;
    const size = Math.round(R * 2 * 1.5);
    const c = canvas(size, size);
    const cctx = ctx2d(c, true);
    const img = cctx.createImageData(size, size);
    const d = img.data;
    const noise = makeNoise(41);
    const cell = Math.max(6, R * 0.55);
    const amp = stage.rough * 0.34;
    const half = size / 2;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const dx = x - half;
        const dy = y - half;
        const r = Math.hypot(dx, dy) / R;
        const n = (noise(x / cell, y / cell) - 0.5) * 2 * amp;
        let a = 1 - smoothstep(0.5 + n, 1.02 + n, r);
        a *= 1 - 0.1 * Math.min(1, r);
        const o = (y * size + x) * 4;
        d[o] = 26;
        d[o + 1] = 24;
        d[o + 2] = 22;
        d[o + 3] = Math.round(a * 255 * stage.core);
      }
    }
    cctx.putImageData(img, 0, 0);
    return blurred(c, size, size, Math.max(1.5, size * 0.012));
  }

  private draw(now: number) {
    const { ctx, W, H } = this;
    if (!this.base || !this.tmp) return;
    const stage = STAGES[this.stage];
    const lx = this.lesion.x * W;
    const ly = this.lesion.y * H;

    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(this.base, 0, 0);
    this.drawn = { ...this.lesion };

    if (this.source?.kind === "amsler") {
      // The fixation dot a patient is asked to hold: it sits wherever the eye
      // is, which here is wherever the pointer is.
      ctx.fillStyle = "#1d2126";
      ctx.beginPath();
      ctx.arc(lx, ly, (H * 0.84) / 20 * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.stage > 0) {
      const built = this.cached(this.stage);
      if (built) {
        // The affected surround, through a soft circular window at fixation.
        const t = ctx2d(this.tmp);
        t.globalCompositeOperation = "source-over";
        t.clearRect(0, 0, W, H);
        t.drawImage(built.affected, 0, 0);
        t.globalCompositeOperation = "destination-in";
        const window_ = t.createRadialGradient(lx, ly, 0, lx, ly, stage.region * W);
        window_.addColorStop(0, "rgba(0,0,0,1)");
        window_.addColorStop(0.55, "rgba(0,0,0,1)");
        window_.addColorStop(1, "rgba(0,0,0,0)");
        t.fillStyle = window_;
        t.fillRect(0, 0, W, H);
        t.globalCompositeOperation = "source-over";
        ctx.drawImage(this.tmp, 0, 0);

        if (stage.haze > 0) {
          const haze = ctx.createRadialGradient(lx, ly, 0, lx, ly, (stage.hazeSize * W) / 2);
          haze.addColorStop(0, `rgba(${HAZE_RGB}, ${stage.haze})`);
          haze.addColorStop(0.6, `rgba(${HAZE_RGB}, ${stage.haze * 0.55})`);
          haze.addColorStop(1, `rgba(${HAZE_RGB}, 0)`);
          ctx.fillStyle = haze;
          ctx.fillRect(0, 0, W, H);
        }
        if (built.blob) {
          const b = built.blob;
          ctx.drawImage(b, lx - b.width / 2, ly - b.height / 2);
        }
      }
    }

    // Where the eye is looking.
    ctx.beginPath();
    ctx.arc(lx, ly, 6 * this.scale, 0, Math.PI * 2);
    ctx.lineWidth = 1.5 * this.scale;
    ctx.strokeStyle = "rgba(111, 227, 234, 0.9)";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(lx, ly, 6 * this.scale, 0, Math.PI * 2);
    ctx.lineWidth = 3.5 * this.scale;
    ctx.strokeStyle = `rgba(${SCOTOMA_RGB}, 0.35)`;
    ctx.stroke();

    // Cross-fade from the previous stage.
    if (this.previous) {
      const k = Math.min(1, (now - this.previous.at) / 380);
      ctx.globalAlpha = 1 - k;
      ctx.drawImage(this.previous.frame, 0, 0);
      ctx.globalAlpha = 1;
      if (k >= 1) this.previous = null;
    }
    this.dirty = false;
  }
}
