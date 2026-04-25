# Chapter 3 — Phase 2: `NormalVsExtremeWidget`

**File:** `components/tutorial/widgets/normal-vs-extreme-widget.tsx`
**Ships after:** Phase 1 (`TwoBellsWidget`) is locked in.
**Depends on:** `standardNormalCurve` and `gaussianCurve` extracted to `maths/sampling.ts`.

---

## Goal

Teach the ruler before the reader has to use it. One bell, with three interactive regions the reader can hover or click to see how much of the distribution falls where: ~68% (inner ±1 SD), ~95% (full ±2 SD), and ~5% (tails).

This widget exists so that when `DecisionThresholdWidget` shows up, "95%" already means something visual rather than a number on a slider.

---

## Scope

In:
- One bell, plotted in SD units (x-axis shows "−2 SD / −1 SD / mean / +1 SD / +2 SD"). No raw conversion rate on the axis.
- Bell centered symmetrically in the chart regardless of baseline — the lesson is about bell shape, not absolute rates.
- Three hover/click regions: inner band (±1 SD), outer ring (±1 to ±2 SD), tails (beyond ±2 SD).
- On interaction: the active region highlights with color and a label strip above the chart shows the percentage and a short description.
- Click toggles a locked state; "clear" link resets it.

Out:
- No two bells, no overlap.
- No baseline slider. The 68/95 rule is a shape rule — the specific baseline is irrelevant here.
- No one-sided framing yet — this widget is bilateral. The page copy distinguishes this from the decision line (see `app/how-sure-do-you-need-to-be/page.tsx:133-140`).

---

## Implementation

### Axis

X-axis in SD units (standard normal, z-score space). Tick labels: `−2 SD`, `−1 SD`, `mean`, `+1 SD`, `+2 SD`. No y-axis. Dashed vertical markers at ±1 and ±2 SD.

Use `standardNormalCurve(xMin, xMax)` from `maths/sampling.ts` — plots `y = exp(-0.5 * x^2)` in z-score units, normalized to peak=1.

### Interaction

Three interactive hit areas (transparent `<rect>` elements):
- Inner: x ∈ [−1, +1] SD
- Outer ring: x ∈ [−2, −1] and [+1, +2] SD (two rects, same handler)
- Tails: x < −2 SD and x > +2 SD (two rects, same handler)

State: `hovered: Region | null`, `locked: Region | null`. Active = `locked ?? hovered`.

On hover of outer ring → highlights the full ±2 SD zone (inner + outer ring together) because the label is "95%" which covers both.

### Visual

Band colors by active region:

| Active  | Inner fill-opacity | Outer ring fill-opacity | Tail fill-opacity |
|---------|--------------------|-------------------------|-------------------|
| none    | 0.14 (green)       | 0.07 (green)            | 0.03 (amber)      |
| inner   | 0.52 (green)       | 0.04 (green)            | 0.015 (amber)     |
| outer   | 0.38 (green)       | 0.22 (green)            | 0.015 (amber)     |
| tail    | 0.04 (green)       | 0.02 (green)            | 0.52 (amber)      |

Bell silhouette sits on top (`pointerEvents: none`) so the hit areas behind it remain active.

### Label strip

HTML `<div>` above the SVG, 48px tall:
- Idle: "Hover or click a region to see how much falls there" (muted)
- Active: `<strong>{pct}</strong> {text}` in the region's color, plus a "clear" link if locked

### Terminology

Use "SD" not σ in all labels (same convention as the rest of chapter 3).

### Accessibility

`aria-label` on the SVG describes all three regions with their percentages. Hit rects have `cursor: pointer`. The label strip above is visible text.

---

## Acceptance

- Bell renders centered with SD-unit x-axis; no conversion rate anywhere on the chart.
- Hovering inner → inner band lights up green, label shows "~68%".
- Hovering outer ring → full ±2 SD zone lights up, label shows "~95%".
- Hovering tails → tails light up amber, label shows "~5%".
- Click locks the state; "clear" resets it.
- Typecheck and lint pass clean.

## Risks

- **Binomial ≠ normal:** the actual bell at p=0.10, N=100 is close enough that 68/95 hold to ~1 point; the "~" prefix in labels covers this.
- **Editorial drift:** the widget is intentionally bilateral — don't add a one-sided view here; that belongs in `DecisionThresholdWidget`.
