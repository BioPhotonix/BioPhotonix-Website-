"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Where the photons converge: a point inside an element, as shares of its box. */
type Focus = { ref: RefObject<HTMLElement | null>; x: number; y: number };

/**
 * A field of photons drifting towards a focal point, drawn on a canvas behind
 * the hero. It is decoration: aria-hidden, paused when off screen, and a
 * single static frame under prefers-reduced-motion.
 *
 * The focal point is measured from the element it belongs to (the device's
 * eyepieces, in the hero), not fixed as a share of the canvas. It used to be
 * fixed at 72% across and 48% down, which is where the device sits on a
 * laptop; on a phone the device is below the text, so the photons gathered on
 * an empty spot in the middle of the copy. It is re-measured as the layout
 * settles and every few frames, so it follows the device wherever the layout
 * puts it. Photons start anywhere in the field, clear of the focal point, and
 * converge on it from all round.
 *
 * The convergence point follows the pointer part of the way, and particles
 * already in flight steer towards it, so the field bends rather than
 * snapping. Mouse and trackpad only.
 */
export default function PhotonField({ className = "", focus }: { className?: string; focus?: Focus }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; warm: boolean };
    const particles: P[] = [];
    const COUNT = 110;

    // Where the beams converge. `home` is the device, measured; `aim` is what
    // the field is actually converging on this frame, and it eases towards the
    // pointer when there is one. The pull is partial on purpose: the light
    // should keep looking like it belongs to the device, not like it is
    // chasing a cursor.
    const PULL = 0.45;
    const measure = () => {
      const el = focus?.ref.current;
      if (el) {
        const c = canvas.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        if (r.width > 0) return { x: r.left - c.left + r.width * focus!.x, y: r.top - c.top + r.height * focus!.y };
      }
      return { x: width * 0.72, y: height * 0.48 };
    };
    let home = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    let aim = home;
    const target = () => (pointer ? { x: home.x + (pointer.x - home.x) * PULL, y: home.y + (pointer.y - home.y) * PULL } : home);
    const focal = () => aim;

    /** A starting point anywhere in the field, but not on top of the focal point. */
    const origin = (f: { x: number; y: number }) => {
      const clear = Math.min(width, height) * 0.3;
      for (let i = 0; i < 12; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        if (Math.hypot(x - f.x, y - f.y) > clear) return { x, y };
      }
      return { x: f.x < width / 2 ? width : 0, y: Math.random() * height };
    };

    const spawn = (p?: P): P => {
      const f = focal();
      const { x, y } = origin(f);
      const dx = f.x - x;
      const dy = f.y - y;
      const d = Math.hypot(dx, dy) || 1;
      const speed = 0.25 + Math.random() * 0.45;
      const out: P = p ?? ({} as P);
      out.x = x;
      out.y = y;
      out.vx = (dx / d) * speed;
      out.vy = (dy / d) * speed;
      out.r = 0.6 + Math.random() * 1.4;
      out.life = 0;
      out.warm = Math.random() < 0.18;
      return out;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      home = measure();
      aim = home;
      particles.length = 0;
      for (let i = 0; i < COUNT; i += 1) {
        const p = spawn();
        // Scatter along the path so the field is full from the first frame.
        const t = Math.random();
        const f = focal();
        p.x += (f.x - p.x) * t;
        p.y += (f.y - p.y) * t;
        p.life = t;
        particles.push(p);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const f = focal();
      for (const p of particles) {
        const dx = f.x - p.x;
        const dy = f.y - p.y;
        const d = Math.hypot(dx, dy);
        const near = Math.max(0, 1 - d / (width * 0.5));
        const alpha = 0.12 + near * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + near * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = p.warm ? `rgba(255,120,90,${alpha})` : `rgba(111,227,234,${alpha})`;
        ctx.fill();
        if (near > 0.35) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 9, p.y - p.vy * 9);
          ctx.strokeStyle = p.warm ? `rgba(255,120,90,${alpha * 0.35})` : `rgba(111,227,234,${alpha * 0.35})`;
          ctx.lineWidth = p.r * 0.8;
          ctx.stroke();
        }
      }
    };

    let frame = 0;
    const step = () => {
      if (!running) return;
      // Follow the device as the layout settles and as it floats.
      frame += 1;
      if (frame % 12 === 0) home = measure();
      const t = target();
      aim = { x: aim.x + (t.x - aim.x) * 0.055, y: aim.y + (t.y - aim.y) * 0.055 };
      const f = focal();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Steer towards wherever the field is converging now, so a particle
        // already in flight curves as the pointer moves instead of holding the
        // heading it was given when it spawned.
        const sx = f.x - p.x;
        const sy = f.y - p.y;
        const sd = Math.hypot(sx, sy) || 1;
        const speed = Math.hypot(p.vx, p.vy) || 0.4;
        p.vx += ((sx / sd) * speed - p.vx) * 0.035;
        p.vy += ((sy / sd) * speed - p.vy) * 0.035;
        // Slight drift, so the beams do not look ruled.
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        if (Math.hypot(f.x - p.x, f.y - p.y) < 18 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) spawn(p);
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    resize();
    draw();
    if (!reduce) raf = requestAnimationFrame(step);
    // The device scales in as the page loads; once it has, measure again and,
    // for the still frame under reduced motion, redraw around where it is.
    const settle = window.setTimeout(() => {
      home = measure();
      if (reduce) {
        resize();
        draw();
      }
    }, 1500);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    // Pointer steering. Mouse and trackpad only: on a touch screen there is no
    // hover, and a pointer that only exists during a tap would make the field
    // lurch. Reduced motion never gets here, since the field is a still frame.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer = x < 0 || y < 0 || x > width || y > height ? null : { x, y };
    };
    const onPointerLeave = () => {
      pointer = null;
    };
    if (!reduce && fine) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    const io = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      if (reduce) return;
      if (visible && !running) {
        running = true;
        raf = requestAnimationFrame(step);
      } else if (!visible && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      running = false;
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the focus is a ref and two constants, read when measured
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />;
}
