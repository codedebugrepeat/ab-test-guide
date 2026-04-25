"use client";

import { useState, useMemo, type ChangeEvent } from "react";
import { CH2_BASELINE_STEPS } from "./chapter-2-constants";

export function useBaselineSlider(initialBaseline: number) {
  const [baseline, setBaseline] = useState(initialBaseline);

  const baselineIndex = useMemo(() => {
    const exact = CH2_BASELINE_STEPS.indexOf(baseline as (typeof CH2_BASELINE_STEPS)[number]);
    if (exact !== -1) return exact;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < CH2_BASELINE_STEPS.length; i += 1) {
      const dist = Math.abs(CH2_BASELINE_STEPS[i] - baseline);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    return bestIdx;
  }, [baseline]);

  const handleBaselineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    const next = CH2_BASELINE_STEPS[Math.min(CH2_BASELINE_STEPS.length - 1, Math.max(0, idx))];
    setBaseline(next);
  };

  return { baseline, baselineIndex, handleBaselineChange };
}
