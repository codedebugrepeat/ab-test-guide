"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { N, P } from "./sampling-constants";
import { WJAR_W } from "./jar-illustration";
import { binomialMean } from "@/maths/sampling";

type Props = { counts: number[] };

const WIDTH = WJAR_W;
const HEIGHT = 320;
const MARGIN = { top: 40, right: 18, bottom: 46, left: 42 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;
const PLACEHOLDER_ROWS = 3;

const axisLabelProps = {
  fill: "currentColor",
  fillOpacity: 0.35,
  fontSize: 10,
  fontWeight: 500,
};

export function DiscreteSamplingDistribution({ counts }: Props) {
  const cols = Array.from({ length: N + 1 }, (_, i) => i);
  const buckets = cols.map(() => 0);
  for (const c of counts) if (c >= 0 && c <= N) buckets[c] += 1;

  const maxBucket = Math.max(1, ...buckets);
  const maxDotsNominal = Math.floor(PLOT_H / DOT_STEP_NOMINAL);
  const scale = maxBucket <= maxDotsNominal ? 1 : maxDotsNominal / maxBucket;
  const step = DOT_STEP_NOMINAL * scale;
  const r = DOT_R_NOMINAL * Math.min(1, Math.max(0.6, scale));

  const xScale = scaleBand<number>({ domain: cols, range: [0, PLOT_W] });
  const yScale = scaleLinear<number>({ domain: [0, maxBucket], range: [PLOT_H, 0] });
  const colX = (col: number) => (xScale(col) ?? 0) + xScale.bandwidth() / 2;
  const dotCy = (row: number) => PLOT_H - r - row * step;

  const tickInterval =
    maxBucket <= 5 ? 1 : maxBucket <= 20 ? 5 : maxBucket <= 50 ? 10 : maxBucket <= 100 ? 25 : 50;
  const yTicks = Array.from(
    { length: Math.floor(maxBucket / tickInterval) + 1 },
    (_, i) => i * tickInterval,
  );

  const trueMean = binomialMean(N, P);

  // Keyed by insertion index so each dot mounts once — animation fires only on arrival.
  const columnCounters = cols.map(() => 0);
  const dots = counts.flatMap((c, idx) =>
    c >= 0 && c <= N ? [{ key: idx, col: c, row: columnCounters[c]++ }] : [],
  );

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Discrete sampling distribution of ${counts.length} draws across green-marble counts 0 to ${N}.`}
        className="block h-auto w-full"
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          <AxisLeft
            scale={yScale}
            tickValues={yTicks}
            stroke="currentColor"
            axisLineClassName="[stroke-opacity:0.14]"
            tickStroke="currentColor"
            tickClassName="[stroke-opacity:0.25]"
            tickLength={4}
            label="times drawn"
            labelOffset={24}
            labelProps={{ ...axisLabelProps, textAnchor: "middle" }}
            tickLabelProps={() => ({
              ...axisLabelProps,
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.32em",
            })}
          />

          <AxisBottom
            top={PLOT_H}
            scale={xScale}
            stroke="currentColor"
            axisLineClassName="[stroke-opacity:0.14]"
            hideTicks
            tickFormat={(v) => String(v)}
            tickLabelProps={(col) => ({
              fontSize: 11,
              fontWeight: col === trueMean ? 600 : 500,
              fill: "currentColor",
              fillOpacity: col === trueMean ? 0.7 : 0.4,
              textAnchor: "middle",
              dy: "0.9em",
            })}
          />
          <text
            x={PLOT_W / 2}
            y={PLOT_H + 45}
            textAnchor="middle"
            fontSize="10"
            fontWeight={500}
            fill="currentColor"
            fillOpacity={0.4}
          >
            Number of green marbles per sample
          </text>

          {/* True-mean marker */}
          <line
            x1={colX(trueMean)}
            y1={-6}
            x2={colX(trueMean)}
            y2={PLOT_H}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <text
            x={colX(trueMean)}
            y={-12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            fillOpacity={0.55}
          >
            true rate: {Math.round(P * 100)}% → {trueMean} per {N}
          </text>

          {/* Dashed placeholder slots above each column's current stack */}
          {cols.map((col) =>
            Array.from({ length: PLACEHOLDER_ROWS }, (_, k) => {
              const cy = dotCy(buckets[col] + k);
              if (cy < 0) return null;
              return (
                <circle
                  key={`ph-${col}-${k}`}
                  cx={colX(col)}
                  cy={cy}
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.12 - k * 0.03}
                  strokeDasharray="2 2"
                  strokeWidth={1}
                />
              );
            }),
          )}

          {/* Drawn samples as stacked dots */}
          {dots.map((d) => (
            <circle
              key={d.key}
              cx={colX(d.col)}
              cy={dotCy(d.row)}
              r={r}
              fill="#16a34a"
              className="animate-dot-drop"
              style={{ transformBox: "fill-box" as const }}
            />
          ))}
        </Group>
      </svg>

      <div className="text-[11px] text-foreground/45 tabular-nums">
        {counts.length === 0
          ? "Draw a sample to begin."
          : `${counts.length} sample${counts.length !== 1 ? "s" : ""} drawn`}
      </div>
    </div>
  );
}
