"use client";

import { useState, useEffect, useRef } from "react";
import { TwoBellsDistribution } from "./two-bells-distribution";
import {
  CH2_AXIS_MAX,
  CH2_BASELINE_STEPS,
  CH2_DEBOUNCE_MS,
  CH2_LIFT,
  CH2_N,
} from "../constants/chapter-2-constants";
import { CASE_STUDY_A_RATE } from "../constants/case-study-constants";
import { useBaselineSlider } from "./use-baseline-slider";

type OverlapLevel = "heavy" | "moderate" | "light";

function overlapFor(baseline: number): OverlapLevel {
  if (baseline <= 0.05) return "heavy";
  if (baseline <= 0.2) return "moderate";
  return "light";
}

export function TwoBellsWidget() {
  const { baseline, baselineIndex, handleBaselineChange } = useBaselineSlider(CASE_STUDY_A_RATE);
  const [liveText, setLiveText] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const liftedBaseline = Math.min(CH2_AXIS_MAX, baseline * (1 + CH2_LIFT));

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const next = baseline;
    const lifted = Math.min(CH2_AXIS_MAX, next * (1 + CH2_LIFT));
    debounceRef.current = setTimeout(() => {
      setLiveText(
        `Baseline ${(next * 100).toFixed(1)}%. Control mean ${(next * 100).toFixed(1)}%, variant mean ${(lifted * 100).toFixed(1)}%. Overlap ${overlapFor(next)}.`,
      );
    }, CH2_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [baseline]);

  const maxBin = Math.round(CH2_AXIS_MAX * 100);
  const gapPts = (liftedBaseline - baseline) * 100;

  let insightText: string;
  if (baseline <= 0.02) {
    insightText = `At N=${CH2_N} and a ${(CH2_LIFT * 100).toFixed(0)}% relative lift, the two bells sit almost on top of each other. A single sample from either jar could easily come from the other.`;
  } else if (baseline <= 0.1) {
    insightText = `The means pull apart by about ${gapPts.toFixed(1)} points, but the bells still overlap heavily through the middle.`;
  } else {
    insightText = `The bells are starting to pull apart — about ${gapPts.toFixed(1)} points between the means. There's still a band in the middle where a sample from A and a sample from B look the same.`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[560px] items-center gap-4">
        <label
          htmlFor="two-bells-baseline-slider"
          className="shrink-0 text-sm font-medium text-foreground/70"
        >
          Baseline:
        </label>
        <input
          id="two-bells-baseline-slider"
          type="range"
          min={0}
          max={CH2_BASELINE_STEPS.length - 1}
          step={1}
          value={baselineIndex}
          onChange={handleBaselineChange}
          aria-valuetext={`${(baseline * 100).toFixed(0)}%`}
          className="flex-1"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">
          {(baseline * 100).toFixed(0)}%
        </span>
      </div>

      <TwoBellsDistribution
        pA={baseline}
        pB={liftedBaseline}
        maxBin={maxBin}
      />

      <p className="max-w-[480px] text-center text-sm text-foreground/60">
        {insightText}
      </p>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
