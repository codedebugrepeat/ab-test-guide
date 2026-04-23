"use client";

import { useState, useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { binomialSD } from "@/maths/sampling";
import { SamplingRateDistribution } from "./sampling-rate-distribution";
import {
  CH2_BASELINE_DEFAULT,
  CH2_BASELINE_STEPS,
  CH2_AXIS_MAX,
  CH2_LIFT,
  CH2_N,
  CH2_DEBOUNCE_MS,
  CH2_THEORY_DOT_COUNT,
} from "./chapter-2-constants";

function buildTheoreticalBuckets({
  n,
  p,
  maxBin,
  totalDots,
}: {
  n: number;
  p: number;
  maxBin: number;
  totalDots: number;
}) {
  const buckets = Array.from({ length: maxBin + 1 }, () => 0);
  if (p <= 0) {
    buckets[0] = totalDots;
    return buckets;
  }
  if (p >= 1) {
    buckets[maxBin] = totalDots;
    return buckets;
  }

  // Binomial PMF via recurrence to avoid huge binomial coefficients.
  // We first compute raw weights per visible bin, then allocate exactly totalDots
  // using a largest-remainder method. This avoids rounding drift.
  const raw = Array.from({ length: maxBin + 1 }, () => 0);

  // P(K=0) = (1-p)^n
  let prob = Math.pow(1 - p, n);
  for (let k = 0; k <= n; k += 1) {
    const ratePct = Math.round((k / n) * 100);
    if (ratePct <= maxBin) raw[ratePct] += prob;
    // out-of-range outcomes are silently dropped; we scale against the full
    // probability mass (1.0) below so visible bins stay proportionally faithful.

    // P(K=k+1) = P(K=k) * (n-k)/(k+1) * p/(1-p)
    if (k < n) {
      prob = (prob * (n - k)) / (k + 1);
      prob = (prob * p) / (1 - p);
    }
  }

  const visibleMass = raw.reduce((acc, v) => acc + v, 0);
  if (visibleMass <= 0) {
    buckets[Math.min(maxBin, Math.max(0, Math.round(p * 100)))] = totalDots;
    return buckets;
  }

  // Scale against 1.0 (full probability), not visibleMass, so that each bin
  // reflects its true share of totalDots and overflow tails don't spike the edge.
  const scaled = raw.map((v) => v * totalDots);
  const floored = scaled.map((v) => Math.floor(v));
  let remaining = Math.round(visibleMass * totalDots) - floored.reduce((acc, v) => acc + v, 0);

  const remainders = scaled
    .map((v, idx) => ({ idx, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);

  for (let i = 0; i < remainders.length && remaining > 0; i += 1) {
    floored[remainders[i].idx] += 1;
    remaining -= 1;
  }

  for (let i = 0; i < buckets.length; i += 1) {
    buckets[i] = floored[i];
  }

  return buckets;
}

export function BaselineDistributionWidget() {
  const [baseline, setBaseline] = useState(CH2_BASELINE_DEFAULT);
  const [liveText, setLiveText] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const next = baseline;
    debounceRef.current = setTimeout(() => {
      const lifted = Math.min(CH2_AXIS_MAX, next * (1 + CH2_LIFT));
      setLiveText(
        `Baseline changed to ${(next * 100).toFixed(1)}%. Lift marker at ${(lifted * 100).toFixed(1)}%. Showing the theoretical distribution for ${CH2_N} visitors.`,
      );
    }, CH2_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [baseline]);

  const handleBaselineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    const next = CH2_BASELINE_STEPS[Math.min(CH2_BASELINE_STEPS.length - 1, Math.max(0, idx))];
    setBaseline(next);
  };

  const theoryBuckets = useMemo(() => {
    return buildTheoreticalBuckets({
      n: CH2_N,
      p: baseline,
      maxBin: Math.round(CH2_AXIS_MAX * 100),
      totalDots: CH2_THEORY_DOT_COUNT,
    });
  }, [baseline]);

  const sd = binomialSD(CH2_N, baseline) / CH2_N;
  const lo = Math.max(0, (baseline - 2 * sd) * 100);
  const hi = Math.min(CH2_AXIS_MAX * 100, (baseline + 2 * sd) * 100);
  const liftPoints = baseline * CH2_LIFT * 100;
  const liftLabel = `+${(CH2_LIFT * 100).toFixed(0)}%`;

  let insightText: string;
  if (baseline <= 0.03) {
    insightText = `At ${(baseline * 100).toFixed(0)}% baseline, a ${liftLabel} lift is only ~${liftPoints.toFixed(1)} points. That's buried inside the usual wobble of a 100-visitor sample (${lo.toFixed(0)}%–${hi.toFixed(0)}%).`;
  } else if (baseline <= 0.1) {
    insightText = `At ${(baseline * 100).toFixed(0)}% baseline, the lift line moves by ~${liftPoints.toFixed(1)} points, but single samples still bounce around (${lo.toFixed(0)}%–${hi.toFixed(0)}%). You can tell broad differences apart, not small ones.`;
  } else {
    insightText = `At ${(baseline * 100).toFixed(0)}% baseline, a ${liftLabel} lift is ~${liftPoints.toFixed(1)} points, so the two averages separate on the axis. But a single 100-visitor sample still varies by a few points (${lo.toFixed(0)}%–${hi.toFixed(0)}%).`;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[560px] items-center gap-4">
        <label className="shrink-0 text-sm font-medium text-foreground/70">
          Baseline:
        </label>
        <input
          type="range"
          min={0}
          max={CH2_BASELINE_STEPS.length - 1}
          step={1}
          value={baselineIndex}
          onChange={handleBaselineChange}
          aria-label="Baseline conversion rate"
          aria-valuetext={`${(baseline * 100).toFixed(0)}%`}
          className="flex-1"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">
          {(baseline * 100).toFixed(0)}%
        </span>
      </div>

      <SamplingRateDistribution buckets={theoryBuckets} baseline={baseline} />

      <p className="max-w-[480px] text-center text-sm text-foreground/60">
        {insightText}
      </p>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
