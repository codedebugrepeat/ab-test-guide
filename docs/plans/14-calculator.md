# Calculator reimplementation

## Context

The `/calculator` page is the finale of the guide — beginners pull every lever and watch the picture respond. The current widget at `components/tutorial/widgets/calculator-widget.tsx` exposes four discrete-stepped sliders (baseline, lift, confidence, visitors/variant) and uses `n` as an input that the user must compare against a computed required sample size.

The user wants to flip this: only **three** levers (baseline, MDE/lift, confidence) drive the calculator, and **visitors/variant becomes the output** — the minimum sample size needed. Each lever needs a continuous slider plus a typeable number picker (with arrow buttons and input validation). An assumptions callout below explains the two simplifications (one-tailed test; power fixed at 80%).

## Critical files

- `components/tutorial/widgets/calculator-widget.tsx` — full rewrite of widget body
- `app/calculator/page.tsx` — light copy edit so paragraphs match the new layout
- `maths/sampling.ts` — add `normalInv(p)` (one-sided z from arbitrary confidence in [0.5, 0.999])

## Lever ranges and steps

| Lever | Range | Slider step | Input step | Default |
| --- | --- | --- | --- | --- |
| Baseline | 0% – 100% | 0.1% | 0.1% | 10% |
| MDE (relative lift) | 0% – 100% | 0.1% | 0.1% | 10% |
| Confidence | 80% – 99.9% | 0.1% | 0.1% | 95% |

Edge handling:
- Baseline 0% or 100% → `requiredN = ∞` (display `—` with a small "infeasible at this baseline" caption).
- Lift 0% → `requiredN = ∞` (same caption).
- Baseline × (1 + lift) ≥ 100% → clamp `pB` to just under 1 for the chart; the formula already returns ∞ in that branch.

## Computation

Reuse `requiredSampleSize` already in the widget; replace the discrete `Z_BY_CONFIDENCE` lookup with a continuous inverse-normal call:

```ts
const za = normalInv(confidence);     // one-sided
const zb = 0.8416;                    // power fixed at 80%
```

Add `normalInv` in `maths/sampling.ts` using Acklam's rational approximation (accurate to ~1e-9 over [0.5, 0.9999]). Keep `Z_BY_CONFIDENCE` for existing chapter widgets that use the discrete map.

## UI structure

```
┌─ Three lever rows ──────────────────────────────────────┐
│ [label]  [────slider────]  [− 10.0 % +]                 │  ← number picker
│ [label]  [────slider────]  [− 10.0 % +]                 │
│ [label]  [────slider────]  [− 95.0 % +]                 │
└─────────────────────────────────────────────────────────┘

Big primary readout:
   "Visitors per variant: 11,604"
   "Each side needs ~11,604 visitors to detect a 10% lift on a 10%
    baseline at 95% confidence."

[BellsThresholdChart at pA, pB, n=requiredN, confidence]

┌─ Assumptions callout ───────────────────────────────────┐
│ This calculator uses a one-tailed test (we only check   │
│ if B beats A, not whether A beats B) and fixes power at │
│ 80%. Power is the chance of catching a real win — we'll │
│ leave that lever for a later chapter.                   │
└─────────────────────────────────────────────────────────┘
```

### Number picker component

A small inline `NumberInput` (defined in the same file — no new component file unless reused elsewhere):
- `<button>−</button> <input type="number" /> <button>+</button>`
- Arrows step by `step` prop and clamp to `[min, max]`.
- Typing: keep the raw string in local state; on blur or Enter, parse + clamp + commit. Empty / NaN reverts to last committed value.
- Suffix (`%`) rendered as a sibling span, not inside the input, so the input stays a clean number field.
- Slider and input share one source of truth (the numeric state); changing either updates both.

### Slider behavior

- Native `<input type="range">` with `min`, `max`, `step` matching the table above.
- Value bound to the same numeric state as the number input.
- `aria-valuetext` formatted as percentage for screen readers.

## Page copy update

`app/calculator/page.tsx` — the existing "required-visitors number on the left… your test on the right" paragraphs no longer match the new layout. Replace with two short paragraphs:

1. One-line framing of the three levers and the computed visitors number.
2. The intuition the page already had: halve the lift, visitors roughly quadruple; raise confidence, the threshold (and required visitors) grow.

Keep the chart-reading hook — the BellsThresholdChart still illustrates *why* this many visitors is needed.

## Decision: callout location

Put the assumptions callout **inside `CalculatorWidget`** at the bottom, below the chart. Keeps the widget self-contained and matches the rest of the tutorial-widget pattern (each widget owns its own framing).

## Verification

1. `npm run dev` and visit `/calculator`.
2. Drag each slider end-to-end; confirm the number input mirrors and the readout updates.
3. Type values into each number input: valid in-range, out-of-range (should clamp on blur), non-numeric (should revert), empty (should revert).
4. Click `+` / `−` buttons at the slider extremes — should clamp, not wrap.
5. Set lift = 0 or baseline = 0 → readout shows `—` with caption.
6. Sanity-check numbers against a known case: baseline 10%, lift 10%, confidence 95%, power 80% (one-tailed) → ~11,604 per variant.
7. Verify the BellsThresholdChart still renders sensibly when `n` jumps to large values.
8. `npm run lint` and `npm run build` clean.
