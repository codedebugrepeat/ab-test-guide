# Chapter 2 widget plan — final

**Status:** supersedes the widget section of `03-section-2-plan.md` and resolves `04-section-2-widget-v2.md` (Option B, with a two-widget structure).

**Decision recap:** Chapter 2 gets **two widgets**, in order. The first reprises the Chapter 1 marble widget and introduces the idea of a **sampling distribution** by building one live as the reader draws. The second hands the reader a baseline slider and lets them play — the discrete distribution is now the main visual, and baseline is the new lever.

This matches the arc:
- Ch1 → "individual samples are noisy"
- **Ch2, widget 1 → "many samples form a shape" (sampling distribution, discrete)**
- **Ch2, widget 2 → "that shape changes with baseline"**
- Ch3 → "that shape is called a distribution — here's the smooth version, and N narrows it" (bell curves)

By the time the reader hits Chapter 3, bell curves aren't a new abstraction — they're the smoothed-out version of the dot-shape they already built twice.

---

## Page 2 copy/widget structure

Rough outline. Exact copy to be drafted when building:

1. **Opening** — picks up from Ch1 handoff. "Small samples are noisy. But how noisy? Let's keep drawing and find out."
2. **Widget 1: "The shape of noise"** — same marble widget as Ch1, with a live histogram building beside it.
3. **Bridge paragraph** — "What you just drew has a name: a *sampling distribution*. It's the shape of all the outcomes your experiment *could* produce from the same truth. Tight shape = consistent samples = you can trust what you see. Wide shape = your next sample could be almost anything."
4. **Baseline definition** — the existing "what's a baseline?" copy (largely keep).
5. **Widget 2: "Baseline changes the shape"** — the distribution viewer with a baseline slider. This is the main interactive.
6. **Post-widget unpacking** — at 2%, the distribution is narrow in absolute percent but wide *relative to the truth*; at 20%, the opposite. The relative width is what matters for telling "did my button change anything?" — explain.
7. **Quote** — "The lower your baseline, the more data you need to hear the signal above the noise."
8. **Implication paragraph** — the "landing page at 2% vs checkout at 30%" framing (keep from current plan).
9. **Section footer** — summary + transition to Ch3.

---

## Widget 1 — "The shape of noise"

### Purpose

Introduce the sampling distribution as a visual object, using the widget the reader already knows from Ch1. This widget is **not about baseline** — baseline is fixed. It's a teaching device: draw many samples, watch their counts pile up into a shape.

### Layout

Two panels side by side (stacked on mobile):

- **Left:** the Ch1 marble widget, largely as-is — jar, "draw a sample of 10" button, marble rows. Baseline stays at **20%** (matches Ch1 exactly; zero cognitive tax).
- **Right:** a **discrete sampling distribution** plot. X-axis = count of green marbles in a sample (0 to 10, integer bins). Y-axis = how many samples landed at that count. Each time the reader draws, one dot drops into the corresponding column and stacks on top of previous dots.

> **Naming note:** we deliberately don't call this a histogram. A histogram groups continuous data into bins; this plot shows integer outcomes (0, 1, 2, …, 10) as fixed columns. The right term is *sampling distribution* (specifically, the empirical sampling distribution of the count statistic) — **discrete** because the x-axis is a count, not a rate or continuous value.

### Interaction

- Single primary button: "Draw a sample" (animated row + dot lands).
- Secondary: "Draw 10", "Draw 100" — dots flow in faster, staggered, animated.
- No baseline control. No N control. Just the draw action.
- "Start over" resets both the marble rows and the distribution plot.

### What the reader sees

- Early draws: a few scattered dots — maybe one at 1, one at 3, one at 2. Reader thinks: "okay, it's random."
- After 20 draws: a bump forming around 2 (the true mean), with tails. They start to sense a shape.
- After 100+ draws: the classic binomial silhouette at 20%/N=10 — peaked at 2, strong tail to 4 and 5, almost nothing at 0 or 7+.

### The aha

The randomness the reader saw in Ch1 has *structure*. One sample is unpredictable; the distribution of many samples is predictable. That's the object the rest of the guide is about.

### Visual style

- Dots (not bars) for small counts — visually clearer at low N, feels less "chart-y." As dots stack in a column, they form a bar organically.
- Same green as marbles (`#16a34a`) for filled dots; grey-dashed placeholder slots above visible dots to hint at capacity.
- Subtle vertical line at the true mean (x=2) with a tiny "true rate: 20% → 2 per 10" label.
- Animated drop from marble row → distribution column. Short duration (~300ms), eases the visual link between "I drew this sample" and "it lands here."

### Implementation notes

- **Reuse the existing `MarbleSamplingWidget` from Ch1 — do not duplicate it.** The left panel is the same widget, not a fork. Refactor to expose sample history: extract a controlled variant (`<MarbleSamplingWidget samples={...} onDraw={...} />`) alongside the existing uncontrolled version Ch1 uses, so both chapters share one component. Widget 2 also reuses the jar / marble visuals where appropriate.
- New component `DiscreteSamplingDistribution` takes a list of sample counts and renders them as stacked dots in 11 columns (0–10).
- Reuse `drawSample` / `countSample` from `maths/sampling.ts`. Baseline fixed at `P = 0.2` (reuse the `P` constant from `sampling-constants.ts`).
- Wrapper component `SamplingDistributionBuilder` owns state and renders `MarbleSamplingWidget` + `DiscreteSamplingDistribution` side by side. The plot's state is derived from the same counts the marble widget tracks — no duplicate sampling logic.
- Reset clears both.

### What this widget does *not* do

- Does not let the user change baseline or N.
- Does not show the true sampling distribution PMF (no theoretical overlay). The shape emerges from the reader's draws only.
- Does not name what they're looking at in the widget itself — the bridge paragraph does that.

---

## Widget 2 — "Baseline changes the shape"

### Purpose

Now that the reader has the "shape of many samples" idea, give them the baseline slider and let them see the shape transform.

### Layout

Single panel. Top: a baseline slider. Middle: the discrete sampling distribution of observed rates. Bottom: two or three lines of dynamic insight text.

Though this widget's x-axis shows observed rates (effectively finely-quantized: at N=100 the possible rates are 0%, 1%, 2%, …, 100%) rather than integer counts, it's still a discrete sampling distribution — the dots are the empirical distribution of a discrete statistic. Continuous framing (a smooth curve) arrives in Chapter 3.

### Interaction

- **Baseline slider:** 1% → 25%, step 0.5%, default 5%.
- **Sample size fixed at N=100** (not user-controllable — one new lever per chapter, and we need N large enough that the shape is visible at 2% baseline).
- **"Draw 100 samples" button.** Auto-draws 100 samples of N=100 and animates the dots in over ~1s. Dots land at their observed sample rate on the x-axis.
- **"Redraw" replaces** the current 100 with a new 100 (not cumulative). This keeps the comparison clean when the slider moves.
- **Moving the slider clears the distribution** and re-draws automatically, so the reader's primary interaction is just "slide and see."

### Axis

- X-axis in **observed sample rate (%)**, **fixed** range (not auto-scaling). Default 0%–35% so the ±2σ tail at baseline=25% fits with headroom; final range tuned during build. Fixed is the deliberate choice — the visual of the 2% distribution taking up only a sliver of the axis, while the 20% distribution spreads across a chunk of it, *is* the lesson.
- Vertical line at the **true baseline rate** (moves with the slider), labeled "truth: X%".
- A faint "±2 std band" shaded behind the dots — labeled "~95% of samples land here" — so the reader can see the band visibly widen/narrow in relative terms.

### What the reader sees

At **baseline = 2%:** dots cluster between 0% and 5%. The band is 0%–5%. The truth line is at 2%. The reader observes: a single sample could easily show 0% or 4% — more than 2× off the truth. "You can't tell 2% apart from 4%."

At **baseline = 10%:** dots span ~5%–15%. Band is tighter relatively. Starting to look useful.

At **baseline = 20%:** dots span ~12%–28%. Band is the widest in absolute terms, but *narrowest relative to the truth*. A sample tells you the truth to within a few points relative to 20% — reliable.

### Dynamic insight text

Below the plot, one line adapts to the slider:

| Baseline | Text |
|---|---|
| ≤ 3% | "At X% baseline, a sample of 100 could show anywhere from 0% to Y%. That's Z× off the truth — almost any number is plausible." |
| 3–10% | "At X% baseline, your sample will land roughly between A% and B%. You can tell broad differences apart, not small ones." |
| > 10% | "At X% baseline, your sample will land within ~C points of the truth. That's tight enough to spot a real change." |

Numbers in the text are computed from the observed dots (or the theoretical band) at current baseline.

### The aha

Two in one:
1. **Absolute width grows with baseline** (a 20% jar has more variance than a 2% jar in percentage points), but —
2. **Relative width shrinks with baseline.** The 2% distribution covers a proportionally huge range of "could-be truths." The 20% distribution pins down the truth. That relative width is what matters when you're trying to distinguish "A vs B differs by 0.4pp" from noise.

### Implementation notes

- Build a second plot component, `SamplingRateDistribution`, for Widget 2. (Widget 1's `DiscreteSamplingDistribution` has fixed integer bins 0–N and doesn't generalize cleanly to a fine-grained rate axis — keeping them as two components is cleaner than over-generalizing.)
- **Reuse `drawSample` / `countSample` / `binomialSD` from `maths/sampling.ts`.** No new math module.
- **Reuse visual primitives** (dot styling, green color, animation timing constants) from Widget 1 / the Ch1 marble widget so both widgets feel like one family.
- Compute the ±2 std band analytically from `binomialSD(N, p) / N` — no need to simulate it.
- Auto-redraw on slider change — debounce ~100ms so dragging is smooth.
- Pre-compute 100 draws when slider settles; animate them in staggered (reuse the Ch1 widget's `BATCH_STAGGER` / `PULSE_DURATION` constants so the motion feels familiar).

### What this widget does *not* do

- Does not let the reader change N (that's Ch3's lever).
- Does not compare two baselines side by side. The comparison is temporal — slide the slider.
- Does not introduce a formal bell curve overlay. Dots only.

---

## Shared technical notes

### Components

New files:
- `components/tutorial/discrete-sampling-distribution.tsx` — Widget 1's right-hand plot (stacked dots in integer columns 0–N). Named to match what it actually shows: the empirical sampling distribution of a discrete count.
- `components/tutorial/sampling-distribution-builder.tsx` — Widget 1 wrapper that combines the marble widget + the discrete distribution.
- `components/tutorial/sampling-rate-distribution.tsx` — Widget 2's dot plot of observed rates with ±2σ band.
- `components/tutorial/baseline-distribution-widget.tsx` — Widget 2 wrapper (slider + plot + insight text).

Touch (don't duplicate):
- `components/tutorial/marble-sampling-widget.tsx` — expose sample history. Prefer a controlled variant `<MarbleSamplingWidget samples={...} onDraw={...} />` extracted alongside the existing uncontrolled version Ch1 uses. Ch1 keeps using the uncontrolled version; Ch2's Widget 1 uses the controlled one. **One component, two entry points — no fork.**
- `maths/sampling.ts` — likely no changes needed; all the math is there.

### Shared constants

Consider a new `components/tutorial/chapter-2-constants.ts`:
```
export const CH2_BASELINE_MIN = 0.01;
export const CH2_BASELINE_MAX = 0.25;
export const CH2_BASELINE_DEFAULT = 0.05;
export const CH2_N = 100;
export const CH2_SAMPLE_COUNT = 100;
```

Don't co-opt the Ch1 `N`/`P` constants — Ch2 has its own sample size and varying baseline.

### Accessibility

- Both widgets need `aria-live` regions announcing state changes ("Drew sample 12: 3 green"; "Baseline changed to 5%; redrawing distribution").
- Slider needs keyboard control (native `<input type="range">`) and `aria-valuetext` with the human-readable value.
- Dot plots need a text-alternative summary: "Distribution of 100 samples at 5% baseline, ranging from 0% to 12%, centered at 5%."

### Performance

- Widget 2 redraws 100 samples per slider change. At 5% CPU cost per redraw that's fine. Debounce to avoid thrash while dragging.
- Dots animating in should be GPU-accelerated CSS transforms, not layout-changing properties.

---

## What lands from the old plan

Kept:
- Baseline definition copy
- "Two products, two data problems" framing (but now backed by the distribution widget, not a 2×2 grid)
- Quote: "The lower your baseline, the more data you need to hear the signal above the noise."
- Section footer summary + transition copy

Dropped:
- The two-grids A/B widget (replaced entirely by widget 2)
- The locked +20% variant rate (no A/B happens on this page — Ch2 is about baseline alone, not lifts)

---

## Resolved decisions

1. **Widget 1 baseline: 20%.** Matches Ch1 exactly. Continuity with Widget 2 (which uses the same visualization) outweighs matching the case-study version A rate.
2. **Widget 2 axis: fixed range.** The visual of the 2% distribution taking up only a sliver of the axis while the 20% one spreads out is the point of the widget. Auto-scaling would hide that.
3. **Widget 1 stays pure** — no ±2σ band. Widget 1's job is "here's what randomness looks like when you pile up samples." The analytic framing (band, truth line as anchor for confidence intervals) is reserved for Widget 2.
4. **Mobile layout for Widget 1: marble widget above, distribution below.** Stacked vertically. Can revisit if building reveals a better option.
