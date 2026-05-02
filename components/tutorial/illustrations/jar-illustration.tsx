"use client";

import { useEffect, useState } from "react";
import { P } from "../constants/sampling-constants";

const WJAR_W = 260;
const WJAR_H = 250;
const WJAR_RIM = 25;
const WMR = 9;
const WMGAP = 4;
const WMSTEP = WMR * 2 + WMGAP;
const WCOLS = 10;
const WROWS = 6;
const WSTART_X = (WJAR_W - (WCOLS * WMSTEP - WMGAP)) / 2 + 10;
const WROW_YS = [50, 86, 122, 158, 194, 230];

const WOVAL_COLS = 10;
const WOVAL_W = WOVAL_COLS * WMSTEP - WMGAP + 10;
const WOVAL_RY = 18;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 4294967296;
  };
}

type WideMarble = { row: number; col: number; green: boolean };

function generateWideMarbles(): WideMarble[] {
  const rng = seededRandom(77);
  const marbles: WideMarble[] = [];
  for (let r = 0; r < WROWS; r++)
    for (let c = 0; c < WCOLS; c++)
      marbles.push({ row: r, col: c, green: rng() < P });
  return marbles;
}

const WIDE_MARBLES = generateWideMarbles();

// Delays: pause before first sample, between samples, pause after all shown
const DELAY_START = 600;
const DELAY_STEP = 700;
const DELAY_HOLD = 1800;

export function JarIllustration() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const delay =
      visibleCount === 0 ? DELAY_START :
      visibleCount === WROWS ? DELAY_HOLD :
      DELAY_STEP;

    const t = setTimeout(() => {
      setVisibleCount(v => (v < WROWS ? v + 1 : 0));
    }, delay);

    return () => clearTimeout(t);
  }, [visibleCount]);

  return (
    <div className="w-full rounded-xl px-3 py-4">
      <div className="mx-auto w-4/5">
        <div className="relative w-full" style={{ height: "clamp(220px, 45vw, 320px)" }}>
          <svg
            viewBox={`0 0 ${WJAR_W} ${WJAR_H + 8}`}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <clipPath id="wjar-clip">
                <rect
                  x={0}
                  y={WJAR_RIM}
                  width={WJAR_W}
                  height={WJAR_H - WJAR_RIM}
                  rx={10}
                />
              </clipPath>
            </defs>

            {/* Jar body */}
            <rect
              x={0}
              y={WJAR_RIM}
              width={WJAR_W}
              height={WJAR_H - WJAR_RIM}
              rx={10}
              fill="#f0f0ee"
              stroke="rgba(23,23,23,0.14)"
              strokeWidth="1.5"
            />
            {/* Rim */}
            <rect
              x={0}
              y={0}
              width={WJAR_W}
              height={WJAR_RIM}
              rx={4}
              fill="#e8e8e6"
              stroke="rgba(23,23,23,0.14)"
              strokeWidth="1.2"
            />
            <text
              x={WJAR_W / 2}
              y={WJAR_RIM - 10}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(0, 0, 0, 1)"
              fontWeight="600"
              letterSpacing="0.12em"
            >
              Marble Jar
            </text>

            {/* Marbles */}
            <g clipPath="url(#wjar-clip)">
              {WIDE_MARBLES.map((m, i) => {
                const cx = WSTART_X + m.col * WMSTEP + WMR;
                const cy = WROW_YS[m.row];
                return (
                  <g key={i}>
                    <circle cx={cx + 1} cy={cy + 1.5} r={WMR} fill="rgba(0,0,0,0.07)" />
                    <circle cx={cx} cy={cy} r={WMR} fill={m.green ? "#16a34a" : "#d4d4d4"} />
                    <circle
                      cx={cx - 2.5}
                      cy={cy - 2.5}
                      r={WMR * 0.32}
                      fill={m.green ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.7)"}
                    />
                  </g>
                );
              })}
            </g>

            {/* Sample ovals — fade in one by one */}
            {[0, 1, 2, 3, 4, 5].map((ri) => {
              const cy = WROW_YS[ri];
              const visible = ri < visibleCount;
              return (
                <g
                  key={ri}
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: "opacity 0.35s ease",
                  }}
                >
                  <rect
                    x={WSTART_X - 8}
                    y={cy - WOVAL_RY}
                    width={WOVAL_W}
                    height={WOVAL_RY * 2}
                    rx={10}
                    fill="transparent"
                    stroke="#747474"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                  />
                  <text
                    x={WSTART_X - 12}
                    y={cy + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#747474"
                    fontWeight="600"
                  >
                    #{ri + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
