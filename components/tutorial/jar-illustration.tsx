
"use client";

// Wide horizontal jar with 4 rows of marbles and 3 sample ovals circled inside.

import { P } from "./sampling-constants";

export const WJAR_W = 420;
const WJAR_H = 168;
const WJAR_RIM = 18;
const WMR = 9;
const WMGAP = 4;
const WMSTEP = WMR * 2 + WMGAP;
const WCOLS = 12;
const WROWS = 4;
const WSTART_X = (WJAR_W - (WCOLS * WMSTEP - WMGAP)) / 2;
const WROW_YS = [42, 78, 114, 150];

// Oval circles cols 0–9 of each row
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

export function JarIllustration() {
  return (
    <svg
      width={WJAR_W}
      height={WJAR_H + 8}
      viewBox={`0 0 ${WJAR_W} ${WJAR_H + 8}`}
      style={{ display: "block" }}
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
        y={WJAR_RIM - 4}
        textAnchor="middle"
        fontSize="8"
        fill="rgba(23,23,23,0.35)"
        fontWeight="600"
        letterSpacing="0.12em"
      >
                JAR
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
                                cx={cx - 2.5} cy={cy - 2.5} r={WMR * 0.32}
                                fill={m.green ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.7)"}
                            />
                        </g>
                    );
                })}
            </g>

            {/* 3 sample ovals on rows 0, 1, 2 */}
            {[0, 1, 2].map((ri) => {
                const cy = WROW_YS[ri];
                return (
                    <g key={ri}>
                        <rect
                            x={WSTART_X - 8} y={cy - WOVAL_RY}
                            width={WOVAL_W} height={WOVAL_RY * 2}
                            rx={10}
                            fill="rgba(239,68,68,0.05)"
                            stroke="#747474" strokeWidth="1.5" strokeDasharray="5 3"
                        />
                        <text
                            x={WSTART_X - 12} y={cy + 4} textAnchor="end"
                            fontSize="10" fill="#747474" fontWeight="600"
                        >
                            #{ri + 1}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
