import { describe, it, expect } from "vitest";
import {
  drawSample,
  countSample,
  binomialMean,
  binomialSD,
  sampleMean,
  binomialPMF,
  buildTheoreticalBuckets,
  gaussianCurve,
  standardNormalCurve,
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

  it("n=0: all mass in bin 0 regardless of p", () => {
    const pmf = binomialPMF(0, 0.5, 100);
    expect(pmf[0]).toBe(1);
    expect(pmf.slice(1).every((v) => v === 0)).toBe(true);
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

  it("n=0: all dots in bin 0 regardless of p", () => {
    const buckets = buildTheoreticalBuckets({ n: 0, p: 0.5, maxBin: 100, totalDots: 50 });
    expect(buckets[0]).toBe(50);
    expect(buckets.slice(1).every((v) => v === 0)).toBe(true);
  });

  it("totalDots=0 produces all-zero buckets", () => {
    const buckets = buildTheoreticalBuckets({ n: 100, p: 0.5, maxBin: 100, totalDots: 0 });
    expect(buckets.every((v) => v === 0)).toBe(true);
  });
});

describe("gaussianCurve", () => {
  it("returns `steps` points spanning [xMin, xMax] inclusive", () => {
    const data = gaussianCurve(0.1, 100, 0, 25, 50);
    expect(data).toHaveLength(50);
    expect(data[0].x).toBe(0);
    expect(data[data.length - 1].x).toBe(25);
  });

  it("defaults to 300 steps", () => {
    expect(gaussianCurve(0.1, 100, 0, 25)).toHaveLength(300);
  });

  it("y peaks at 1 when the mean is in the sampled grid", () => {
    // x range chosen so x=10 (the mean for p=0.1) is exactly hit at i=10
    const data = gaussianCurve(0.1, 100, 0, 20, 21);
    expect(data[10].x).toBe(10);
    expect(data[10].y).toBeCloseTo(1, 10);
  });

  it("max y across a finely-sampled curve is at most 1 and very close to it", () => {
    const data = gaussianCurve(0.1, 100, 0, 25);
    const maxY = Math.max(...data.map((d) => d.y));
    expect(maxY).toBeLessThanOrEqual(1 + 1e-9);
    expect(maxY).toBeGreaterThan(0.99);
  });

  it("is symmetric around the mean", () => {
    const sd = Math.sqrt(0.1 * 0.9 / 100) * 100;
    const mean = 10;
    const data = gaussianCurve(0.1, 100, mean - 2 * sd, mean + 2 * sd, 11);
    for (let i = 0; i < data.length; i += 1) {
      expect(data[i].y).toBeCloseTo(data[data.length - 1 - i].y, 9);
    }
  });

  it("matches the gaussian formula y = exp(-z^2/2) at ±1 SD and ±2 SD", () => {
    const sd = Math.sqrt(0.1 * 0.9 / 100) * 100;
    const mean = 10;
    // Sample exactly two points: one at mean+sd, one at mean+2sd.
    const [oneSd] = gaussianCurve(0.1, 100, mean + sd, mean + sd + 1, 2);
    const [twoSd] = gaussianCurve(0.1, 100, mean + 2 * sd, mean + 2 * sd + 1, 2);
    expect(oneSd.y).toBeCloseTo(Math.exp(-0.5), 6);
    expect(twoSd.y).toBeCloseTo(Math.exp(-2), 6);
  });

  it("matches the gaussian formula at ±1 SD and ±2 SD for n=400", () => {
    // n=400 sd = sqrt(0.1*0.9/400)*100 = 1.5 pp — verifies formula with n≠100
    const sd = Math.sqrt(0.1 * 0.9 / 400) * 100;
    const mean = 10;
    const [oneSd] = gaussianCurve(0.1, 400, mean + sd, mean + sd + 1, 2);
    const [twoSd] = gaussianCurve(0.1, 400, mean + 2 * sd, mean + 2 * sd + 1, 2);
    expect(oneSd.y).toBeCloseTo(Math.exp(-0.5), 6);
    expect(twoSd.y).toBeCloseTo(Math.exp(-2), 6);
  });

  it("curve width scales with 1/√n: n=400 is half as wide as n=100", () => {
    // At +1 SD for n=100 (x = mean+3pp), an n=400 curve (sd=1.5pp) is at z=2,
    // so its y should be exp(-2) rather than exp(-0.5).
    const mean = 10;
    const sd100 = Math.sqrt(0.1 * 0.9 / 100) * 100; // 3 pp
    const [pt100] = gaussianCurve(0.1, 100, mean + sd100, mean + sd100 + 1, 2);
    const [pt400] = gaussianCurve(0.1, 400, mean + sd100, mean + sd100 + 1, 2);
    expect(pt100.y).toBeCloseTo(Math.exp(-0.5), 6);
    expect(pt400.y).toBeCloseTo(Math.exp(-2), 6);
  });

  it("y values are non-negative and bounded by 1", () => {
    const data = gaussianCurve(0.3, 100, 0, 60);
    expect(data.every((d) => d.y >= 0 && d.y <= 1 + 1e-9)).toBe(true);
  });

  it("p=0 collapses to a single point at x=0 with y=1", () => {
    const data = gaussianCurve(0, 100, 0, 25);
    expect(data).toEqual([{ x: 0, y: 1 }]);
  });

  it("p=1 collapses to a single point at x=100 with y=1", () => {
    const data = gaussianCurve(1, 100, 0, 100);
    expect(data).toEqual([{ x: 100, y: 1 }]);
  });

  it("n=0 collapses to a single point", () => {
    const data = gaussianCurve(0.5, 0, 0, 100);
    expect(data).toHaveLength(1);
    expect(data[0].y).toBe(1);
  });

  it("steps=1 returns a single valid point at xMin with no NaN", () => {
    const data = gaussianCurve(0.1, 100, 5, 15, 1);
    expect(data).toHaveLength(1);
    expect(Number.isNaN(data[0].x)).toBe(false);
    expect(Number.isNaN(data[0].y)).toBe(false);
    expect(data[0].x).toBe(5);
  });
});

describe("standardNormalCurve", () => {
  it("returns `steps` points spanning [xMin, xMax] inclusive", () => {
    const data = standardNormalCurve(-3.5, 3.5, 50);
    expect(data).toHaveLength(50);
    expect(data[0].x).toBeCloseTo(-3.5, 10);
    expect(data[data.length - 1].x).toBeCloseTo(3.5, 10);
  });

  it("defaults to 300 steps", () => {
    expect(standardNormalCurve(-3, 3)).toHaveLength(300);
  });

  it("y=1 at x=0 (the mean)", () => {
    // With an odd step count, x=0 is hit exactly at the midpoint.
    const data = standardNormalCurve(-2, 2, 5);
    expect(data[2].x).toBe(0);
    expect(data[2].y).toBe(1);
  });

  it("y=exp(-0.5) at x=±1 SD", () => {
    const data = standardNormalCurve(-1, 1, 3);
    expect(data[0].y).toBeCloseTo(Math.exp(-0.5), 10);
    expect(data[2].y).toBeCloseTo(Math.exp(-0.5), 10);
  });

  it("y=exp(-2) at x=±2 SD", () => {
    const data = standardNormalCurve(-2, 2, 3);
    expect(data[0].y).toBeCloseTo(Math.exp(-2), 10);
    expect(data[2].y).toBeCloseTo(Math.exp(-2), 10);
  });

  it("is symmetric: y(x) === y(-x)", () => {
    const data = standardNormalCurve(-3, 3, 13);
    for (let i = 0; i < data.length; i++) {
      expect(data[i].y).toBeCloseTo(data[data.length - 1 - i].y, 10);
    }
  });

  it("all y values are in (0, 1]", () => {
    const data = standardNormalCurve(-4, 4);
    expect(data.every((d) => d.y > 0 && d.y <= 1)).toBe(true);
  });

  it("monotonically decreasing from center outward", () => {
    const data = standardNormalCurve(0, 4, 50);
    for (let i = 1; i < data.length; i++) {
      expect(data[i].y).toBeLessThanOrEqual(data[i - 1].y);
    }
  });

  it("steps=1 returns a single valid point at xMin with no NaN", () => {
    const data = standardNormalCurve(-1, 1, 1);
    expect(data).toHaveLength(1);
    expect(Number.isNaN(data[0].x)).toBe(false);
    expect(Number.isNaN(data[0].y)).toBe(false);
    expect(data[0].x).toBe(-1);
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
