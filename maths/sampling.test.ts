import { describe, it, expect } from "vitest";
import {
  drawSample,
  countSample,
  binomialMean,
  binomialSD,
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

describe("statistical smoke test", () => {
  it("empirical mean of 1000 samples is within ±0.2 of 2.0", () => {
    const counts = Array.from({ length: 1000 }, () => countSample(drawSample(10, 0.2)));
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    expect(mean).toBeGreaterThan(1.8);
    expect(mean).toBeLessThan(2.2);
  });
});
