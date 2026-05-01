"use client";

import { useEffect, useRef, useState } from "react";
import { BellsThresholdChart } from "./bells-threshold-chart";
import { CH4_DEBOUNCE_MS } from "../constants/chapter-4-constants";
import { requiredSampleSize, estimateDuration, formatDuration, type Period } from "@/maths/calculator";
import { type ConfidenceLevel } from "@/maths/sampling";
import { WidgetFrame } from "./widget-frame";

const CONFIDENCE_OPTIONS = [0.9, 0.95, 0.99] as const satisfies readonly ConfidenceLevel[];

type NumberInputProps = {
  id?: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  suffix?: string;
  onChange: (v: number) => void;
};

function NumberInput({ id, label, value, min, max, step, decimals, suffix, onChange }: NumberInputProps) {
  const [raw, setRaw] = useState(value.toFixed(decimals));
  const committed = useRef(value);

  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setRaw(value.toFixed(decimals));
    }
  }, [value, decimals]);

  function commit(str: string) {
    const n = parseFloat(str);
    if (Number.isNaN(n)) {
      setRaw(committed.current.toFixed(decimals));
      return;
    }
    const clamped = Math.min(max, Math.max(min, n));
    const rounded = Math.round(clamped / step) * step;
    committed.current = rounded;
    setRaw(rounded.toFixed(decimals));
    onChange(rounded);
  }

  function step_(dir: 1 | -1) {
    const next = Math.min(max, Math.max(min, committed.current + dir * step));
    const rounded = Math.round(next / step) * step;
    committed.current = rounded;
    setRaw(rounded.toFixed(decimals));
    onChange(rounded);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => step_(-1)}
        className="flex h-7 w-7 items-center justify-center rounded border border-foreground/15 text-sm text-foreground/60 hover:bg-foreground/5 active:bg-foreground/10"
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <div className="relative flex items-center">
        <input
          id={id}
          aria-label={id ? undefined : label}
          type="number"
          value={raw}
          min={min}
          max={max}
          step={step}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit((e.target as HTMLInputElement).value);
          }}
          className="w-24 rounded border border-foreground/15 bg-transparent py-1 pl-2 pr-6 text-right text-sm font-semibold tabular-nums text-foreground/90 focus:outline-none focus:ring-1 focus:ring-foreground/30"
        />
        {suffix && (
          <span className="pointer-events-none absolute right-2 text-sm text-foreground/50">
            {suffix}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => step_(1)}
        className="flex h-7 w-7 items-center justify-center rounded border border-foreground/15 text-sm text-foreground/60 hover:bg-foreground/5 active:bg-foreground/10"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}

type LeverRowProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  suffix?: string;
  onChange: (v: number) => void;
};

function LeverRow({ id, label, value, min, max, step, decimals, suffix, onChange }: LeverRowProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <label htmlFor={id} className="w-full text-sm font-medium text-foreground/70 sm:w-28 sm:shrink-0">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${value.toFixed(decimals)}${suffix ?? ""}`}
        className="w-full sm:flex-1"
      />
      <div className="flex w-full justify-end sm:w-auto sm:shrink-0">
        <NumberInput
          label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          decimals={decimals}
          suffix={suffix}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

const DEFAULTS = { baseline: 10, lift: 10, confidence: 0.95 as ConfidenceLevel };

export function CalculatorWidget() {
  const [baseline, setBaseline] = useState(DEFAULTS.baseline);
  const [lift, setLift] = useState(DEFAULTS.lift);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(DEFAULTS.confidence);
  const [visitorsPerPeriod, setVisitorsPerPeriod] = useState<number>(1000);
  const [period, setPeriod] = useState<Period>("day");
  const [liveText, setLiveText] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDefault = baseline === DEFAULTS.baseline && lift === DEFAULTS.lift && confidence === DEFAULTS.confidence;

  function reset() {
    setBaseline(DEFAULTS.baseline);
    setLift(DEFAULTS.lift);
    setConfidence(DEFAULTS.confidence);
  }

  const pA = baseline / 100;
  const pB = Math.min(0.999, pA * (1 + lift / 100));

  const requiredN = requiredSampleSize(pA, lift / 100, confidence);
  const feasible = Number.isFinite(requiredN);
  // Fixed intentionally: constant n keeps bell widths stable so the curves visibly drift apart as sliders move, building intuition.
  const chartN = 1000;

  const baselineLabel = (Math.round(baseline * 10) / 10).toString();
  const liftLabel = (Math.round(lift * 10) / 10).toString();
  const confidenceLabel = (confidence * 100).toString();

  const duration = feasible ? estimateDuration(requiredN, visitorsPerPeriod) : null;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLiveText(
        feasible
          ? `Baseline ${baselineLabel}%, lift ${liftLabel}%, confidence ${confidenceLabel}%. You need ${requiredN.toLocaleString()} visitors per variant.`
          : `Baseline ${baselineLabel}%, lift ${liftLabel}%, confidence ${confidenceLabel}%. Infeasible — adjust your inputs.`,
      );
    }, CH4_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [baseline, lift, confidence, requiredN, feasible, baselineLabel, liftLabel, confidenceLabel]);

  return (
    <div className="flex flex-col gap-6">
      {/* Levers */}
      <div className="flex flex-col gap-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            Inputs
          </span>
          <button
            type="button"
            onClick={reset}
            disabled={isDefault}
            className="text-xs text-foreground/40 transition-colors hover:text-foreground/70 disabled:pointer-events-none disabled:opacity-0"
          >
            Reset to defaults
          </button>
        </div>
        <LeverRow
          id="calc-baseline"
          label="Baseline"
          value={baseline}
          min={0}
          max={100}
          step={0.1}
          decimals={1}
          suffix="%"
          onChange={setBaseline}
        />
        <LeverRow
          id="calc-lift"
          label="Min. detectable lift"
          value={lift}
          min={0}
          max={100}
          step={0.1}
          decimals={1}
          suffix="%"
          onChange={setLift}
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="w-full text-sm font-medium text-foreground/70 sm:w-28 sm:shrink-0">
            Confidence
          </span>
          <div role="radiogroup" aria-label="Confidence level" className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
            {CONFIDENCE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={confidence === opt}
                onClick={() => setConfidence(opt)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 ${confidence === opt
                  ? "border-foreground/40 bg-foreground/10 text-foreground"
                  : "border-foreground/15 text-foreground/50 hover:border-foreground/25 hover:text-foreground/75"
                  }`}
              >
                {opt * 100}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary readout */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Output
        </p>
        <div className="mt-3 grid grid-cols-2 divide-x divide-foreground/10">
          <div className="pr-5">
            <p className="text-xs text-foreground/40">Minimum visitors in A</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {feasible ? requiredN.toLocaleString() : "—"}
            </p>
          </div>
          <div className="pl-5">
            <p className="text-xs text-foreground/40">Minimum visitors in B</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              {feasible ? requiredN.toLocaleString() : "—"}
            </p>
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/55">
          {feasible
            ? `Each side needs ~${requiredN.toLocaleString()} visitors to detect a ${liftLabel}% relative lift on a ${baselineLabel}% baseline at ${confidenceLabel}% confidence.`
            : "Infeasible with these inputs — try raising baseline, reducing lift target, or lowering confidence."}
        </p>
      </div>

      {/* Chart */}
      <WidgetFrame>
        <div className="flex w-full justify-center">
          {baseline <= 0 || baseline >= 100 ? (
            <div className="flex h-[320px] w-full items-center justify-center rounded-xl border border-dashed border-foreground/15">
              <p className="text-sm text-foreground/35">Set a baseline between 0% and 100% to see the chart.</p>
            </div>
          ) : (
            <BellsThresholdChart pA={pA} pB={pB} n={chartN} confidence={confidence} />
          )}
        </div>
      </WidgetFrame>

      {/* Duration estimator */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
            How long will it take?
          </p>
          <div role="radiogroup" aria-label="Period" className="flex gap-1">
            {(["day", "week", "month"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={period === p}
                onClick={() => setPeriod(p)}
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition-colors ${period === p
                  ? "border-foreground/40 bg-foreground/10 text-foreground"
                  : "border-foreground/15 text-foreground/50 hover:border-foreground/25 hover:text-foreground/75"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <label htmlFor="calc-visitors-per-period" className="w-full text-sm text-foreground/70 sm:w-40 sm:shrink-0">
            Visitors per {period}
          </label>
          <div className="flex w-full justify-end sm:flex-1 sm:justify-end">
            <NumberInput
              id="calc-visitors-per-period"
              label={`Visitors per ${period}`}
              value={visitorsPerPeriod}
              min={1}
              max={10_000_000}
              step={1}
              decimals={0}
              onChange={setVisitorsPerPeriod}
            />
          </div>
        </div>
        <p className="mt-4 text-2xl font-semibold tabular-nums">
          {duration !== null ? formatDuration(duration, period) : "—"}
        </p>
        <p className="mt-1 text-sm text-foreground/55">
          {duration !== null && feasible
            ? `At ${visitorsPerPeriod.toLocaleString()} visitors per ${period}, you need ${formatDuration(duration, period)} to collect the ${(requiredN * 2).toLocaleString()} total visitors required.`

            : feasible
              ? "Enter visitors per period to estimate runtime."
              : "Set valid inputs above to estimate runtime."}
        </p>
      </div>

      {/* Assumptions callout */}
      <div className="rounded-xl border border-foreground/15 bg-foreground/[0.02] p-5 text-sm text-foreground/60">
        <p className="font-semibold text-foreground/80">Assumptions</p>
        <ul className="mt-2 space-y-1.5 list-disc list-inside">
          <li>
            <strong className="text-foreground/75">Conversion rate metric.</strong>{" "}
            The numbers here assume you&apos;re measuring a conversion rate (e.g. signup, purchase) — not revenue, time-on-page, or other continuous metrics.
          </li>
          <li>
            <strong className="text-foreground/75">One-tailed test.</strong>{" "}
            This calculator only checks whether B beats A — not whether A beats B. One tail, one direction.
          </li>
          <li>
            <strong className="text-foreground/75">Power fixed at 80%.</strong>{" "}
            Power is the chance of catching a real win if one exists. We lock it at 80% here and leave that lever for a later chapter.
          </li>
        </ul>
      </div>

      <div aria-live="polite" className="sr-only">
        {liveText}
      </div>
    </div>
  );
}
