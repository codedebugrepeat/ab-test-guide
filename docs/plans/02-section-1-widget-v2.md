# 02 — Section 1 Widget v2: Bulk Draw + Reset

Status: proposed — awaiting approval.

## Goal

Make the widget more engaging and give users a way to start fresh. Three additions
on top of the v1 widget:

1. **Reset button** — lets the user clear history and start over.
2. **Draw 10 samples button** — draws 10 samples of 10 marbles each in one click,
   so more is happening and the pattern becomes obvious faster.
3. **Draw 100 samples button** — draws 100 samples at once for users who want to
   see the full distribution take shape.

No structural changes to the page layout or surrounding prose. These are additive
changes to `marble-sampling-widget.tsx` (and `marble-row.tsx` where needed).

## Changes

### 1. Reset button

**Appearance:** outline/ghost style button — no filled background, just a border.
Positioned to the right of (or below) the primary "Draw a sample" button. Visually
recedes next to the primary CTA; the user should reach for "Draw a sample" first.

**Label:** a circular-arrow icon (↺) followed by the text "Start over".

**Behaviour:**
- Clears all sample rows from the history stack instantly (no animation needed).
- Resets the sample counter to 0 so the next draw is labelled "Sample 1" again.
- Returns the widget to its empty/placeholder state (same dashed-outline prompt
  as before the first draw).
- Disabled while a draw animation is in progress (same lock that disables the
  primary button).
- Not shown before the first draw — render it only once at least one sample exists.
  This avoids a confusing "Start over" affordance on a blank widget.

**Icon:** use a Unicode circular arrow (↺, U+21BA) or an SVG icon already present
in the project. Check `components/` and any icon library in `package.json` before
adding a new dependency. If none exists, inline a minimal SVG (`<svg>` ~4 lines).

**Accessibility:** `aria-label="Clear all samples and start over"`.

---

### 2. Draw 10 samples button

**Appearance:** secondary filled button — more prominent than the reset outline
button but visually subordinate to the primary "Draw a sample" button. Positioned
adjacent to (or below) the primary button.

**Label:** "Draw 10 samples"

**Behaviour:**
- Generates 10 independent samples (each: 10 marbles, Binomial(n=10, p=0.2)) and
  prepends all 10 rows to the history stack in a single state update.
- Animation: the 10 rows drop in sequentially — each row starts its drop after the
  previous row has fully settled (~800 ms apart). This keeps the visual momentum
  going without everything hitting at once. Total duration: ~9 s if fully animated.
  With `prefers-reduced-motion`, all 10 rows appear instantly.
- The button is disabled for the full duration of the sequential animation. The
  primary "Draw a sample" button is also disabled during this window.
- Row-cap (12) still applies: if adding 10 rows would exceed the cap, the oldest
  rows are trimmed/faded in the same way as the single-draw path.
- `aria-live` region announces each row as it settles: "Sample 7: 3 out of 10
  converted." (one announcement per row, as they arrive).
- Label: stays "Draw 10 samples" regardless of how many samples have been drawn
  (no dynamic label change needed here).

---

### 3. Draw 100 samples button

**Appearance:** ghost/text style — same pattern as "Draw 10 samples" but lower
prominence, since drawing 100 at once is a power-user action that shouldn't
compete with the two buttons above.

**Label:** "Draw 100 samples"

**Behaviour:** same as "Draw 10 samples" scaled up to 100 rows, with one
difference in animation: 100 sequential animated rows would take ~80 s, so
instead all 100 are snapped in at once:
- A brief loading indicator (e.g. a spinner or pulsing opacity) flashes for
  ~400 ms on the widget container while the samples are computed.
- Then the stack snaps to the capped view (12 most recent rows, oldest trimmed)
  with no per-row animation. The row-cap is still 12; 88 rows are silently
  discarded after being included in any aggregate display (if added later).
- This "snap" approach means `prefers-reduced-motion` users get identical
  behaviour — no special case needed.
- The sample counter continues from wherever it was (i.e. if the user had already
  drawn 5 samples, the 100 new ones are labelled 6–105).
- All three buttons are disabled during the ~400 ms flash.
- `aria-live` region announces once after the snap: "100 samples drawn. Showing
  most recent 12."
- `aria-label="Draw 100 samples at once"`.

---

## Button layout

All three action buttons sit in a single row (flex, gap) beneath the pill label
and above the sample stack. Left-to-right order:

```
[Draw a sample]  [Draw 10 samples]  [Draw 100 samples]  [↺ Start over]
  primary          secondary             ghost/text        outline
```

On narrow viewports (< 480 px) wrap to two rows: primary + secondary on row 1,
ghost + outline on row 2.

"Draw a sample", "Draw 10 samples", and "Draw 100 samples" are the draw actions
grouped left; "Start over" is last and visually separate. The visual weight
ordering (primary → secondary → ghost → outline) should be immediately legible.

---

## Files to change

- `components/tutorial/marble-sampling-widget.tsx` — add bulk-draw logic, reset
  logic, button layout, and the 100-sample snap + loading flash.
- `components/tutorial/marble-row.tsx` — no structural change expected; confirm
  `isNew` prop still works correctly when multiple rows are added in one update.

**Do not touch:** page.tsx (no prose changes), `globals.css`, maths module,
any component not listed above.

---

## Out of scope for this plan

- Aggregate statistics display (mean line across all 100 samples, histogram) —
  deferred.
- Adjustable `n` or `p`.
- Persisting sample history across page reloads.

---

## Verification

1. **Reset button** is not visible before the first draw; appears after at least
   one sample exists.
2. Reset clears all rows and resets counter; next draw is labelled "Sample 1".
3. Reset is disabled during animation.
4. "Draw 10 samples" produces 10 sequential animated rows (or instant snap with
   `prefers-reduced-motion`).
5. Buttons are disabled for the full animation window on a bulk draw.
6. "Draw 100 samples" snaps to 12 rows with a brief flash; `aria-live` announces
   the 100-sample result once.
7. Button order and visual hierarchy are correct at 1280 px and 375 px widths.
8. `npm run lint` and `npm run build` pass.
