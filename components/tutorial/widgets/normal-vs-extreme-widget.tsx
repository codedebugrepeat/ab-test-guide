"use client";

import React, { useState } from "react";
import { AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { standardNormalCurve, type GaussianPoint } from "@/maths/sampling";

type Region = "inner" | "outer" | "tail";

const BELL_COLOR = "#16a34a";
const TAIL_COLOR = "#f59e0b";

const REGION_META: Record<Region, { pct: string; text: string; color: string; ariaLabel: string }> = {
  inner: {
    pct: "~68%",
    text: "of samples land within 1 SD of the mean — routine noise",
    color: BELL_COLOR,
    ariaLabel: "Inner band (−1 SD to +1 SD): ~68% of samples",
  },
  outer: {
    pct: "~95%",
    text: "of samples land within 2 SDs of the mean",
    color: BELL_COLOR,
    ariaLabel: "Outer ring (−2 SD to −1 SD and +1 SD to +2 SD): ~95% of samples cumulative",
  },
  tail: {
    pct: "~5%",
    text: "of samples end up in the tails — rare outcomes",
    color: TAIL_COLOR,
    ariaLabel: "Tails beyond ±2 SDs: ~5% of samples",
  },
};

const WIDTH = 560;
const HEIGHT = 280;
const MARGIN = { top: 16, right: 32, bottom: 44, left: 32 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

const X_MIN = -3.7;
const X_MAX = 3.7;

type Datum = GaussianPoint;

function bandOpacities(active: Region | null) {
  switch (active) {
    case "inner":
      return { inner: 0.52, outerRing: 0.04, tail: 0.015 };
    case "outer":
      return { inner: 0.38, outerRing: 0.22, tail: 0.015 };
    case "tail":
      return { inner: 0.04, outerRing: 0.02, tail: 0.52 };
    default:
      return { inner: 0.14, outerRing: 0.07, tail: 0.03 };
  }
}

export function NormalVsExtremeWidget() {
  const [hovered, setHovered] = useState<Region | null>(null);
  const [locked, setLocked] = useState<Region | null>(null);

  const active = locked ?? hovered;
  const info = active ? REGION_META[active] : null;
  const opacities = bandOpacities(active);

  const xScale = scaleLinear<number>({ domain: [X_MIN, X_MAX], range: [0, PLOT_W] });
  const yScale = scaleLinear<number>({ domain: [0, 1.12], range: [PLOT_H, 0] });

  const data = standardNormalCurve(X_MIN, X_MAX);

  const xMinus1Sd = xScale(-1);
  const xMinus2Sd = xScale(-2);
  const xPlus1Sd = xScale(1);
  const xPlus2Sd = xScale(2);

  function enter(r: Region) { setHovered(r); }
  function leave() { setHovered(null); }
  function click(r: Region) { setLocked((prev) => (prev === r ? null : r)); }

  function regionProps(r: Region) {
    return {
      role: "button" as const,
      tabIndex: 0,
      "aria-label": REGION_META[r].ariaLabel,
      "aria-pressed": locked === r,
      style: { cursor: "pointer" },
      onMouseDown: (e: React.MouseEvent) => e.preventDefault(),
      onMouseEnter: () => enter(r),
      onMouseLeave: leave,
      onClick: () => click(r),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); click(r); }
      },
      onFocus: () => enter(r),
      onBlur: leave,
    };
  }

  const ariaLabel =
    "Sampling distribution in standard deviation units. The inner band from −1 SD to +1 SD contains about 68% of samples. The band from −2 SD to +2 SD contains about 95%. The tails beyond ±2 SD hold about 5%.";

  const tickFormat = (v: number | { valueOf(): number }) => {
    const n = Number(v);
    if (n === 0) return "mean";
    return n > 0 ? `+${n} SD` : `${n} SD`;
  };

  return (
    <div className="flex w-full max-w-[560px] flex-col items-center gap-0">
      {/* Label strip */}
      <div className="flex h-12 w-full items-center justify-center px-4">
        {info ? (
          <p className="text-center text-sm">
            <span className="font-bold tabular-nums" style={{ color: info.color }}>
              {info.pct}
            </span>{" "}
            <span className="text-foreground/60">{info.text}</span>
            {locked && (
              <button
                onClick={() => setLocked(null)}
                className="ml-3 text-xs text-foreground/35 underline underline-offset-2"
              >
                clear
              </button>
            )}
          </p>
        ) : (
          <p className="text-sm text-foreground/35">
            Hover or click a region to see how much falls there
          </p>
        )}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="figure"
        aria-label={ariaLabel}
        className="block h-auto w-full"
        style={{ cursor: "default" }}
      >
        <Group left={MARGIN.left} top={MARGIN.top}>
          {/* Tail bands */}
          <g {...regionProps("tail")}>
            <rect
              x={0}
              y={0}
              width={Math.max(0, xMinus2Sd)}
              height={PLOT_H}
              fill={TAIL_COLOR}
              fillOpacity={opacities.tail}
              style={{ transition: "fill-opacity 0.15s" }}
            />
            <rect
              x={xPlus2Sd}
              y={0}
              width={Math.max(0, PLOT_W - xPlus2Sd)}
              height={PLOT_H}
              fill={TAIL_COLOR}
              fillOpacity={opacities.tail}
              style={{ transition: "fill-opacity 0.15s" }}
            />
          </g>

          {/* Outer ring bands (±1 to ±2 SD) */}
          <g {...regionProps("outer")}>
            <rect
              x={xMinus2Sd}
              y={0}
              width={Math.max(0, xMinus1Sd - xMinus2Sd)}
              height={PLOT_H}
              fill={BELL_COLOR}
              fillOpacity={opacities.outerRing}
              style={{ transition: "fill-opacity 0.15s" }}
            />
            <rect
              x={xPlus1Sd}
              y={0}
              width={Math.max(0, xPlus2Sd - xPlus1Sd)}
              height={PLOT_H}
              fill={BELL_COLOR}
              fillOpacity={opacities.outerRing}
              style={{ transition: "fill-opacity 0.15s" }}
            />
          </g>

          {/* Inner band (±1 SD) */}
          <g {...regionProps("inner")}>
            <rect
              x={xMinus1Sd}
              y={0}
              width={Math.max(0, xPlus1Sd - xMinus1Sd)}
              height={PLOT_H}
              fill={BELL_COLOR}
              fillOpacity={opacities.inner}
              style={{ transition: "fill-opacity 0.15s" }}
            />
          </g>

          {/* Bell silhouette (on top of bands, pointer-events-none so bands get events) */}
          <AreaClosed<Datum>
            data={data}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            yScale={yScale}
            curve={curveMonotoneX}
            fill={BELL_COLOR}
            fillOpacity={0.3}
            style={{ pointerEvents: "none" }}
          />
          <LinePath<Datum>
            data={data}
            x={(d) => xScale(d.x) ?? 0}
            y={(d) => yScale(d.y) ?? 0}
            curve={curveMonotoneX}
            stroke={BELL_COLOR}
            strokeWidth={1.5}
            style={{ pointerEvents: "none" }}
          />

          {/* Dashed SD markers */}
          {[-2, -1, 1, 2].map((sd) => (
            <line
              key={sd}
              x1={xScale(sd)}
              y1={0}
              x2={xScale(sd)}
              y2={PLOT_H}
              stroke="currentColor"
              strokeOpacity={0.18}
              strokeDasharray="3 3"
              strokeWidth={1}
              style={{ pointerEvents: "none" }}
            />
          ))}

          <AxisBottom
            top={PLOT_H}
            scale={xScale}
            stroke="currentColor"
            axisLineClassName="[stroke-opacity:0.14]"
            hideTicks
            tickValues={[-2, -1, 0, 1, 2]}
            tickFormat={tickFormat}
            tickLabelProps={() => ({
              fontSize: 11,
              fontWeight: 500,
              fill: "currentColor",
              fillOpacity: 0.4,
              textAnchor: "middle",
              dy: "0.9em",
            })}
          />
        </Group>
      </svg>
    </div>
  );
}
