---
status: proposed
---

# Rebalance pages 2 and 3: move two-bells intro out of page 3

## Problem

Page 3 (`/how-sure-do-you-need-to-be`) is too dense. It currently introduces:

1. **A new visual concept** — switching from discrete sampling histogram to a smooth silhouette, plus the second bell for B (`TwoBellsWidget`).
2. **The 68/95 rule and standard deviation** as a ruler (`NormalVsExtremeWidget`).
3. **The decision threshold** — critical value, confidence level, significance level (`DecisionThresholdWidget`).

That's three widgets and three big conceptual jumps in one chapter. The first jump (continuous silhouette + B's bell) is really a *visual reframing* of what page 2 already established, not a new idea about confidence. It belongs at the end of page 2, where the reader's mental model of "noise has a shape" is fresh.

Page 2, meanwhile, ends a touch abruptly with a pure-text "What's still missing" teaser. That's an opportunity: end page 2 by *showing* the missing piece (B's bell) instead of just promising it.

## Goal

Redistribute so cognitive load stays moderate across both pages:

- **Page 2** ends by introducing the smooth-silhouette reframing and B's bell, capping the chapter with the two-bells visual.
- **Page 3** opens already inside the two-bells frame and focuses purely on the *decision* concepts: where samples land (68/95, std deviation) and where to draw the line.

## Changes to page 2 (`how-many-visitors-do-you-need/page.tsx`)

### What to move in

The current page-3 block from line ~40 ("Version B has its own bell") through the "Slide the baseline and watch the overlap move" section (~line 99). Specifically:

- The `TwoBellsWidget` and its surrounding copy.
- The "we're drawing the bells as smooth silhouettes from here on" caption — but **promote** this from a small caption to a proper transition paragraph, since on page 2 it is now the bridge from discrete histogram → continuous bell.
- The "slide the baseline and watch the overlap move" explanation that ties the two-bells view back to the baseline lever (this reinforces page 2's main lesson, so it fits naturally here).

### Where to put it

Replace the current closing section "What's still missing" (lines 184–194). That section's job — teasing B's bell — is now done by actually showing it.

### New narrative shape for page 2

Keep the existing flow up through "The signal-to-noise problem" / "lower baseline = more data" quote unchanged. Then add a new closing arc:

1. **Bridge paragraph** — "We've been drawing the control's distribution as a histogram of discrete counts. From here on we'll draw it as a smooth silhouette: same distribution, just without the individual dots. The semantics don't change. Sample something and you get variance; values cluster around the mean and form a bell."
2. **Introduce B's bell** — "Run an A/B test and you have two groups. Each is its own sampling process, each has its own bell, each centered on its own mean. The control sits at the baseline rate; B sits at the baseline plus the lift."
3. **`TwoBellsWidget`** — at the case study's 10% baseline and 100 visitors per variant.
4. **Tie back to the baseline lever** — short version of the current page-3 "slide the baseline" copy: at 2% the bells almost overlap; at 20% they pull apart. Same relative lift, very different picture. This re-uses the chapter's main lever (baseline) on the new visual, which is what makes the move feel earned rather than tacked on.
5. **Updated `SectionFooter`** — replace the third bullet's wording so the summary reflects the now-visible second bell. New teaser should hand off the *decision* question, not the "B has a bell" question. Suggested: "Next: two bells, one decision. How far apart do they need to sit before you call a winner?"

### Things to keep an eye on

- The current page 2 already mentions "B has its own bell" in the closing paragraph — that paragraph gets replaced wholesale by the new arc, so no leftover duplication.
- The widget at 10% baseline / 100 visitors should match the running case-study numbers already used on page 2 (10 signups out of 100 → 10% baseline). Confirm `TwoBellsWidget`'s defaults align; if not, pass props.
- Page 2 already uses `BaselineDistributionWidget` with a baseline slider. The new `TwoBellsWidget` block should not feel redundant — frame it as "now with B's bell drawn alongside" rather than yet another baseline demo. The "slide the baseline" callback should be brief (1 short paragraph), not a re-teaching.

## Changes to page 3 (`how-sure-do-you-need-to-be/page.tsx`)

### What to remove

- The opening "Version B has its own bell" section and the `TwoBellsWidget`.
- The smooth-silhouette caption directly under the widget.
- The "Slide the baseline and watch the overlap move" section.

### New opening for page 3

The chapter's job is now narrower: given two bells, where do you draw the line? Suggested structure:

1. **New intro paragraph** — recap in one or two sentences what the reader saw at the end of page 2: two bells, the gap between their means, the overlap in the middle. Then pivot: "Looking at two bells doesn't yet tell you what to *do* with a single experiment's result. That's this chapter."
2. Keep "Middle is normal, tails are rare" + `NormalVsExtremeWidget` essentially as-is.
3. Keep "Where do you draw the line?" + `DecisionThresholdWidget` as-is.
4. Keep "Three names for the same line" and "What confidence actually costs" as-is.
5. `SectionFooter` — drop the first bullet (it's now page 2's payoff). Tighten the rest.

### Things to keep an eye on

- The current page-3 intro paragraph references "Chapter 2 left one bell on the chart… Version B was there too, but only as a dashed line." That framing is no longer accurate after the move — page 2 will end *with* B's bell drawn. Rewrite the intro accordingly.
- The "we're drawing bells as smooth silhouettes from here on" line must move with the widget, not stay on page 3.

## Files touched

- `app/how-many-visitors-do-you-need/page.tsx` — replace closing section, import `TwoBellsWidget`, update footer.
- `app/how-sure-do-you-need-to-be/page.tsx` — remove first widget block + baseline-overlap section, drop `TwoBellsWidget` import, rewrite intro, trim footer summary.
- No widget code changes expected. No changes to `components/tutorial/chapters.ts` (chapter titles still fit).

## Out of scope

- Renaming pages or chapter titles.
- Changing widget internals.
- Reworking page 4.

## Validation

- Reread both pages end-to-end after the move; the page-2 → page-3 handoff should feel like "you've seen two bells, now let's decide" rather than "let me re-introduce two bells."
- `npm run dev` and click through `/how-many-visitors-do-you-need` → `/how-sure-do-you-need-to-be` to confirm the visual transition works (the silhouette framing on page 2 should make page 3's continued use of silhouettes feel natural, not abrupt).
- Confirm no dangling references to the moved sections in other plan docs (`09-page3-plan.md`, `11-page3-widget1-two-bells.md`) — those are historical plans; leave them as-is but note in this plan that they predate the rebalance.
