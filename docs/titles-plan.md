# Title & Heading Consistency Plan

## Problem

Right now the user hits five different names for the same thing on page 1:

| Surface | Current text |
| --- | --- |
| Browser tab (page 1) | `A/B Testing — From Zero to Confident · A/B Test Guide` |
| Site name (header/footer) | `A/B Test Guide` |
| Sidebar chapter 1 | `Why you can't trust small samples` |
| Sidebar chapter 1 (short) | `Small samples` |
| Page 1 `h1` | `A/B Testing from first principles` |
| Page 1 first `h2` | `Why you can't trust your experiment with a small sample size` |
| Page 1 second `h2` | `I ran the experiment and sign-ups went from 10 to 15. Ship version B, right?` |
| Page 2 tab | `How Many Visitors Do You Need?` |
| Page 2 sidebar | `How many visitors do you need?` |
| Page 2 `h1` | `How many visitors do you need?` |

Issues:

1. **Page 1 h1 doesn't match the sidebar.** The sidebar calls chapter 1 "Why you can't trust small samples" but the h1 is the unrelated "A/B Testing from first principles," so the user can't orient.
2. **No clear signal that page 1 is both the guide's entrance AND chapter 1.** The guide-level framing ("A/B Testing from first principles") swallows the chapter-level heading, and the chapter topic is only picked up again a full section later as an h2.
3. **Four different names for the overall guide** (`A/B Test Guide`, `A/B Testing — From Zero to Confident`, `A/B Testing from first principles`, and the description tagline).
4. **Redundant h2s.** Page 1 has `Why you can't trust your experiment with a small sample size` as an h2 that nearly duplicates the chapter title, followed immediately by the rhetorical `I ran the experiment and sign-ups went from 10 to 15...` — two competing chapter openers.
5. **Case inconsistency** between browser tabs (Title Case) and on-page headings (sentence case).

## Principles

- **One name for the guide**, used in the header, the `<title>` template, and the footer.
- **One name per chapter**, used identically in the sidebar, the browser tab, and the page h1. No paraphrasing between surfaces.
- **Sentence case everywhere** — headings and browser tabs. Matches the current on-page tone.
- **Page 1 needs a visible two-layer header**: a small guide-level eyebrow/intro that frames the whole tutorial, then the chapter h1 that matches the sidebar. This is the standard docs-site pattern (MDN, Stripe docs, Tailwind docs) for "page one of a multi-page tutorial that starts teaching immediately."
- **The h1 always matches the sidebar chapter title exactly.** No near-misses.
- **h2s mark real subsections**, not rephrased chapter titles.

## Proposed names

### Guide-level
- Site name (unchanged): `A/B Test Guide`
- Tagline (for homepage intro block + meta description): `A hands-on guide to A/B testing with interactive visualizations.`
- Browser `<title>` template (unchanged): `{page} · A/B Test Guide`

### Chapter 1 (`/why-you-cant-trust-your-experiment`)
- Sidebar long: `Why small samples lie`
- Sidebar short: `Small samples`
- Page h1: `Why small samples lie`
- Browser tab: `Why small samples lie · A/B Test Guide`

Rationale: punchier than "Why you can't trust small samples," keeps the same idea, and avoids the noun pile-up ("trust your experiment with a small sample size") that forced the current h2 rephrase. "Lie" is a light editorial voice that matches the existing tone ("coin flip in a trenchcoat").

### Chapter 2 (`/how-many-visitors-do-you-need`)
- Sidebar long: `How many visitors do you need?`
- Sidebar short: `Sample size`
- Page h1: `How many visitors do you need?`
- Browser tab: `How many visitors do you need? · A/B Test Guide`

Unchanged — already consistent, just align the browser tab casing.

## Page 1 structure (the main fix)

The challenge: page 1 is both the landing page for the guide and the first chapter. The user should see "this is the A/B testing guide" and "this chapter is about small samples" without either swallowing the other.

Proposed DOM order:

```
<eyebrow>  A/B Test Guide · Chapter 1 of 2
<h1>       Why small samples lie
<lede>     You ran an A/B test, the new version looked better, and you weren't sure
           whether to trust it. This guide explains why — and how to know for certain.
           Every concept has an interactive visualization. No stats background required.
<hr>
<h2>       Ship version B, right?                     (was the "10 to 15" h2, tightened)
...body...
<h2>       What you're really looking at: sampling error
...body, marble widget...
<h2>       The instinct vs. the reality              (merges the two short h2s at the end)
...body...
<SectionFooter />
```

Key moves:

- **Eyebrow line** (`A/B Test Guide · Chapter 1 of 2`) does the guide-framing job in one line, so the h1 is free to be the chapter title.
- **H1 matches the sidebar exactly** (`Why small samples lie`).
- **Lede paragraph** merges the current two intro blocks (the boxed "Interactive guide" callout and the "You ran an A/B test..." paragraph) into one. Removes the visual weight of a dedicated card at the very top, which currently competes with the h1.
- **The duplicated chapter h2** (`Why you can't trust your experiment with a small sample size`) is deleted — it just restated the h1.
- **Rhetorical h2** (`I ran the experiment and sign-ups went from 10 to 15. Ship version B, right?`) is shortened to `Ship version B, right?` — the setup is in the lede and doesn't need repeating in a heading.
- **End of page h2s** (`The instinct: B beat A, so ship B` + `Why that conclusion is premature`) collapse into one h2; they're two halves of the same beat and both are already short.

## Page 2 structure

Page 2 is mostly fine. Two small adjustments for parity with the new page 1 pattern:

- Add an eyebrow line: `A/B Test Guide · Chapter 2 of 2`.
- Keep the h1 as-is.
- The current h2 `Back to our experiment` is a transition, not a subsection — downgrade to body prose or an `h3` so the h2 hierarchy stays about concepts (`What's a baseline?`, `Two products, two completely different problems`, `The signal-to-noise problem`).

## Centralize titles in one file

All of the strings above — guide name, tagline, chapter long/short titles, eyebrow format — should live in one module so there's a single place to edit them. Proposal:

- Extend `components/tutorial/chapters.ts` (or rename to `lib/tutorial-pages.ts` for clearer scope) to be the single source of truth for chapter metadata:
  ```ts
  export const chapters = [
    {
      href: "/why-you-cant-trust-your-experiment",
      number: 1,
      title: "Why small samples lie",       // sidebar long + page h1
      shortTitle: "Small samples",           // sidebar compact / horizontal nav
      browserTitle: "Why small samples lie", // <title> before the " · A/B Test Guide" suffix
      description: "...",                    // meta description
    },
    ...
  ];
  export const totalChapters = chapters.length;
  ```
- Guide-level constants (`name`, `tagline`, eyebrow template like `` `${siteConfig.name} · Chapter ${n} of ${total}` ``) stay in `lib/site-config.ts`, which is already the central config. No new file needed at the guide level.
- Each page imports its chapter entry by `number` (or by a named export) and uses those values for `metadata.title`, the eyebrow, and the h1 — no title strings hardcoded in the page components.

This way, renaming a chapter is a one-line change and the sidebar, browser tab, and h1 can't drift apart again.

## Files to change

- `components/tutorial/chapters.ts` — expand entries with `browserTitle` and `description`; update chapter 1 `title` to `Why small samples lie`. This becomes the single source of truth for per-chapter strings.
- `app/why-you-cant-trust-your-experiment/page.tsx` — import chapter entry, drive `metadata`, eyebrow, and h1 from constants; merge intro block + lede, remove duplicate h2, rename/merge remaining h2s.
- `app/how-many-visitors-do-you-need/page.tsx` — same refactor; add eyebrow; demote `Back to our experiment` from h2.
- `lib/site-config.ts` — no change needed; `name` and `description` already serve as the guide-level constants.
- `app/layout.tsx` — no change needed; the template already produces `{page} · A/B Test Guide`.

## Out of scope (for this pass)

- The calculator page (`/calculator`) and 404 (`not-found.tsx`) — not part of the tutorial arc.
- Redesigning the eyebrow component visually — the plan assumes a small muted `<p>` above the h1, reusing existing type styles.
- Renumbering or adding chapters beyond the current two.
