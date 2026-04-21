"use client";

import { useState } from "react";
import { drawSample, countSample, binomialMean, sampleMean } from "@/maths/sampling";
import { MarbleRow } from "./marble-row";
import { JarIllustration } from "./jar-illustration";

const N = 10;
const P = 0.2;
const MAX_ROWS = 5;
const FADE_DURATION = 250;

type Sample = { id: number; marbles: boolean[] };

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string | null;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex min-w-[90px] flex-col items-center gap-0.5 rounded-[10px] border px-5 py-2.5 ${highlight
        ? "border-green-600/20 bg-green-600/[0.06]"
        : "border-transparent"
        }`}
    >
      <span
        className={`text-[30px] font-bold leading-none tabular-nums tracking-tight ${highlight ? "text-green-600" : "text-foreground"
          }`}
      >
        {value}
      </span>
      <span className="text-center text-[11px] leading-snug text-foreground/45">
        {label}
      </span>
      {sub && (
        <span className="mt-0.5 text-[10px] text-foreground/30">{sub}</span>
      )}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
export function MarbleSamplingWidget() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [totalDraws, setTotalDraws] = useState(0);
  const [allCounts, setAllCounts] = useState<number[]>([]);
  const [liveText, setLiveText] = useState("");
  const [fadingId, setFadingId] = useState<number | null>(null);
  const [newestId, setNewestId] = useState<number | null>(null);

  const trueMean = binomialMean(N, P);
  const currentMean = allCounts.length > 0 ? sampleMean(allCounts) : null;
  const latestCount = allCounts.length > 0 ? allCounts[allCounts.length - 1] : null;

  const meanDiff =
    currentMean !== null ? currentMean - trueMean : null;
  const diffLabel =
    meanDiff !== null
      ? meanDiff >= 0
        ? `+${meanDiff.toFixed(2)} above true avg`
        : `${meanDiff.toFixed(2)} below true avg`
      : null;

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
    setNewestId(nextId);
    setLiveText(`Sample ${nextId}: ${count} out of ${N} green.`);
  }

  const buttonLabel =
    totalDraws === 0 ? "Draw a sample" : "Draw another sample";

  return (
    <div className="w-full rounded-lg border border-foreground/10 bg-background px-8 py-7 shadow-sm">

      {/* ── Illustration ── */}
      <div className="mb-5 flex flex-col items-center">
        <p className="mb-1 text-base font-bold tracking-tight">
          1 in 5 marbles is green (true rate 20%)
        </p>
        <p className="mb-3.5 text-[12px] text-foreground/50">
          We pick 10 marbles at random each time.
        </p>
        <JarIllustration />
      </div>

      {/* ── Stats ── */}
      <div className="mb-5 flex items-stretch justify-center gap-2 border-y border-foreground/[0.08] py-3.5">
        <StatCard label="true average" value={trueMean.toFixed(1)} />
        <div className="mx-1 w-px self-stretch bg-foreground/[0.08]" />
        <StatCard
          label="your average so far"
          value={currentMean !== null ? currentMean.toFixed(2) : "–"}
          sub={diffLabel}
        />
        <div className="mx-1 w-px self-stretch bg-foreground/[0.08]" />
        <StatCard
          label="latest sample"
          value={latestCount !== null ? `${latestCount}/${N}` : "–"}
          highlight={latestCount !== null}
        />
      </div>

      {/* ── Draw button ── */}
      <div className="mb-5 flex justify-center">
        <button
          onClick={handleDraw}
          aria-label={`${buttonLabel}. ${totalDraws} sample${totalDraws !== 1 ? "s" : ""} drawn so far.`}
          className="rounded-md bg-foreground px-7 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 active:opacity-65"
        >
          {buttonLabel}
        </button>
      </div>

      {/* ── Screen-reader live region ── */}
      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>

      {/* ── Sample rows ── */}
      <div className="min-h-[240px]">
        {samples.length === 0 ? (
          <div className="flex justify-center gap-[3px] py-5">
            {Array.from({ length: N }, (_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-[22px] w-[22px] rounded-full border border-dashed border-foreground/15"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Fixed-width inner block (label 68 + gap 10 + marbles 247 + gap 10 + count 36 = 371px) */}
            <div className="w-[371px]">
              {/* Column header */}
              <div className="mb-1 flex items-center gap-[10px] border-b border-foreground/[0.08] pb-1.5">
                <span className="w-[68px] shrink-0" />
                <div className="flex shrink-0 gap-[3px]">
                  {Array.from({ length: N }, (_, i) => (
                    <div
                      key={i}
                      className="w-[22px] text-center text-[9px] font-semibold text-foreground/25"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <span className="w-9 pl-0.5 text-[10px] font-semibold text-foreground/25">
                  hits
                </span>
              </div>

              {/* Rows */}
              {samples.map((s) => (
                <MarbleRow
                  key={s.id}
                  marbles={s.marbles}
                  sampleNumber={s.id}
                  isNew={s.id === newestId}
                  isFading={s.id === fadingId}
                />
              ))}

              {totalDraws > MAX_ROWS && (
                <p className="mt-2 text-center text-[10px] text-foreground/30">
                  showing last {MAX_ROWS} of {totalDraws} samples
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
