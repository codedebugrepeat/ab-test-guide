"use client";

import { useMemo } from "react";
import { AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { gaussianCurve, normalCdf, Z_BY_CONFIDENCE, type ConfidenceLevel, type GaussianPoint } from "@/maths/sampling";

type Props = {
  pA: number;
  pB: number;
  n: number;
  confidence: ConfidenceLevel;
};

const WIDTH = 560;
const HEIGHT = 320;
const MARGIN = { top: 80, right: 24, bottom: 50, left: 24 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const A_COLOR = "#16a34a";
const B_COLOR = "#f59e0b";
const FALSE_POS_COLOR = "#dc2626";
const MISSED_COLOR = "#6b7280";
const FILL_OPACITY = 0.22;
const SHADE_OPACITY = 0.5;


function splitCurve(data: GaussianPoint[], cx: number, side: "right" | "left"): GaussianPoint[] {
  const out: GaussianPoint[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const cur = data[i];
    if (side === "right" ? cur.x >= cx : cur.x <= cx) out.push(cur);
    if (i < data.length - 1) {
      const next = data[i + 1];
      if ((cur.x < cx && next.x >= cx) || (cur.x > cx && next.x <= cx)) {
        const t = (cx - cur.x) / (next.x - cur.x);
        out.push({ x: cx, y: cur.y + t * (next.y - cur.y) });
      }
    }
  }
  return out;
}

export type BellsThresholdReadout = {
  meanA: number;
  meanB: number;
  sdA: number;
  sdB: number;
  threshold: number;
  falsePositiveShare: number;
  falseNegativeShare: number;
};

export function computeBellsReadout({ pA, pB, n, confidence }: Props): BellsThresholdReadout {
  const meanA = pA * 100;
  const meanB = pB * 100;
  const sdA = Math.sqrt((pA * (1 - pA)) / n) * 100;
  const sdB = Math.sqrt((pB * (1 - pB)) / n) * 100;
  const z = Z_BY_CONFIDENCE[confidence];
  const threshold = meanA + z * sdA;
  const falsePositiveShare = 1 - confidence;
  const falseNegativeShare = sdB > 0 ? normalCdf((threshold - meanB) / sdB) : 0;
  return { meanA, meanB, sdA, sdB, threshold, falsePositiveShare, falseNegativeShare };
}

export function BellsThresholdChart({ pA, pB, n, confidence }: Props) {
  const readout = useMemo(() => computeBellsReadout({ pA, pB, n, confidence }), [pA, pB, n, confidence]);
  const { meanA, meanB, sdA, sdB, threshold } = readout;

  // Axis padding: enough to show both tails comfortably even when lift is big.
  const pad = 4 * Math.max(sdA, sdB);
  const rawMin = Math.min(meanA, meanB) - pad;
  const rawMax = Math.max(meanA, meanB, threshold) + pad;
  const xMin = Math.max(0, rawMin);
  const xMax = Math.min(100, rawMax);

  const dataA = useMemo(() => gaussianCurve(pA, n, xMin, xMax), [pA, n, xMin, xMax]);
  const dataB = useMemo(() => gaussianCurve(pB, n, xMin, xMax), [pB, n, xMin, xMax]);
  const dataAFalse = useMemo(() => splitCurve(dataA, threshold, "right"), [dataA, threshold]);
  const dataBMissed = useMemo(() => splitCurve(dataB, threshold, "left"), [dataB, threshold]);

  const xScale = scaleLinear<number>({ domain: [xMin, xMax], range: [0, PLOT_W] });
  const yScale = scaleLinear<number>({ domain: [0, 1.12], range: [PLOT_H, 0] });

  const fpLabelX = Math.min(xMax - 0.01 * (xMax - xMin), threshold + 1.0 * sdA);
  const fnLabelX = Math.max(xMin + 0.01 * (xMax - xMin), threshold - 1.0 * sdA);

  const ariaLabel = `Two sampling distributions in conversion-rate units. Control mean ${meanA.toFixed(2)}%, variant mean ${meanB.toFixed(2)}%, n=${n} per variant. Decision threshold at ${threshold.toFixed(2)}% from ${(confidence * 100).toFixed(0)}% one-sided confidence. Red region is A's right tail past the threshold; gray region is B's left tail short of it.`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={ariaLabel}
      className="block h-auto w-full max-w-[560px]"
    >
      <Group left={MARGIN.left} top={MARGIN.top}>
        <AreaClosed data={dataA} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} yScale={yScale} curve={curveMonotoneX} fill={A_COLOR} fillOpacity={FILL_OPACITY} />
        <LinePath data={dataA} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} curve={curveMonotoneX} stroke={A_COLOR} strokeWidth={1.5} />

        <AreaClosed data={dataB} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} yScale={yScale} curve={curveMonotoneX} fill={B_COLOR} fillOpacity={FILL_OPACITY} />
        <LinePath data={dataB} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} curve={curveMonotoneX} stroke={B_COLOR} strokeWidth={1.5} />

        {dataAFalse.length > 1 && (
          <AreaClosed data={dataAFalse} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} yScale={yScale} curve={curveMonotoneX} fill={FALSE_POS_COLOR} fillOpacity={SHADE_OPACITY} />
        )}
        {dataBMissed.length > 1 && (
          <AreaClosed data={dataBMissed} x={(d) => xScale(d.x) ?? 0} y={(d) => yScale(d.y) ?? 0} yScale={yScale} curve={curveMonotoneX} fill={MISSED_COLOR} fillOpacity={SHADE_OPACITY} />
        )}

        {/* Mean markers */}
        <line x1={xScale(meanA)} y1={-6} x2={xScale(meanA)} y2={PLOT_H} stroke={A_COLOR} strokeOpacity={0.85} strokeWidth={1.5} />
        <text x={xScale(meanA)} y={-44} textAnchor="middle" fontSize="10" fontWeight="600" fill={A_COLOR} fillOpacity={0.9}>
          A: {meanA.toFixed(meanA < 10 ? 2 : 1)}%
        </text>
        <line x1={xScale(meanB)} y1={-6} x2={xScale(meanB)} y2={PLOT_H} stroke={B_COLOR} strokeOpacity={0.9} strokeDasharray="6 2" strokeWidth={1.5} />
        <text x={xScale(meanB)} y={-32} textAnchor="middle" fontSize="10" fontWeight="600" fill={B_COLOR} fillOpacity={0.95}>
          B: {meanB.toFixed(meanB < 10 ? 2 : 1)}%
        </text>

        {/* Threshold line */}
        <line x1={xScale(threshold)} y1={-66} x2={xScale(threshold)} y2={PLOT_H} stroke="currentColor" strokeOpacity={0.8} strokeWidth={2} />
        <text x={xScale(threshold)} y={-71} textAnchor="middle" fontSize="10" fontWeight="600" fill="currentColor" fillOpacity={0.55}>
          threshold ({(confidence * 100).toFixed(0)}%)
        </text>

        <text x={xScale(fpLabelX)} y={-18} textAnchor="middle" fontSize="10" fontWeight="700" fill={FALSE_POS_COLOR} fillOpacity={0.9}>
          false positives
        </text>
        <text x={xScale(fnLabelX)} y={-18} textAnchor="middle" fontSize="10" fontWeight="700" fill={MISSED_COLOR} fillOpacity={0.9}>
          false negatives
        </text>

        <AxisBottom
          top={PLOT_H}
          scale={xScale}
          stroke="currentColor"
          axisLineClassName="[stroke-opacity:0.14]"
          hideTicks
          numTicks={6}
          tickFormat={(v) => `${Number(v).toFixed(Number(v) < 10 ? 1 : 0)}%`}
          tickLabelProps={() => ({
            fontSize: 11,
            fontWeight: 500,
            fill: "currentColor",
            fillOpacity: 0.4,
            textAnchor: "middle",
            dy: "0.9em",
          })}
        />
        <text x={PLOT_W / 2} y={PLOT_H + 45} textAnchor="middle" fontSize="10" fontWeight={500} fill="currentColor" fillOpacity={0.4}>
          Conversion rate per {n.toLocaleString()}-visitor sample
        </text>
      </Group>
    </svg>
  );
}
