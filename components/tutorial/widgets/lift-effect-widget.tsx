"use client";

import { useEffect, useRef, useState } from "react";
import { BellsThresholdChart, computeBellsReadout } from "./bells-threshold-chart";
import {
  CH4_BASELINE,
  CH4_CONFIDENCE,
  CH4_DEBOUNCE_MS,
  CH4_LIFT_DEFAULT_INDEX,
  CH4_LIFT_STEPS,
  CH4_N,
} from "../constants/chapter-4-constants";

function insightFor(liftIndex: number, falseNegativeShare: number, showThreshold: boolean): string {
  const lift = CH4_LIFT_STEPS[liftIndex];
  const liftPct = (lift * 100).toFixed(0);
  if (!showThreshold) {
    if (lift <= 0.02) {
      return `At a ${liftPct}% lift, B's bell sits almost on top of A's. A single sample can't reliably tell you which group is ahead.`;
    }
    if (lift <= 0.10) {
      return `At a ${liftPct}% lift, the bells overlap heavily. Small improvements like this are easy to miss.`;
    }
    if (lift <= 0.20) {
      return `At a ${liftPct}% lift, the bells are starting to pull apart. The difference is becoming easier to see.`;
    }
    return `At a ${liftPct}% lift, the bells barely touch. An improvement this size announces itself.`;
  }
  const missedPct = (falseNegativeShare * 100).toFixed(0);
  if (lift <= 0.02) {
    return `At a ${liftPct}% lift, B's bell sits almost on top of A's. Roughly ${missedPct}% of B falls short of the line — at this N, you'd hardly ever call this a winner.`;
  }
  if (lift <= 0.10) {
    return `At a ${liftPct}% lift, the bells overlap heavily. About ${missedPct}% of B still lands left of the threshold.`;
  }
  if (lift <= 0.20) {
    return `At a ${liftPct}% lift, the bells start to pull apart. The gray region is shrinking — roughly ${missedPct}% of B still falls short.`;
  }
  return `At a ${liftPct}% lift, the bells barely touch. Only about ${missedPct}% of B lands left of the line. The lift is doing the work.`;
}

export function LiftEffectWidget({ showThreshold = true }: { showThreshold?: boolean }) {
  const [liftIndex, setLiftIndex] = useState(CH4_LIFT_DEFAULT_INDEX);
  const [liveText, setLiveText] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lift = CH4_LIFT_STEPS[liftIndex];
  const pA = CH4_BASELINE;
  const pB = pA * (1 + lift);

  const readout = computeBellsReadout({ pA, pB, n: CH4_N, confidence: CH4_CONFIDENCE });

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (showThreshold) {
        setLiveText(
          `Lift ${(lift * 100).toFixed(0)}%. Variant mean ${readout.meanB.toFixed(2)}%. False negatives ${(readout.falseNegativeShare * 100).toFixed(0)}% of variant.`,
        );
      } else {
        setLiveText(`Lift ${(lift * 100).toFixed(0)}%. Variant mean ${readout.meanB.toFixed(2)}%.`);
      }
    }, CH4_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [lift, readout.meanB, readout.falseNegativeShare, showThreshold]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-[560px] items-center gap-4">
        <label
          htmlFor="lift-effect-slider"
          className="shrink-0 text-sm font-medium text-foreground/70"
        >
          Lift:
        </label>
        <input
          id="lift-effect-slider"
          type="range"
          min={0}
          max={CH4_LIFT_STEPS.length - 1}
          step={1}
          value={liftIndex}
          onChange={(e) => setLiftIndex(Number(e.target.value))}
          aria-valuetext={`${(lift * 100).toFixed(0)}%`}
          className="flex-1"
        />
        <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground/80">
          {(lift * 100).toFixed(0)}%
        </span>
      </div>

      <BellsThresholdChart pA={pA} pB={pB} n={CH4_N} confidence={CH4_CONFIDENCE} showThreshold={showThreshold} />

      <p className="max-w-[520px] text-center text-sm text-foreground/60">
        {insightFor(liftIndex, readout.falseNegativeShare, showThreshold)}
      </p>

      <p className="text-[11px] text-foreground/45 tabular-nums">
        Baseline {(CH4_BASELINE * 100).toFixed(0)}%, N={CH4_N.toLocaleString()} per variant
        {showThreshold && <>, confidence {(CH4_CONFIDENCE * 100).toFixed(0)}%</>}.
      </p>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
