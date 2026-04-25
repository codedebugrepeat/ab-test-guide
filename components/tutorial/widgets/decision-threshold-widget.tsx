"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import type { GaussianPoint } from "@/maths/sampling";
import { CH2_DEBOUNCE_MS } from "../constants/chapter-2-constants";

const CONFIDENCE_STEPS = [0.8, 0.9, 0.95, 0.99] as const;
const DEFAULT_CONFIDENCE_INDEX = 2;

const Z_BY_CONFIDENCE: Record<number, number> = {
  0.8: 0.8416,
  0.9: 1.2816,
  0.95: 1.6449,
  0.99: 2.3263,
};

// Abstract normalized units — no real percentages, pure shape.
// 2.5 SD separation gives clear visual gap while keeping meaningful missed-win region.
const A_MEAN = -1.25;
const B_MEAN = 1.25;
const SD = 1.0;
const X_MIN = -5.0;
const X_MAX = 5.0;

const WIDTH = 560;
const HEIGHT = 300;
const MARGIN = { top: 72, right: 24, bottom: 16, left: 24 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const A_COLOR = "#16a34a";
const B_COLOR = "#f59e0b";
const FALSE_POS_COLOR = "#dc2626";
const MISSED_COLOR = "#6b7280";
const FILL_OPACITY = 0.22;
const SHADE_OPACITY = 0.52;

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax));
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function bellCurve(mean: number, sd: number, steps = 300): GaussianPoint[] {
  return Array.from({ length: steps }, (_, i) => {
    const x = X_MIN + (i / (steps - 1)) * (X_MAX - X_MIN);
    const z = (x - mean) / sd;
    return { x, y: Math.exp(-0.5 * z * z) };
  });
}

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

type Datum = GaussianPoint;

const xScale = scaleLinear<number>({ domain: [X_MIN, X_MAX], range: [0, PLOT_W] });
const yScale = scaleLinear<number>({ domain: [0, 1.12], range: [PLOT_H, 0] });

export function DecisionThresholdWidget() {
  const [confidenceIndex, setConfidenceIndex] = useState(DEFAULT_CONFIDENCE_INDEX);
  const [liveText, setLiveText] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const confidence = CONFIDENCE_STEPS[confidenceIndex];
  const z = Z_BY_CONFIDENCE[confidence];
  const criticalX = A_MEAN + z * SD;

  const falsePositiveShare = 1 - confidence;
  const missedWinShare = normalCdf((criticalX - B_MEAN) / SD);

  const dataA = useMemo(() => bellCurve(A_MEAN, SD), []);
  const dataB = useMemo(() => bellCurve(B_MEAN, SD), []);
  const dataAFalse = useMemo(() => splitCurve(dataA, criticalX, "right"), [dataA, criticalX]);
  const dataBMissed = useMemo(() => splitCurve(dataB, criticalX, "left"), [dataB, criticalX]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLiveText(
        `Confidence ${(confidence * 100).toFixed(0)}%. False positives: ${(falsePositiveShare * 100).toFixed(1)}% of control. Missed wins: ${(missedWinShare * 100).toFixed(0)}% of variant.`,
      );
    }, CH2_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [confidence, falsePositiveShare, missedWinShare]);

  // Region label x positions: ±1 SD from the threshold, capped to chart bounds.
  const fpLabelX = Math.min(X_MAX - 0.6, criticalX + 1.0);
  const fnLabelX = Math.max(X_MIN + 0.6, criticalX - 1.0);

  const ariaLabel = `Two sampling distributions. Left bell is control (A), right bell is variant (B). A threshold line marks the decision boundary. The red region in A's right tail shows false positives. The gray region in B's left tail shows false negatives.`;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[560px] items-center gap-4">
        <label
          htmlFor="confidence-slider"
          className="shrink-0 text-sm font-medium text-foreground/70"
        >
          Confidence:
        </label>
        <input
          id="confidence-slider"
          type="range"
          min={0}
          max={CONFIDENCE_STEPS.length - 1}
          step={1}
          value={confidenceIndex}
          onChange={(e) => setConfidenceIndex(Number(e.target.value))}
          aria-valuetext={`${(confidence * 100).toFixed(0)}%`}
          className="flex-1"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">
          {(confidence * 100).toFixed(0)}%
        </span>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
        className="block h-auto w-full max-w-[560px]"
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* A bell */}
          <AreaClosed<Datum>
            data={dataA}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={A_COLOR}
            fillOpacity={FILL_OPACITY}
          />
          <LinePath<Datum>
            data={dataA}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            curve={curveMonotoneX}
            stroke={A_COLOR}
            strokeWidth={1.5}
          />

          {/* B bell */}
          <AreaClosed<Datum>
            data={dataB}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={B_COLOR}
            fillOpacity={FILL_OPACITY}
          />
          <LinePath<Datum>
            data={dataB}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            curve={curveMonotoneX}
            stroke={B_COLOR}
            strokeWidth={1.5}
          />

          {/* False-positive shading: A right of threshold */}
          {dataAFalse.length > 1 && (
            <AreaClosed<Datum>
              data={dataAFalse}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y) ?? 0}
              yScale={yScale}
              curve={curveMonotoneX}
              fill={FALSE_POS_COLOR}
              fillOpacity={SHADE_OPACITY}
            />
          )}

          {/* Missed-win (false negative) shading: B left of threshold */}
          {dataBMissed.length > 1 && (
            <AreaClosed<Datum>
              data={dataBMissed}
              x={(d) => xScale(d.x) ?? 0}
              y={(d) => yScale(d.y) ?? 0}
              yScale={yScale}
              curve={curveMonotoneX}
              fill={MISSED_COLOR}
              fillOpacity={SHADE_OPACITY}
            />
          )}

          {/* Threshold line */}
          <line
            x1={xScale(criticalX)}
            y1={-52}
            x2={xScale(criticalX)}
            y2={PLOT_H}
            stroke="currentColor"
            strokeOpacity={0.8}
            strokeWidth={2}
          />
          <text
            x={xScale(criticalX)}
            y={-57}
            textAnchor="middle"
            fontSize="10"
            fontWeight="600"
            fill="currentColor"
            fillOpacity={0.5}
          >
            threshold
          </text>

          {/* False positives label */}
          <text
            x={xScale(fpLabelX)}
            y={-28}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={FALSE_POS_COLOR}
            fillOpacity={0.9}
          >
            false positives
          </text>

          {/* False negatives label */}
          <text
            x={xScale(fnLabelX)}
            y={-28}
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={MISSED_COLOR}
            fillOpacity={0.9}
          >
            false negatives
          </text>

          {/* Faint baseline */}
          <line
            x1={0}
            y1={PLOT_H}
            x2={PLOT_W}
            y2={PLOT_H}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        </Group>
      </svg>

      <p className="max-w-[520px] text-center text-sm text-foreground/60">
        Pull the threshold left: more of B&apos;s real improvements get called as wins, but A&apos;s
        noise slips through more often. Push it right: A&apos;s noise gets filtered out, but real
        improvements in B start getting missed.
      </p>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
