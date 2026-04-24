# Chapter 3 — Phase 1: `TwoBellsWidget`

**File:** `components/tutorial/two-bells-widget.tsx` (currently a placeholder)
**Route it lands on:** `/how-sure-do-you-need-to-be`
**Prior art to reuse:** `baseline-distribution-widget.tsx` + `sampling-rate-distribution.tsx`
**Supersedes nothing; extends chapter 2.**

---

## Goal

Promote chapter 2's dashed lift line into a full second bell, on the same axis, with the same shape logic. Two bells, shared x-axis, visible overlap.

The reader should be able to:
1. See control (A) and variant (B) as two sampling distributions on one chart.
2. Move the baseline slider and watch the absolute gap and the overlap change together.
3. Read an insight line that names what just happened.

Lift stays fixed at `CH2_LIFT = 0.10` and N stays fixed at `CH2_N = 100`. One lever, one idea.

---

## Scope (Phase 1 only)

In:
- Two-bell dot-stack render on a shared axis.
- Baseline slider (same `CH2_BASELINE_STEPS`).
- Vertical markers at both means (solid for A, dashed for B — matching ch2 styling).
- Overlap readout in copy/caption, not yet a shaded overlap region on the chart.
- aria-live text that names both means and a qualitative overlap ("heavy/moderate/light").

Out (belongs to later phases or a polish pass):
- No σ bands, no 68/95 labels (that's Phase 2's widget).
- No decision-threshold line, no confidence slider (Phase 3).
- No N slider (ch4 owns N per `09-page3-plan.md`).

---

## Implementation

### 1. Extract the theory function

`buildTheoreticalBuckets` in `baseline-distribution-widget.tsx` is the bell-shape core. Move it to `maths/sampling.ts` (alongside `binomialSD`) so both widgets can import it without one depending on the other's module. Keep the signature identical; update the ch2 widget to import from the new location.

Light refactor — no behavior change. Verify ch2 visually after the move.

### 2. New component `TwoBellsWidget`

Build from the ch2 widget as a starting point:

- State: `baseline` (same steps), debounced `liveText`.
- Compute two bucket arrays: `bucketsA = buildTheoreticalBuckets({ p: baseline, ... })` and `bucketsB = buildTheoreticalBuckets({ p: Math.min(CH2_AXIS_MAX, baseline * (1 + CH2_LIFT)), ... })`.
- Both at `totalDots: CH2_THEORY_DOT_COUNT` (400 each = 800 on screen — accept it; fall back to 250 each only if the 2% stress test overcrowds).

### 3. New render component `TwoBellsDistribution` — continuous silhouettes

**Switch from dot stacks to continuous curves for this widget.** The dot form served ch2's "each outcome is a dot" metaphor, but once two distributions share an axis the reader's job is to compare shapes and measure the distance between them. Silhouettes make that job easier: the eye locks onto the mean gap and the overlap region instead of counting stacks.

Do this as a sibling component of `SamplingRateDistribution` rather than a new mode on it — the ch2 widget stays on dots, this one goes continuous. Name it something like `TwoBellsDistribution`.

Rendering approach:

- Build the same bucket arrays from `buildTheoreticalBuckets`, then render each as an area path (e.g. `@visx/shape`'s `AreaClosed` with `curveBasis` or `curveMonotoneX` over the bucket centers). The bucket array is already a density at each percent bin — treat it as y-values over x = bin index.
- A: filled area, green (`#16a34a`) at ~0.35 opacity, stroked on top at full color for the silhouette edge.
- B: filled area, amber (`#f59e0b`) at ~0.35 opacity, stroked on top.
- Overlap reads naturally: where the two semi-transparent fills stack, the color mixes. No third-tone shading needed for Phase 1.
- Keep A's solid mean marker and B's dashed mean marker on top, same styling as ch2.
- Shared y-scale from `Math.max` across both bucket arrays.

Because we're rendering curves, `CH2_THEORY_DOT_COUNT` is no longer the right knob — the bucket array's shape is what gets drawn. Keep the 400-entry bucket resolution for smoothness; drop the per-dot rendering entirely.

**Editorial note for the page copy:** add a short line near the TwoBellsWidget — something like "We're drawing the bells as smooth silhouettes from here on. Each bell is still the same distribution you saw in chapter 2, just without the individual dots." One sentence, matter-of-fact. This establishes the continuous form as the chapter's default so Phase 2 and Phase 3 can use it without re-explaining.

### 4. Insight copy

Replace the single `insightText` with a two-bell version. Rough branches by baseline:

- `<= 0.02`: "At N=100 and a 10% relative lift, the two bells sit almost on top of each other. A single sample from either jar could easily come from the other."
- `0.05–0.10`: "The means pull apart by about X points, but the bells still overlap heavily through the middle."
- `>= 0.20`: "The bells are starting to pull apart. There's still a band in the middle where a sample from A and a sample from B look the same."

Compute the absolute gap from `baseline * CH2_LIFT * 100` so the number matches the chart.

### 5. Accessibility

aria-label on the svg:
`"Two sampling distributions on a shared axis. Control at X% (solid marker), variant at Y% (dashed marker), N=100."`

aria-live update on slider change:
`"Baseline X%. Control mean X%, variant mean Y%. Overlap {heavy|moderate|light}."`

Overlap bucket: heavy if baseline ≤ 0.05, moderate if ≤ 0.20, else light. Crude but matches the visual.

---

## Acceptance

- At 10% baseline (default), the page shows two clearly distinct stacks with substantial visible overlap.
- At 2%, the two bells are nearly indistinguishable.
- At 20%, A and B still overlap but the two peaks are clearly resolved.
- ch2 widget still renders identically after the `buildTheoreticalBuckets` extraction.
- No regressions to the chapter 2 page — verify by visual diff.

## Risks

- **Form change from dots to silhouettes:** the reader has spent all of ch2 on dots. Mitigated by the one-sentence page note establishing the new convention. If playtest readers trip on it, the fallback is to keep dots under the silhouette (very low opacity) for one chart before retiring them — but ship silhouette-only first.
- **Curve artifacts at extreme baselines:** at 1% baseline, the bell is skewed and truncated at zero; `curveBasis` can undershoot below the x-axis. Use `curveMonotoneX` or clamp the path's y to ≥ 0.
- **Color accessibility:** green + amber at 0.35 opacity, stacked, should still read in both themes. Verify on dark.
- **Shared y-scale:** both bells have the same N, so peak heights should match. Sanity check anyway.
