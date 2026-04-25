"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { CH2_AXIS_MAX, CH2_LIFT, CH2_N } from "../constants/chapter-2-constants";

type Props = {
  buckets: number[];
  baseline: number;
};

const WIDTH = 560;
const HEIGHT = 320;
const MARGIN = { top: 44, right: 20, bottom: 50, left: 46 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;
const MAX_BIN = Math.round(CH2_AXIS_MAX * 100);

const axisLabelProps = {
  fill: "currentColor",
  fillOpacity: 0.35,
  fontSize: 10,
  fontWeight: 500,
};

function buildTickValues(maxBin: number, interval: number) {
  const ticks: number[] = [];
  for (let v = 0; v <= maxBin; v += interval) ticks.push(v);
  if (ticks[ticks.length - 1] !== maxBin) ticks.push(maxBin);
  return ticks;
}

export function SamplingRateDistribution({ buckets, baseline }: Props) {
  const cols = Array.from({ length: MAX_BIN + 1 }, (_, i) => i);
  const xTicksBase = buildTickValues(MAX_BIN, 10);
  const bucketCounts = cols.map((_, i) => Math.max(0, Math.floor(buckets[i] ?? 0)));

  const maxBucket = Math.max(1, ...bucketCounts);
  const maxDotsNominal = Math.floor(PLOT_H / DOT_STEP_NOMINAL);
  const scale = maxBucket <= maxDotsNominal ? 1 : maxDotsNominal / maxBucket;
  const step = DOT_STEP_NOMINAL * scale;
  const dotR = DOT_R_NOMINAL * Math.min(1, Math.max(0.6, scale));

  const xScale = scaleBand<number>({ domain: cols, range: [0, PLOT_W] });
  const xValueScale = scaleLinear<number>({
    domain: [-0.5, MAX_BIN + 0.5],
    range: [0, PLOT_W],
  });
  const yScale = scaleLinear<number>({ domain: [0, maxBucket], range: [PLOT_H, 0] });
  const colX = (col: number) => (xScale(col) ?? 0) + xScale.bandwidth() / 2;
  const dotCy = (row: number) => PLOT_H - dotR - row * step;

  const tickInterval =
    maxBucket <= 5 ? 1 : maxBucket <= 20 ? 5 : maxBucket <= 50 ? 10 : maxBucket <= 100 ? 25 : 50;
  const yTicks = Array.from(
    { length: Math.floor(maxBucket / tickInterval) + 1 },
    (_, i) => i * tickInterval,
  );

  const baselinePct = baseline * 100;
  const lifted = Math.min(CH2_AXIS_MAX, baseline * (1 + CH2_LIFT));
  const liftedPct = lifted * 100;
  const baselineBin = Math.round(baselinePct);
  const xTicks = [...new Set([...xTicksBase, baselineBin])].sort((a, b) => a - b);
  const liftLabel = `+${(CH2_LIFT * 100).toFixed(0)}% lift: ${liftedPct.toFixed(1)}%`;

  const dots: Array<{ key: string; col: number; row: number }> = [];
  for (const col of cols) {
    const count = bucketCounts[col] ?? 0;
    for (let row = 0; row < count; row += 1) {
      dots.push({ key: `${col}-${row}`, col, row });
    }
  }

  return (
    <div className="flex w-full max-w-[560px] flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Theoretical sampling distribution at ${baselinePct.toFixed(1)}% baseline (N=${CH2_N}), with a ${liftLabel} marker.`}
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
            label="relative likelihood"
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
            tickValues={xTicks}
            tickFormat={(v) => `${v}%`}
            tickLabelProps={(col) => ({
              fontSize: 11,
              fontWeight: col === baselineBin ? 600 : 500,
              fill: "currentColor",
              fillOpacity: col === baselineBin ? 0.7 : 0.4,
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
            Conversion rate per 100-visitor sample
          </text>

          {/* Baseline average line */}
          <line
            x1={xValueScale(baselinePct)}
            y1={-6}
            x2={xValueScale(baselinePct)}
            y2={PLOT_H}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeDasharray="3 3"
            strokeWidth={1}
          />
          <text
            x={xValueScale(baselinePct)}
            y={-24}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            fillOpacity={0.55}
          >
            average: {baselinePct.toFixed(0)}%
          </text>

          {/* Lift marker line */}
          <line
            x1={xValueScale(liftedPct)}
            y1={-6}
            x2={xValueScale(liftedPct)}
            y2={PLOT_H}
            stroke="currentColor"
            strokeOpacity={0.75}
            strokeDasharray="6 2"
            strokeWidth={1.5}
            className="text-blue-500 dark:text-blue-400"
          />
          <text
            x={xValueScale(liftedPct)}
            y={-12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            fillOpacity={0.8}
            className="text-blue-500 dark:text-blue-400"
          >
            {liftLabel}
          </text>

          {/* Stacked dots */}
          {dots.map((d) => (
            <circle
              key={d.key}
              cx={colX(d.col)}
              cy={dotCy(d.row)}
              r={dotR}
              fill="#16a34a"
            />
          ))}
        </Group>
      </svg>

      <div className="text-[11px] text-foreground/45 tabular-nums">
        Theoretical shape (not a random draw).
      </div>
    </div>
  );
}
