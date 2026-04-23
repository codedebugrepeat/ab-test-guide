# Chapter 2 widget — v2 options

**Status:** Decided. **Option B** chosen, with a two-widget structure. See `05-section-2-widget-plan.md` for the implementation plan. The options below are kept as a record of what we considered and why we ruled them out.

**Context:** The previous plan (`03-section-2-plan.md`) proposes a side-by-side "two companies at different baselines, both running A/B tests at +20% relative lift" grid widget. It's too much: the reader has to hold four things in their head at once (low-baseline A, low-baseline B, high-baseline A, high-baseline B) *and* compare across companies — all before we've even introduced the idea of a sampling distribution. We want a widget that teaches **baseline = how much signal each visitor brings** with a single, focused interaction.

This doc lays out candidate widgets, how each fits the arc, and ends with a decision question for Christoph.

---

## The story we're telling (recap)

| Chapter | Teaches | Widget | New lever |
|---|---|---|---|
| 1 | Small samples are noisy | Jar + draw 10 marbles at 20% baseline, see counts dance | (none — fixed jar) |
| **2** | **Baseline sets how rare the signal is — low baseline = sparse data = harder to see anything** | **?** | **?** |
| 3 | Sample size narrows the sampling distribution | Bell curves + N slider | N |
| 4 | Confidence threshold trades off N vs false alarms | + significance shading | significance |
| 5 | Smaller lifts need dramatically more N | + effect-size slider | minimum lift |

Chapter 1 gave the reader one mental object: **a jar of marbles, from which we draw a sample**. Chapter 3 makes a jump (abstraction to bell curves). Chapter 2 is the *narrative bridge*: still concrete, still marbles, but we're changing what's *in* the jar.

## Design constraints

1. **Stay in the marble metaphor.** Bell curves belong to Chapter 3. Reusing the jar keeps the cognitive load minimal and reinforces Chapter 1's vocabulary.
2. **One new variable.** Chapter 2's new variable is **baseline**. Not A/B, not lift, not N. Adding any second variable turns the widget into a 2×2 comparison, which is what we're trying to avoid.
3. **No bell curves.** Save the abstraction step for Chapter 3.
4. **Visceral, not verbal.** The "aha" has to happen in the widget, not the caption.
5. **Complexity step up from Ch1 should be small.** Ch1 widget = "draw samples, watch count". Ch2 widget should still feel like a sibling — add one knob, not a whole new paradigm.

---

## Option A — "Turn the baseline down" (extend the Ch1 widget)

**One-sentence pitch:** Take the exact Ch1 marble-sampling widget and add a baseline slider. That's it.

**What the user does:** They see the same widget they already know. A new slider at the top sets the jar's baseline from 1% to 25%. "Draw a sample of 10" still works. At 1% baseline, most draws come up 0 green; occasionally 1; very rarely 2. At 20%, it's the familiar dance. At 5%, nearly every sample shows 0 or 1 — *you can't distinguish between jars just by looking at one sample*.

**The aha:** At 1–3%, almost every 10-marble draw is the same (0 green). The signal is literally invisible at this sample size. The reader discovers: *to see anything at a low baseline, I need bigger samples.* That's the handoff to Chapter 3.

**Story-arc fit:** ⭐⭐⭐⭐⭐ Strongest continuity. Same widget, same interaction, one new knob. The Ch1 → Ch2 → Ch3 arc becomes: "draw samples" → "change the jar, keep drawing" → "okay, so let's make the sample bigger — watch the distribution narrow." No conceptual jump between chapters.

**Complexity jump:** Smallest possible. One new control on a widget the reader already understands.

**Pros:**
- Cheapest to build — small delta on existing component.
- Maximum narrative continuity.
- Ties directly into Chapter 3 (where N becomes the new lever).
- The "empty samples" experience at 2% baseline is genuinely memorable.

**Cons:**
- Less "designed" than a purpose-built Ch2 widget — risks feeling like "same thing, slightly different."
- At N=10 with low baselines, signals are so rare the user mostly sees empty rows, which could read as broken. Might need to add a "draw 100" emphasis at low baselines.

**Implementation sketch:** Add `baseline` state to `MarbleSamplingWidget`, thread it into `drawSample(N, baseline)`. Add a slider control above the stats row. Copy for the dynamic insight text adapts to baseline. No new components needed.

---

## Option B — "Sample-to-sample wobble at different baselines"

**One-sentence pitch:** Show the *spread* of sample rates at a given baseline by drawing many samples and plotting their observed rates on a number line.

**What the user does:** Baseline slider sets the jar (1–25%). User clicks "draw 50 samples of N=100". A horizontal number line (0% — 30%) populates with 50 dots, each one a sample's observed rate. A vertical line marks the true baseline. At 2% baseline, dots cluster in a band from 0% to 6% — meaning *your observed rate can easily be 3× the truth or 0*. At 20% baseline, dots cluster tightly from 16% to 24%.

**The aha:** At low baselines, the spread of sample rates is enormous *relative to the truth*. A 2% jar can easily produce a sample that looks like 4% — so when you see 4%, you have no idea whether the true rate is 2%, 3%, 4%, 5%, or 6%. At 20%, a sample of 21% is almost certainly within a point or two of the truth.

**Story-arc fit:** ⭐⭐⭐⭐ Strong. This is basically "the sampling distribution, but drawn as dots on a line" — a gentler precursor to Chapter 3's bell curves. Reader arrives at Chapter 3 already understanding the concept; the bell curve is just the smooth version of what they've seen.

**Complexity jump:** Moderate. Introduces a new visualization (dots on a number line) but the underlying mental model (draws from a jar) is unchanged.

**Pros:**
- Teaches the signal-to-noise intuition very directly.
- Sets up Chapter 3 perfectly — the dots are a discrete sampling distribution.
- Handles the "but at N=10 you see nothing at 2%" problem by using N=100 internally.

**Cons:**
- Bigger build — new viz component (dot plot).
- Risk of feeling like a proto-bell-curve, stealing Chapter 3's punch.
- Reader may conflate "spread of dots" with something else.

**Implementation sketch:** New component `BaselineSpreadWidget`. Baseline slider + "draw 50 samples" button. Use `drawSample(100, baseline)` 50×; plot observed rates as SVG dots on a horizontal axis. Re-roll on click.

---

## Option C — "Visitors per signup" (rarity counter)

**One-sentence pitch:** Stream visitors across the screen one at a time. Green flash when they convert. Baseline slider controls how often that happens. A counter shows "visitors per signup" live.

**What the user does:** Baseline slider (1–25%). Hit "play" and visitors stream left-to-right, each a grey dot, occasional green flashes. At 2% baseline: ~50 grey dots between green flashes. At 20%: every fifth dot is green. Live counter: "On average, 1 signup every X visitors."

**The aha:** At 2%, signups are *rare*. You can see with your eyes how much empty grey passes between any two green dots. At 20% it's a steady stream. The reader *feels* how much traffic is needed to accumulate the same amount of green signal.

**Story-arc fit:** ⭐⭐⭐ Decent but indirect. Teaches rarity, which is a correct and important framing. But it teaches it as "how often does one thing happen?" rather than "how noisy is a sample?" — the latter is the direct setup for Chapter 3.

**Complexity jump:** Small — it's a ticker, simpler than Ch1's widget in some ways.

**Pros:**
- Visually very satisfying, easy to grasp.
- Makes "the signal is rare" viscerally obvious.
- Light-weight implementation.

**Cons:**
- Doesn't teach *sampling variation* — the core noise concept. A live stream shows the rate, not the spread of sample means.
- Chapter 3 won't feel like a natural next step from "watching visitors flow" → "here's a bell curve of sample outcomes."
- Might be fun but skip the conceptual work we need this chapter to do.

**Implementation sketch:** Animated row of dots, Bernoulli draw per tick with baseline probability. Counter at side. No persistence needed.

---

## Option D — "Same lift, different data cost"

**One-sentence pitch:** A single jar with a baseline slider. Show in numbers (not grids, not dots) how many visitors you'd need to distinguish a +20% lift at that baseline, as an instant read-out.

**What the user does:** Baseline slider. Below it, one big number: **"You'd need ~18,000 visitors per group to detect a 20% lift at this baseline."** Slide baseline up → number drops dramatically → slide down → it explodes. Maybe a bar chart next to it comparing "visitors needed" at 2%, 5%, 15% — user sees the current value slot into place on the bar.

**The aha:** At 2% baseline you need ~40k visitors. At 20% you need ~2k. The cost of a low baseline is an order of magnitude more data. Not abstract — a specific number that changes live.

**Story-arc fit:** ⭐⭐ Weaker. This leaps ahead to a formula-driven answer (sample size calculation) that we haven't introduced yet — we're supposed to *build up* to that by the end of Chapter 5. Using a calculator result in Chapter 2 steals Chapter 5's punchline.

**Complexity jump:** Small UI-wise, but conceptually it assumes the reader accepts "here's a number from a formula we haven't shown you yet."

**Pros:**
- Numerically dramatic — the cost explosion at low baselines is visceral.
- Very tight, single-concept widget.

**Cons:**
- Short-circuits the arc. The calculator is the Chapter 5 payoff.
- Requires explaining or handwaving the formula now.
- Less intuition-building, more "trust me, it's a lot."

---

## Option E — "Hybrid: one jar, baseline slider, draw N with pick-your-N"

**One-sentence pitch:** Option A, but the user also chooses N (10, 100, 1000). Demonstrates that low baseline *forces* you toward larger N.

**What the user does:** Two controls — baseline slider and N picker (3 buttons). Draw samples, see counts. At baseline=2%, N=10, every row is 0 — clearly unusable. Bump N to 100: now rows show 0, 1, 2, 3, 4, 5 — still noisy but you see variation. Bump to 1000: counts hover tightly around 20. Same baseline, different N, very different information.

**The aha:** At low baselines, small N is uninformative. The reader *discovers the need* for Chapter 3's N slider by running into its absence.

**Story-arc fit:** ⭐⭐⭐ Risky. It teaches baseline + N at once, which is Chapter 2 + Chapter 3 combined. Could muddy the "one new idea per chapter" rule.

**Complexity jump:** Moderate — two controls instead of one.

**Pros:**
- Very concrete: reader solves their own problem by bumping N.
- Natural lead-in to Chapter 3's formal N slider.

**Cons:**
- Violates the one-new-lever-per-chapter discipline the arc is built around.
- Chapter 3's reveal becomes "you already did this, here's the formal version" — less payoff.

---

## Comparison at a glance

| Option | Arc fit | Complexity jump | Build cost | New concept introduced | Chapter 3 setup |
|---|---|---|---|---|---|
| A — baseline slider on Ch1 widget | ⭐⭐⭐⭐⭐ | Smallest | Lowest | Baseline | Implicit: "I need bigger N" |
| B — spread of sample rates | ⭐⭐⭐⭐ | Moderate | Medium | Baseline + sampling spread as dot plot | Explicit: dot plot → bell curve |
| C — visitors-per-signup stream | ⭐⭐⭐ | Small | Low | Baseline as rarity | Weak |
| D — visitors-needed readout | ⭐⭐ | Small UI / big conceptual | Medium | Sample size formula | Spoils Ch5 |
| E — baseline + N combo | ⭐⭐⭐ | Moderate | Medium | Baseline + N together | Too early |

---

## Recommendation (original)

**Option A** is the strongest default. It gives Chapter 2 exactly one new idea (baseline), reuses the widget the reader just spent Chapter 1 learning, and sets up Chapter 3 (N slider, bell curves) as the obvious next move. It's also the cheapest to build — a controlled extension of `MarbleSamplingWidget`.

**Option B** is the sophisticated alternative: a purpose-built widget that does more narrative work — it pre-teaches the sampling-distribution idea so Chapter 3 becomes "same thing you already saw, now drawn smoothly." Pick this if you're willing to pay the extra build cost to make Chapter 3 feel inevitable.

Options C, D, and E each have specific problems with the arc and I'd not recommend them as-is.

---

## Decision — Option B, extended into two widgets

**Picked: Option B**, with a modification — Chapter 2 gets *two* widgets in sequence, not one.

**Why:**

- **Introducing the sampling distribution early is worth the build cost.** Chapter 3's bell curves are the single biggest abstraction leap in the guide. Option B starts priming that mental model one chapter earlier, in discrete form, so Ch3 feels like smoothing rather than a new concept.
- **Option A was safer but did less narrative work.** It teaches baseline cleanly but leaves Ch3 doing all the lifting to introduce distributions.
- **Options C, D, E each broke the arc** — C teaches rarity rather than noise, D spoils Ch5's calculator payoff, E smuggles Ch3's N lever into Ch2.

**The two-widget modification (Christoph's idea):** Before letting the reader play with baseline, reprise the Ch1 marble widget with a histogram building beside it. Same draws they already know, but now each sample's count stacks into a column — the discrete sampling distribution emerges on screen. *Then* introduce the baseline slider as the second widget, using the same distribution visualization the reader has just watched being built.

This fixes Option B's main risk (a new visualization dropped in cold) by having the reader *build the visualization themselves* from a widget they already understand, before being asked to read from it.

**See `05-section-2-widget-plan.md` for the full implementation plan.**
