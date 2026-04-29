# Tutorial storytelling audit

## Context

The tutorial is functionally complete: four chapters plus a calculator, each chapter introducing one widget that builds on the previous. The widgets and calculator work. The remaining gap is **copy and narrative**: does the prose hold a beginner's hand from "I ran a test, B looked better, ship?" to "here's the calculator that turns three inputs into a sample size," without any page asking too much, without any concept introduced before it's earned, and in an order that actually compounds?

This document is an audit, not an implementation plan. It scopes the rewrite work that should follow.

The ICP, restated: an engineer, PM, or founder who wants to run an A/B test and do it right. They have no statistics background. They want practical intuition, not jargon. They will read on a laptop, scroll, click sliders, and skim the prose between widgets.

---

## Chapter map (current state)

| # | Route | Title | New concept | New widget |
|---|---|---|---|---|
| 1 | `why-you-cant-trust-your-experiment` | Why small samples lie | Sampling error | Marble jar |
| 2 | `how-many-visitors-do-you-need` | How many visitors do you need? | Sampling distribution → bell → baseline → two bells | Sampling-distribution builder, baseline distribution, two bells |
| 3 | `how-sure-do-you-need-to-be` | How sure do you need to be? | Standard deviation, decision threshold, confidence/significance/critical value | Normal-vs-extreme, decision threshold |
| 4 | `how-big-a-jump-are-you-looking-for` | How big a jump are you looking for? | Minimum detectable effect, four-lever recap | Lift effect |
| — | `calculator` | Calculator | All four levers, live | Calculator |

---

## What works

### 1. The hook lands
"Group A: 10/100. Group B: 15/100. Ship?" is the right opening for the ICP — almost everyone has run something like this, felt the urge to ship, and wondered if they should. The case-study callout is concrete and reused throughout. **Keep this.**

### 2. The marble jar before the bell
Chapter 1 deliberately uses a non-bell visualization (marbles in a jar) to show sampling error before any distribution machinery is introduced. This is the right pedagogy: the abstract bell is much easier to accept once you've already seen randomness with your own eyes at small N.

### 3. Histogram → smooth-bell handoff
Chapter 2's *"from here on we'll draw it as a smooth silhouette: same distribution, just without the individual dots"* is a clean transition. The reader earned the bell; they didn't have one handed to them.

### 4. Each chapter explicitly hooks the previous
"Chapter 2 ended with two bells…", "Chapter 3 left you with a chart and a line on it…". This continuity scaffolding is doing real work; a reader who skipped ahead can recover, and a sequential reader gets reinforcement. Keep this pattern.

### 5. Voice
Phrases like *"a coin flip in a trenchcoat,"* *"a product call dressed in stats clothing,"* *"stops being a vibe"* are exactly the right register for the ICP — plain, occasionally funny, never condescending, never hiding behind jargon.

### 6. The calculator framing as a payoff
By the end of chapter 4 the reader has been told three times that sample size is "the price you pay" / "what falls out" — the calculator delivers exactly that. The narrative arc lands.

---

## What doesn't work

### A. The case study's lift doesn't match the charts (continuity break)
The case study is **10% → 15%, a 50% relative lift / 5pp absolute**. But:
- Chapter 2's `BaselineDistributionWidget` describes "if it really does lift by 10%."
- Chapter 4 explicitly states: *"Every chart in this guide so far has assumed B's jar converts 10% better than A's."*

So the chart in chapter 2 onward is showing a 10% relative lift (i.e. 10% → 11%), not the 10 vs 15 from the case study. **This is the single biggest continuity bug.** A beginner who's holding the case study in their head will quietly lose the thread the moment they start moving sliders. They won't be able to articulate why. They'll just feel lost.

**Pick one and commit:** either change the case study to be a 10% relative lift, or use a 5pp / 50% lift across all charts, or call out explicitly in chapter 2 that "the case study had a 5pp gap; from here we'll work with a more typical 10% relative lift to keep the visuals readable" — and then never silently switch.

### B. Chapter 2's title overpromises
*"How many visitors do you need?"* is the question. The chapter does not answer it. It teaches **baseline**, then **sampling distribution shape**, then **two bells**. A reader who arrives expecting a number leaves with a concept. The title is a hook for the *whole guide*, not for chapter 2.

Two options:
- Retitle chapter 2 to name the actual content: e.g. *"It starts with your baseline"* or *"The shape of noise."*
- Keep the title and end the chapter with a placeholder answer ("for the case study, you'd need ~X visitors — and the next two chapters explain why").

The first is cleaner.

### C. Chapter 2 carries too much load
Currently chapter 2 introduces, in order: histogram from random draws → sampling distribution → smoothing into a bell → baseline → low-baseline-needs-more-data → silhouette convention → two bells. That is **at least four** new conceptual leaps in a single page. The reader is asked to (a) accept that random draws have a stable shape, (b) accept that shape is a bell, (c) absorb a new variable (baseline) and its effect on width, (d) accept that A/B tests have *two* bells side by side.

Compare to chapter 4, which introduces exactly one new concept (minimum detectable effect) on top of an already-built chart. Chapter 4 is light. Chapter 2 is overloaded. Two-bells is currently dangling at the end of chapter 2 in service of chapter 3 — it's the right setup but it makes 2 a heavy chapter and arguably belongs at the **start of chapter 3** instead.

**Suggested split:** end chapter 2 after "the lower your baseline, the more data you need." Move the "Two bells" section to the top of chapter 3 as the visual setup for the threshold conversation. This shortens 2, lengthens 3 in a way that helps 3, and creates a cleaner one-concept-per-chapter rhythm.

### D. Chapter 3's standard-deviation detour is suspicious
The chapter introduces standard deviation, the 68/95 rule, and then immediately walks it back: *"the 68/95 numbers above describe the shape of a bell, looking at both tails together. They're a feel for the distribution, not the line we're about to draw. […] Don't conflate the two."*

When a tutorial has to tell the reader not to conflate two things it just introduced, that is a smell. Either:
- The detour earns its keep (it does build vocabulary that's used later — "spread," "tightens"), and the disclaimer can be lighter; OR
- The detour is overhead the chapter doesn't need, and the threshold can be introduced directly without naming standard deviation. The reader can grasp "the line lives somewhere out past A's typical range" without ever hearing "two standard deviations."

**Recommendation: drop the 68/95 framing for the MVP.** Keep the visual intuition ("middle is normal, tails are rare") but introduce only the right-tail share, since that's the only one the rest of the guide uses. This trims cognitive load and removes the "don't conflate" footnote.

### E. Three names for the same line is one name too many
Chapter 3 introduces **critical value, confidence level, significance level** in one section — three terms for a single picture. The ICP doesn't need all three. They need one ("the threshold"), and to know that *significance* and *confidence* are two ways of describing how strict the threshold is.

Lead with the threshold; introduce *confidence level* as the share to its left; mention *significance level* and *critical value* once each as "the names you'll see elsewhere." Don't make the reader hold three labels for the same object as a load-bearing concept.

### F. Chapter 4 is the lightest chapter and ends the tutorial
Once continuity issue (A) is fixed and standard deviation is trimmed, chapter 4 is pleasant but slight: one slider on an existing chart, then a four-lever recap. It's the chapter most at risk of feeling anticlimactic. The "four levers, one knob" framing is great — but it's the only thing chapter 4 adds that chapters 2–3 didn't.

Possible additions to give chapter 4 more weight:
- Show the **dramatic blow-up** the original `chapters.md` plan called for: "drag minimum lift from 10% down to 1% and required N explodes from ~1,500 to ~150,000." Make this visceral with a sample-size readout that updates live, before the calculator.
- Or: add a "your three inputs, locked in" recap card at the end of chapter 4 that previews what the calculator will do, with the reader's running case-study numbers.

### G. Continuity gaps and unannounced concepts

| Concept | First used | First explained | Gap |
|---|---|---|---|
| "lift" (as % improvement) | Ch 2, casually | Ch 4 | Used loosely for 2 chapters before being a defined input |
| "100 visitors per group" / "per variant" | Ch 1 | Never re-grounded | The case study has 100/group; charts later assume different N implicitly |
| "true rate" (jar) vs "baseline" (page) | Ch 1 jar = 20% | Ch 2 baseline = 10% | Reader sees two different numbers without bridge |
| Bell "width" / "spread" / "tightens" | Ch 2 | Used as if defined | Vocabulary slips in; never named precisely until ch 3 (standard deviation) |
| "Per variant" arithmetic | Ch 1 (100/group) | Calculator (per-variant readout) | Reader may not realize the calculator's number is per side, not total |

None of these are fatal. (A), (B), and the jar-rate-vs-baseline mismatch are the ones to fix; the others want a sentence each.

### H. Chapter 1's marble jar uses 20%, but the case study is 10%
The jar's true rate is 20%. The case study's baseline is 10%. A careful reader notices this and wonders if there's a reason. There isn't a stated one. Either match the jar to the case study (10% jar) or add a one-sentence "the jar has 20% green so the visual reads — the principle is the same at any rate."

### I. The chapter 2 → chapter 3 transition is weaker than it could be
Chapter 2 ends with "whether the test calls a winner depends on how far apart those bells sit." Chapter 3 opens with "Looking at that picture doesn't yet tell you what to *do* with a single experiment's result." Good — but the chapter then immediately sidetracks into bell anatomy / standard deviation before getting to the threshold. The reader was promised "what to do with a result"; they get a stats lesson first. Tighten by either (i) opening 3 with the threshold widget and introducing the bell-anatomy ideas inline as needed, or (ii) compressing the 68/95 section as in (D).

---

## Is the order right? (Specifically: should confidence be last?)

Three plausible orders:

1. **Current: baseline → confidence → lift.** Confidence introduces the threshold line as a visual; lift then animates B's bell against that line. Pedagogically tight: the line earns its keep before the lift slider exploits it.
2. **Alternative: baseline → lift → confidence.** Lift is more intuitive (a product call) and sits naturally next to baseline. Confidence then becomes the final policy lever — "how strict do you want to be about all this?" — which is arguably the cleanest closing concept.
3. **Alternative: baseline → lift → confidence → sample size as a chapter of its own.** Probably too many chapters for the MVP.

**Recommendation: keep the current order.** The reason is the visualization, not the concept. The threshold line is the most powerful single visual in the tutorial; introducing it before the lift slider lets chapter 4 pay off twice (move lift, watch where B lands relative to a line the reader already understands). If lift came first, chapter 3 would need a new and less satisfying visual reason for the threshold to exist.

That said, the *naming* might want to flip: "confidence" being introduced as a lever before lift is a bit odd if the reader has been told for two chapters that the goal is "detecting B." The narrative would be cleaner if chapter 3 explicitly framed the threshold first ("here's how you decide if a result counts") and *then* attached the term "confidence" to it — rather than leading with "how sure do you need to be?" as the chapter title before the threshold concept exists.

**Concrete suggestion:** retitle chapter 3 to lead with the visual idea, e.g. *"Drawing the line"* or *"What counts as a winner?"* and let "confidence" be the term you learn inside the chapter rather than the chapter's premise.

---

## Recommended improvements, ranked

### Must-fix (continuity bugs the reader will silently feel)
1. **Reconcile the case study's lift with the chart assumptions.** Either use a 10% relative lift in the case study, or use 50% / 5pp consistently, or call the switch out explicitly in chapter 2.
2. **Bridge the jar (20%) → baseline (10%) numbers.** One sentence in chapter 2 tying the marble jar back to the case study's baseline.
3. **Fix the chapter 2 title vs content mismatch.** Either retitle chapter 2 to name the baseline content, or end it with a partial answer to "how many visitors."

### Should-fix (cognitive load / clarity)
4. **Move "Two bells" from end of ch 2 to start of ch 3.** Lighter ch 2, better-set-up ch 3.
5. **Trim ch 3's standard-deviation / 68/95 detour.** Keep the intuition, drop the named rule and the "don't conflate" footnote.
6. **Lead ch 3 with the threshold visual; attach "confidence" inside the chapter, not in its title.** Consider retitling.
7. **De-emphasize the three-names-for-one-line section.** Lead with "threshold"; treat *confidence* and *significance* as names for two sides of it; mention *critical value* once.

### Nice-to-have (polish and payoff)
8. **Beef up ch 4 with a live N readout** that updates as the lift slider moves, so the "drag from 10% to 1% and watch N explode" moment lands viscerally before the calculator.
9. **Define "lift" explicitly in ch 2** the first time it's used in a chart (right now it slips in casually).
10. **Add a one-line "per variant" reminder** wherever a sample-size number appears, so the reader knows the calculator's output is per side.
11. **Match the marble jar's true rate to the case study (10%)** or explain the mismatch in a single sentence.

### Out of scope for this audit
- New widgets or calculator behavior changes (functionality is complete).
- Visual / typographic redesign.
- A post-experiment significance tester (already deferred to v2).

---

## Suggested next step

Treat this audit as a backlog. Open a single follow-up branch and address fixes 1–3 first (they are surgical copy edits). Then 4–7 as a second pass (these touch chapter structure and require re-reading the prose end-to-end). 8–11 are polish.

Each fix should be a separate small commit so the prose history stays readable.

---

## Decisions (2026-04-29)

These are the calls made after reviewing the audit. Each maps to a finding above.

### A. Lift consistency — go with 10% relative lift everywhere
- Adapt the case study from **10 vs 15** to **10 vs 11** signups out of 100.
- The new framing is intentionally less dramatic: it makes the chapter 1 point sharper — *picking the winner is not as straightforward as it looks; B might be ahead by chance because of sampling error*.
- All charts, widgets, and prose use a **10% relative lift** from here on. No silent switches.

### B. Chapter 2 title — rename to *"Your baseline matters"*
- Names what the chapter actually teaches. Drops the over-promise of "how many visitors do you need."

### C. Move the first sampling-distribution widget to the end of chapter 1
- After the reader plays with the marble jar in ch 1, we end ch 1 by introducing the **discrete bell shape** there (the histogram you build by stacking draws).
- Chapter 2 then opens already inside the bell metaphor and is purely about **baseline and how it changes how the two bells overlap.**
- **Keep "Two bells" on chapter 2.** It re-renders the same idea (B-relative-to-A) as two bells side by side instead of as a single dashed lift line on the control's bell. That's a useful second visualization of one concept, and it keeps chapter 3 clean and focused on confidence (combined with the order change in I).

### D. Standard deviation — demote to a side remark
- Main language stays simple: "spread," "wobble," "typical width."
- "Standard deviation" appears only as an aside for the curious reader (see F for the side-remark mechanism).

### E. Threshold naming — drop *critical value* from main copy
- Use **threshold** in main prose. *Critical value* is a side remark.
- Use **significance level** as the named term for the sliver to the right. *Alpha* and *1 − alpha = confidence* are side remarks.

### F. Side-remark mechanism for statistical rigor
Plan and ship a single, reusable affordance for "more correct" terminology and asides — usable everywhere across the tutorial. Goals:
- A consistent **icon** that means "stats aside / for the curious." Same icon on every page.
- Interaction reveals the rigorous version (footnote panel, tooltip, or expandable inline — to be decided in implementation).
- Reassures statistically-literate readers that the guide is teaching the right thing under the hood, without burdening beginners.

Side remarks to seed with at minimum:
- **Lift**: define it explicitly the first time it appears, as the term we'll use throughout. Side remark: relative vs absolute lift, and we mean relative.
- **Mean**: define once as the more correct term for the type of average we're using.
- **True rate**: side remark — we mean the (unknown) rate in the population.
- **Standard deviation**: side remark in ch 3.
- **Critical value**: side remark on threshold.
- **Alpha / 1 − alpha**: side remark on significance / confidence.
- **Null hypothesis (H₀)**: side remark when threshold is introduced (see I).

### H. Marble jar true rate — match the case study
- Move the jar from 20% to **10%**, matching the case study and downstream widgets. Removes the unexplained number mismatch.

### I. Reorder chapters — go with alternative #2: baseline → lift → confidence
Confidence is the more complex concept; it earns the closing slot.

**New ch 3 (lift):**
- Drop the threshold from this chapter.
- Keep the two bells. Show that **at low lift the bells heavily overlap; as lift grows they pull apart.**
- This chapter is purely about *how big a real effect would have to be for the picture to look unambiguous*.

**New ch 4 (confidence):**
- Open with: now that the other variables are set, **where do you draw the line?**
- Frame the threshold as: "at what point does a sample mean from B look so extreme that, if there really were no effect, you wouldn't expect to see it — i.e. it would be very rare?"
- Side remark introduces hypothesis testing language: this is the **null hypothesis (H₀)** — under H₀, groups A and B are the same.
- Then attach confidence / significance to the threshold (per E).

Transition from ch 3 → ch 4 needs a more natural bridge than the current ch 2 → ch 3 handoff (per finding I in the audit). Draft when writing.

### Items not separately re-decided
- **B/C combined** already addresses the "ch 2 too heavy" concern (audit C) — moving the first widget out of ch 2 and reframing the chapter to baseline-only.
- **Audit G** (lift, mean, true-rate, per-variant, standard deviation as unannounced concepts) is folded into the side-remark plan in F.
- **Audit fixes 8 (live N readout) and 10 (per-variant reminder)** remain as polish; revisit after the rewrite lands.

---

## Technical implementation plan

Phases are ordered so each unlocks the next. Land each phase as its own PR (or stack of small commits on a feature branch) so prose history stays readable. After every phase: run the dev server and click through all four chapters end-to-end before merging.

### Phase 0 — Branch setup and routing prep
**Goal:** prepare for the chapter reorder without breaking anything.

- Create branch `refactor/storytelling-rewrite` off `main`.
- Decide on routing for the reorder (decision I): the existing routes encode old titles. Two options:
  - **Rename routes** to match new content (`/how-many-visitors-do-you-need` → `/your-baseline-matters`, etc.) and add 301 redirects from old paths in `next.config.ts`.
  - **Keep routes**, only change titles/content. Less SEO-clean but lower-risk.
  - **Recommendation:** keep routes for this rewrite. Re-slug as a follow-up. Add a TODO.
- Update `components/tutorial/chapters.ts` to reflect the new order and titles (decisions B + I). The `chapters` array is the single source of truth for nav order — update there, then thread through pages.

**Critical files:** `components/tutorial/chapters.ts`, `next.config.ts` (only if re-slugging).

### Phase 1 — Numbers consistency (decisions A + H)
**Goal:** every widget, illustration, and prose number agrees on a 10% relative lift and a 10% baseline default.

- Update the case study callout to **10 vs 11** signups out of 100:
  - `components/tutorial/case-study-callout.tsx`
  - `components/tutorial/illustrations/experiment-illustration.tsx`
- Update marble jar to a 10% true rate:
  - `components/tutorial/illustrations/jar-illustration.tsx`
  - `components/tutorial/widgets/marble-sampling-widget.tsx`
  - `components/tutorial/widgets/sampling-distribution-builder.tsx` (the histogram builder also uses this rate)
  - Any constants in `components/tutorial/constants/sampling-constants.ts`.
- Verify chapter-2 / chapter-4 constants (`CH2_LIFT`, `CH4_BASELINE`, `CH4_LIFT_STEPS`) already use 0.10 — they do. No change needed there.
- Sweep prose for hard-coded "20%" / "15 signups" / "5pp gap" references. The jar at 20% is referenced in ch 1 ("the jar below has a true conversion rate of 20%") and ch 2 ("Same 20% true rate, same 10-marble draw"). Both need updating.
- Reframe the ch 1 punchline: with 10 vs 11, the gap is smaller, so the prose should now lead with *"B looks ahead — but is it ahead enough to trust?"* rather than *"50% better in relative terms."* Drop the "10 vs 15 by pure chance" line; replace with sampling-error framing on a smaller gap.

**Verification:** grep for `15`, `20%`, `50% better`, `5p` and reconcile each hit.

### Phase 2 — Side-remark mechanism (decision F) ✓
**Goal:** ship a single reusable affordance for "for the curious" asides before any chapter rewrite needs it.

**Implemented:**

- `components/tutorial/side-remark.tsx` — native `<details>`-based component, a11y-friendly (keyboard reachable, `role="note"` on the expanded panel, `aria-label` on summary). API:
  ```tsx
  <SideRemark term="lift">{vocabulary.lift}</SideRemark>
  ```
  The component renders the bold term and the circled-i icon itself; callers never repeat the term in surrounding text. Leading and trailing spaces are baked into the component so no `{" "}` guards are needed at call sites.
- `components/tutorial/constants/vocabulary.tsx` — centralised `ReactNode` map of all side-remark descriptions, keyed by term. Adding a new term means one entry here; using it anywhere is `{vocabulary.termName}`. Makes it easy to see which terms have definitions and which don't.
- Smoke-tested on ch 2 with `term="mean"`.

**Critical files:** `components/tutorial/side-remark.tsx`, `components/tutorial/constants/vocabulary.tsx`.

### Phase 3 — Chapter 1 restructure (decision C, part 1)
**Goal:** end ch 1 with the discrete bell shape, so ch 2 can open inside the bell metaphor.

- Move `<SamplingDistributionBuilder />` from `app/how-many-visitors-do-you-need/page.tsx` to the end of `app/why-you-cant-trust-your-experiment/page.tsx`.
- Write a new closing section for ch 1 that:
  - Pivots from "one draw bounces around" to "stack many draws and a shape emerges."
  - Names the shape (sampling distribution / discrete bell) without yet naming "bell curve" formally.
  - Hands off to ch 2 with: *"That shape isn't fixed. Its width depends on your baseline."*
- Update `SectionFooter` teaser/nextLabel for ch 1.

**Critical files:** both chapter pages; `components/tutorial/section-footer.tsx` (no API change, just content).

### Phase 4 — Chapter 2 rewrite (decisions B + C, part 2)
**Goal:** chapter 2 is now purely about baseline.

- Rename in `components/tutorial/chapters.ts`: title → *"Your baseline matters"*, shortTitle → *"Baseline"*, browserTitle → match.
- Rewrite `app/how-many-visitors-do-you-need/page.tsx`:
  - Open with: ch 1 ended on a shape; that shape moves with baseline.
  - Keep `BaselineDistributionWidget` and `TwoBellsWidget`. **Keep two-bells on this page** (per decision C).
  - Drop the sampling-distribution intro section (now in ch 1).
  - Tighten the "signal-to-noise" section — it's now the chapter's main payload.
  - Use `<SideRemark>` to define **lift**, **mean**, **true rate** on first use.
- Update `SectionFooter` teaser to set up the new ch 3 (lift), not confidence.

### Phase 5 — Reorder and rewrite chapter 3 as "lift" (decision I, part 1)
**Goal:** old ch 4 (lift) becomes the new ch 3, with the threshold removed.

- Update `chapters.ts`: ch 3 is now the lift chapter.
- Either rename the route `/how-big-a-jump-are-you-looking-for` to ch-3 position in nav (route stays, position changes), or re-slug. Recommendation: keep route for now.
- Rewrite `app/how-big-a-jump-are-you-looking-for/page.tsx`:
  - Open from ch 2's two-bells closer.
  - **Drop all threshold-line copy and visuals from this chapter.** The `LiftEffectWidget` currently renders a threshold; either update it to hide the threshold line in this chapter (prop-controlled), or fork a leaner widget.
  - Decision needed when implementing: prop on `LiftEffectWidget` (e.g. `showThreshold={false}`) is the cleaner path — single widget, two configurations.
  - Story: small lift = bells overlap heavily; large lift = bells pull apart. That's it. No threshold yet.
- Update `SectionFooter` teaser to set up confidence.

**Critical files:** `components/tutorial/widgets/lift-effect-widget.tsx` (add `showThreshold` prop), `components/tutorial/widgets/bells-threshold-chart.tsx` (likely the underlying chart — verify it accepts the prop).

### Phase 6 — Rewrite chapter 4 as "confidence" (decision I, part 2 + E)
**Goal:** confidence becomes the closing chapter, opening with the threshold.

- Update `chapters.ts`: ch 4 is now the confidence chapter; route `/how-sure-do-you-need-to-be` moves to position 4.
- Rewrite `app/how-sure-do-you-need-to-be/page.tsx`:
  - Open: "now that the other variables are set, where do you draw the line?"
  - Introduce **threshold** in plain language. Define: a sample mean from B so extreme that, if there were no real effect, you wouldn't expect to see it.
  - Side remark (`<SideRemark>`) introduces **null hypothesis (H₀)** here.
  - Introduce **significance level** (sliver to the right of the threshold). Side remarks for *alpha* and *1 − alpha = confidence*.
  - Decision E: **drop "critical value" from main copy** entirely; reduce to a side remark on first mention of threshold.
  - Decision D: **demote standard deviation** to a side remark. Main prose uses "spread" / "typical width."
  - Trim or remove the 68/95 detour and the "don't conflate" footnote.
  - Reuse the existing `DecisionThresholdWidget` and `NormalVsExtremeWidget`. The latter may be cuttable now that 68/95 is demoted — re-evaluate when writing.
- Update `SectionFooter` to lead into the calculator (instead of into ch 4 lift).

### Phase 7 — Calculator page recap update
**Goal:** the calculator's chapter recap matches the new order and titles.

- Update `app/calculator/page.tsx` recap list:
  - Ch 1: small samples lie.
  - Ch 2: your baseline matters.
  - Ch 3: lift — the size of the win you're hunting.
  - Ch 4: confidence — how strict the threshold is.
- Verify chapter links match new ordering.

### Phase 8 — Sweep and polish
**Goal:** catch the things that surface only when reading end-to-end.

- Read all four chapters in order. Note every concept used before defined; fix with `<SideRemark>` or a sentence.
- Verify no widget references a now-unused chapter title or constant.
- Check `docs/chapters.md` and `docs/titles-plan.md` — these planning docs will be stale after the rewrite. Either update them or add a header noting they describe a prior version.
- Run linters and typecheck.
- Manual a11y check on `<SideRemark>` (keyboard reachable, screen-reader friendly).

### Phase 9 — Optional polish (deferred unless time allows)
- **Audit fix 8:** live N readout on the lift slider in ch 3, showing how required N explodes as lift shrinks. Requires plumbing a sample-size calculation into `LiftEffectWidget`.
- **Audit fix 10:** "per variant" reminder near sample-size numbers.
- Re-slugging: rename routes to match new titles, with redirects in `next.config.ts`.

---

## Critical-files index

Listed once for quick lookup during implementation.

| Path | Why it matters |
|---|---|
| `components/tutorial/chapters.ts` | Source of truth for chapter order, titles, slugs |
| `components/tutorial/case-study-callout.tsx` | Case-study numbers (10 vs 11) |
| `components/tutorial/illustrations/experiment-illustration.tsx` | Case-study illustration text |
| `components/tutorial/illustrations/jar-illustration.tsx` | Marble jar visual (10% green) |
| `components/tutorial/widgets/marble-sampling-widget.tsx` | Jar sampling widget |
| `components/tutorial/widgets/sampling-distribution-builder.tsx` | Histogram widget — moves to ch 1 |
| `components/tutorial/widgets/lift-effect-widget.tsx` | Add `showThreshold` prop |
| `components/tutorial/widgets/bells-threshold-chart.tsx` | Underlying chart — verify prop pass-through |
| `components/tutorial/constants/sampling-constants.ts` | True-rate constant |
| `app/why-you-cant-trust-your-experiment/page.tsx` | Ch 1 content + new closing widget |
| `app/how-many-visitors-do-you-need/page.tsx` | Ch 2 — baseline only |
| `app/how-big-a-jump-are-you-looking-for/page.tsx` | New ch 3 — lift, no threshold |
| `app/how-sure-do-you-need-to-be/page.tsx` | New ch 4 — confidence, threshold, H₀ |
| `app/calculator/page.tsx` | Recap list + links |
| **new** `components/tutorial/side-remark.tsx` | Reusable "for the curious" affordance |

## Verification checklist (run after every phase)

- `npm run dev` and click through ch 1 → 2 → 3 → 4 → calculator. Use every widget.
- All four chapter `Next →` links go to the correct next chapter in the new order.
- No prose references "20% jar," "15 signups," "50% better," "critical value" (outside side remarks), or "standard deviation" (outside side remarks).
- All side remarks are keyboard-reachable.
- `npm run lint` and `npm run typecheck` clean.

