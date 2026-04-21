"use client";

import { useState } from "react";
import { drawSample, countSample, binomialMean, sampleMean } from "@/maths/sampling";
import { MarbleRow } from "./marble-row";

const N = 10;
const P = 0.2;
const MAX_ROWS = 12;
const FADE_DURATION = 200;

type Sample = { id: number; marbles: boolean[] };

export function MarbleSamplingWidget() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);
  const [allCounts, setAllCounts] = useState<number[]>([]);
  const [liveText, setLiveText] = useState("");
  const [fadingId, setFadingId] = useState<number | null>(null);

  const trueMean = binomialMean(N, P);
  const currentMean = sampleMean(allCounts);

  function handleDraw() {
    const marbles = drawSample(N, P);
    const count = countSample(marbles);
    const nextId = totalDraws + 1;

    if (samples.length >= MAX_ROWS) {
      const oldestId = samples[samples.length - 1].id;
      setFadingId(oldestId);
      setTimeout(() => {
        setSamples((s) => s.filter((r) => r.id !== oldestId));
        setFadingId(null);
      }, FADE_DURATION);
    }

    setSamples((prev) => [{ id: nextId, marbles }, ...prev].slice(0, MAX_ROWS + 1));
    setAllCounts((prev) => [...prev, count]);
    setTotalDraws(nextId);
    setLiveText(`Sample ${nextId}: ${count} out of ${N} converted.`);
  }

  const buttonLabel =
    totalDraws === 0
      ? "Draw a sample — see what you get"
      : totalDraws >= 3
        ? "Draw another"
        : "Draw a sample";

  return (
    <div className="w-full rounded-lg border border-foreground/15 bg-foreground/[0.02] px-6 py-5">
      {/* Prominent stats */}
      <div className="mb-5 flex gap-8 border-b border-foreground/10 pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-none tabular-nums">
            {trueMean.toFixed(1)}
          </span>
          <span className="text-xs text-foreground/50">jar&apos;s true average</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-bold leading-none tabular-nums">
            {allCounts.length > 0 ? currentMean.toFixed(1) : "–"}
          </span>
          <span className="text-xs text-foreground/50">
            {allCounts.length > 0 ? "your average so far" : "draw to see your average"}
          </span>
        </div>
      </div>

      <div className="mb-4 inline-flex items-center rounded-full border border-foreground/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/50">
        Every 1 in 5 marbles in this jar is green — a true rate of 20%.
      </div>

      <div>
        <button
          onClick={handleDraw}
          aria-label={`${buttonLabel}. ${totalDraws} sample${totalDraws !== 1 ? "s" : ""} drawn so far.`}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80 active:opacity-70"
        >
          {buttonLabel}
        </button>
      </div>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>

      <div className="mt-5">
        {samples.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-0.5">
            {samples.map((s, i) => (
              <MarbleRow
                key={s.id}
                marbles={s.marbles}
                sampleNumber={s.id}
                isFirst={i === 0}
                isFading={s.id === fadingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="w-20 shrink-0" />
      <div className="flex gap-1">
        {Array.from({ length: N }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="h-5 w-5 rounded-full border border-dashed border-foreground/20"
          />
        ))}
      </div>
      <span className="ml-2 text-xs text-foreground/30">
        click the button to draw your first sample
      </span>
    </div>
  );
}
