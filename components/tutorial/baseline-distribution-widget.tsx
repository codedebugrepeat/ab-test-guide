"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { drawSample, countSample, binomialSD } from "@/maths/sampling";
import { SamplingRateDistribution } from "./sampling-rate-distribution";
import {
  CH2_BASELINE_MIN,
  CH2_BASELINE_MAX,
  CH2_BASELINE_DEFAULT,
  CH2_AXIS_MAX,
  CH2_LIFT,
  CH2_N,
  CH2_SAMPLE_COUNT,
  CH2_STAGGER_MS,
  CH2_DEBOUNCE_MS,
} from "./chapter-2-constants";

export function BaselineDistributionWidget() {
  const [baseline, setBaseline] = useState(CH2_BASELINE_DEFAULT);
  const [rates, setRates] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [liveText, setLiveText] = useState("");

  const drawTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDraw = useCallback(
    (currentBaseline: number) => {
      if (isDrawing) return;
      setIsDrawing(true);
      setRates([]);

      const computed = Array.from({ length: CH2_SAMPLE_COUNT }, () => {
        const marbles = drawSample(CH2_N, currentBaseline);
        return countSample(marbles) / CH2_N;
      });

      const timeouts: ReturnType<typeof setTimeout>[] = [];
      computed.forEach((rate, i) => {
        const t = setTimeout(() => {
          setRates((prev) => [...prev, rate]);
          if (i === computed.length - 1) {
            setIsDrawing(false);
            setHasDrawn(true);
            const sd = binomialSD(CH2_N, currentBaseline) / CH2_N;
            const lo = Math.max(0, (currentBaseline - 2 * sd) * 100);
            const hi = Math.min(CH2_AXIS_MAX * 100, (currentBaseline + 2 * sd) * 100);
            const lifted = Math.min(CH2_AXIS_MAX, currentBaseline * (1 + CH2_LIFT));
            setLiveText(
              `Drew 100 samples at ${(currentBaseline * 100).toFixed(1)}% baseline. Lift marker at ${(lifted * 100).toFixed(1)}%. Range ${lo.toFixed(0)}% to ${hi.toFixed(0)}%.`,
            );
          }
        }, i * CH2_STAGGER_MS);
        timeouts.push(t);
      });

      drawTimeouts.current = timeouts;
    },
    [isDrawing],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => triggerDraw(baseline), CH2_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseline]);

  useEffect(() => {
    return () => {
      drawTimeouts.current.forEach(clearTimeout);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleBaselineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value) / 100;
    setBaseline(next);
    const sd = binomialSD(CH2_N, next) / CH2_N;
    const lo = Math.max(0, (next - 2 * sd) * 100);
    const hi = Math.min(CH2_AXIS_MAX * 100, (next + 2 * sd) * 100);
    const lifted = Math.min(CH2_AXIS_MAX, next * (1 + CH2_LIFT));
    setLiveText(
      `Baseline changed to ${(next * 100).toFixed(1)}%. Lift marker at ${(lifted * 100).toFixed(1)}%. Redrawing. Expected range ${lo.toFixed(0)}% to ${hi.toFixed(0)}%.`,
    );
  };

  const sd = binomialSD(CH2_N, baseline) / CH2_N;
  const lo = Math.max(0, (baseline - 2 * sd) * 100);
  const hi = Math.min(CH2_AXIS_MAX * 100, (baseline + 2 * sd) * 100);
  const liftPoints = baseline * CH2_LIFT * 100;
  const liftLabel = `+${(CH2_LIFT * 100).toFixed(0)}%`;

  let insightText: string;
  if (baseline <= 0.03) {
    insightText = `At ${(baseline * 100).toFixed(1)}% baseline, a ${liftLabel} lift is only ~${liftPoints.toFixed(1)} points. That's buried inside the usual wobble of a 100-visitor sample (${lo.toFixed(0)}%–${hi.toFixed(0)}%).`;
  } else if (baseline <= 0.1) {
    insightText = `At ${(baseline * 100).toFixed(1)}% baseline, the lift line moves by ~${liftPoints.toFixed(1)} points, but single samples still bounce around (${lo.toFixed(0)}%–${hi.toFixed(0)}%). You can tell broad differences apart, not small ones.`;
  } else {
    insightText = `At ${(baseline * 100).toFixed(1)}% baseline, a ${liftLabel} lift is ~${liftPoints.toFixed(1)} points, so the two averages separate on the axis. But a single 100-visitor sample still varies by a few points (${lo.toFixed(0)}%–${hi.toFixed(0)}%).`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[560px] items-center gap-4">
        <label className="shrink-0 text-sm font-medium text-foreground/70">
          Baseline:
        </label>
        <input
          type="range"
          min={CH2_BASELINE_MIN * 100}
          max={CH2_BASELINE_MAX * 100}
          step={0.5}
          value={baseline * 100}
          onChange={handleBaselineChange}
          aria-label="Baseline conversion rate"
          aria-valuetext={`${(baseline * 100).toFixed(1)}%`}
          className="flex-1"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">
          {(baseline * 100).toFixed(1)}%
        </span>
      </div>

      <SamplingRateDistribution rates={rates} baseline={baseline} />

      <button
        onClick={() => triggerDraw(baseline)}
        disabled={isDrawing}
        className="rounded-md bg-foreground/8 px-4 py-2 text-sm font-medium text-foreground/70 transition hover:bg-foreground/12 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {hasDrawn ? "Redraw" : "Draw 100 samples"}
      </button>

      <p className="max-w-[480px] text-center text-sm text-foreground/60">
        {insightText}
      </p>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
