"use client";

import { useEffect, useId, useRef, useState } from "react";
import { vision } from "@/content/site";
import { VisionRenderer, type SceneSource } from "./vision-engine";

/**
 * What a patient sees at each stage of dry AMD.
 *
 * The apparatus only: the host page supplies its own heading, the way
 * BurdenChart is used. Stage copy lives in `vision` in the content file, the
 * stage parameters and every pixel in vision-engine.ts.
 *
 * The lost area follows the pointer. That is the one thing a static picture
 * of AMD cannot convey: a scotoma is on the retina, so it goes wherever the
 * eye goes and cannot be looked around. On touch the frame takes a tap
 * instead of a drag, so the page still scrolls.
 */

type Props = {
  /**
   * Heading level for the stage title. It follows whatever heading precedes
   * the simulator on its host page — currently only /vision, where the page
   * h1 sits above it, so h2. Kept configurable for a host that nests it under
   * a section heading.
   */
  titleAs?: "h2" | "h3";
};

type Scene = (typeof vision.scenes)[number];

const sourceOf = (s: Scene): SceneSource => ("src" in s && s.src ? { kind: "image", src: s.src } : { kind: "amsler" });

export default function VisionSimulator({ titleAs: Title = "h3" }: Props) {
  const [scene, setScene] = useState<Scene["id"]>(vision.scenes[0].id);
  const [stage, setStage] = useState(0);
  const sliderId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<VisionRenderer | null>(null);

  const current = vision.stages[stage];
  const sceneMeta = vision.scenes.find((s) => s.id === scene)!;
  const indicated = vision.indicated.stages.includes(current.id);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const r = new VisionRenderer(el);
    renderer.current = r;
    r.resize();
    const ro = new ResizeObserver(() => r.resize());
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => r.setVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
      r.destroy();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    renderer.current?.setScene(sourceOf(sceneMeta));
  }, [sceneMeta]);

  useEffect(() => {
    renderer.current?.setStage(stage);
  }, [stage]);

  return (
    <div>
      {/* Scene */}
      <div role="group" aria-label={vision.sceneLabel} className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1 text-fog">{vision.sceneLabel}</span>
        {vision.scenes.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScene(s.id)}
            aria-pressed={scene === s.id}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              scene === s.id
                ? "border-teal-400 bg-teal-400/10 text-fog"
                : "border-line text-fog hover:border-line-strong hover:text-fog"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <figure className="mt-5">
        <div
          className="vs-frame aspect-[3/2] rounded-2xl border border-line"
          onPointerMove={(e) => {
            if (e.pointerType === "touch") return;
            renderer.current?.setPointer({ x: e.clientX, y: e.clientY });
          }}
          onPointerDown={(e) => {
            if (e.pointerType !== "touch") return;
            renderer.current?.setPointer({ x: e.clientX, y: e.clientY });
          }}
          onPointerLeave={() => renderer.current?.setPointer(null)}
        >
          <canvas ref={canvasRef} role="img" aria-label={`${sceneMeta.label}, seen with ${current.title.toLowerCase()}.`} />
        </div>
        <figcaption className="mt-3 text-sm text-fog">{sceneMeta.caption}</figcaption>
      </figure>

      <p className="mt-3 text-sm text-fog">{vision.hint}</p>

      {/* Stage */}
      <div className="mt-8">
        <label htmlFor={sliderId} className="eyebrow block text-fog">
          {vision.stageLabel}
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={vision.stages.length - 1}
          step={1}
          value={stage}
          onChange={(e) => setStage(Number(e.target.value))}
          aria-valuetext={current.title}
          className="mt-3 w-full"
        />
        <div className="mt-2 flex justify-between gap-1">
          {vision.stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStage(i)}
              aria-label={`Show ${s.title}`}
              className={`figure rounded px-1 py-0.5 text-xs transition ${
                i === stage ? "text-fog" : "text-fog hover:text-fog"
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="mt-6 min-h-[9.5rem]">
        <Title className="h-card text-fog">{current.title}</Title>
        <p className="mt-3 text-fog">{current.body}</p>
        {indicated && (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-teal-400 pl-4 text-sm">
            <span className="eyebrow">{vision.indicated.label}</span>
            <span className="text-fog">{vision.indicated.body}</span>
          </p>
        )}
      </div>

      <details className="mt-6 text-sm text-fog">
        <summary className="cursor-pointer select-none">{vision.caveat.title}</summary>
        <p className="mt-3 max-w-2xl">{vision.caveat.body}</p>
      </details>
    </div>
  );
}
