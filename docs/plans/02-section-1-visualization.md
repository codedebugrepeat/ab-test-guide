# 02 — Section 1 Visualization: Marble Sampling Widget

Status: proposed — awaiting approval.

## Goal

Give the reader a hands-on, intuitive feel for sampling error before naming it.
They interact with the widget first — draw samples, watch the counts vary — and
*then* the surrounding text gives the concept a name and connects it back to the
A/B test. The learning order is: experience → name → implication.

## Learning outcome

After playing with the widget for 30–60 seconds the reader should feel, not just
read, that:

1. Even with a fixed underlying rate, every sample gives a different count.
2. Small samples make that spread wide — a 10 vs. 15 gap is completely normal.
3. This variation has a name — sampling error — and it's why you can't trust a
   small experiment.

## The metaphor

Your visitors are marbles in a jar. Some are **converted** (green, ✓); the rest
are **not converted** (grey, ✗). The jar has a fixed, true conversion rate —
the same rate every time you draw. You grab 10 marbles at random. Count the
green ones. Draw again. Count again. The counts differ even though the jar
hasn't changed.

That's the whole lesson.

## Math

**Distribution:** Binomial(n=10, p=0.2). True conversion rate = 20%, so the
expected count per sample = 2, sd ≈ 1.26. 20% is chosen because it is a round
number that puts the expected value at 2 (easy to visually anchor) and is close
to the case-study scenario (10–15%) without equalling it — the jar represents
the *underlying population*, not the specific A/B test result.

**Sampling:** Generate each sample as 10 independent Bernoulli(0.2) draws
(i.e. `Math.random() < p` for each marble). This is exact, needs no
approximation, and naturally produces the boolean array (`converted[]`) needed
to render individual marble states.

**Maths module (`maths/sampling.ts`):**
```ts
// Returns an array of booleans: true = converted, false = not
export function drawSample(n: number, p: number): boolean[]

// Convenience: just the count
export function drawSampleCount(n: number, p: number): number

// Expected value and SD (for annotation)
export function binomialMean(n: number, p: number): number   // n * p
export function binomialSD(n: number, p: number): number     // sqrt(n*p*(1-p))
```

No external library needed — pure math.

## Widget anatomy

```
┌─────────────────────────────────────────────────────────┐
│  [Draw a sample]                                        │
│                                                         │
│  Sample 4  ● ● ○ ● ○ ○ ○ ○ ○ ○   → 3 conversions  ← newest
│  Sample 3  ● ○ ○ ○ ○ ● ○ ○ ○ ○   → 2 conversions
│  Sample 2  ● ● ● ○ ○ ○ ○ ○ ○ ○   → 3 conversions
│  Sample 1  ● ○ ○ ○ ○ ○ ● ○ ○ ○   → 2 conversions
│            ╎                                            │
│            ╎ ← expected: 2 (dotted vertical line)       │
└─────────────────────────────────────────────────────────┘
```

- **Button**: "Draw a sample" (primary style). On first draw: "Draw a sample —
  see what you get". Disabled briefly (~700 ms) while marbles are animating so
  rapid-fire clicks don't stack badly. After 3+ draws, label changes to "Draw
  another".
- **Marble row**: 10 marbles in a horizontal strip. Each marble is a small
  circle (~20 px). Converted = green fill + ✓ (or solid fill); not-converted =
  muted/grey + hollow or ✗. Both color and symbol carry the encoding so it reads
  in both light/dark mode and for color-blind users.
- **Count label**: right of the strip, e.g. "3 / 10". Keep it tight — the
  visual spread across rows tells the story better than the numbers alone.
- **History stack**: newest sample at the top, older samples push down. Cap at
  12 rows; rows beyond 12 are trimmed off the bottom. No scroll — the widget
  has a fixed max-height.
- **True-mean line**: a vertical dotted line (1 px, muted color, `opacity-40`)
  drawn at the position corresponding to 2/10 (= 20%) of the marble strip
  width. Labelled "expected: 2" in small text above the first row. The line
  persists across all rows so the reader can eyeball how far each sample landed
  from the truth.
- **Empty state**: before any draw, show a placeholder row in dashed outline
  ("click the button to draw your first sample") to make the affordance clear.

## Animation

**Approach:** CSS keyframe animation driven by a `data-state` attribute
(`idle` | `dropping` | `settled`). No animation library required. Framer Motion
is explicitly out of scope to keep the bundle lean.

**Sequence per draw:**
1. A new row element is inserted at the top of the stack (off-screen or opacity 0).
2. Each marble inside it animates from `translateY(-24px), opacity 0` to
   `translateY(0), opacity 1` with a brief easing (ease-out, ~200 ms per marble,
   staggered by `index * 60 ms`).
3. After all marbles have settled (~800 ms total), `data-state` transitions to
   `settled` and the button re-enables.
4. Marbles that are `converted=true` get a slight "bounce" (scale 1.0 → 1.15 →
   1.0) on settle so the green ones pop visually.
5. Older rows do not re-animate when a new row is added — they are static.

**CSS variables / tokens used:** `--color-foreground`, opacity modifiers already
in use on the page. Green: `oklch(65% 0.17 145)` or Tailwind `green-500` — whichever
the globals already support. Check `globals.css` at implementation time; do not
introduce new CSS custom properties.

## Surrounding prose (page integration)

**Placement in the page:** after the case-study callout, before "The instinct:
B beat A, so ship B". The widget is the proof of concept; the prose sections
that follow name and use what the user just felt.

**Lead-in text (before widget):**
> Imagine every potential visitor is a marble in a jar. Green means they signed
> up; grey means they didn't. The jar below has a true conversion rate baked in
> — 20%, so 2 in every 10 on average. Draw a sample of 10 and count the green
> ones.

**Follow-on text (after widget, before "The instinct" section):**
> What you just saw is **sampling error** — the natural spread in outcomes you
> get when drawing a small random sample, even when nothing about the jar
> changed. The jar's truth didn't move; your draws did.
>
> At 10 marbles per draw, the count bounces around considerably. Getting 1 when
> the expected value is 2 is common. Getting 3 is common too. Now scale that up:
> our A/B test had 100 visitors per group, not 10 — but the same principle
> applies. A raw gap of 10 vs. 15 signups is the kind of gap that sampling error
> produces routinely, even when both variants are identical.
>
> Sample size is the lever that tightens this spread. We'll come back to exactly
> how much — but first, let's name the mistake.

## Phases

Each phase ends with a reviewable commit. Do not start the next phase until the
previous one is approved.

---

### Phase 1 — Prose + placeholder

**Goal:** get the surrounding text right before any code touches the widget slot.
The page should read well even with a static placeholder where the widget will
eventually live.

**Files to change:**
- `app/why-you-cant-trust-your-experiment/page.tsx` — insert the lead-in prose,
  a `<VisualizationPlaceholder />` stub, and the follow-on prose between the
  case-study callout and the existing "The instinct" section.

**The placeholder** is a simple bordered box with a short label inside:
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  [Marble sampling widget — coming soon]
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```
Dashed border, muted text, fixed `min-height` (~180 px) so the page layout
already reflects the space the real widget will occupy. Inline in the page file;
no separate component needed.

**Do not touch:** `globals.css`, `maths/`, any component files not listed above.

**Verification:**
- Page renders with lead-in prose, placeholder box, follow-on prose in the
  correct position between the case-study callout and "The instinct" section.
- `npm run lint` and `npm run build` pass.

---

### Phase 2 — Maths module + unit tests

**Goal:** implement and verify the sampling logic in isolation, before any UI
touches it.

**Files to create:**
- `maths/sampling.ts` — `drawSample`, `drawSampleCount`, `binomialMean`,
  `binomialSD`. Pure TS, no dependencies.
- `maths/sampling.test.ts` — unit tests (use whichever test runner is already
  configured in the project; check `package.json` at implementation time).

**What to test:**
- `drawSample(10, 0.2)` always returns an array of exactly 10 booleans.
- `drawSample(10, 0.0)` returns all `false`; `drawSample(10, 1.0)` returns all
  `true`.
- `drawSampleCount` return value always satisfies `0 <= count <= n`.
- `binomialMean(10, 0.2)` returns `2`; `binomialSD(10, 0.2)` is close to
  `1.265` (within floating-point tolerance).
- Statistical smoke test: draw 1 000 samples with `drawSampleCount(10, 0.2)`,
  confirm the empirical mean is within ±0.2 of 2.0. (Seeding isn't needed —
  the tolerance is wide enough that this passes reliably.)

**Do not touch:** any component or page files.

**Verification:**
- `npm test` (or equivalent) passes with all cases green.
- `npm run lint` passes.

---

### Phase 3 — Static widget (no animation)

**Goal:** real component with real data, no movement. The reader can already use
it; it just doesn't animate yet.

**Files to create:**
- `components/tutorial/marble-sampling-widget.tsx` — `'use client'` component.
  Owns sample-history state and the button. Composes `MarbleRow`. No animation
  logic yet — marbles appear instantly on draw.
- `components/tutorial/marble-row.tsx` — renders one row of 10 marble circles +
  count label. Props: `marbles: boolean[], sampleNumber: number`. No `isNew` or
  animation props yet.

**Files to change:**
- `app/why-you-cant-trust-your-experiment/page.tsx` — replace
  `<VisualizationPlaceholder />` with `<MarbleSamplingWidget />`.

**Behaviour in this phase:**
- Button click immediately adds a new row at the top of the stack (no drop
  animation).
- True-mean line present and correctly positioned.
- Empty state, row cap (12), count label, pill label all implemented.
- Button disabled state (re-enables instantly since there is no animation timer
  yet — the 700 ms lock is added in Phase 4).
- `aria-live` region present and announcing results.

**Do not touch:** `globals.css`, `layout.tsx`, `SiteHeader`, `SiteFooter`,
`Container`, `lib/site-config.ts`, `components/tutorial/case-study-callout.tsx`.

**Verification:**
- Button draws a new row instantly; 12-row cap works; mean line aligns.
- Light + dark mode, mobile width readable.
- Screen reader announces each draw.
- `npm run lint` and `npm run build` pass.

---

### Phase 4 — Animation

**Goal:** add the drop + bounce animation on top of the working static widget.
No structural changes to the widget; animation is purely additive.

**Files to change:**
- `components/tutorial/marble-row.tsx` — add `isNew: boolean` prop. When `true`,
  animate each marble from `translateY(-24px), opacity 0` to settled position
  (staggered by `index * 60 ms`, ease-out ~200 ms each). Converted marbles get
  a settle-bounce (scale 1.0 → 1.15 → 1.0). Uses CSS keyframes via Tailwind
  arbitrary values or a `<style>` block; no animation library.
- `components/tutorial/marble-sampling-widget.tsx` — track which row is `isNew`
  (only the most recently added); disable button for ~700 ms during animation.
  Respect `prefers-reduced-motion`: if set, `isNew` has no effect (marbles
  appear instantly).

**Do not touch:** everything not listed above.

**Verification:** full checklist from the Phase 4 Verification section below.

---

## Files to create / change (summary across all phases)

**Create:**
- `maths/sampling.ts`
- `maths/sampling.test.ts`
- `components/tutorial/marble-sampling-widget.tsx`
- `components/tutorial/marble-row.tsx`

**Modify:**
- `app/why-you-cant-trust-your-experiment/page.tsx`

**Do not touch:**
- `globals.css`, `layout.tsx`, `SiteHeader`, `SiteFooter`, `Container`,
  `lib/site-config.ts`, `components/tutorial/case-study-callout.tsx`.

## Accessibility

- Marbles are not interactive elements; the button is the only focus target.
- After each draw, announce the result to screen readers via an
  `aria-live="polite"` region: "Sample 4: 3 out of 10 converted."
- Marble circles use `aria-hidden="true"`; meaning is carried by the live
  region.
- The button has a descriptive `aria-label` that updates with draw count.
- `prefers-reduced-motion`: if set, skip translate animation; marbles appear
  instantly. The bounce effect is also suppressed.

## Explicitly out of scope

- Adjustable `n` or `p` sliders — deferred to a later section where sample size
  is the main topic.
- Saving or sharing sample results.
- Any connection to the calculator page.
- More than one "jar" (no side-by-side A vs. B simulation here — that's the
  coin-flip widget from the original plan, which lives in a later section).
- Histogram or distribution curve overlay — text + dotted mean line is enough
  for this section's goal.

## Open questions

1. **True mean line label.** "expected: 2" is clear but slightly technical for
   a first-time reader. Alternatives: "average" / "typical" / "what we'd expect
   from a perfect sample". Decide at implementation time — lean toward
   "average: 2" for accessibility.
2. **Marble size on mobile.** 10 × 20 px circles + gaps + count label may be
   tight at 375 px width. Options: reduce to 16 px circles, or wrap to 5+5 on
   very small screens. Confirm at implementation time.
3. **Row cap behavior.** When the 13th row would be added, should old rows fade
   out or hard-cut? Fade (opacity 0 over 200 ms then remove) feels cleaner.
4. **Initial conversion rate disclosure.** The lead-in text says "20%". Should
   the widget also display this as a label ("Jar: 20% conversion rate") for
   readers who don't read the prose first? Probably yes — a small pill label
   above the button.

## Verification (Phase 4 — full checklist)

1. `npm run dev` — no console errors.
2. Button click → 10 marbles drop into the top row with staggered animation.
3. Green marbles (converted=true) have bounce on settle; grey do not.
4. Drawing 8+ samples stacks correctly; row 13+ causes row 1 to disappear.
5. True-mean line is vertically aligned with position 2/10 across all rows.
6. `aria-live` region announces each sample result.
7. With `prefers-reduced-motion` enabled, marbles appear without animation.
8. Mobile (375 px): marbles readable, button reachable.
9. Light mode + dark mode: colors readable, contrast sufficient.
10. `npm run lint` passes.
11. `npm run build` succeeds; route stays static (widget is a client component
    inside a server page — this is fine).
