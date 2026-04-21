"use client";

import { useState, useRef, useEffect } from "react";
import { drawSample, countSample, binomialMean } from "@/maths/sampling";
import { MarbleRow } from "./marble-row";
import { JarIllustration, WJAR_W } from "./jar-illustration";
import { N, P } from "./sampling-constants";
const MAX_ROWS = 5;
const FADE_DURATION = 250;

type Sample = { id: number; marbles: boolean[]; fading?: boolean };

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight = false,
  dim = false,
}: {
  label: string;
  value: string;
  sub?: string | null;
  highlight?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      className={`flex min-w-[90px] flex-col items-center gap-0.5 rounded-[10px] border px-5 py-2.5 ${highlight
        ? "border-green-600/20 bg-green-600/[0.06]"
        : "border-transparent"
        }`}
    >
      <span
        className={`text-[30px] font-bold leading-none tabular-nums tracking-tight ${highlight ? "text-green-600" : dim ? "text-foreground/35" : "text-foreground"
          }`}
      >
        {value}
      </span>
      <span className={`text-center text-[11px] leading-snug ${dim ? "text-foreground/30" : "text-foreground/45"}`}>
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
  const drawCount = useRef(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [runningSum, setRunningSum] = useState(0);
  const [latestCount, setLatestCount] = useState<number | null>(null);
  const [liveText, setLiveText] = useState("");
  const [newestId, setNewestId] = useState<number | null>(null);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (fadeTimeout.current) clearTimeout(fadeTimeout.current); }, []);

  const trueMean = binomialMean(N, P);
  const currentMean = totalDraws > 0 ? runningSum / totalDraws : null;

  function handleDraw() {
    const marbles = drawSample(N, P);
    const count = countSample(marbles);
    const nextId = ++drawCount.current;

    setSamples((prev) => {
      const next = [{ id: nextId, marbles }, ...prev].slice(0, MAX_ROWS + 1);
      if (prev.length >= MAX_ROWS) {
        const lastIdx = next.length - 1;
        return next.map((s, i) => i === lastIdx ? { ...s, fading: true } : s);
      }
      return next;
    });

    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    fadeTimeout.current = setTimeout(() => {
      setSamples((s) => s.filter((r) => !r.fading));
    }, FADE_DURATION);
    setTotalDraws(nextId);
    setRunningSum((prev) => prev + count);
    setLatestCount(count);
    setNewestId(nextId);
    setLiveText(`Sample ${nextId}: ${count} out of ${N} green.`);
  }

  const buttonLabel =
    totalDraws === 0 ? "Draw a sample" : "Draw another sample";

  return (
    <div className="flex flex-col items-center gap-5">

      {/* ── Illustration (above card) ── */}
      <div className="text-center">
        <p className="mb-1 text-base font-bold tracking-tight">
          1 in 5 marbles is green (true rate 20%)
        </p>
        <p className="mb-4 text-[12px] text-foreground/50">
          We pick 10 marbles at random each time.
        </p>
        <JarIllustration />
      </div>

      {/* Divider */}
      <div className="w-full max-w-[420px] border-t border-foreground/10" />


      {/* ── Widget card ── */}
      <div
        className="rounded-2xl border border-foreground/10 bg-background px-6 py-5 shadow-sm"
        style={{ width: WJAR_W }}
      >
        {/* Stats: latest | avg | true */}
        <div className="mb-4 flex items-stretch justify-center gap-1.5 border-b border-foreground/[0.08] pb-4">
          <StatCard
            label="latest sample"
            value={latestCount !== null ? `${latestCount}/${N}` : "–"}
            highlight={latestCount !== null}
          />
          <div className="mx-1 w-px self-stretch bg-foreground/[0.08]" />
          <StatCard
            label="your average"
            sub={`${totalDraws} sample${totalDraws !== 1 ? "s" : ""}`}
            value={currentMean !== null ? currentMean.toFixed(2) : "–"}
          />
          <div className="mx-1 w-px self-stretch bg-foreground/[0.08]" />
          <StatCard
            label="true average"
            value={trueMean.toFixed(1)}
            dim
          />
        </div>

        {/* Full-width draw button */}
        <button
          onClick={handleDraw}
          aria-label={`${buttonLabel}. ${totalDraws} sample${totalDraws !== 1 ? "s" : ""} drawn so far.`}
          className="mb-4 w-full rounded-[10px] bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80 active:opacity-65"
        >
          {buttonLabel}
        </button>

        {/* Screen-reader live region */}
        <div aria-live="polite" className="sr-only">{liveText}</div>

        {/* Sample rows */}
        <div className="flex flex-col items-center">
          {samples.length === 0 ? (
            <div className="flex justify-center gap-[3px] py-3">
              {Array.from({ length: N }, (_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="h-[22px] w-[22px] rounded-full border border-dashed border-foreground/15"
                />
              ))}
            </div>
          ) : (
            // Fixed-width inner block (label 68 + gap 10 + marbles 247 + gap 10 + count 36 = 371px)
            <div className="w-[371px]">
              {/* Column header */}
              <div className="mb-1 flex items-center gap-[10px] border-b border-foreground/[0.08] pb-1.5">
                <span className="w-[68px] shrink-0" />
                <div className="flex shrink-0 gap-[3px]">
                  {Array.from({ length: N }, (_, i) => (
                    <div key={i} className="w-[22px] text-center text-[9px] font-semibold text-foreground/25">
                      {i + 1}
                    </div>
                  ))}
                </div>
                <span className="w-9 pl-0.5 text-[10px] font-semibold text-foreground/25">hits</span>
              </div>

              {samples.map((s) => (
                <MarbleRow
                  key={s.id}
                  marbles={s.marbles}
                  sampleNumber={s.id}
                  isNew={s.id === newestId}
                  isFading={!!s.fading}
                />
              ))}

              {totalDraws > MAX_ROWS && (
                <p className="mt-2 text-center text-[10px] text-foreground/30">
                  showing last {MAX_ROWS} of {totalDraws} samples
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
