/**
 * The three things the vision simulator degrades.
 *
 * Every scene sits on a light ground and carries real tonal range, because
 * the loss is produced by a backdrop-filter over the top: blur, contrast and
 * saturation have to have something to take away. A flat or line-drawn scene
 * would barely change, which would understate the disease.
 *
 * Each scene also declares `paper`, the rgb triplet of its own background.
 * The simulator feeds that to `--vs-paper` so the atrophy layers dissolve
 * detail into the scene's own ground rather than darkening it.
 */

import type { JSX } from "react";

export type SceneId = "reading" | "clock" | "grid";

/** Background of each scene, as an "r g b" triplet for rgb(... / <alpha>). */
export const SCENE_PAPER: Record<SceneId, string> = {
  reading: "244 241 234",
  clock: "250 250 250",
  grid: "250 250 250",
};

/** Everything is drawn to this ratio so switching scene never resizes the frame. */
export const SCENE_RATIO = "3 / 2";

/**
 * A page of a book. Sized in cqw so the page keeps the same apparent text
 * size whatever width the frame is given, with a 14px floor because nothing
 * on this site is allowed to render smaller than that.
 */
const BODY = "mt-[2.8%] font-display text-[clamp(0.9rem,1.95cqw,1.45rem)] leading-[1.6]";

function ReadingScene() {
  return (
    <div className="h-full w-full bg-[#f4f1ea] px-[8%] py-[6%] text-[#20242b]">
      <p className="font-display text-[clamp(1rem,2.3cqw,1.7rem)] font-semibold">Chapter four</p>
      <p className={BODY}>
        She had read the same paragraph four times before she admitted that the trouble was not the
        paragraph. The words at the edge of the page were perfectly clear. It was the ones she
        looked at directly that kept going missing, as though someone had lifted them out and left
        the sentence to close quietly over the gap.
      </p>
      <p className={BODY}>
        She moved the lamp nearer, which had helped last winter and did not help now. Then she tried
        the trick her mother had used without ever explaining it, tilting her head a little to one
        side so that the page arrived at an angle, and for a few lines the sentences held together
        again.
      </p>
      <p className={BODY}>
        It was not that the letters were blurred. Blurred she could have managed. They were simply
        not there, and her eye went on insisting, politely and steadily, that nothing was wrong.
      </p>
      <p className={BODY}>
        At the optician&rsquo;s in March they had shown her a chart and she had read most of it, and
        everyone had seemed pleased.
      </p>
    </div>
  );
}

/**
 * A wall clock.
 *
 * Chosen over an eye chart, which was tried first and abandoned: a chart puts
 * its largest letters at the top and its smallest at the bottom, so a scotoma
 * anchored to the centre of the frame takes the middle rows and spares the
 * smallest, which reads backwards. A clock has the opposite geometry. Every
 * piece of information that matters — both hands and the point they turn
 * about — is at the centre, and the numerals a patient can still see are
 * around the outside. Losing the middle of a clock is the difference between
 * seeing it and being able to read it.
 */
const HOURS = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

function ClockScene() {
  const cx = 300;
  const cy = 200;
  // 10:09. The hands sit well apart, so the tips survive outside the scotoma
  // while the centre goes, and the time becomes genuinely ambiguous.
  const hourAngle = (10 + 9 / 60) * 30 - 90;
  const minuteAngle = 9 * 6 - 90;
  const point = (angle: number, r: number) => [
    cx + r * Math.cos((angle * Math.PI) / 180),
    cy + r * Math.sin((angle * Math.PI) / 180),
  ];
  const [hx, hy] = point(hourAngle, 74);
  const [mx, my] = point(minuteAngle, 116);

  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="vs-dial" cx="42%" cy="34%" r="76%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ebebeb" />
        </radialGradient>
      </defs>
      <rect width="600" height="400" fill="#fafafa" />
      <circle cx={cx} cy={cy} r="168" fill="#2c3238" />
      <circle cx={cx} cy={cy} r="158" fill="url(#vs-dial)" />

      {HOURS.map((label, i) => {
        const a = i * 30 - 90;
        const [tx, ty] = point(a, 128);
        const [t1x, t1y] = point(a, 150);
        const [t2x, t2y] = point(a, 142);
        return (
          <g key={label}>
            <line x1={t1x} y1={t1y} x2={t2x} y2={t2y} stroke="#4a5158" strokeWidth="2.5" strokeLinecap="round" />
            <text
              x={tx}
              y={ty}
              fontSize="26"
              fontFamily="var(--font-sans)"
              fontWeight={600}
              fill="#1b2026"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {label}
            </text>
          </g>
        );
      })}

      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#14181d" strokeWidth="11" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#14181d" strokeWidth="7" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="8" fill="#14181d" />
      <circle cx={cx} cy={cy} r="3.4" fill="#fafafa" />
    </svg>
  );
}

function GridScene() {
  // A square 20-by-20 grid centred in the 600x400 frame, so the central dot
  // lands on the same point the loss layers are anchored to.
  const STEP = 18;
  const lines = [];
  for (let i = 0; i <= 20; i += 1) {
    const x = 120 + i * STEP;
    const y = 20 + i * STEP;
    lines.push(<line key={`v${i}`} x1={x} y1={20} x2={x} y2={380} />);
    lines.push(<line key={`h${i}`} x1={120} y1={y} x2={480} y2={y} />);
  }
  return (
    <svg viewBox="0 0 600 400" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <rect width="600" height="400" fill="#fafafa" />
      <g stroke="#1d2126" strokeWidth="1.2">{lines}</g>
      <circle cx="300" cy="200" r="5" fill="#1d2126" />
    </svg>
  );
}

export const SCENES: Record<SceneId, () => JSX.Element> = {
  reading: ReadingScene,
  clock: ClockScene,
  grid: GridScene,
};
