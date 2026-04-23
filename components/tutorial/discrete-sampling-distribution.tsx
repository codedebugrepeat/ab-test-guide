"use client";

import { N, P } from "./sampling-constants";
import { WJAR_W } from "./jar-illustration";
import { binomialMean } from "@/maths/sampling";

type Props = { counts: number[] };

const WIDTH = WJAR_W;
const HEIGHT = 320;
const PAD_L = 42;
const PAD_R = 18;
const PAD_TOP = 40;
const PAD_BOTTOM = 46;
const PLOT_W = WIDTH - PAD_L - PAD_R;
const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM;
const COL_COUNT = N + 1;
const COL_W = PLOT_W / COL_COUNT;

const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;
const PLACEHOLDER_ROWS = 3;

function yTicks(maxBucket: number, step: number): number[] {
  const interval =
    maxBucket <= 5 ? 1 :
    maxBucket <= 20 ? 5 :
    maxBucket <= 50 ? 10 :
    maxBucket <= 100 ? 25 : 50;
  const ticks: number[] = [];
  for (let v = 0; v <= maxBucket; v += interval) {
    const y = HEIGHT - PAD_BOTTOM - v * step;
    if (y >= PAD_TOP) ticks.push(v);
  }
  return ticks;
}

export function DiscreteSamplingDistribution({ counts }: Props) {
  const buckets = Array.from({ length: COL_COUNT }, () => 0);
  for (const c of counts) {
    if (c >= 0 && c < COL_COUNT) buckets[c] += 1;
  }

  const maxBucket = Math.max(1, ...buckets);
  const maxDotsNominal = Math.floor(PLOT_H / DOT_STEP_NOMINAL);
  const scale = maxBucket <= maxDotsNominal ? 1 : maxDotsNominal / maxBucket;
  const step = DOT_STEP_NOMINAL * scale;
  const r = DOT_R_NOMINAL * Math.min(1, Math.max(0.6, scale));
  const ticks = yTicks(maxBucket, step);

  const colX = (col: number) => PAD_L + COL_W * (col + 0.5);
  const dotY = (row: number) => HEIGHT - PAD_BOTTOM - r - row * step;

  const trueMean = binomialMean(N, P);

  // Keyed by insertion index so each dot mounts once — animation fires only on arrival.
  const columnCounters = Array.from({ length: COL_COUNT }, () => 0);
  const dots: { key: number; col: number; row: number }[] = [];
  counts.forEach((c, idx) => {
    if (c >= 0 && c < COL_COUNT) {
      const row = columnCounters[c]++;
      dots.push({ key: idx, col: c, row });
    }
  });

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Discrete sampling distribution of ${counts.length} draws across green-marble counts 0 to ${N}.`}
        className="block h-auto w-full"
      >
        {/* Baseline */}
        <line
          x1={PAD_L}
          y1={HEIGHT - PAD_BOTTOM}
          x2={WIDTH - PAD_R}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="currentColor"
          strokeOpacity={0.14}
          strokeWidth={1}
        />

        {/* Y-axis line */}
        <line
          x1={PAD_L}
          y1={PAD_TOP}
          x2={PAD_L}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="currentColor"
          strokeOpacity={0.14}
          strokeWidth={1}
        />

        {/* Y-axis ticks and labels */}
        {ticks.map((v) => {
          const y = HEIGHT - PAD_BOTTOM - v * step;
          return (
            <g key={`ytick-${v}`}>
              <line
                x1={PAD_L - 4}
                y1={y}
                x2={PAD_L}
                y2={y}
                stroke="currentColor"
                strokeOpacity={0.25}
                strokeWidth={1}
              />
              <text
                x={PAD_L - 7}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight={500}
                fill="currentColor"
                fillOpacity={0.35}
              >
                {v}
              </text>
            </g>
          );
        })}

        {/* Y-axis label */}
        <text
          x={9}
          y={HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight={500}
          fill="currentColor"
          fillOpacity={0.35}
          transform={`rotate(-90, 9, ${HEIGHT / 2})`}
        >
          times drawn
        </text>

        {/* True-mean marker */}
        <line
          x1={colX(trueMean)}
          y1={PAD_TOP - 6}
          x2={colX(trueMean)}
          y2={HEIGHT - PAD_BOTTOM}
          stroke="currentColor"
          strokeOpacity={0.3}
          strokeDasharray="3 3"
          strokeWidth={1}
        />
        <text
          x={colX(trueMean)}
          y={PAD_TOP - 12}
          textAnchor="middle"
          fontSize="10"
          fontWeight="600"
          fill="currentColor"
          fillOpacity={0.55}
        >
          true rate: {Math.round(P * 100)}% → {trueMean} per {N}
        </text>

        {/* Dashed placeholder slots above each column's current stack */}
        {Array.from({ length: COL_COUNT }, (_, col) => {
          const startRow = buckets[col];
          return Array.from({ length: PLACEHOLDER_ROWS }, (_, k) => {
            const row = startRow + k;
            const y = dotY(row);
            if (y < PAD_TOP) return null;
            return (
              <circle
                key={`ph-${col}-${k}`}
                cx={colX(col)}
                cy={y}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.12 - k * 0.03}
                strokeDasharray="2 2"
                strokeWidth={1}
              />
            );
          });
        })}

        {/* Drawn samples as stacked dots */}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={colX(d.col)}
            cy={dotY(d.row)}
            r={r}
            fill="#16a34a"
            className="animate-dot-drop"
            style={{ transformBox: "fill-box" as const }}
          />
        ))}

        {/* X-axis labels */}
        {Array.from({ length: COL_COUNT }, (_, col) => (
          <text
            key={`xlab-${col}`}
            x={colX(col)}
            y={HEIGHT - PAD_BOTTOM + 16}
            textAnchor="middle"
            fontSize="11"
            fontWeight={col === trueMean ? 600 : 500}
            fill="currentColor"
            fillOpacity={col === trueMean ? 0.7 : 0.4}
          >
            {col}
          </text>
        ))}
        <text
          x={WIDTH / 2}
          y={HEIGHT - 8}
          textAnchor="middle"
          fontSize="10"
          fontWeight={500}
          fill="currentColor"
          fillOpacity={0.4}
        >
          green marbles per sample of {N}
        </text>
      </svg>

      <div className="text-[11px] text-foreground/45 tabular-nums">
        {counts.length === 0
          ? "Draw a sample to begin."
          : `${counts.length} sample${counts.length !== 1 ? "s" : ""} drawn`}
      </div>
    </div>
  );
}
