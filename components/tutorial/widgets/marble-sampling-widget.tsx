"use client";

import { useState, useRef, useEffect } from "react";
import { drawSample, countSample, binomialMean } from "@/maths/sampling";
import { MarbleRow } from "./marble-row";
import { N, P } from "../constants/sampling-constants";
const MAX_ROWS = 5;
const FADE_DURATION = 250;
const PULSE_DURATION = 1400;
const BATCH_STAGGER = 110;
const DONE_DELAY = 150;

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
      className={`flex w-full min-w-0 flex-col items-center gap-0.5 rounded-[10px] border px-2 py-2.5 sm:min-w-[90px] sm:px-5 ${highlight
        ? "border-green-600/20 bg-green-600/[0.06]"
        : "border-transparent"
        }`}
    >
      <span
        className={`text-[22px] font-bold leading-none tabular-nums tracking-tight sm:text-[30px] ${highlight ? "text-green-600" : dim ? "text-foreground/35" : "text-foreground"
          }`}
      >
        {value}
      </span>
      <span className={`text-center text-[10px] leading-snug sm:text-[11px] ${dim ? "text-foreground/30" : "text-foreground/45"}`}>
        {label}
      </span>
      {sub && (
        <span className="mt-0.5 text-[9px] text-foreground/30 sm:text-[10px]">{sub}</span>
      )}
    </div>
  );
}

// ── Main widget ───────────────────────────────────────────────────────────────
type MarbleSamplingWidgetProps = {
  onSample?: (count: number) => void;
  onReset?: () => void;
  hideRows?: boolean;
};

export function MarbleSamplingWidget({
  onSample,
  onReset,
  hideRows = false,
}: MarbleSamplingWidgetProps = {}) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const drawCount = useRef(0);
  const [totalDraws, setTotalDraws] = useState(0);
  const [runningSum, setRunningSum] = useState(0);
  const [latestCount, setLatestCount] = useState<number | null>(null);
  const [liveText, setLiveText] = useState("");
  const [newestId, setNewestId] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isAnimatingRef = useRef(false);
  const [batchPending, setBatchPending] = useState(false);
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bulkTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => {
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    bulkTimeouts.current.forEach(clearTimeout);
  }, []);

  const trueMean = binomialMean(N, P);
  const currentMean = totalDraws > 0 ? runningSum / totalDraws : null;

  function handleReset() {
    bulkTimeouts.current.forEach(clearTimeout);
    bulkTimeouts.current = [];
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    isAnimatingRef.current = false;
    setIsAnimating(false);
    setBatchPending(false);
    drawCount.current = 0;
    setSamples([]);
    setTotalDraws(0);
    setRunningSum(0);
    setLatestCount(null);
    setNewestId(null);
    setLiveText("Samples cleared.");
    onReset?.();
  }

  function handleDrawN(n: number) {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const newSamples = Array.from({ length: n }, () => {
      const marbles = drawSample(N, P);
      return { marbles, count: countSample(marbles) };
    });

    setIsAnimating(true);
    bulkTimeouts.current.forEach(clearTimeout);
    bulkTimeouts.current = [];
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);

    if (n > 10) {
      // ── Batch path ────────────────────────────────────────────────────────
      // Commit all stats immediately, show a pulse for PULSE_DURATION, then
      // animate only the last MAX_ROWS rows so we never schedule 100 renders.
      const totalNewSum = newSamples.reduce((acc, s) => acc + s.count, 0);
      drawCount.current += n;
      const finalId = drawCount.current;
      const lastSample = newSamples[n - 1];

      setTotalDraws(finalId);
      setRunningSum((prev) => prev + totalNewSum);
      setLatestCount(lastSample.count);
      setBatchPending(true);

      if (onSample) {
        const stagger = PULSE_DURATION / n;
        newSamples.forEach((sample, i) => {
          const t = setTimeout(() => onSample(sample.count), i * stagger);
          bulkTimeouts.current.push(t);
        });
      }

      const phase2 = setTimeout(() => {
        setBatchPending(false);

        const toAnimate = newSamples.slice(-MAX_ROWS);
        const baseId = finalId - toAnimate.length;

        toAnimate.forEach((sample, index) => {
          const id = baseId + index + 1;
          const t = setTimeout(() => {
            setSamples((prev) => {
              const clean = prev.map((s) => s.fading ? { ...s, fading: false } : s);
              const next = [{ id, marbles: sample.marbles }, ...clean].slice(0, MAX_ROWS + 1);
              if (prev.length >= MAX_ROWS) {
                return next.map((s, i) => i === next.length - 1 ? { ...s, fading: true } : s);
              }
              return next;
            });
            setNewestId(id);

            if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
            fadeTimeout.current = setTimeout(
              () => setSamples((s) => s.filter((r) => !r.fading)),
              FADE_DURATION,
            );

            if (index === toAnimate.length - 1) {
              setLiveText(
                `Drew ${n} samples. Latest: ${lastSample.count} out of ${N} green. ${finalId} drawn in total.`,
              );
              const done = setTimeout(() => {
                isAnimatingRef.current = false;
                setIsAnimating(false);
              }, DONE_DELAY);
              bulkTimeouts.current.push(done);
            }
          }, index * BATCH_STAGGER);
          bulkTimeouts.current.push(t);
        });
      }, PULSE_DURATION);
      bulkTimeouts.current.push(phase2);

    } else {
      // ── Animated path (n=10) ──────────────────────────────────────────────
      // Per-row animation; IDs assigned at commit time; single announcement.
      const stagger = Math.round(1000 * Math.sqrt(n / 10) / n);

      newSamples.forEach((sample, index) => {
        const t = setTimeout(() => {
          const id = ++drawCount.current;
          setSamples((prev) => {
            const clean = prev.map((s) => s.fading ? { ...s, fading: false } : s);
            const next = [{ id, marbles: sample.marbles }, ...clean].slice(0, MAX_ROWS + 1);
            if (prev.length >= MAX_ROWS) {
              return next.map((s, i) => i === next.length - 1 ? { ...s, fading: true } : s);
            }
            return next;
          });
          setNewestId(id);
          setTotalDraws(id);
          setRunningSum((prev) => prev + sample.count);
          setLatestCount(sample.count);
          onSample?.(sample.count);

          if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
          fadeTimeout.current = setTimeout(
            () => setSamples((s) => s.filter((r) => !r.fading)),
            FADE_DURATION,
          );

          if (index === newSamples.length - 1) {
            setLiveText(
              `Drew ${n} samples. Latest: ${sample.count} out of ${N} green. ${id} drawn in total.`,
            );
            const done = setTimeout(() => {
              isAnimatingRef.current = false;
              setIsAnimating(false);
            }, DONE_DELAY);
            bulkTimeouts.current.push(done);
          }
        }, index * stagger);

        bulkTimeouts.current.push(t);
      });
    }
  }

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
    onSample?.(count);
  }

  const buttonLabel =
    totalDraws === 0 ? "Draw a sample" : "Draw another sample";

  return (
    <div className="flex w-full flex-col items-center gap-5">

      {/* ── Widget card ── */}
      <div className="mx-auto w-full max-w-[420px] rounded-2xl border border-foreground/10 bg-background px-4 py-5 shadow-sm sm:px-6">
        {/* Stats: latest | avg | true */}
        <div className="mb-4 grid grid-cols-3 gap-2 border-b border-foreground/[0.08] pb-4 sm:flex sm:items-stretch sm:justify-center sm:gap-1.5">
          <StatCard
            label="latest sample"
            value={latestCount !== null ? `${latestCount}/${N}` : "–"}
          />
          <div className="mx-1 hidden w-px self-stretch bg-foreground/[0.08] sm:block" />
          <StatCard
            label="your average"
            sub={`${totalDraws} sample${totalDraws !== 1 ? "s" : ""}`}
            value={currentMean !== null ? currentMean.toFixed(2) : "–"}
            highlight={currentMean !== null}
          />
          <div className="mx-1 hidden w-px self-stretch bg-foreground/[0.08] sm:block" />
          <StatCard
            label="true average"
            value={trueMean.toFixed(1)}
            dim
          />
        </div>

        {/* Buttons */}
        <div className="mb-4 flex flex-col gap-2">
          {/* Primary */}
          <button
            onClick={handleDraw}
            disabled={isAnimating}
            aria-label={`${buttonLabel}. ${totalDraws} sample${totalDraws !== 1 ? "s" : ""} drawn so far.`}
            className="w-full whitespace-nowrap rounded-[10px] bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-80 active:opacity-65 disabled:opacity-40"
          >
            {buttonLabel}
          </button>
          {/* Secondary row */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={() => handleDrawN(10)}
              disabled={isAnimating}
              aria-label="Draw 10 samples at once"
              className="w-full rounded-[10px] bg-foreground/10 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80 active:opacity-65 disabled:opacity-40 sm:flex-1"
            >
              Draw 10 samples
            </button>
            <button
              onClick={() => handleDrawN(100)}
              disabled={isAnimating}
              aria-label="Draw 100 samples at once"
              className="w-full rounded-[10px] bg-foreground/10 py-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80 active:opacity-65 disabled:opacity-40 sm:flex-1"
            >
              Draw 100 samples
            </button>
          </div>
          {/* Reset row */}
          {totalDraws > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleReset}
                disabled={isAnimating}
                aria-label="Clear all samples and start over"
                className="rounded-lg border border-foreground/20 px-3 py-1.5 text-xs font-medium text-foreground/50 transition-opacity hover:opacity-80 active:opacity-65 disabled:opacity-40"
              >
                ↺ Start over
              </button>
            </div>
          )}
        </div>

        {/* Screen-reader live region */}
        <div aria-live="polite" className="sr-only">{liveText}</div>

        {!hideRows && <div className="flex flex-col items-center">
          {batchPending ? (
            // Phase 1 of 100-draw: pulse indicator while stats settle
            <div
              aria-hidden="true"
              className="flex h-[150px] w-full items-center justify-center gap-2"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/25 animate-bounce [animation-delay:-0.32s]" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/25 animate-bounce [animation-delay:-0.16s]" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/25 animate-bounce" />
            </div>
          ) : samples.length === 0 ? (
            <div className="flex w-full items-center justify-center gap-[2px] sm:gap-[3px]">
              {Array.from({ length: N }, (_, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="h-[18px] w-[18px] rounded-full border border-dashed border-foreground/15 sm:h-[22px] sm:w-[22px]"
                />
              ))}
            </div>
          ) : (
            <div className="w-full">
              {/* Column header */}
              <div className="mb-1 flex justify-center border-b border-foreground/[0.08] pb-1.5">
                <div className="grid items-center gap-x-[8px] sm:gap-x-[10px] grid-cols-[minmax(4ch,auto)_auto_minmax(4ch,auto)]">
                  <span className="text-right text-[10px] font-semibold text-foreground/25 sm:text-[11px]" />
                  <div className="flex justify-center gap-[2px] sm:gap-[3px]">
                    {Array.from({ length: N }, (_, i) => (
                      <div key={i} className="w-[18px] text-center text-[8px] font-semibold text-foreground/25 sm:w-[22px] sm:text-[9px]">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <span className="text-left text-[9px] font-semibold text-foreground/25 sm:text-[10px]">hits</span>
                </div>
              </div>

              {/* overflow-hidden clips the fading-out row so it never adds height */}
              <div className="max-h-[150px] overflow-hidden">
                {samples.map((s) => (
                  <MarbleRow
                    key={s.id}
                    marbles={s.marbles}
                    sampleNumber={s.id}
                    isNew={s.id === newestId}
                    isFading={!!s.fading}
                  />
                ))}
              </div>

              {totalDraws > MAX_ROWS && (
                <p className="mt-3 text-center text-[12px] text-foreground/40">
                  Showing the {MAX_ROWS} most recent — {totalDraws} drawn in total
                </p>
              )}
            </div>
          )}
        </div>}
      </div>
    </div>
  );
}
