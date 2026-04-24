# Chapter 3 plan — two bells and the overlap problem

**Route:** `/how-sure-do-you-need-to-be` (file does not yet exist)

**Status:** Draft. Chapter 2 now ends by teasing "version B has its own bell — next chapter we put them both on the chart." This plan picks up from there.

**Chapter title candidates (pick one before implementing):**
- "How sure do you need to be?" (matches the current `nextLabel` and original `docs/chapters.md`)
- "When can you tell them apart?" (closer to the actual visual payoff of the chapter)

Default to the first for consistency with existing nav; revisit if the overlap framing becomes the stronger hook.

---

## The arc

Chapter 2 leaves the reader with one bell (the control) and a dashed lift line showing where version B would land. The reader can see that at low baselines the line hides inside the spread, and at higher baselines it separates.

Chapter 3 does three things, in order:

1. **Promote the lift line to a full bell.** Version B has its own sampling distribution, centered on `baseline * (1 + lift)`, with the same width (same N, same `p(1-p)/n` to first order). Two bells, one chart.
2. **Make the overlap visible.** At low baseline or low N, the two bells heavily overlap — a single sample from B could land anywhere in A's bell, and vice versa. At higher baseline or higher N, they separate.
3. **Name the decision.** Deciding "B won" really means drawing a line somewhere between the two bells. Where you draw the line is your **confidence level**. A stricter line means fewer false positives but needs more separation (more data) to clear. This is the bridge into chapter 4's sample-size calculator framing.

Keep the running case study (signup button, baseline 10%, 10% relative lift) as the default state so numbers stay consistent with page 1 and page 2.

---

## Widgets

### Widget 1 — Two bells (primary)

Working name: `TwoBellsWidget` (or reuse `BaselineDistributionWidget` with a prop).

**What it shows:**
- Same x-axis as the ch2 widget (observed conversion rate per sample).
- Control bell centered at `baseline`, variant bell centered at `baseline * (1 + lift)`.
- Both bells shaded; overlap region rendered in a third tone so it pops.
- Vertical markers at both means, keeping the dashed "B" and solid "A" styling from ch2 for continuity.

**Controls (one lever at a time, building from ch2):**
- Baseline slider (same steps as ch2: 1, 2, 5, 10, 20, 30, 40, 50%).
- Optional second lever: N slider (e.g. 100, 500, 2000, 10000). Start N fixed at 100 for continuity with ch2, unlock N later in the chapter if it reads better as a separate beat.

**Key observation to prompt for in copy:**
- At 2% baseline and N=100, the two bells sit almost on top of each other.
- At 20% baseline, the means pull apart but the bells still overlap noticeably.
- At 20% baseline and N=10000, the bells shrink to near-spikes and fully separate.

Lift stays fixed at `CH2_LIFT = 0.10` to keep the "same relative improvement, different pictures" thread from ch2.

### Widget 2 — Where do you draw the line? (optional, second half of chapter)

Either a second widget or an extension of Widget 1:

- Add a vertical "decision threshold" line between the two bells.
- Shade the area of A's bell to the right of the threshold (false positives) and the area of B's bell to the left of the threshold (false negatives / missed wins).
- Slider for confidence level (80 / 90 / 95 / 99%) moves the threshold.

Only introduce this once the two-bell picture is locked in. If it makes the chapter too dense, defer to chapter 4 and keep ch3 focused on overlap.

---

## Page structure (target)

1. Eyebrow + h1 (chapter title). Pattern matches ch1/ch2.
2. Opening paragraph: pick up exactly where ch2 ended. One bell in, one to go.
3. h2: "Version B has its own bell"
   - Lead-in paragraph explaining that B is drawn from a jar whose true rate is `baseline * (1 + lift)`, so its sampling distribution has the same shape, just shifted right.
   - `TwoBellsWidget` in default state (baseline 10%, N=100).
4. Post-widget: walk through what the overlap means. Use concrete numbers: at 10% baseline with N=100, A's 95% range is roughly 4–16%; B's is roughly 5–17%. A single sample can't reliably tell them apart.
5. h2: "Slide the baseline and watch the overlap move"
   - Prompt the reader to try 2% and 20%. Describe what they should see in prose afterwards.
6. h2: "Where do you draw the line?" (only if Widget 2 ships in ch3)
   - Introduce the decision-threshold idea; widget 2 or extended widget 1.
   - Paragraph on the tradeoff: stricter threshold = fewer false positives, needs more separation = more data.
7. Quote: something like "A winner is a gap big enough that you would not see it by chance."
8. h2: "What confidence actually costs"
   - Short: higher confidence shifts the threshold further out, which means more data to clear it. Connect to ch4.
9. SectionFooter teasing chapter 4 (minimum detectable lift and the full calculator).

All prose should be drafted in the `writing-like-a-human` voice before shipping. Keep sentences varied, no em dashes, no "crucial/pivotal," no triplet overuse.

---

## Files this chapter will touch

- `app/how-sure-do-you-need-to-be/page.tsx` — new.
- `components/tutorial/chapters.ts` — add chapter 3 entry (`title`, `shortTitle`, `browserTitle`, `description`).
- `components/tutorial/two-bells-widget.tsx` — new, or extend `baseline-distribution-widget.tsx` to accept a `variant` mode.
- `components/tutorial/chapter-3-constants.ts` — new, or reuse CH2_N, CH2_LIFT, CH2_BASELINE_STEPS so the two chapters stay in sync.
- `components/tutorial/tutorial-nav.tsx` — no change if it reads from `chapters.ts`.
- `app/how-many-visitors-do-you-need/page.tsx` — `nextHref` already points at the new route; no change.

---

## Implementation notes

### Bell shape reuse

The theoretical shape logic already lives in `buildTheoreticalBuckets` in `baseline-distribution-widget.tsx`. For the two-bell widget, call it twice with different `p` values and render both bucket sets. Consider extracting the function into `maths/sampling.ts` so both chapters can import it cleanly.

### Overlap rendering

Simplest: render the B bell's dots at the same x-positions but with a distinct fill (e.g. amber vs. the existing green), stacked independently. Overlap becomes visible as two colored columns co-existing at the same x-bins.

Alternative: render both as smoothed area curves (switch from dot-stacks to filled paths) and blend the colors in the overlap region. Reads more like a textbook stats chart but loses the "each dot is a possible outcome" interpretation the reader built in ch2. Start with the dot-stack version for continuity; switch only if it reads badly side-by-side.

### Dot count

With 400 dots per distribution, two distributions means 800 dots on screen. Test at 2% baseline where the bells stack almost identically — that is the visual stress test. If it overcrowds, drop per-distribution dot count to 250 and keep the rest of the scaling identical.

### Accessibility

Two bells means the ch2 aria-label pattern ("Theoretical sampling distribution at X% baseline …") needs to mention both means. Draft:
`"Two sampling distributions: control at X% (solid), variant at Y% (dashed), N=Z. Overlap is {heavy|moderate|light}."`

---

## Open questions

- Does chapter 3 own the N slider, or does that belong in chapter 4 with the full calculator? Current lean: **N slider belongs to chapter 4** so chapter 3 has one clean lever (baseline) and one clean idea (overlap → confidence). Revisit if the two-bell picture alone is too static without N.
- Title: "How sure do you need to be?" (confidence-forward) vs. "When can you tell them apart?" (overlap-forward). Pick during drafting.
- Should the chapter end with the confidence/threshold widget, or defer it to chapter 4 entirely? If it defers, chapter 3 is a short, tight chapter on overlap alone. That might read better than one long chapter on overlap + confidence.
