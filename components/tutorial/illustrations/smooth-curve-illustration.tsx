"use client";

import { scaleBand, scaleLinear } from "@visx/scale";
import { buildTheoreticalBuckets, gaussianCurve } from "@/maths/sampling";
import { CH2_N, CH2_THEORY_DOT_COUNT } from "../constants/chapter-2-constants";

// P=0.5 so the illustration shows a perfectly centred, symmetric bell.
const P_ILLUS = 0.5;
// Show bins 20–80 (61 bins across the plot) — same band width as the widget at 50% baseline.
const MIN_BIN = 20;
const MAX_BIN = 80;
const cols = Array.from({ length: MAX_BIN - MIN_BIN + 1 }, (_, i) => i + MIN_BIN);

const WIDTH = 500;
const HEIGHT = 240;
const MARGIN = { top: 20, right: 20, bottom: 10, left: 20 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;

const DOT_COLOR = "#16a34a";
const CURVE_COLOR = "#15803d";

// Same dot-count and sizing logic as SamplingRateDistribution.
const allBuckets = buildTheoreticalBuckets({
  n: CH2_N,
  p: P_ILLUS,
  maxBin: 100,
  totalDots: CH2_THEORY_DOT_COUNT,
});
const buckets = cols.map((i) => allBuckets[i] ?? 0);
const maxBucket = Math.max(1, ...buckets);
const maxDotsNominal = Math.floor(PLOT_H / DOT_STEP_NOMINAL);
const dotScale = maxBucket <= maxDotsNominal ? 1 : maxDotsNominal / maxBucket;
const DOT_STEP = DOT_STEP_NOMINAL * dotScale;
const DOT_R = DOT_R_NOMINAL * Math.min(1, Math.max(0.6, dotScale));

export function SmoothCurveIllustration() {
  const xBandScale = scaleBand<number>({ domain: cols, range: [0, PLOT_W] });
  const xCurveScale = scaleLinear<number>({
    domain: [MIN_BIN - 0.5, MAX_BIN + 0.5],
    range: [0, PLOT_W],
  });
  const colX = (col: number) => (xBandScale(col) ?? 0) + xBandScale.bandwidth() / 2;
  const dotCy = (row: number) => PLOT_H - DOT_R - row * DOT_STEP;

  // Place the curve peak above the tallest dot stack with a small gap.
  const peakY = PLOT_H - 2 * DOT_R - (maxBucket - 1) * DOT_STEP - 15;
  const yCurveScale = scaleLinear<number>({ domain: [0, 1], range: [PLOT_H, peakY] });

  // Gaussian curve in percentage units (x: 0–100) aligned with the bin centers.
  const curvePoints = gaussianCurve(P_ILLUS, CH2_N, MIN_BIN, MAX_BIN, 300);
  const pathD = curvePoints
    .map((pt, i) => {
      const px = xCurveScale(pt.x) ?? 0;
      const py = yCurveScale(pt.y) ?? 0;
      return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
    })
    .join(" ");

  const dots: Array<{ key: string; col: number; row: number }> = [];
  for (let idx = 0; idx < cols.length; idx++) {
    const col = cols[idx];
    const count = buckets[idx];
    for (let row = 0; row < count; row++) {
      dots.push({ key: `${col}-${row}`, col, row });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[500px] justify-center">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
        aria-label="A discrete binomial dot distribution with an animated smooth Gaussian curve drawn over it, illustrating how a continuous bell shape approximates the discrete counts."
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {dots.map((d) => (
            <circle
              key={d.key}
              cx={colX(d.col)}
              cy={dotCy(d.row)}
              r={DOT_R}
              fill={DOT_COLOR}
            />
          ))}

          {/* pathLength=1 normalises the path so the animation uses unitless 0–1 dash values. */}
          <path
            d={pathD}
            pathLength={1}
            fill="none"
            stroke={CURVE_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-smooth-curve"
          />
        </g>
      </svg>
    </div>
  );
}
