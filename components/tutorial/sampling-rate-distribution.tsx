"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { binomialSD } from "@/maths/sampling";
import { CH2_AXIS_MAX, CH2_LIFT, CH2_N } from "./chapter-2-constants";

type Props = {
  rates: number[];
  baseline: number;
};

const WIDTH = 560;
const HEIGHT = 320;
const MARGIN = { top: 44, right: 20, bottom: 50, left: 46 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;
const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;
const PLACEHOLDER_ROWS = 3;
const MAX_BIN = Math.round(CH2_AXIS_MAX * 100); // 35

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

export function SamplingRateDistribution({ rates, baseline }: Props) {
  const cols = Array.from({ length: MAX_BIN + 1 }, (_, i) => i);
  const xTicks = buildTickValues(MAX_BIN, 10);
  const buckets = cols.map(() => 0);
  for (const r of rates) {
    const bin = Math.min(MAX_BIN, Math.max(0, Math.round(r * 100)));
    buckets[bin] += 1;
  }

  const maxBucket = Math.max(1, ...buckets);
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

  const sd = binomialSD(CH2_N, baseline) / CH2_N;
  const loFrac = Math.max(0, baseline - 2 * sd);
  const hiFrac = Math.min(CH2_AXIS_MAX, baseline + 2 * sd);
  const loBin = Math.round(loFrac * 100);
  const hiBin = Math.round(hiFrac * 100);

  const bandLeft = xScale(loBin) ?? 0;
  const bandRight = (xScale(hiBin) ?? 0) + xScale.bandwidth();

  const baselinePct = baseline * 100;
  const lifted = Math.min(CH2_AXIS_MAX, baseline * (1 + CH2_LIFT));
  const liftedPct = lifted * 100;
  const baselineBin = Math.round(baselinePct);
  const liftLabel = `+${(CH2_LIFT * 100).toFixed(0)}% lift: ${liftedPct.toFixed(1)}%`;

  const columnCounters = cols.map(() => 0);
  const dots = rates.flatMap((r, idx) => {
    const bin = Math.min(MAX_BIN, Math.max(0, Math.round(r * 100)));
    return [{ key: idx, col: bin, row: columnCounters[bin]++ }];
  });

  return (
    <div className="flex w-full max-w-[560px] flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Sampling rate distribution of ${rates.length} draws at ${baselinePct.toFixed(1)}% baseline, with a ${liftLabel} marker, ranging from ${(loFrac * 100).toFixed(0)}% to ${(hiFrac * 100).toFixed(0)}%.`}
        className="block h-auto w-full"
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* ±2σ band */}
          <rect
            x={bandLeft}
            y={0}
            width={Math.max(0, bandRight - bandLeft)}
            height={PLOT_H}
            fill="currentColor"
            fillOpacity={0.05}
          />
          <text
            x={bandRight - 4}
            y={8}
            textAnchor="end"
            fontSize="9"
            fontWeight={500}
            fill="currentColor"
            fillOpacity={0.3}
          >
            typical range
          </text>

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
            Observed conversion rate per sample
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
            y={-12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            fillOpacity={0.55}
          >
            average: {baselinePct.toFixed(1)}%
          </text>

          {/* Lift marker line */}
          <line
            x1={xValueScale(liftedPct)}
            y1={-6}
            x2={xValueScale(liftedPct)}
            y2={PLOT_H}
            stroke="#16a34a"
            strokeOpacity={0.75}
            strokeDasharray="6 2"
            strokeWidth={1.5}
          />
          <text
            x={xValueScale(liftedPct)}
            y={-24}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="#16a34a"
            fillOpacity={0.8}
          >
            {liftLabel}
          </text>

          {/* Placeholder slots */}
          {cols.map((col) =>
            Array.from({ length: PLACEHOLDER_ROWS }, (_, k) => {
              const cy = dotCy(buckets[col] + k);
              if (cy < 0) return null;
              return (
                <circle
                  key={`ph-${col}-${k}`}
                  cx={colX(col)}
                  cy={cy}
                  r={dotR}
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
              r={dotR}
              fill="#16a34a"
              className="animate-dot-drop"
              style={{ transformBox: "fill-box" as const }}
            />
          ))}
        </Group>
      </svg>

      <div className="text-[11px] text-foreground/45 tabular-nums">
        {rates.length === 0
          ? "Draw samples to begin."
          : `${rates.length} sample${rates.length !== 1 ? "s" : ""} drawn`}
      </div>
    </div>
  );
}
