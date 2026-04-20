"use client";

import { useState } from "react";
import { drawSample, countSample } from "@/maths/sampling";
import { MarbleRow } from "./marble-row";

const N = 10;
const P = 0.2;
const MAX_ROWS = 12;
const FADE_DURATION = 200;

type Sample = { id: number; marbles: boolean[] };

export function MarbleSamplingWidget() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);
  const [liveText, setLiveText] = useState("");
  const [fadingId, setFadingId] = useState<number | null>(null);

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
    <div className="rounded-lg border border-foreground/15 bg-foreground/[0.02] px-6 py-5">
      <div className="mb-4 inline-flex items-center rounded-full border border-foreground/15 bg-foreground/[0.04] px-3 py-1 text-xs text-foreground/50">
        Jar: 20% conversion rate
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
      <span className="w-16 shrink-0" />
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
