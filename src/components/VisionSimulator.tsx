"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { vision } from "@/content/site";
import { SCENES, SCENE_PAPER, SCENE_RATIO, type SceneId } from "./vision-scenes";

/**
 * What a patient sees at each stage of dry AMD.
 *
 * The apparatus only: the host page supplies its own heading, the way
 * BurdenChart is used. Stage copy and the clinical reasoning behind the
 * staging live in `vision` in the content file.
 *
 * Every stage layer is rendered and only the active one is opaque, so moving
 * through the stages cross-fades instead of snapping. See the .vs-* block in
 * globals.css for why the loss is built from backdrop-filter rather than
 * paint, and why atrophy is drawn beside the point of fixation and not on it.
 */

/** One class per stage, indexed to `vision.stages`. Healthy has no layer. */
const LOSS = [null, "vs-early", "vs-intermediate", "vs-atrophy", "vs-advanced"] as const;

type Props = {
  /**
   * Heading level for the stage title. It follows whatever heading precedes
   * the simulator on the host page: h3 under a section heading on the home
   * page, h2 where the page heading is the h1 above it.
   */
  titleAs?: "h2" | "h3";
};

export default function VisionSimulator({ titleAs: Title = "h3" }: Props) {
  const [scene, setScene] = useState<SceneId>("reading");
  const [stage, setStage] = useState(0);
  const sliderId = useId();

  const Scene = SCENES[scene];
  const current = vision.stages[stage];
  const sceneMeta = vision.scenes.find((s) => s.id === scene)!;
  const indicated = vision.indicated.stages.includes(current.id);

  return (
    <div>
      {/* Scene */}
      <div role="group" aria-label={vision.sceneLabel} className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1 text-fog/70">{vision.sceneLabel}</span>
        {vision.scenes.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScene(s.id as SceneId)}
            aria-pressed={scene === s.id}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              scene === s.id
                ? "border-teal-400 bg-teal-400/10 text-fog"
                : "border-line text-fog/70 hover:border-line-strong hover:text-fog"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <figure className="mt-5">
        <div
          className="vs-scene rounded-2xl border border-line"
          style={{ aspectRatio: SCENE_RATIO, ["--vs-paper" as string]: SCENE_PAPER[scene] }}
          role="img"
          aria-label={`${sceneMeta.label}, seen with ${current.title.toLowerCase()}.`}
        >
          <Scene />

          {LOSS.map((cls, i) =>
            cls ? <div key={cls} aria-hidden="true" className={`vs-loss ${cls} ${i === stage ? "is-on" : ""}`} /> : null,
          )}

          {/* The simulation is anchored to this point, and the caveat says so. */}
          <div className="vs-fixation" aria-hidden="true">
            <span className="block h-3.5 w-3.5 rounded-full border border-teal-300/70 shadow-[0_0_0_1px_rgba(4,8,10,0.35)]" />
          </div>
        </div>
        <figcaption className="mt-3 text-sm text-fog/70">{sceneMeta.caption}</figcaption>
      </figure>

      {/* Stage */}
      <div className="mt-8">
        <label htmlFor={sliderId} className="eyebrow block text-fog/70">
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
                i === stage ? "text-fog" : "text-fog/70 hover:text-fog/85"
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="mt-6 min-h-[9.5rem]">
        <Title className="h-card text-fog">{current.title}</Title>
        <p className="mt-3 text-fog/75">{current.body}</p>
        {indicated && (
          <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-l-2 border-teal-400 pl-4 text-sm">
            <span className="eyebrow">{vision.indicated.label}</span>
            <span className="text-fog/75">{vision.indicated.body}</span>
          </p>
        )}
      </div>

      <details className="mt-6 text-sm text-fog/70">
        <summary className="cursor-pointer select-none">{vision.caveat.title}</summary>
        <p className="mt-3 max-w-2xl">{vision.caveat.body}</p>
      </details>

      <p className="mt-6">
        <Link href={vision.cta.href} className="link-underline text-base text-fog/85 hover:text-fog">
          {vision.cta.label}
        </Link>
      </p>
    </div>
  );
}
