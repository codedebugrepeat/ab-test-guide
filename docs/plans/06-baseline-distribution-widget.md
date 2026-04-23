# Phase 2 — Build Widget 2: "Baseline changes the shape"

**Update (pivot):** For the improved “baseline vs lift” framing (two average markers), see `docs/plans/08-widget2-pivot-lift-marker.md`.

**Status:** Ready to implement. Widget 1 (`SamplingDistributionBuilder`) is done. This document covers the three files to create and one page edit to wire it in.

---

## Files to create

### 1. `components/tutorial/chapter-2-constants.ts`

```ts
export const CH2_BASELINE_MIN  = 0.01;   // 1%
export const CH2_BASELINE_MAX  = 0.25;   // 25%
export const CH2_BASELINE_DEFAULT = 0.05; // 5%
export const CH2_N             = 100;    // sample size (fixed for Ch2)
export const CH2_SAMPLE_COUNT  = 100;    // draws per batch
export const CH2_AXIS_MAX      = 0.35;   // fixed x-axis ceiling (35%)
export const CH2_STAGGER_MS    = 10;     // ms between dot reveals during animation
export const CH2_DEBOUNCE_MS   = 120;    // ms debounce on slider
```

Don't import from `sampling-constants.ts` — those are Ch1 values (N=10, P=0.2) and must stay isolated.

---

### 2. `components/tutorial/sampling-rate-distribution.tsx`

The dot plot. Receives pre-computed rates and renders them; owns no sampling logic.

```tsx
"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { binomialSD } from "@/maths/sampling";
import { CH2_N, CH2_AXIS_MAX } from "./chapter-2-constants";

type Props = {
  rates: number[];    // observed sample rates as fractions, e.g. 0.03
  baseline: number;  // current true baseline as fraction, e.g. 0.05
};
```

**Key layout decisions:**

| Constant | Value | Reason |
|---|---|---|
| `WIDTH` | 560 | Wider than Widget 1's 420 — 36 bins need room |
| `HEIGHT` | 320 | Same as Widget 1 |
| `MARGIN` | `{ top:44, right:20, bottom:50, left:46 }` | Extra bottom for rate axis labels |
| `PLOT_W` | 494 | 560 − 66 |

**X-axis bins:** integers 0–35, representing 0%–35%. Domain for `scaleBand` is `[0, 1, 2, …, 35]`. Bin a rate `r` with `Math.round(r * 100)`, clamped to `[0, 35]`. Tick labels every 5 bins (`0, 5, 10, 15, 20, 25, 30, 35`) formatted as `"X%"`.

**Y-axis:** `scaleLinear` from 0 to `Math.max(1, maxBucket)`. Same adaptive tick interval logic as Widget 1.

**±2σ band (rendered first, behind dots):**
```
const sd = binomialSD(CH2_N, baseline) / CH2_N;  // rate SD (not count SD)
const loFrac = Math.max(0, baseline - 2 * sd);
const hiFrac = Math.min(CH2_AXIS_MAX, baseline + 2 * sd);
const loBin  = Math.round(loFrac * 100);
const hiBin  = Math.round(hiFrac * 100);
// rect from left edge of loBin column to right edge of hiBin column
```
Color: `fill="currentColor" fillOpacity={0.05}`, no stroke. Label `"~95% of samples"` at top-right of the rect, small text, `fillOpacity={0.3}`.

**True baseline line:**
```
const trueBin = Math.round(baseline * 100);
// vertical dashed line at colX(trueBin), from y=-6 to y=PLOT_H
// label above: "truth: X%"
```
Same style as Widget 1's true-mean marker.

**Dots:**
Same pattern as `DiscreteSamplingDistribution` — keyed by insertion index, render stacked. Use `animate-dot-drop` CSS class and `transformBox: "fill-box"`. Dot radius `DOT_R_NOMINAL = 4`, same scaling logic if stacks overflow.

**Placeholder slots:** Same dashed placeholder circles above each column's current stack (`PLACEHOLDER_ROWS = 3`).

**Accessible `aria-label`:**
```
`Sampling rate distribution of ${rates.length} draws at ${(baseline*100).toFixed(1)}% baseline, ranging from ${loFrac*100}% to ${hiFrac*100}%.`
```

---

### 3. `components/tutorial/baseline-distribution-widget.tsx`

The wrapper. Owns the slider state, sampling logic, animation, and insight text. Passes `rates[]` and `baseline` down to `SamplingRateDistribution`.

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { drawSample, countSample, binomialSD } from "@/maths/sampling";
import { SamplingRateDistribution } from "./sampling-rate-distribution";
import {
  CH2_BASELINE_MIN, CH2_BASELINE_MAX, CH2_BASELINE_DEFAULT,
  CH2_N, CH2_SAMPLE_COUNT, CH2_STAGGER_MS, CH2_DEBOUNCE_MS,
} from "./chapter-2-constants";
```

**State:**
- `baseline: number` — current slider value (fraction)
- `rates: number[]` — the visible rates in the chart (grows during animation)
- `isDrawing: boolean` — lock while animation in progress

**Slider markup:**
```tsx
<input
  type="range"
  min={CH2_BASELINE_MIN * 100}
  max={CH2_BASELINE_MAX * 100}
  step={0.5}
  value={baseline * 100}
  onChange={(e) => setBaseline(Number(e.target.value) / 100)}
  aria-label="Baseline conversion rate"
  aria-valuetext={`${(baseline * 100).toFixed(1)}%`}
/>
```
Show current value inline: `<span>{(baseline * 100).toFixed(1)}%</span>`.

**Auto-draw on slider settle (debounce):**
```ts
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

useEffect(() => {
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => triggerDraw(), CH2_DEBOUNCE_MS);
  return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
}, [baseline]);
```

**`triggerDraw` function:**
```ts
function triggerDraw() {
  if (isDrawing) return;
  setIsDrawing(true);
  setRates([]);  // clear previous

  const computed = Array.from({ length: CH2_SAMPLE_COUNT }, () => {
    const marbles = drawSample(CH2_N, baseline);
    return countSample(marbles) / CH2_N;
  });

  const timeouts: ReturnType<typeof setTimeout>[] = [];
  computed.forEach((rate, i) => {
    const t = setTimeout(() => {
      setRates((prev) => [...prev, rate]);
      if (i === computed.length - 1) setIsDrawing(false);
    }, i * CH2_STAGGER_MS);
    timeouts.push(t);
  });

  drawTimeouts.current = timeouts;
}
```
Store timeouts in a ref so reset/remount can cancel them.

**"Draw 100 samples" / "Redraw" button:** calls `triggerDraw()`. Label is `"Draw 100 samples"` before any draw; `"Redraw"` after first draw. Disabled while `isDrawing`.

**Auto-draw on mount:** The `useEffect` on `baseline` fires immediately with `CH2_BASELINE_DEFAULT`, which debounces and triggers the first draw. No extra `useEffect` needed.

**Cleanup on unmount:**
```ts
useEffect(() => {
  return () => {
    drawTimeouts.current.forEach(clearTimeout);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, []);
```

**Dynamic insight text** (below the chart):

Computed from the current `baseline` value using `binomialSD`:
```ts
const sd = binomialSD(CH2_N, baseline) / CH2_N;
const lo = Math.max(0, (baseline - 2 * sd) * 100);
const hi = Math.min(35, (baseline + 2 * sd) * 100);
const spread = hi - lo;
const multiple = (spread / 2) / (baseline * 100);
```

| Condition | Text |
|---|---|
| `baseline <= 0.03` | `At {X}% baseline, a sample of 100 could show anywhere from {lo}% to {hi}%. That's a spread of {spread.toFixed(1)} points — more than double the truth itself.` |
| `baseline <= 0.10` | `At {X}% baseline, your sample will land roughly between {lo}% and {hi}%. You can tell broad differences apart, not small ones.` |
| `baseline > 0.10` | `At {X}% baseline, your sample will land within ~{(spread/2).toFixed(1)} points of the truth. That's tight enough to spot a real change.` |

Numbers use `(baseline * 100).toFixed(1)` for X, `lo.toFixed(0)` / `hi.toFixed(0)` for range.

**`aria-live` region:**
```tsx
<div aria-live="polite" className="sr-only">
  {liveText}
</div>
```
Update `liveText` when draw completes: `"Drew 100 samples at ${X}% baseline, ranging from ${lo}% to ${hi}%."`. Also announce slider changes: `"Baseline changed to ${X}%; redrawing."`.

---

## File to edit

### `app/how-many-visitors-do-you-need/page.tsx`

Replace:
```tsx
import { SamplingDistributionBuilder } from "@/components/tutorial/sampling-distribution-builder";
// ...
<WidgetFrame>
  <SamplingDistributionBuilder />
</WidgetFrame>
```

With:
```tsx
import { BaselineDistributionWidget } from "@/components/tutorial/baseline-distribution-widget";
// ...
<WidgetFrame>
  <BaselineDistributionWidget />
</WidgetFrame>
```

No other page changes in this phase — copy restructure is Phase 3.

---

## Verification checklist

- [ ] Slider moves → dots clear immediately → new dots animate in over ~1s
- [ ] ±2σ band visually widens when baseline is low (2%), narrows relatively when high (20%)
- [ ] Truth line tracks the slider
- [ ] Insight text adapts correctly at the three breakpoints (≤3%, 3–10%, >10%)
- [ ] "Redraw" replaces (not appends) the current distribution
- [ ] Keyboard: slider is navigable via arrow keys; `aria-valuetext` reads correctly
- [ ] Screen reader: `aria-live` announces slider moves and completed draws
- [ ] No layout shift when dots animate in (fixed SVG viewBox + `h-auto`)
- [ ] Mobile: widget scales down cleanly (SVG is `w-full h-auto`)
