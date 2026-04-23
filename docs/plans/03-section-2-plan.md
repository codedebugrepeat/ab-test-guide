# Section 2 plan — "How many visitors do you need?"

**URL**: `/how-many-visitors-do-you-need`

---

## Narrative arc

Page 1 ends with: *"More data tightens the spread. How much more? That's what the rest of this guide covers."* Page 2 picks up that thread and immediately grounds it: "It depends on your baseline."

The page has one job — teach the reader that **baseline conversion rate is the foundation of every sample size calculation**, and make that viscerally clear through a widget before any formula appears.

---

## Copy flow

### Opening (1–2 short paragraphs)

Picks up directly from the page 1 handoff. You can't ship B after 100 visitors — so how many do you need? Not a round number. It depends on your situation. The first variable to understand is your baseline.

### What's a baseline?

Plain definition grounded in the case study. Your current signup rate before any change. If 4 out of 100 visitors sign up, your baseline is 4%. Simple.

### Why it's the starting point

Frame it as the signal-per-visitor question. At 2% baseline, each visitor has a 1-in-50 chance of giving you useful signal. At 20%, it's 1-in-5. Same number of visitors, completely different amount of information.

### [Widget — see below]

### Post-widget unpacking (2–3 paragraphs)

Explain what they just saw. At 2%: control ≈ 2 green, variant ≈ 2.4 — the gap is less than one person. You literally can't distinguish A from B in 100 visitors. At 20%: 20 vs 24, a 4-marble gap that's actually visible.

### Quote

> "The lower your baseline, the more data you need to hear the signal above the noise."

### Implication paragraph (no formulas)

A 2% landing page needs roughly 10–20× more visitors than a 30% checkout flow to run the same test. Same relative improvement, completely different data requirement — not because the math is different, but because the signal is rarer.

### Section footer

**What we learned:**
- Baseline = your current conversion rate before any change
- Low baseline → sparse signal → much more data required
- The same +20% relative improvement is far harder to detect at 2% than at 15%

**Transition:** "Baseline is the first input. But you also need to decide how confident you want to be in the result — that's the next chapter."

---

## Widget: Baseline Signal Viewer

The marble metaphor from page 1 carries forward. Two 10×10 grids of circles — Version A (control) and Version B (variant, always +20% relative lift locked in). A slider controls the baseline from 1% to 25%.

### What the user sees

**At 2% baseline:**
- A: 2 green circles in a grid of 100 grey ones
- B: ~2.4 → rounds to 2 or 3 green circles
- The two grids look nearly identical

**At 20% baseline:**
- A: 20 green circles
- B: 24 green circles
- The difference is immediately visible

### Stat cards

One below each grid: "Expected: X signups per 100 visitors". A gap annotation between them turns amber at low baseline — "less than 1 signup difference per 100 visitors".

### Dynamic insight text

Responsive to the slider, shown below the grids:

| Baseline | Text |
|---|---|
| ≤ 3% | "At X% baseline, the expected gap is less than one signup per 100 visitors. You'd need thousands of visitors before a real improvement becomes visible." |
| 3–10% | "A gap of ~Y signups per 100 is real but fragile. You'll need a substantial sample to be confident." |
| > 10% | "At X% baseline you have enough signal that differences are detectable — though still not at 100 visitors." |

### Implementation notes

- Slider: 1–25%, step 0.5, default 5%
- Variant rate = baseline × 1.2 (locked, not user-controlled)
- Grids: fill the first `Math.round(rate × 100)` cells green, rest grey — deterministic, not random, so A and B are directly comparable
- Colors: `#16a34a` green and `#d4d4d4` grey, same as the jar illustration on page 1
- On mobile: stack the two grids vertically

---

## What this page does not include

No bell curves yet. The original chapters.md plan introduced bell curves in section 2 alongside the N slider, but this page focuses solely on baseline as a concept — teaching the sparse-signal intuition first, before any distribution visualisation. The bell curve gets a one-sentence preview in the footer at most:

> "In the next chapter, we'll see this as overlapping probability distributions — and you'll have a slider to watch it change in real time."

Bell curves with the N slider come on the next page.
