# Pivot plan — Widget 2: show baseline vs a realistic lift

**Problem:** the current Widget 2 (dots + “~95% of samples” band + “truth” line) makes it hard to *feel* why 2% baseline is worse (less signal) than 20%. The reader sees “a shape”, but not whether a real lift would stand out from the noise.

**Pivot:** keep the dot distribution, but add a second vertical marker for a hypothetical variant with a fixed relative lift (start at +10%). The chart becomes a simple question: **are these two averages meaningfully separated compared to the spread of the dots?**

This is still one lever (baseline). Lift is fixed, not user-controlled.

---

## Model

- Control (baseline): $p$
- Variant (with lift): $p_\text{lift} = p \cdot (1 + \text{lift})$
- Default lift: `CH2_LIFT = 0.10` (10% relative)

At baseline = 2%, this is 2.0% → 2.2% (gap 0.2pp). At baseline = 20%, it’s 20% → 22% (gap 2pp).

---

## UI changes

### Chart: keep the dots, add two markers

In `SamplingRateDistribution`:

- Keep the dot plot and x-axis exactly as-is (0%–35%, 1pp columns). *(v2 edit: implementation intentionally expanded the axis to 0%–60%, 61 columns, for better visual contrast between low and high baselines — e.g. the 50% bell fits fully on screen without crowding.)*
- Keep the shaded band, but change the label from `~95% of samples` to something more literal like `typical range` (optionally add `(±2σ)` in smaller text if it fits).
- Rename the existing marker label from `truth` to `average` (or `baseline avg`).
- Add a second marker for the lifted average:
  - Label: `+10% lift: Y%` (computed from the current baseline).
  - Style: different from baseline marker (both color and dash pattern).

**Key detail:** keep dots snapped to 1pp bins, but draw both vertical marker lines at a continuous x-position so small gaps (2.0 → 2.2) don’t collapse to the same column.

A simple way to do this without changing the dot layout:

- Continue using the existing `scaleBand` for dot columns.
- Add a second x-scale for values in percent:
  - `xValueScale = scaleLinear({ domain: [-0.5, MAX_BIN + 0.5], range: [0, PLOT_W] })`
  - Baseline line at `xValueScale(baseline * 100)`
  - Lift line at `xValueScale(baseline * (1 + lift) * 100)`

Clamps:
- Clamp the lifted rate to the axis ceiling (`CH2_AXIS_MAX`) so the line never disappears off the chart.

### Styling (no new theme tokens)

Use existing colors already present in the widget:

- Baseline marker: `currentColor` with medium opacity, dashed.
- Lift marker: use the same green as the dots (`#16a34a`) but with a different dash pattern (or solid line) so it reads as a separate thing.

Keep the dots green (they represent observed samples drawn at the baseline). The lift marker is a “where the variant average would land” reference line, not a second distribution.

---

## Copy changes

### Insight text below the chart

Update the dynamic text in `BaselineDistributionWidget` to explicitly connect “low baseline = low signal” to the lift marker.

Proposed structure:

- Always include the lift in percentage points: `delta = baseline * lift * 100`.
- Always include the typical noise scale: `noise ≈ 2σ` in points (already computed via `binomialSD`).

Examples (exact wording can be tuned, but keep it plain):

- At low baseline (≤ 3%):
  - “A +10% lift is only ~0.2 points at 2.0%. That sits inside the usual wobble of a 100-person sample.”
- Mid (3–10%):
  - “The lift line moves, but most samples still bounce around a lot. You can spot big shifts, not small ones.”
- High (> 10%):
  - “A +10% lift is a few points here, so the two averages separate on the axis. But single samples still vary.”

### Accessibility text

- `aria-label` on the SVG should mention both markers:
  - “Sampling rate distribution of 100 draws at X% baseline, with a +10% lift marker at Y%, …”
- `aria-live` should announce the marker too:
  - On slider change: “Baseline changed to X%. Showing +10% lift marker at Y%. Redrawing.”
  - On draw complete: “Drew 100 samples at X%. Lift marker at Y%. Range A% to B%.”

---

## Files to edit

- `components/tutorial/chapter-2-constants.ts`
  - Ensure `CH2_LIFT` exists (start at `0.10`).

- `components/tutorial/sampling-rate-distribution.tsx`
  - Add a `lift` input (prop or import constant) and render the second vertical marker.
  - Draw markers using a continuous x-position (don’t round to bins).
  - Update band label (“typical range”), marker labels (“average”, “+lift”), and SVG `aria-label`.

- `components/tutorial/baseline-distribution-widget.tsx`
  - Pass lift value through (or import it and keep the chart signature stable).
  - Update insight text to reference the lift gap in points.
  - Update `aria-live` messages.

---

## Tuning step (allowed scope)

If +10% doesn’t read well on-screen:

- Keep the same UI, only change `CH2_LIFT`.
- Try `0.15` or `0.20` and re-check two anchor baselines:
  - 2% (should still be “basically indistinguishable”)
  - 20% (lines should clearly separate)

---

## Verification checklist

- [ ] At baseline ≈ 2%, the lift marker is extremely close to the baseline marker (not snapped onto the same pixel).
- [ ] At baseline ≈ 20%, the lift marker visibly separates from the baseline marker.
- [ ] Dots still render in 1pp columns and animate as before.
- [ ] Slider drag clears dots and redraws with debounce; markers update immediately.
- [ ] Band label reads as “typical range” (not a stats lesson).
- [ ] Screen reader announcements mention baseline and the lift marker.
