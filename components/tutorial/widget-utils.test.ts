import { describe, it, expect } from "vitest";
import { newestFirst } from "./widget-utils";

describe("newestFirst", () => {
  it("returns the last maxRows items in reverse order", () => {
    const rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(newestFirst(rows, 5)).toEqual([10, 9, 8, 7, 6]);
  });

  it("first element is the highest-id item (newest at top)", () => {
    const rows = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
    const result = newestFirst(rows, 5);
    expect(result[0].id).toBe(100);
    expect(result[4].id).toBe(96);
  });

  it("returns all items reversed when count is less than maxRows", () => {
    expect(newestFirst([1, 2, 3], 5)).toEqual([3, 2, 1]);
  });

  it("returns empty array for empty input", () => {
    expect(newestFirst([], 5)).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const rows = [1, 2, 3, 4, 5];
    newestFirst(rows, 3);
    expect(rows).toEqual([1, 2, 3, 4, 5]);
  });
});
