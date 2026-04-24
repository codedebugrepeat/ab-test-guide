# Tutorial sections

## Running example (used in every section)

> You have a sign-up button on your website and want to increase sign-ups. You're testing whether changing the button copy will make a difference.

- **Control (A):** original button copy + surrounding text
- **Variant (B):** new copy
- **Metric:** signup rate (signups / visitors)

This exact scenario is introduced in section 1 and never changes. All numbers, all widgets, all explanations refer to "your signup button" — never abstract "variant A/B" or generic "conversion rate."

---

## The core visualization

A single chart is introduced in section 2 and reused — with growing complexity — in sections 3 and 4. It shows two overlapping bell curves:

- **Left curve (H₀):** the distribution of results you'd expect if the new copy makes *no difference*
- **Right curve (H₁):** the distribution of results you'd expect if the new copy *actually works*

The more the curves overlap, the harder it is to tell signal from noise. The user's job — across the three sections — is to understand what moves the curves and what separates them.

**Progressive unlocking of controls:**

| Section | New control unlocked | What the user sees |
|---|---|---|
| 2 | Sample size (N) slider | Larger N → curves narrow → less overlap → easier to detect a real difference |
| 3 | Significance level slider | Significance threshold moves → shaded "declare a winner" region shifts → tradeoff between false positives and required N |
| 4 | Minimum lift slider | Curves move apart or together → smaller lift = more overlap = much harder to detect |

Each section introduces exactly one new concept and one new lever. By section 4, the user has all three controls and can see how N, significance, and minimum lift interact — without ever being handed all three at once.

---

## Section 1 — "I tested it on 100 people. That's enough, right?"

**Hook:** You changed your signup button copy, showed it to 100 visitors, and the new version got more signups. Ready to ship? Not so fast — this isn't an A/B test yet, it's a gamble.

**Tone:** Warm, not condescending. Almost everyone makes this mistake. It's not obvious until you see it. This tutorial exists to fix that.

**What to show:** Even if both versions are identical, a sample of 100 people will almost always show one "winning" — because random variation at small N looks exactly like a real signal.

**Key ideas (plain language only, no formulas):**
- Small samples produce noisy results by chance alone
- You need a principled way to separate a real signal from lucky noise
- That's what the rest of this tutorial teaches — and what the calculator computes for you

**Widget:** Coin flip race. Two identical fair coins, both 50/50. User presses "flip again" and watches 10 flips: they nearly always show different counts. Then 100 flips: still diverges. Then 1000: they converge. Counter shows "how many times out of X runs did we see a gap this big by pure chance?" The aha: at small N, noise looks like signal every time.

**No bell curves in this section.** The coin flip widget is intentionally simpler — a clean gut-punch before the main visualization is introduced.

**Transition:** "OK — so you need more than 100 people. But how many? That's what the next three sections answer."

---

## Section 2 — "OK, how many? It depends on your baseline."

**Hook:** Before you can know how many visitors you need, you need to know how many people currently sign up — without any change. That's your baseline.

**What to show:** If your signup rate is currently 2%, you get very few signups per 100 visitors. Any lift you see is mostly noise because there's so little signal to begin with. Higher baseline = more signal per visitor = less data needed to see a real difference.

**Key ideas:**
- Baseline rate: how often do visitors sign up today, before any change?
- Low baseline → sparse signal → more noise → you need more data
- The baseline is the starting point for every sample size calculation

**Widget — bell curve introduced for the first time:**
The two overlapping distributions appear. At this stage, only **one control is available: sample size (N) slider.**

User moves the slider up → curves narrow → overlap shrinks → it becomes visibly easier to tell the two apart. Move it down → curves widen → overlap grows → nearly impossible to detect a real difference.

A note on baseline: show a subtle annotation that the *width* of the curves also depends on the baseline rate. When baseline is very low, the curves start out wider — reinforce this with a secondary baseline slider or a brief before/after (not yet a primary control, just a callout). The main action is still the N slider.

**Transition:** "Now you know N matters and baseline matters. But there's another variable: how sure do you actually need to be?"

---

## Section 3 — "How sure do you need to be?"

**Hook:** You get to choose how often you're willing to be wrong. A lower bar means fewer visitors needed — but you'll ship more changes that don't actually work. A higher bar is safer, but more expensive.

**What to show:** Confidence level (significance level) as a threshold. Moving it changes the boundary between "call a winner" and "inconclusive." Higher confidence pushes that boundary, which means you need more data to clear it.

**Key ideas:**
- Significance level: how often are you OK with a false alarm? (common choice: 5%)
- Confidence interval: a range that probably contains the true answer
- Higher confidence → stricter threshold → more data required

**Widget — second control unlocked: significance level slider.**

Same bell curve chart from section 2. N slider is still there. Now a significance level slider (80% / 90% / 95% / 99%) appears. A shaded critical region on the chart shows the "declare a winner" zone. User can now manipulate both:
- Increase N → curves narrow (as before)
- Increase confidence → critical region shifts, requiring less overlap to declare significance → user sees both levers interact

**Transition:** "One more variable: how big a change do you actually care about detecting?"

---

## Section 4 — "How big a difference do you want to catch?"

**Hook:** You don't need to detect every possible improvement. If your new copy gets 0.1% more signups, you probably don't care. If it gets 15% more, you definitely do. The size of the difference you want to reliably catch changes how much data you need — a lot.

**What to show:** Minimum detectable lift — the smallest improvement worth shipping. Smaller lift = curves move closer together = more overlap = much harder to separate signal from noise. To catch small lifts reliably, you need either a huge N or are willing to accept a much higher error rate.

**Key ideas:**
- Minimum detectable lift (plain language: "the smallest improvement you'd actually bother shipping")
- Smaller lift = more data needed — often dramatically more
- The full picture: N depends on baseline, confidence level, and minimum lift — all three together

**Widget — third control unlocked: minimum lift slider.**

Same bell curve chart. All three controls now available: N, significance level, minimum lift. Moving the minimum lift slider moves the H₁ curve closer to or further from H₀. The user can now play with all three and see the full interaction. Required sample size shown as a single prominent number that updates live with every slider change.

A key "aha" moment to make visible: dragging minimum lift from 10% down to 1% causes the required N to explode — the number jumps dramatically. Make this visceral.

**Payoff:** At the end of section 4, the user has built intuition for all three inputs. A clear CTA: "Ready to run the numbers for your actual experiment? Go to the calculator →"

---

## Navigation model

- Progress indicator at the top: "Section 2 of 4" with section titles visible and clickable (jump to any).
- Back / Next at the bottom of each section.
- "Skip to calculator" always visible in the nav.
- No forced linear lock — every section is skippable.

## Narrative design decisions

### The hook/content tension is intentional

The guide opens with a post-experiment scenario ("I ran a test, B got more signups, ship it?") but teaches pre-experiment planning concepts and ends with a pre-experiment calculator. This is a deliberate choice, not an inconsistency.

The hook works because most beginners have already run a sloppy experiment and want to know if the result is trustworthy. That creates immediate recognition and motivation. The implicit message: *you may have done exactly this — this guide will show you why you can't trust that result yet, and how to run the next one properly.*

The framing to nail at the top of page 1 — one sentence in the intro callout — is something like:

> "If you've already run an experiment, this will explain what you can and can't conclude from it. If you're planning one, it'll show you how to set it up so the results actually mean something."

That one sentence resolves the tension without backpedaling.

### The calculator is pre-experiment (by design)

The guide teaches exactly the three inputs the calculator needs — baseline (section 2), confidence level (section 3), minimum detectable lift (section 4) — and the calculator closes the loop: plug those numbers in, get your required sample size, go run the experiment. That's the right payoff for this ICP (beginners).

A post-experiment significance tester would be more immediately useful to someone who already ran something, but it's also more dangerous for beginners: someone plugging numbers into a p-value calculator without understanding what they're doing is how bad A/B testing culture spreads.

The calculator lives at `/calculator` as a separate route. The section 4 footer must make the connection explicit — by the time the reader reaches it, they've seen all three inputs; the CTA should name them: *"You've now seen all three inputs. The calculator takes them and gives you the number."*

### Post-experiment sanity check — deferred to v2

A lightweight secondary entry point on the calculator: *"Already ran something?"* — user enters visitors and conversions, gets back whether their sample was large enough. No p-values, no significance testing. Just: *"your sample was about right / you'd have needed 3× more visitors."* Honest and actionable without being a full post-experiment tool.

---

## Open questions

- Single scrolling page vs. one route per section? (see architecture.md — defaulting to single page for MVP)
- Does the tutorial end with a "your numbers so far" summary card before the calculator CTA?
- Advanced deep-dives / stats sidecar per section: deferred post-MVP
- Exact copy and scenario numbers (e.g., "your current signup rate is 3%") — to be written when building each section
