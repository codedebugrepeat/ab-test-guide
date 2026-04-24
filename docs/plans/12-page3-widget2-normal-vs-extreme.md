# Chapter 3 — Phase 2: `NormalVsExtremeWidget`

**File:** `components/tutorial/normal-vs-extreme-widget.tsx` (currently a placeholder)
**Ships after:** Phase 1 (`TwoBellsWidget`) is locked in.
**Depends on:** `buildTheoreticalBuckets` already extracted to `maths/sampling.ts` in Phase 1.

---

## Goal

Teach the ruler before the reader has to use it. One bell, labeled bands at ±1 SD and ±2 SD, with the 68% / 95% shares called out. No variant, no threshold.

This widget exists so that when `DecisionThresholdWidget` shows up, "95%" already means something visual rather than a number on a slider.

---

## Scope (Phase 2 only)

In:
- One sampling distribution, pinned to the case study (baseline 10%, N=100). No slider.
- Vertical markers at ±1 SD and ±2 SD from the mean.
- Shaded bands, two-tone: inner band (±1 SD) darker, outer band (±1 SD to ±2 SD) lighter.
- In-chart labels: "~68%" inside the inner band, "~95%" across the outer band, "rare" on each tail past ±2 SD.

Out:
- No two bells, no overlap.
- No one-sided framing yet — this widget is bilateral because it's about bell shape, not about rejection regions. The page copy already makes this distinction (see `app/how-sure-do-you-need-to-be/page.tsx:133-140`).
- No baseline slider. Page copy calls the 68/95 rule a "shape rule" — a slider invites the reader to test it, which is a different story. Keep it static.

---

## Implementation

### 1. Bell render

Reuse the continuous-silhouette render from Phase 1 with just A's buckets (single filled area, stroked edge). The σ bands sit behind the silhouette and read cleanly against the single-color fill.

Pin inputs as module constants inside the widget file:

```ts
const CH3_DEMO_BASELINE = 0.10;
const CH3_DEMO_N = 100;
```

Do not import from `chapter-2-constants`. This widget's pinning is a chapter 3 editorial decision, not a ch2 reuse.

### 2. SD computation

Use existing `binomialSD(n, p)` from `maths/sampling.ts`. Convert to axis units (percentage points) by dividing by `n` and multiplying by 100, exactly as the ch2 widget already does at line 135–137.

```
sdPct = binomialSD(N, p) / N * 100
```

For N=100, p=0.10: SD ≈ 3.0 percentage points. So the 1 SD band is roughly 7%–13%, and the 2 SD band is roughly 4%–16%. These are the numbers the page copy already references.

### 3. Band rendering

Render as `<rect>` fills inside the plot `<Group>`, behind the silhouette:

- Outer band: `x = xValueScale(mean - 2·SD)` to `xValueScale(mean + 2·SD)`, full plot height, fill `currentColor` at opacity ~0.06.
- Inner band: same shape at `±1·SD`, opacity ~0.12.
- Tail shading past ±2 SD: optional, opacity ~0.03, labeled "rare" in small type.

Vertical tick marks at the four SD boundaries, same dashed style as the ch2 baseline line but neutral color.

### 4. Labels

**Terminology: use "SD" in all chart labels, not σ.** Convention in most stats writing reserves greek letters (σ, μ) for the underlying population parameters and uses roman letters (s, SD) for sample statistics. More importantly, this guide is trying to build intuition without dragging in unnecessary notation — σ on a chart asks the reader to translate a symbol before they can read the picture, and we want the opposite. The page prose already uses the full phrase "standard deviation" (see `app/how-sure-do-you-need-to-be/page.tsx:109-117`); `SD` in chart labels is the compact form of the same phrase.

Inside-chart text (not a legend):

- Centered above the inner band, near the top of the plot: `~68%`.
- Centered above the outer band, slightly higher: `~95%`.
- Small `±1 SD` / `±2 SD` labels at the top of each vertical marker.
- `rare` on each far tail.

Use `fontSize: 10`, `fillOpacity: 0.5`–`0.6`, same style family as ch2 axis labels.

Carry this convention forward into Phase 3 — the critical-value readout there should also be framed in SDs where it names the ruler, not σ.

### 5. Accessibility

aria-label:
`"Sampling distribution at 10% baseline, N=100. Inner band from 7% to 13% contains about 68% of samples. Outer band from 4% to 16% contains about 95%."`

Compute numbers from the actual σ so copy and chart can't drift.

---

## Acceptance

- Widget renders at the case-study default with no controls.
- SD bands visibly partition the bell into three zones (inner, outer ring, tails).
- Numeric labels on the bands match what the page prose says (67.8 / 95.4 approximations rounded to 68 / 95).
- The widget reads as "one bell with a ruler on it," not as a second version of the two-bells chart.

## Risks

- **Binomial ≠ normal:** at p=0.10, N=100 the normal approximation is good enough that 68/95 hold to ~1 point; keep the "~" in the labels.
- **Visual noise:** bands + dots + tick labels can crowd. If the chart gets busy, drop the tail "rare" shading and keep only the label.
- **Editorial drift:** if a reviewer asks for a slider, push back — see scope rationale above. The shape rule does not need to be interactive here.
