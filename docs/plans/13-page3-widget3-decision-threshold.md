# Chapter 3 — Phase 3: `DecisionThresholdWidget`

**File:** `components/tutorial/decision-threshold-widget.tsx` (currently a placeholder)
**Ships after:** Phases 1 and 2 are both in.
**Depends on:** the two-bell render component from Phase 1; `binomialSD` for the ruler.

---

## Goal

Put the line on the chart. Reader moves a confidence slider, line moves in A's right tail, the two shaded error regions (false positives under A, missed wins under B) resize live. This is where "confidence" stops being a word and becomes a visible tradeoff.

Stay strictly **one-sided**, right tail only. This is the chapter convention (see `09-page3-plan.md` lines 29–40).

---

## Scope (Phase 3 only)

In:
- Two bells, same default case study (baseline 10%, N=100, lift 10%). Same render as Phase 1 but without the baseline slider — baseline is pinned here so the only lever is confidence.
- Confidence slider with four stops: 80 / 90 / 95 / 99%. Default 95%.
- Vertical "critical value" line at `mean_A + z_α * sd_A` where `z_α` is the one-sided z for the chosen confidence.
- Shaded region under A's bell to the right of the line (false positives).
- Shaded region under B's bell to the left of the line (missed wins).
- A small caption or annotation giving the critical value as a percentage on the axis.

Out:
- No baseline slider. Phase 1 already has one — changing two levers in one widget would muddle the chapter's "one idea at a time" rhythm.
- No N slider. Per `09-page3-plan.md`, N belongs to chapter 4.
- No two-sided rejection region. The line is right-tail only. Do not shade A's left tail.
- No power readout (e.g. "you'll catch a real win X% of the time"). Tempting but belongs in ch4's MDE framing.

---

## Implementation

### 1. Critical value math

One-sided z values, hardcoded:

```ts
const Z_BY_CONFIDENCE: Record<number, number> = {
  0.80: 0.8416,
  0.90: 1.2816,
  0.95: 1.6449,
  0.99: 2.3263,
};
```

Do not use 1.96 — that's two-sided 95%. The chapter is one-sided throughout.

Critical value on the x-axis (percentage points):

```
sdPct = binomialSD(N, baseline) / N * 100
meanPct = baseline * 100
criticalPct = meanPct + Z_BY_CONFIDENCE[conf] * sdPct
```

### 2. Slider control

Use a stepped range (`min=0, max=3, step=1`) mapping index → `[0.80, 0.90, 0.95, 0.99]`, mirroring the ch2 baseline slider pattern. Label shows `"Confidence: 95%"`. Default index is 2.

### 3. Shaded error regions

The render component needs a new capability: shading an arbitrary x-range under a specified bucket array. Two options:

- **Dot recoloring** (preferred, stays consistent with chapter voice): walk the bucket arrays; for A-dots where `col > criticalBin`, recolor to a red/rose tint (`#dc2626` at low opacity). For B-dots where `col < criticalBin`, recolor to a gray tint. Keep the non-shaded dots at their Phase 1 colors.
- **Area overlay:** draw a translucent `<rect>` over the relevant x-range. Simpler, but loses the "each dot is a possible outcome" metaphor.

Go with dot recoloring. The reader has been building the dot-as-outcome frame since ch2; breaking it here would cost more than it saves.

### 4. The line itself

Vertical `<line>` at `xValueScale(criticalPct)`, solid, stronger than the dashed mean markers:

- `stroke-width: 2`
- neutral high-contrast color (near-black / near-white per theme)
- label at the top: `"critical value: X.X%"`

Animate on slider change: a short CSS transition on the line's `x1`/`x2` (via a React-driven attribute change is fine; 120ms ease is plenty).

### 5. Live caption

Below the chart, one line that reads off the current state:

> At 95% confidence, the line sits at 14.9%. Anything to the right of it counts as a win. About 5% of A's bell is past the line (false positives); a chunk of B's bell is still left of it (missed wins you'd have had).

Compute the two percentages from the bucket arrays so the numbers always match the visual.

### 6. Accessibility

aria-label on the svg:
`"Two sampling distributions with a decision threshold at X.X%. Right tail of control beyond the threshold is the false-positive region; left side of variant below the threshold is the missed-win region."`

aria-live on slider change:
`"Confidence Y%. Critical value X.X%. False-positive area {Z}% of control. Missed-win area {W}% of variant."`

---

## Acceptance

- At 95% default, line sits around 14.9% (for baseline 10%, N=100), A's right tail past it is about 5%, B's left side below it is clearly the majority of B's bell — the reader should immediately see that at N=100 even a real lift is usually missed.
- Sliding to 99% moves the line further right, shrinks the red region to a sliver, and grows the gray region (more missed wins).
- Sliding to 80% moves the line left, grows the red region, shrinks the gray region.
- Slider changes feel smooth; the line does not jump a full bin at a time on sub-pixel widths.
- The visual tells the same story the "Three names for the same line" copy tells: critical value = line position; confidence = share of A left of it; significance = sliver of A right of it.

## Risks

- **Overlap with bands from Phase 2:** at 10% baseline, N=100, the 2σ ruler lands near 16%. The critical line at 95% sits at ~14.9%. Those are close. The reader may conflate them. Mitigate in the page copy, not the widget — the page already has the disclaimer at `app/how-sure-do-you-need-to-be/page.tsx:133-140`. If it still confuses, consider a faint "for reference, 2σ ends at 16%" annotation.
- **Stepped vs continuous confidence:** a continuous slider is tempting but four stops match the way the chapter names the default (95%) and its neighbors. Keep it discrete.
- **Temptation to merge with Phase 1:** resist. Merging gives one mega-widget with two sliders that change different things, which is exactly the rhythm the chapter is trying to avoid.
