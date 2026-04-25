import { describe, it, expect } from "vitest";
import {
  drawSample,
  countSample,
  binomialMean,
  binomialSD,
  sampleMean,
  binomialPMF,
  buildTheoreticalBuckets,
} from "./sampling";

describe("drawSample", () => {
  it("returns exactly n booleans", () => {
    const result = drawSample(10, 0.2);
    expect(result).toHaveLength(10);
    result.forEach((v) => expect(typeof v).toBe("boolean"));
  });

  it("returns all false when p=0", () => {
    expect(drawSample(10, 0.0).every((v) => v === false)).toBe(true);
  });

  it("returns all true when p=1", () => {
    expect(drawSample(10, 1.0).every((v) => v === true)).toBe(true);
  });
});

describe("countSample", () => {
  it("counts the true values in an array", () => {
    expect(countSample([true, false, true, false, false])).toBe(2);
  });

  it("returns 0 for all-false array", () => {
    expect(countSample([false, false, false])).toBe(0);
  });

  it("result is always between 0 and n when used with drawSample", () => {
    for (let i = 0; i < 100; i++) {
      const count = countSample(drawSample(10, 0.2));
      expect(count).toBeGreaterThanOrEqual(0);
      expect(count).toBeLessThanOrEqual(10);
    }
  });
});

describe("binomialMean", () => {
  it("returns n * p", () => {
    expect(binomialMean(10, 0.2)).toBe(2);
  });
});

describe("binomialSD", () => {
  it("returns sqrt(n*p*(1-p))", () => {
    expect(binomialSD(10, 0.2)).toBeCloseTo(1.2649, 3);
  });
});

describe("sampleMean", () => {
  it("returns the mean of an array of counts", () => {
    expect(sampleMean([1, 3])).toBe(2);
  });

  it("handles a single value", () => {
    expect(sampleMean([4])).toBe(4);
  });

  it("returns 0 for an empty array", () => {
    expect(sampleMean([])).toBe(0);
  });

  it("rounds correctly for display at 1 decimal", () => {
    expect(sampleMean([1, 2, 3]).toFixed(1)).toBe("2.0");
    expect(sampleMean([0, 3]).toFixed(1)).toBe("1.5");
  });
});

describe("binomialPMF", () => {
  it("returns an array of length maxBin + 1", () => {
    expect(binomialPMF(100, 0.3, 100)).toHaveLength(101);
  });

  it("p=0: all mass in bin 0", () => {
    const pmf = binomialPMF(100, 0, 100);
    expect(pmf[0]).toBe(1);
    expect(pmf.slice(1).every((v) => v === 0)).toBe(true);
  });

  it("p=1: all mass in maxBin", () => {
    const pmf = binomialPMF(100, 1, 100);
    expect(pmf[100]).toBe(1);
    expect(pmf.slice(0, 100).every((v) => v === 0)).toBe(true);
  });

  it("values are non-negative", () => {
    const pmf = binomialPMF(100, 0.4, 100);
    expect(pmf.every((v) => v >= 0)).toBe(true);
  });

  it("total mass does not exceed 1", () => {
    const pmf = binomialPMF(100, 0.5, 100);
    const total = pmf.reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(1 + 1e-9);
  });

  it("peak is near p*100 for typical p", () => {
    const pmf = binomialPMF(100, 0.3, 100);
    const peak = pmf.indexOf(Math.max(...pmf));
    expect(peak).toBeGreaterThanOrEqual(27);
    expect(peak).toBeLessThanOrEqual(33);
  });
});

describe("buildTheoreticalBuckets", () => {
  it("buckets always sum to exactly totalDots", () => {
    for (const p of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const buckets = buildTheoreticalBuckets({ n: 100, p, maxBin: 100, totalDots: 200 });
      expect(buckets.reduce((a, b) => a + b, 0)).toBe(200);
    }
  });

  it("returns an array of length maxBin + 1", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0.5, maxBin: 100, totalDots: 50 });
    expect(buckets).toHaveLength(101);
  });

  it("p=0: all dots in bin 0", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0, maxBin: 100, totalDots: 50 });
    expect(buckets[0]).toBe(50);
    expect(buckets.slice(1).every((v) => v === 0)).toBe(true);
  });

  it("p=1: all dots in maxBin", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 1, maxBin: 100, totalDots: 50 });
    expect(buckets[100]).toBe(50);
    expect(buckets.slice(0, 100).every((v) => v === 0)).toBe(true);
  });

  it("all bucket values are non-negative integers", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0.4, maxBin: 100, totalDots: 300 });
    expect(buckets.every((v) => v >= 0 && Number.isInteger(v))).toBe(true);
  });

  it("peak bucket is near p*100 for typical p", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0.4, maxBin: 100, totalDots: 500 });
    const peak = buckets.indexOf(Math.max(...buckets));
    expect(peak).toBeGreaterThanOrEqual(37);
    expect(peak).toBeLessThanOrEqual(43);
  });

  it("totalDots=0 produces all-zero buckets", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0.5, maxBin: 100, totalDots: 0 });
    expect(buckets.every((v) => v === 0)).toBe(true);
  });
});

describe("statistical smoke test", () => {
  it("empirical mean of 1000 samples is within ±0.2 of 2.0", () => {
    const counts = Array.from({ length: 1000 }, () => countSample(drawSample(10, 0.2)));
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    expect(mean).toBeGreaterThan(1.8);
    expect(mean).toBeLessThan(2.2);
  });
});
