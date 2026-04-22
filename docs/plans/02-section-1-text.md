# 02 — Section 1 Text & Visual Polish

Status: proposed — awaiting approval.

## Goal

Improve the copy and visual hierarchy of the section 1 page (`/why-you-cant-trust-your-experiment`) to help readers grasp the core concept faster. The page structure stays the same; this plan adds pull quotes, a visual case-study illustration, a "what we learned" footer strip, and reworks the header section around the running example.

---

## Change 1 — Rework the intro header and hook

### Problem

The current H2 `100 visitors. 15 signups vs. 10. Ship the winner, right?` requires readers to mentally parse numbers before they understand the scenario. The case study callout comes *after* the hook, so the hook assumes context the reader doesn't have yet.

### Solution

**Move the case study callout above the hook.** The callout is already visually distinct — brand it clearly as a "Case study" (not just "Running example") so readers understand this is the concrete example the whole guide will use.

Then rewrite the hook as a simple human reaction to the result:

> "I ran the experiment and sign-ups went from 10 to 15. Ship version B, right?"

Follow immediately with a short acknowledgement that this is an intuitive, common mistake — not a stupid one:

> "This is a common call to make, and an intuitive one. But it's a pitfall — and the next few minutes will show you exactly why."

Remove the phrasing "almost everyone makes this mistake" (too presumptuous). The framing is: *this is easy to get wrong, here's why*.

### Affected files

- `app/why-you-cant-trust-your-experiment/page.tsx` — reorder H2, hook paragraph, and `<CaseStudyCallout>`.
- `components/tutorial/case-study-callout.tsx` — change label from "Running example" to "Case study".

---

## Change 2 — Illustration inside the case study callout

### Problem

The callout currently shows two data boxes (10/100 vs 15/100) but gives no visual sense of *what* A and B actually are — it's abstract numbers.

### Solution

Add a small illustration inside the callout, above the number boxes. It shows two side-by-side mockups:

- **Left (A):** a simple CTA button with original copy (e.g. "Start your free trial") + a small grey count badge ("10 signups")
- **Right (B):** the same button with new copy (e.g. "Get started for free") + a small green count badge ("15 signups")

Below the two mockups, the existing 10/100 vs 15/100 data boxes remain unchanged.

A one-liner between the illustration and the data boxes sets up the numbers:
> "We ran 100 visitors through each. Here's what we got:"

The illustration doesn't need to be pixel-perfect — a clean, borderless component with two card-like blocks conveying the shape of a CTA is enough.

### New component

`components/tutorial/experiment-illustration.tsx`

- Two side-by-side cards, each showing:
  - Label: "Version A" / "Version B" in small-caps muted text
  - A simulated button (styled `div`, not a real `<button>`) with placeholder copy
  - A signup count line below the button: "10 signups" / "15 signups"
- No interactivity; server-safe; no `'use client'`.
- Uses existing Tailwind tokens only — no new colors or CSS variables.
- Responsive: stacks to column on very small screens, side-by-side from `sm:` upward.

### Affected files

- `components/tutorial/experiment-illustration.tsx` — new component.
- `components/tutorial/case-study-callout.tsx` — import and render `<ExperimentIllustration>` above the data boxes; add the "We ran 100 visitors…" bridge line.

---

## Change 3 — Pull quotes for key insights

### Problem

Important conceptual sentences are buried in prose and carry the same visual weight as surrounding text.

### Solution

Use Tailwind's built-in blockquote/border utilities to create inline pull quotes — no new component needed. Style: left border accent (`border-l-4 border-foreground/30`), slight indent (`pl-5`), muted italic text (`italic text-foreground/70`).

Add **1–2 pull quotes**, used sparingly. Candidates (final wording refined during implementation):

1. After the sampling-error explanation paragraph:
   > "The jar's truth didn't move. Your draws did."

2. In the "why that conclusion is premature" section:
   > "At 100 visitors per group, even two *identical* versions would routinely show a gap like this by pure chance."

If both feel right, keep both. If either disrupts flow when read in context, drop it. Sparingly means max two per page.

### Implementation

A small `Quote` wrapper component centralises the Tailwind classes so they are never duplicated across pages. Usage at the call site is just:

```tsx
<Quote>The jar's truth didn't move. Your draws did.</Quote>
```

### New component

`components/tutorial/quote.tsx`

- Renders a `<blockquote>` with the shared classes (`my-6 border-l-4 border-foreground/30 pl-5 italic text-foreground/70`).
- Accepts `children: React.ReactNode`.
- No `'use client'` — purely presentational, server-safe.
- No props beyond `children`; if styling variants are needed later, add them then.

### Affected files

- `components/tutorial/quote.tsx` — new component.
- `app/why-you-cant-trust-your-experiment/page.tsx` — import `<Quote>` and use it at the two spots above.

---

## Change 4 — "What we learned" footer strip

### Problem

The page currently ends with a plain muted sentence ("How many visitors *would* it take?…"). There's no visual landing point that reinforces what the reader just learned or motivates the next section.

### Solution

A full-width-within-container strip at the bottom of the page. Visual treatment:

- Rounded border (`rounded-xl border border-foreground/15`)
- Slightly tinted background (`bg-foreground/[0.04]`)
- Padding: `px-8 py-7`

Contents (top to bottom):

1. **Label** — small-caps muted: "What we learned"
2. **Summary bullets** — 2–3 tight sentences as a list:
   - Small samples produce noisy results — a 10 vs. 15 gap is common by chance alone.
   - You can't tell signal from noise without knowing how much data you actually need.
   - That's what the rest of this guide teaches.
3. **Teaser line** — plain text: "Next: where does the number of visitors you need actually come from?"
4. **Button** — "Next: Sample size →", styled as a primary button. `onClick` is a no-op for now (`onClick={() => {}}`); the route will be wired in a later plan. Since this needs an event handler, the strip component must be `'use client'`.

### New component

`components/tutorial/section-footer.tsx`

- Props: `summary: string[]` (bullet items), `teaserText: string`, `nextLabel: string`.
- `'use client'` (button needs onClick).
- Uses only existing Tailwind tokens.

### Affected files

- `components/tutorial/section-footer.tsx` — new component.
- `app/why-you-cant-trust-your-experiment/page.tsx` — replace the trailing muted `<p>` with `<SectionFooter>`.

---

## Implementation phases

Each phase is a self-contained, reviewable, committable unit. Later phases depend on earlier ones but do not need to be started until the previous phase is approved.

---

### Phase 1 — Copy & reorder (no new components)

Touch only `page.tsx` and `case-study-callout.tsx`. No new files.

- Rename the callout label from "Running example" → "Case study" in `case-study-callout.tsx`.
- In `page.tsx`: move `<CaseStudyCallout>` above the H2, rewrite the H2 and following paragraph with the new hook copy.

**Commit scope:** copy and structure only — fast to review, easy to revert if the new order doesn't read well.

---

### Phase 2 — `<Quote>` component + pull quotes

- Create `components/tutorial/quote.tsx`.
- Add the two `<Quote>` instances in `page.tsx` at the correct positions.

**Commit scope:** one new tiny component + two call sites. Isolated from the illustration and footer work.

---

### Phase 3 — Experiment illustration

- Create `components/tutorial/experiment-illustration.tsx`.
- Update `case-study-callout.tsx` to import `<ExperimentIllustration>` and add the bridge sentence.

**Commit scope:** the visual A/B mockup inside the callout. Can be reviewed in isolation — if the illustration needs iteration, it doesn't block phase 4.

---

### Phase 4 — Section footer strip

- Create `components/tutorial/section-footer.tsx`.
- Replace the trailing `<p>` in `page.tsx` with `<SectionFooter>`.

**Commit scope:** the "What we learned" strip and no-op next button. Last phase — page is complete after this.

---

## Page order after all changes

1. H1 (unchanged)
2. Intro paragraph (2–3 sentences, unchanged)
3. **Case study callout** ← moved up; now contains ExperimentIllustration + "We ran 100 visitors…" bridge + data boxes
4. H2 hook — rewritten to simple human reaction ("I ran the experiment…")
5. Hook paragraph — rewritten to acknowledge it's a common, intuitive mistake
6. Marble jar intro paragraph (unchanged)
7. `<MarbleSamplingWidget>` (unchanged)
8. Sampling error explanation → **pull quote 1**
9. Scale-up paragraph → **pull quote 2**
10. H2 "The instinct: B beat A, so ship B" (unchanged)
11. Instinct paragraph (unchanged)
12. H2 "Why that conclusion is premature" (unchanged)
13. Three explanation paragraphs (unchanged)
14. **`<SectionFooter>`** ← replaces trailing muted sentence

---

## Files to create / change

Create:
- `components/tutorial/experiment-illustration.tsx`
- `components/tutorial/quote.tsx`
- `components/tutorial/section-footer.tsx`

Modify:
- `app/why-you-cant-trust-your-experiment/page.tsx` — reorder, rewrite hook copy, add blockquotes, add SectionFooter
- `components/tutorial/case-study-callout.tsx` — rename label, add ExperimentIllustration, add bridge sentence

Do not touch:
- `components/tutorial/marble-sampling-widget.tsx`
- `components/tutorial/marble-row.tsx`
- `components/tutorial/jar-illustration.tsx`
- `layout.tsx`, `SiteHeader`, `SiteFooter`, `Container`, `globals.css`

---

## Verification

1. `npm run dev` — page renders without errors.
2. Case study callout appears before the hook H2; label reads "Case study".
3. Illustration shows two side-by-side CTA cards with Version A / Version B labels and signup counts.
4. Bridge line "We ran 100 visitors through each. Here's what we got:" appears between illustration and data boxes.
5. Hook paragraph uses the new copy; no mention of "almost everyone makes this mistake".
6. Two pull quotes appear at the correct positions; visual weight is clearly different from surrounding prose.
7. Section footer strip renders at page bottom with bullets, teaser, and button.
8. Button click does nothing (no error, no navigation).
9. Page is readable in light and dark mode.
10. Responsive at mobile width — illustration stacks vertically, footer strip re-flows.
11. `npm run lint` passes.
