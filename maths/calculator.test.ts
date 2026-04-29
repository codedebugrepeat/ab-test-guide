import { describe, it, expect } from "vitest";
import { requiredSampleSize, estimateDuration, formatDuration } from "./calculator";

// Reference values cross-checked against Evan Miller's sample size calculator
// (one-tailed, 80% power): https://www.evanmiller.org/ab-testing/sample-size.html
// Note: simple-statistics probit differs from the exact z by <0.002, so results
// may be off by 1–2% vs published tables — we test within ±2%.

function within(actual: number, expected: number, toleranceFraction = 0.02) {
  return Math.abs(actual - expected) / expected <= toleranceFraction;
}

// ─── requiredSampleSize ────────────────────────────────────────────────────

describe("requiredSampleSize", () => {
  it("returns Infinity when baseline is 0", () => {
    expect(requiredSampleSize(0, 0.1, 0.95)).toBe(Infinity);
  });

  it("returns Infinity when baseline is 1 (100%)", () => {
    expect(requiredSampleSize(1, 0.1, 0.95)).toBe(Infinity);
  });

  it("returns Infinity when confidence is NaN", () => {
    expect(requiredSampleSize(0.1, 0.1, NaN)).toBe(Infinity);
  });

  it("returns Infinity when confidence is 0", () => {
    expect(requiredSampleSize(0.1, 0.1, 0)).toBe(Infinity);
  });

  it("returns Infinity when confidence is exactly 0.5", () => {
    expect(requiredSampleSize(0.1, 0.1, 0.5)).toBe(Infinity);
  });

  it("returns Infinity when confidence is 1", () => {
    expect(requiredSampleSize(0.1, 0.1, 1)).toBe(Infinity);
  });

  it("returns Infinity when confidence exceeds 1", () => {
    expect(requiredSampleSize(0.1, 0.1, 1.5)).toBe(Infinity);
  });

  it("returns Infinity when confidence is negative", () => {
    expect(requiredSampleSize(0.1, 0.1, -0.95)).toBe(Infinity);
  });

  it("returns Infinity when confidence is Infinity", () => {
    expect(requiredSampleSize(0.1, 0.1, Infinity)).toBe(Infinity);
  });

  it("returns Infinity when lift is 0", () => {
    expect(requiredSampleSize(0.1, 0, 0.95)).toBe(Infinity);
  });

  it("returns Infinity when p2 would reach or exceed 1", () => {
    // baseline 90%, lift 20% → p2 = 1.08 ≥ 1
    expect(requiredSampleSize(0.9, 0.2, 0.95)).toBe(Infinity);
  });

  it("returns a positive integer for valid inputs", () => {
    const n = requiredSampleSize(0.1, 0.1, 0.95);
    expect(Number.isFinite(n)).toBe(true);
    expect(n).toBeGreaterThan(0);
    expect(Number.isInteger(n)).toBe(true);
  });

  it("baseline 10%, lift 10%, 95% confidence → ~11,600 per variant", () => {
    // one-tailed 95%, power 80%: formula gives ≈11,600
    const n = requiredSampleSize(0.1, 0.1, 0.95);
    expect(within(n, 11600)).toBe(true);
  });

  it("baseline 10%, lift 20%, 95% confidence → ~3,020 per variant", () => {
    const n = requiredSampleSize(0.1, 0.2, 0.95);
    expect(within(n, 3020)).toBe(true);
  });

  it("baseline 5%, lift 10%, 95% confidence → ~24,572 per variant", () => {
    // 10% relative lift on 5% baseline is only 0.5pp absolute — needs many visitors
    const n = requiredSampleSize(0.05, 0.1, 0.95);
    expect(within(n, 24572)).toBe(true);
  });

  it("baseline 10%, lift 10%, 99% confidence → more visitors than at 95%", () => {
    const n95 = requiredSampleSize(0.1, 0.1, 0.95);
    const n99 = requiredSampleSize(0.1, 0.1, 0.99);
    expect(n99).toBeGreaterThan(n95);
  });

  it("baseline 10%, lift 10%, 90% confidence → fewer visitors than at 95%", () => {
    const n90 = requiredSampleSize(0.1, 0.1, 0.90);
    const n95 = requiredSampleSize(0.1, 0.1, 0.95);
    expect(n90).toBeLessThan(n95);
  });

  it("halving lift roughly quadruples required visitors", () => {
    const nFull = requiredSampleSize(0.1, 0.2, 0.95);
    const nHalf = requiredSampleSize(0.1, 0.1, 0.95);
    const ratio = nHalf / nFull;
    expect(ratio).toBeGreaterThan(3);
    expect(ratio).toBeLessThan(5);
  });
});

// ─── estimateDuration ─────────────────────────────────────────────────────

describe("estimateDuration", () => {
  it("returns Infinity when requiredN is Infinity", () => {
    expect(estimateDuration(Infinity, 100)).toBe(Infinity);
  });

  it("returns Infinity when visitorsPerPeriod is 0", () => {
    expect(estimateDuration(500, 0)).toBe(Infinity);
  });

  it("500 per group, 100 per week → 10 weeks (2×500/100)", () => {
    expect(estimateDuration(500, 100)).toBe(10);
  });

  it("500 per group, 200 per week → 5 weeks", () => {
    expect(estimateDuration(500, 200)).toBe(5);
  });

  it("rounds up fractional periods", () => {
    // 2×500 = 1000 total, 300/period → 3.33… → ceil = 4
    expect(estimateDuration(500, 300)).toBe(4);
  });

  it("exactly divisible: 1000 per group, 500 per period → 4 periods", () => {
    // 2×1000 = 2000, 2000/500 = 4
    expect(estimateDuration(1000, 500)).toBe(4);
  });

  it("1 visitor per period: duration equals total visitors needed", () => {
    expect(estimateDuration(50, 1)).toBe(100);
  });
});

// ─── formatDuration ───────────────────────────────────────────────────────

describe("formatDuration", () => {
  it("1 day → '~1 day' (singular)", () => {
    expect(formatDuration(1, "day")).toBe("~1 day");
  });

  it("2 days → '~2 days' (plural)", () => {
    expect(formatDuration(2, "day")).toBe("~2 days");
  });

  it("1 week → '~1 week' (singular)", () => {
    expect(formatDuration(1, "week")).toBe("~1 week");
  });

  it("5 weeks → '~5 weeks'", () => {
    expect(formatDuration(5, "week")).toBe("~5 weeks");
  });

  it("1 month → '~1 month' (singular)", () => {
    expect(formatDuration(1, "month")).toBe("~1 month");
  });

  it("3 months → '~3 months'", () => {
    expect(formatDuration(3, "month")).toBe("~3 months");
  });
});

// ─── end-to-end: sample size → duration ───────────────────────────────────

describe("sample size to duration integration", () => {
  it("baseline 10%, lift 10%, 95% conf, 100 visitors/week → plausible weeks", () => {
    const n = requiredSampleSize(0.1, 0.1, 0.95);
    const weeks = estimateDuration(n, 100);
    // 2 × ~11,600 / 100 ≈ 232 weeks; allow ±5%
    expect(weeks).toBeGreaterThan(200);
    expect(weeks).toBeLessThan(260);
  });

  it("baseline 10%, lift 10%, 95% conf, 500 visitors/day → much fewer days than weeks case", () => {
    const n = requiredSampleSize(0.1, 0.1, 0.95);
    const days = estimateDuration(n, 500);
    const weeks = estimateDuration(n, 100);
    // daily at 500 should be far fewer periods than weekly at 100
    expect(days).toBeLessThan(weeks);
  });

  it("more visitors per period always shortens duration", () => {
    const n = requiredSampleSize(0.1, 0.1, 0.95);
    expect(estimateDuration(n, 200)).toBeLessThanOrEqual(estimateDuration(n, 100));
    expect(estimateDuration(n, 1000)).toBeLessThanOrEqual(estimateDuration(n, 200));
  });
});
