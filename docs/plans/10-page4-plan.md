# Chapter 4 plan — how big a jump are you looking for?

**Route:** `/how-big-a-jump-are-you-looking-for` (file does not yet exist)

**Status:** Draft. Follows chapter 3, which ends by teasing "the last lever: the size of the jump you're hunting for."

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

### Widget 1 — Lift lever on the two bells (primary)

Working name: `LiftLeverWidget`, or a prop-based variant of `TwoBellsWidget`.

**What it shows:**
- Same two-bells chart readers saw in chapter 3, with the same visual vocabulary carried over.
- Baseline pinned at 10%. N pinned at something ch3-consistent (100 for continuity, or bump to 500/1000 so the smaller lifts are actually visible without blurring into one blob).
- Lift slider as the primary lever. Steps: 2, 5, 10, 20, 50% relative lift.
- Vertical markers at both means; overlap region shaded as in ch3.
- Carry over the ch3 critical-value line at 95% confidence (the one readers moved with `DecisionThresholdWidget`). Show it fixed here so "clearing the line" is a visible event as the lift changes, not a separate concept the reader has to remember.
- Optional: carry over the ±2σ markers on A's bell from `NormalVsExtremeWidget` so the 95% band stays visible. Only if it doesn't crowd the chart. If it does, drop the σ ticks and keep the critical-value line — the line already encodes the 95% band.

**Key observations to prompt for in copy:**
- At 2% lift (baseline 10%, so 10% vs 10.2%), the bells are effectively on top of each other and B's mean sits well short of the ch3 critical-value line. You could run this test forever and still not clear it.
- At 10% lift (the case study), the overlap is heavy and B's mean sits around the line, not comfortably past it.
- At 50% lift, the bells barely touch and B's mean is well past the line. A test clears quickly because the lift is doing the work.

### Widget 2 — What N does it cost? (optional)

Either an extension of Widget 1 or a separate panel:

- Lift slider (same steps as above).
- Output number: "visitors per variant needed to detect this lift at 95% confidence."
- Reads straight from the sample-size formula the full calculator will use. No chart, just a live number that updates as the lift changes.

This is the bridge into the calculator chapter. If it makes ch4 feel like "half a calculator," defer it and let chapter 5 own the N output entirely. Current lean: **include it.** Seeing "50% lift: 600 visitors. 5% lift: 62,000 visitors." is the sentence that makes MDE feel like a real lever instead of a stats abstraction.

---

## Page structure (target)

1. Eyebrow + h1 (chapter title). Same pattern as ch1/ch2/ch3.
2. Opening paragraph: pick up from ch3's teaser. You've seen baseline move the bells, and confidence move the threshold. One lever left.
3. h2: "You choose what counts as a win"
   - Lead-in on MDE as a business decision. A 2% lift on a signup page might be a no-brainer ship; a 2% lift on a rarely-used feature might not be worth the follow-up work.
   - Make the point that this number is an input, not a result. Tests don't tell you what lift to care about. You do.
4. h2: "Smaller jumps hide. Bigger ones don't."
   - `LiftLeverWidget` at 10% lift default.
   - Post-widget: walk the reader through dragging the slider. At 2% lift, the bells sit on each other. At 50%, they barely touch. Use concrete numbers from the case study baseline.
5. h2: "What that costs in visitors" (only if Widget 2 ships here)
   - Live N readout.
   - Paragraph on the shape of the cost: halving the lift roughly quadruples the visitors needed. This is the bit that usually surprises readers the most.
6. Quote: something like "Aim small and the price is steep. Aim big and you might miss the win that was actually there."
7. h2: "Four levers, one knob"
   - Recap: baseline (given), confidence (policy), MDE (business call), N (the price). Three of those are inputs. N falls out.
   - Bridge into chapter 5.
8. SectionFooter teasing chapter 5 (the full sample-size calculator).

All prose drafted in the `writing-like-a-human` voice. Keep sentences varied, no em dashes, no triplet overuse, no "crucial/pivotal."

---

## Files this chapter will touch

- `app/how-big-a-jump-are-you-looking-for/page.tsx` — new.
- `components/tutorial/chapters.ts` — chapter 4 entry already added in the same PR as this plan.
- `components/tutorial/lift-lever-widget.tsx` — new, or extend `two-bells-widget.tsx` to take a `primaryLever: "baseline" | "lift"` prop.
- `components/tutorial/sample-size-readout.tsx` — new, only if Widget 2 ships in ch4. Plain numeric readout component, no chart.
- `components/tutorial/chapter-4-constants.ts` — new, or reuse `CH2_N`, `CH2_BASELINE` with new `CH4_LIFT_STEPS`.
- `app/how-sure-do-you-need-to-be/page.tsx` — `nextHref` already points at the new route; no further change.

---

## Implementation notes

### Reuse vs. new widget

The two-bell rendering logic from ch3's `TwoBellsWidget` (still a placeholder as of this plan) is the obvious candidate for reuse. The ch3 `DecisionThresholdWidget` also owns the critical-value line that ch4 wants to reuse as a fixed reference. Two sane paths:

- **Extend the ch3 widget(s) with props.** One `primaryLever` prop on `TwoBellsWidget` (baseline vs. lift), plus an optional `criticalValue` prop that renders the line at a fixed confidence. Lowest drift risk, but couples the two chapters tightly.
- **Build a thin wrapper.** `LiftLeverWidget` calls into a shared rendering function with `baseline=0.10` and `confidence=0.95` fixed, exposes a lift slider, and draws the critical-value line statically. Slightly more code, decouples the chapters.

Default to the wrapper. Saves future headaches when either chapter's widget needs chapter-specific polish. Extract whatever bell-drawing and critical-value math ends up shared into `maths/sampling.ts` so ch3 and ch4 consume the same functions.

### Sample size math for Widget 2

Standard two-proportion formula for required N per variant (two-sided, 80% power by default):

```
n ≈ ( (z_α/2 + z_β)^2 * (p1(1-p1) + p2(1-p2)) ) / (p2 - p1)^2
```

Where p1 = baseline, p2 = baseline * (1 + lift). Put this in `maths/sampling.ts` so chapter 5's calculator imports the same function. Do not re-implement the formula per-chapter.

Expose `power` and `alpha` as constants for now (80% and 5%) and document that chapter 5 will unpin them. Chapter 4 keeps them implicit to avoid piling jargon on the reader mid-arc.

### Edge cases on the lift slider

At very small lifts (say 1%), N blows up fast (hundreds of thousands of visitors). That is the point — let the number be big and ugly. Do not cap the readout at an arbitrary "10,000+" or similar; the shock is the lesson.

At very large lifts (say 50%+ relative, so 10% → 15%), the sample size drops into the low hundreds and the bells separate cleanly. Some readers will interpret this as "so just always aim high!" — the chapter's closing paragraph has to answer that (you only catch improvements that actually clear your bar; aim too high and you miss real, smaller wins).

### Accessibility

The aria-label pattern from ch3 needs to mention the lift:
`"Two sampling distributions: control at X% (solid), variant at Y% (dashed), lift Z%, N=W. Overlap is {heavy|moderate|light}."`

---

## Open questions

- **Does the N readout (Widget 2) belong here, or in chapter 5?** Current lean: **here**. The readout makes MDE tangible in a way the chart alone cannot. Chapter 5 then takes all four levers (baseline, confidence, MDE, and the chapter-5 power dial) and renders a full calculator. If ch4 feels like "half of ch5," drop the readout and let ch5 own it.
- **Does ch4 introduce power (1 − β) explicitly?** Current lean: **no**. Keep the chapter focused on MDE as a business lever. Power is a symmetric concept to confidence (false negatives instead of false positives) and deserves its own beat in ch5 rather than being squeezed in here.
- **Should the chapter include a "how to pick MDE" rubric?** Tempting (readers always ask), but risks turning the chapter into product-management advice. Current lean: leave the question open with a short paragraph ("the smallest lift worth shipping") and resist the urge to turn it into a checklist.
