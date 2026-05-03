import { describe, it, expect } from "vitest";
import { buildTheoreticalBuckets, gaussianCurve } from "@/maths/sampling";
import { CH2_N, CH2_THEORY_DOT_COUNT } from "../constants/chapter-2-constants";

// Mirror the illustration's module-level constants exactly.
// If any of these change, the tests below should be updated to match.
const P = 0.5;
const N = CH2_N;           // 100
const TOTAL_DOTS = CH2_THEORY_DOT_COUNT; // 400
const MIN_BIN = 20;
const MAX_BIN = 80;
const HEIGHT = 240;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 10;
const PLOT_H = HEIGHT - MARGIN_TOP - MARGIN_BOTTOM; // 210
const DOT_R_NOMINAL = 4;
const DOT_STEP_NOMINAL = 10;

const allBuckets = buildTheoreticalBuckets({ n: N, p: P, maxBin: 100, totalDots: TOTAL_DOTS });
const cols = Array.from({ length: MAX_BIN - MIN_BIN + 1 }, (_, i) => i + MIN_BIN);
const buckets = cols.map((i) => allBuckets[i] ?? 0);
const maxBucket = Math.max(1, ...buckets);
const maxDotsNominal = Math.floor(PLOT_H / DOT_STEP_NOMINAL);
const dotScale = maxBucket <= maxDotsNominal ? 1 : maxDotsNominal / maxBucket;
const DOT_STEP = DOT_STEP_NOMINAL * dotScale;
const DOT_R = DOT_R_NOMINAL * Math.min(1, Math.max(0.6, dotScale));
const peakY = PLOT_H - 2 * DOT_R - (maxBucket - 1) * DOT_STEP - 15;

// Gaussian formula matching gaussianCurve(P, N, ...) — used to verify dot/curve alignment.
const MEAN_BIN = P * 100;                            // 50
const SD_BIN = Math.sqrt(P * (1 - P) / N) * 100;    // 5 percentage points
const gauY = (bin: number) => Math.exp(-0.5 * ((bin - MEAN_BIN) / SD_BIN) ** 2);
// yCurveScale: y=0 → PLOT_H, y=1 → peakY (SVG: larger y = lower on screen)
const curvePlotY = (gy: number) => PLOT_H + (peakY - PLOT_H) * gy;

describe("SmoothCurveIllustration — dot distribution", () => {
  it("display range covers the full symmetric span MIN_BIN to MAX_BIN around 50", () => {
    expect(50 - MIN_BIN).toBe(MAX_BIN - 50);
  });

  it("buckets in display range are all non-negative integers", () => {
    expect(buckets.every((v) => v >= 0 && Number.isInteger(v))).toBe(true);
  });

  it("distribution is symmetric: allBuckets[50-k] === allBuckets[50+k]", () => {
    for (let k = 1; k <= 15; k++) {
      expect(allBuckets[50 - k]).toBe(allBuckets[50 + k]);
    }
  });

  it("peak bucket is at bin 50", () => {
    const peakBin = cols[buckets.indexOf(maxBucket)];
    expect(peakBin).toBe(50);
  });

  it("display-range buckets sum to the expected fraction of TOTAL_DOTS", () => {
    // Bins 20–80 capture essentially all mass for B(100, 0.5) — expect ≥99.99% of dots.
    const displaySum = buckets.reduce((a, b) => a + b, 0);
    expect(displaySum).toBeGreaterThanOrEqual(Math.round(TOTAL_DOTS * 0.9999));
  });
});

describe("SmoothCurveIllustration — dot sizing and viewport", () => {
  it("tallest dot stack fits within PLOT_H", () => {
    const stackHeight = DOT_R + (maxBucket - 1) * DOT_STEP;
    expect(stackHeight).toBeLessThanOrEqual(PLOT_H);
  });

  it("curve peak stays within SVG viewport (MARGIN_TOP + peakY > 0)", () => {
    expect(MARGIN_TOP + peakY).toBeGreaterThan(0);
  });

  it("DOT_R is between 0.6× and 1× DOT_R_NOMINAL", () => {
    expect(DOT_R).toBeGreaterThanOrEqual(DOT_R_NOMINAL * 0.6);
    expect(DOT_R).toBeLessThanOrEqual(DOT_R_NOMINAL);
  });

  it("DOT_STEP is between 0.6× and 1× DOT_STEP_NOMINAL", () => {
    expect(DOT_STEP).toBeGreaterThanOrEqual(DOT_STEP_NOMINAL * 0.6);
    expect(DOT_STEP).toBeLessThanOrEqual(DOT_STEP_NOMINAL);
  });
});

describe("SmoothCurveIllustration — Gaussian curve", () => {
  it("curve is symmetric around x=50 over [MIN_BIN, MAX_BIN]", () => {
    // 61 steps: index 0 = MIN_BIN(20), index 30 = 50, index 60 = MAX_BIN(80)
    const curve = gaussianCurve(P, N, MIN_BIN, MAX_BIN, 61);
    for (let i = 0; i < 30; i++) {
      expect(curve[30 - i].y).toBeCloseTo(curve[30 + i].y, 9);
    }
  });

  it("curve peaks at x=50 with y=1", () => {
    const curve = gaussianCurve(P, N, MIN_BIN, MAX_BIN, 61);
    // Index 30 lands exactly on x=50 with 61 evenly-spaced steps over [20,80]
    expect(curve[30].x).toBe(50);
    expect(curve[30].y).toBeCloseTo(1, 10);
  });

  it("curve tails are nearly zero at the display edges", () => {
    // At x=20 and x=80: z = ±(30/5) = ±6 → y = exp(-18) ≈ 1.5e-8
    const curve = gaussianCurve(P, N, MIN_BIN, MAX_BIN, 61);
    expect(curve[0].y).toBeLessThan(0.001);
    expect(curve[60].y).toBeLessThan(0.001);
  });

  it("curve y values are in (0, 1]", () => {
    const curve = gaussianCurve(P, N, MIN_BIN, MAX_BIN, 300);
    expect(curve.every((d) => d.y > 0 && d.y <= 1 + 1e-9)).toBe(true);
  });

  it("curve matches exp(-z²/2) at ±1 SD (z=±1, y≈0.607) and ±2 SD (z=±2, y≈0.135)", () => {
    const atPlusSd = gaussianCurve(P, N, MEAN_BIN + SD_BIN, MEAN_BIN + SD_BIN, 1);
    const atPlusTwoSd = gaussianCurve(P, N, MEAN_BIN + 2 * SD_BIN, MEAN_BIN + 2 * SD_BIN, 1);
    expect(atPlusSd[0].y).toBeCloseTo(Math.exp(-0.5), 6);
    expect(atPlusTwoSd[0].y).toBeCloseTo(Math.exp(-2), 6);
  });
});

describe("SmoothCurveIllustration — dots fit inside bell curve", () => {
  it("every non-empty dot stack sits at or below the curve at its column", () => {
    for (let col = MIN_BIN; col <= MAX_BIN; col++) {
      const count = allBuckets[col] ?? 0;
      if (count === 0) continue;
      // Top edge of the tallest dot in this column (in plot y-coords).
      const topDotEdge = PLOT_H - 2 * DOT_R - (count - 1) * DOT_STEP;
      // Curve y at this column's bin center.
      const curveY = curvePlotY(gauY(col));
      // In SVG y-coords: larger y = lower on screen, so topDotEdge >= curveY means dot is below curve.
      expect(topDotEdge).toBeGreaterThanOrEqual(curveY - 1); // 1px tolerance for rounding
    }
  });

  it("center column dot stack is the tallest", () => {
    expect(allBuckets[50]).toBe(maxBucket);
  });

  it("dot counts decrease monotonically from center outward (within display range)", () => {
    // Check left half: bins 20–50 should be non-decreasing as we move toward 50.
    for (let col = MIN_BIN; col < 50; col++) {
      expect(allBuckets[col]).toBeLessThanOrEqual(allBuckets[col + 1]);
    }
    // Right half: bins 50–80 should be non-increasing.
    for (let col = 50; col < MAX_BIN; col++) {
      expect(allBuckets[col]).toBeGreaterThanOrEqual(allBuckets[col + 1]);
    }
  });
});
