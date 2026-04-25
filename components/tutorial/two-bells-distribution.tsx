"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { binomialPMF } from "@/maths/sampling";
import { CH2_N } from "./chapter-2-constants";

type Props = {
  pA: number;
  pB: number;
  maxBin: number;
};

const WIDTH = 560;
const HEIGHT = 320;
const MARGIN = { top: 44, right: 20, bottom: 50, left: 46 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const A_COLOR = "#16a34a";
const B_COLOR = "#f59e0b";
const FILL_OPACITY = 0.35;

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

type Datum = { x: number; y: number };

function toData(pmf: number[]): Datum[] {
  return pmf.map((y, x) => ({ x, y }));
}

// Keep only the range where either distribution has non-negligible mass.
// Pads two zero-valued points on each side (clamped to array bounds) so the
// curve ramps to baseline rather than starting/ending at a non-zero value.
function trimSupport(a: number[], b: number[]): { lo: number; hi: number } {
  const threshold = 1e-6;
  const n = a.length;
  let lo = n - 1;
  let hi = 0;
  for (let i = 0; i < n; i++) {
    if ((a[i] ?? 0) > threshold || (b[i] ?? 0) > threshold) {
      if (i < lo) lo = i;
      if (i > hi) hi = i;
    }
  }
  return { lo: Math.max(0, lo - 2), hi: Math.min(n - 1, hi + 2) };
}

export function TwoBellsDistribution({ pA, pB, maxBin }: Props) {
  const xTicksBase = buildTickValues(maxBin, 10);

  const pmfA = binomialPMF(CH2_N, pA, maxBin);
  const pmfB = binomialPMF(CH2_N, pB, maxBin);

  const { lo, hi } = trimSupport(pmfA, pmfB);

  // Normalize each curve to peak = 1 so both bells reach the same height.
  // The goal is purely didactic: the reader should focus on horizontal distance,
  // not subtle peak-height differences caused by different p values.
  const peakA = Math.max(1e-6, ...pmfA);
  const peakB = Math.max(1e-6, ...pmfB);
  const dataA: Datum[] = toData(pmfA.slice(lo, hi + 1)).map((d, i) => ({ x: lo + i, y: d.y / peakA }));
  const dataB: Datum[] = toData(pmfB.slice(lo, hi + 1)).map((d, i) => ({ x: lo + i, y: d.y / peakB }));

  const maxY = 1;

  const xValueScale = scaleLinear<number>({
    domain: [-0.5, maxBin + 0.5],
    range: [0, PLOT_W],
  });
  const yScale = scaleLinear<number>({
    domain: [0, maxY * 1.12],
    range: [PLOT_H, 0],
  });

  const baselinePct = pA * 100;
  const liftedPct = pB * 100;
  const xTicks = xTicksBase;

  const gapPts = (liftedPct - baselinePct).toFixed(1);

  return (
    <div className="flex w-full max-w-[560px] flex-col items-center gap-2">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Two sampling distributions on a shared axis. Control at ${baselinePct.toFixed(1)}% (solid marker), variant at ${liftedPct.toFixed(1)}% (dashed marker), N=${CH2_N}.`}
        className="block h-auto w-full"
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          <AxisLeft
            scale={yScale}
            numTicks={4}
            stroke="currentColor"
            axisLineClassName="[stroke-opacity:0.14]"
            tickStroke="currentColor"
            tickClassName="[stroke-opacity:0.25]"
            tickLength={4}
            tickFormat={() => ""}
            label="relative likelihood"
            labelOffset={14}
            labelProps={{ ...axisLabelProps, textAnchor: "middle" }}
          />

          <AxisBottom
            top={PLOT_H}
            scale={xValueScale}
            stroke="currentColor"
            axisLineClassName="[stroke-opacity:0.14]"
            hideTicks
            tickValues={xTicks}
            tickFormat={(v) => `${v}%`}
            tickLabelProps={() => ({
              fontSize: 11,
              fontWeight: 500,
              fill: "currentColor",
              fillOpacity: 0.4,
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

          {/* A (control) filled silhouette */}
          <AreaClosed<Datum>
            data={dataA}
            x={(d) => xValueScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={A_COLOR}
            fillOpacity={FILL_OPACITY}
          />
          <LinePath<Datum>
            data={dataA}
            x={(d) => xValueScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            curve={curveMonotoneX}
            stroke={A_COLOR}
            strokeWidth={1.5}
          />

          {/* B (variant) filled silhouette */}
          <AreaClosed<Datum>
            data={dataB}
            x={(d) => xValueScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={B_COLOR}
            fillOpacity={FILL_OPACITY}
          />
          <LinePath<Datum>
            data={dataB}
            x={(d) => xValueScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            curve={curveMonotoneX}
            stroke={B_COLOR}
            strokeWidth={1.5}
          />

          {/* Control (A) solid mean marker */}
          <line
            x1={xValueScale(baselinePct)}
            y1={-6}
            x2={xValueScale(baselinePct)}
            y2={PLOT_H}
            stroke={A_COLOR}
            strokeOpacity={0.85}
            strokeWidth={1.5}
          />
          <text
            x={xValueScale(baselinePct)}
            y={-24}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill={A_COLOR}
            fillOpacity={0.9}
          >
            A: {baselinePct.toFixed(0)}%
          </text>

          {/* Variant (B) dashed mean marker */}
          <line
            x1={xValueScale(liftedPct)}
            y1={-6}
            x2={xValueScale(liftedPct)}
            y2={PLOT_H}
            stroke={B_COLOR}
            strokeOpacity={0.9}
            strokeDasharray="6 2"
            strokeWidth={1.5}
          />
          <text
            x={xValueScale(liftedPct)}
            y={-12}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill={B_COLOR}
            fillOpacity={0.95}
          >
            B: {liftedPct.toFixed(1)}%
          </text>
        </Group>
      </svg>

      <div className="text-[11px] text-foreground/45 tabular-nums">
        Theoretical shapes. Gap between means: {gapPts} pts.
      </div>
    </div>
  );
}
