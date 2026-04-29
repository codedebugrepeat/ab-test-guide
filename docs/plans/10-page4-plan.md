# Chapter 4 plan — how big a jump are you looking for?

**Route:** `/how-big-a-jump-are-you-looking-for` (file does not yet exist)

**Status:** Revised 2026-04-25. Follows chapter 3, which ends by teasing "the last lever: the size of the jump you're hunting for." Chapter 3 shipped three widgets — the third (`DecisionThresholdWidget`) is the one chapter 4 reuses, because it already carries the threshold line, false-positive shading, and false-negative shading. Chapter 4's job is to add the lift slider on top of that chart.

## Revision summary (what changed)

- **Reuse target switched** from `TwoBellsWidget` (ch3 widget 1) to `DecisionThresholdWidget` (ch3 widget 3). The threshold + shaded tails are the visual the reader just learned, and lift is exactly the lever that moves how much of B's bell sits in the false-negative gray.
- **Widget 2 (sample-size readout) deferred to the calculator chapter.** Chapter 4 stays a single-widget page focused on lift. The calculator is the finale where all four levers and the N readout meet.
- **Real units, not abstract SD units.** The ch3 threshold widget uses normalized SD units. Chapter 4's widget switches to real percentage points (baseline 10%, N pinned), because the calculator needs real units anyway and we want one shared chart component.

**Chapter title candidates (pick one before implementing):**
- "How big a jump are you looking for?" (matches the new `nextLabel` and frames MDE as a choice, not a given)
- "The smallest jump worth watching for"
- "Minimum detectable lift"

Default to the first. It mirrors the interrogative titles of chapters 2 and 3 and reads like a product question, not a stats term.

---

## The arc

By the end of chapter 3 the reader has six things on the table:

1. A sampling distribution whose width comes from baseline and N (ch2).
2. Two bells on one chart, and an overlap that shrinks as the means pull apart (ch3, Widget 1 — `TwoBellsWidget`).
3. A ruler for what counts as normal vs. rare: standard deviation, with ~68% inside 1σ and ~95% inside 2σ (ch3, Widget 2 — `NormalVsExtremeWidget`).
4. A decision threshold drawn past A's usual range, sitting at the edge of A's confidence band (ch3, Widget 3 — `DecisionThresholdWidget`).
5. Names for the parts of that threshold: critical value (where), confidence level (inside), significance level (outside).
6. The idea that stricter confidence pushes the critical value further out, which demands more separation to clear.

Chapter 4 should inherit the ch3 visual vocabulary: the two bells, the σ bands where they help, and the critical-value line. Don't reintroduce them. Keep the reader in the same chart they ended ch3 in, and change one thing: the lift.

Chapter 4 introduces the last lever the reader hasn't touched: **the size of the jump they're trying to detect**. Every chapter so far has held lift fixed at 10%. This chapter unpins it.

Three beats, in order:

1. **You choose what counts as a win.** Before running a test, you have to decide the smallest lift that would actually change what you ship. That number is your minimum detectable effect (MDE). It is a business call, not a stats output. A 0.2% lift on checkout might be worth millions; a 0.2% lift on a side feature might not be worth the engineering time.
2. **Smaller MDE means the bells sit closer together.** On the two-bells chart, dragging the lift down pulls B's bell left, back into A's. The overlap floods. Dragging lift up pulls them apart on their own, no extra data needed.
3. **This is the last dial.** Baseline is given to you. Confidence is a policy call. N is what you pay. MDE is the knob that decides how much you pay. Aim small and you pay a lot. Aim big and you pay very little — but you only catch improvements big enough to clear your own bar.

The chapter closes the loop: all four levers (baseline, confidence, MDE, N) are now on the table, and the next step is plugging numbers into them.

Keep the running case study (signup button, baseline 10%) as the default state. Let lift be the thing that moves.

---

## Widgets

### Widget 1 — Lift lever on the threshold chart (only widget on the page)

Working name: `LiftEffectWidget`. Built on a shared `BellsThresholdChart` component that also powers the calculator finale.

**What it shows:**
- The same chart shape as ch3's `DecisionThresholdWidget`: A bell, B bell, vertical threshold line, red shading on A's right tail (false positives), gray shading on B's left tail (false negatives).
- Real percentage-point x-axis. Baseline pinned at 10%. N pinned at 1,000 (ch3 used 100 — but at 100 visitors the SD is large enough that lifts under 20% all collapse into one blob, so the lesson reads better at 1,000). Confidence pinned at 95%.
- **Lift slider as the only control.** Steps: 2, 5, 10, 20, 50% relative lift. Default 10% (case study).

**Key observations the copy walks through:**
- At 2% lift: B's bell is almost identical to A's. The gray false-negative region swallows almost all of B. A test at 95% confidence will essentially never call this a winner at this N.
- At 10% lift (case study default): heavy overlap. About half of B sits left of the line. You'd need a lot more visitors to consistently clear.
- At 50% lift: bells barely touch. Almost none of B falls in the gray. A test clears easily.

This is the entire chapter visually. The "what does this cost in N?" beat is owned by the calculator chapter, not ch4.

---

## Page structure (target)

1. Eyebrow + h1 (chapter title). Same pattern as ch1/ch2/ch3.
2. Opening paragraph: pick up from ch3's teaser. You've seen baseline move the bells, and confidence move the threshold. One lever left.
3. h2: "You choose what counts as a win"
   - Lead-in on MDE as a business decision. A 2% lift on a signup page might be a no-brainer ship; a 2% lift on a rarely-used feature might not be worth the follow-up work.
   - Make the point that this number is an input, not a result. Tests don't tell you what lift to care about. You do.
4. h2: "Smaller jumps hide. Bigger ones don't."
   - `LiftEffectWidget` at 10% lift default.
   - Post-widget: walk the reader through dragging the slider. At 2% lift the gray swallows B; at 50% the gray is gone. Use concrete numbers from the case study baseline.
5. Quote: something like "Aim small and the price is steep. Aim big and you might miss the win that was actually there."
6. h2: "Four levers, one knob"
   - Recap: baseline (given), confidence (policy), MDE (business call), N (the price). Three of those are inputs. N falls out.
   - Bridge into the calculator: every lever you've met now lives on one chart, and the calculator lets you pull all of them at once.
7. SectionFooter teasing the calculator (the finale).

All prose drafted in the `writing-like-a-human` voice. Keep sentences varied, no em dashes, no triplet overuse, no "crucial/pivotal."

---

## Files this chapter will touch

- `app/how-big-a-jump-are-you-looking-for/page.tsx` — new.
- `components/tutorial/widgets/bells-threshold-chart.tsx` — new shared SVG chart in real units. Takes `pA`, `pB`, `n`, `confidence`, renders bells + threshold + shaded tails. Replaces the abstract-units math inside `DecisionThresholdWidget` for ch4 and the calculator. (`DecisionThresholdWidget` itself stays as-is; ch3 already shipped.)
- `components/tutorial/widgets/lift-effect-widget.tsx` — new ch4 widget. Wraps the chart with a lift slider; baseline/N/confidence pinned.
- `components/tutorial/widgets/calculator-widget.tsx` — new finale. Wraps the same chart with all four sliders + N readout.
- `components/tutorial/constants/chapter-4-constants.ts` — new. `CH4_BASELINE = 0.10`, `CH4_N = 1000`, `CH4_CONFIDENCE = 0.95`, `CH4_LIFT_STEPS = [0.02, 0.05, 0.10, 0.20, 0.50]`.
- `maths/sampling.ts` — add `requiredSampleSize({ baseline, lift, alpha, power })` and a small `Z_BY_CONFIDENCE` map shared with the chart. Keep one-sided.
- `app/calculator/page.tsx` — replace the placeholder with the calculator widget + framing copy.
- `app/how-sure-do-you-need-to-be/page.tsx` — `nextHref` already points at the new route; no further change.
- `components/tutorial/chapters.ts` — already has chapter 4. No change needed.

---

## Implementation notes

### Reuse via a shared chart, not by extending the ch3 widget

`DecisionThresholdWidget` ships and stays where it is. It uses normalized SD units, which is fine for ch3's "where do you draw the line?" beat. Chapter 4 and the calculator need real percentage points (because N is a variable in the calculator and changing N changes the SD), so we extract the chart shape into a new component:

`BellsThresholdChart({ pA, pB, n, confidence })` — pure presentation. Computes `meanA`, `meanB`, `sdA = sqrt(pA(1-pA)/n)*100`, `sdB` similarly, threshold = meanA + z·sdA, draws bells + threshold + shaded tails. No sliders, no state.

Both `LiftEffectWidget` (ch4) and `CalculatorWidget` (finale) wrap this chart with their own slider sets. This avoids over-coupling ch4 to ch3's widget while keeping the visual vocabulary identical.

### Sample size math for Widget 2

Standard two-proportion formula for required N per variant, **one-sided** (see convention note below), 80% power by default:

```
n ≈ ( (z_α + z_β)^2 * (p1(1-p1) + p2(1-p2)) ) / (p2 - p1)^2
```

Where p1 = baseline, p2 = baseline * (1 + lift), and `z_α` is the one-tailed critical value (≈1.645 at α=0.05, i.e. 95% confidence). Put this in `maths/sampling.ts` so chapter 5's calculator imports the same function. Do not re-implement the formula per-chapter.

Expose `power` and `alpha` as constants for now (80% and 5%) and document that chapter 5 will unpin them. Chapter 4 keeps them implicit to avoid piling jargon on the reader mid-arc.

### Convention: one-sided throughout

Chapters 3 through 5 use a **one-sided test**. The reader is hunting for a lift. Version B is either better than A by enough to clear the line, or it isn't. We don't care about the left tail of A's bell (B being dramatically worse is not the outcome the reader is reasoning about in this guide).

Consequences for the widgets and copy:

- Only A's right tail is the rejection region. `DecisionThresholdWidget` shades the right tail as the false-positive region; the left tail stays unshaded.
- "95% confidence" = α of 5%, with the whole 5% in A's right tail. z_α ≈ 1.645, not 1.96.
- The ch3 "three names for the same line" copy is already consistent with this (single line, right of A's mean, confidence + significance = 100%). Keep it that way.
- `NormalVsExtremeWidget` can still show ±1σ and ±2σ bilaterally for the "middle is normal, tails are rare" intuition — that widget is about distribution shape, not rejection regions. Just make sure the copy around the threshold widget uses "the 95% band" language loosely (for intuition) without implying a two-sided rejection region.
- Chapter 5 inherits the same convention in the full calculator. If a future version of the guide adds two-sided as an option, it should be an explicit mode switch, not a silent default change.

### Edge cases on the lift slider

At very small lifts (say 1%), N blows up fast (hundreds of thousands of visitors). That is the point — let the number be big and ugly. Do not cap the readout at an arbitrary "10,000+" or similar; the shock is the lesson.

At very large lifts (say 50%+ relative, so 10% → 15%), the sample size drops into the low hundreds and the bells separate cleanly. Some readers will interpret this as "so just always aim high!" — the chapter's closing paragraph has to answer that (you only catch improvements that actually clear your bar; aim too high and you miss real, smaller wins).

### Accessibility

The aria-label pattern from ch3 needs to mention the lift:
`"Two sampling distributions: control at X% (solid), variant at Y% (dashed), lift Z%, N=W. Overlap is {heavy|moderate|light}."`

---

## Open questions (resolved in this revision)

- **N readout in ch4?** Resolved: **no.** The calculator is the place where N becomes a number the reader pulls levers against. Chapter 4 is purely about feeling the lift lever on the chart.
- **Power in ch4?** Resolved: **no.** Power stays implicit (80%) here and in the calculator. Adding it would crowd both pages.
- **MDE-picking rubric?** Resolved: leave it as a short paragraph. No checklist.

## Calculator finale (now part of the plan, not a future chapter)

`/calculator` is the chapter-following page. It renders the same `BellsThresholdChart` with **all four sliders enabled**:

- Baseline: same steps as ch2.
- N (per variant): log-spaced steps, e.g. `[100, 250, 500, 1000, 2500, 5000, 10000]`.
- Confidence: `[0.80, 0.90, 0.95, 0.99]` — same as ch3.
- Lift: same steps as ch4.

Plus a numeric readout: "Required visitors per variant to detect this lift at this confidence (80% power): N." When the user's N slider is below the required N, flag the test as underpowered in the readout text. The chart and the readout are the whole calculator — no separate inputs panel.
