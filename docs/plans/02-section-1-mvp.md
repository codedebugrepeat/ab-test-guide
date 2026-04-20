# 02 — Section 1 MVP (intro + case study, no widget)

Status: proposed — awaiting approval.

## Goal

Ship a static first version of Section 1: "I tested it on 100 people. That's enough, right?" Introduce the running SaaS case study, set up the hook, and plant the problem — without the coin-flip widget and without the calculator. This page should already *make the point* through prose alone; the animation will be added later as reinforcement.

## Scope

In scope:
- A new route for section 1 (per the routing decision in `architecture.md`).
- Page composition: intro, a standout case-study callout, the "conversion went up 10% — I'm done, right?" hook, a short answer explaining why that conclusion is premature.
- Uses the existing `SiteHeader`, `SiteFooter`, and `Container`.
- Page-level metadata (title, description) for SEO.

Explicitly out of scope (deferred):
- The coin-flip widget / any animation or interactivity.
- Calculator embed or links into the calculator's logic.
- Cross-section progress indicator ("Section 1 of 4") and Prev/Next nav — other sections don't exist yet.
- URL state / localStorage wiring.
- MDX — prose lives in plain TSX for this section.
- Real signup CTA — the case study describes a signup button; the page itself doesn't render a functional one.

## Routing

Per the updated `architecture.md`, each section is its own route. Proposal:

- Section 1 URL: **`/is-100-enough`** (mirrors the section's headline question, matches the plain-language tone).
- `/` (home) becomes a minimal tutorial landing page that links to `/is-100-enough`. Lightweight placeholder for now — full landing copy is a later concern.
- Update the header nav: "Tutorial" link continues to point to `/`.

Alternative slugs to consider: `/small-samples`, `/noise-vs-signal`, `/sample-size-intro`. See open question below.

## Page structure (top to bottom)

1. **H1 — the question.** "I tested it on 100 people. That's enough, right?" — set in a large, confident type scale. This is the hook phrased as a question the reader is already asking.
2. **Intro paragraph (2–3 sentences).** Warm, not condescending. Sets up: almost everyone makes this call; it looks obvious; it isn't. Ends with a promise that the next few minutes will show why.
3. **Case-study callout.** Visually distinct block (border, tinted background, subtle label like "Running example"). Contents:
   - One line: "You run a SaaS. You want more signups."
   - Control (A) vs. Variant (B): original button copy vs. new copy.
   - The metric: signup rate = signups ÷ visitors.
   - Short note that this same scenario carries through every section.
4. **The premature-victory hook.** A short subsection framed as the reader's inner monologue: "I showed it to 100 visitors. The new copy got 10% more signups. I'm done — B is better, right?"
5. **Why that's not true (3 short paragraphs or a tight list).**
   - At 100 people, the signal is tiny; a handful of signups either way swings the percentage.
   - Even two *identical* versions would have shown a gap this big just by chance.
   - You can't tell, from one small sample, whether you saw a real improvement or lucky noise.
   - One-liner close: this tutorial teaches you how to tell the difference.
6. **Transition sentence** at the bottom, hinting at what comes next ("How many people *is* enough? That depends — and the next sections unpack it."). No Next button yet since sections 2–4 don't exist; the line plants the direction.

## Design direction

- Typography-first; no imagery.
- Callout uses a subtle border + tinted background that reads in both light and dark mode (using the existing CSS variables in `globals.css`, plus Tailwind's `dark:` or `@media (prefers-color-scheme: dark)` logic Tailwind 4 supports). Example tokens: `border-foreground/15`, `bg-foreground/[0.03]`.
- The "10% more signups — I'm done, right?" line gets visual weight (blockquote treatment or a muted label "The trap") so the reader clocks it as the wrong instinct before reading the counter.
- Keep line length comfortable (existing `max-w-3xl` container is fine).
- No new colors or design tokens introduced — work within what's already in `globals.css`.

## Files to create / change

Create:
- `app/is-100-enough/page.tsx` — the section 1 page (server component; exports `metadata`).
- `components/tutorial/case-study-callout.tsx` — the reusable callout block (will be referenced in later sections too; keeps the scenario consistent).

Modify:
- `app/page.tsx` — replace the current "Tutorial placeholder" with a minimal landing that links to `/is-100-enough`. Keep it very light — this is not the real home page design.
- `lib/site-config.ts` — (optional) extend `navLinks` or add a `tutorialSections` list so the header / future nav can iterate over sections. Decision below in open questions.

No changes to `layout.tsx`, `SiteHeader`, `SiteFooter`, `Container`, or `globals.css`.

## Next.js 16 notes

- Section page is a Server Component (no `'use client'` needed — pure prose + layout).
- Metadata exported per-route as `export const metadata: Metadata = { ... }`. Title template in the root layout will append the site name automatically.
- Links use `next/link`.
- No dynamic routes, so no async `params` to handle.
- Before writing code: re-read `node_modules/next/dist/docs/` entries relevant to routing/metadata in this version, since APIs have changed from what's in training data.

## Verification

1. `npm run dev` — dev server starts clean.
2. `/is-100-enough` renders: H1, intro, callout, hook, explanation, transition.
3. `/` links to `/is-100-enough`; link prefetches and navigates without full reload.
4. Page is readable in both light and dark OS settings.
5. `npm run lint` passes.
6. `npm run build` statically generates `/is-100-enough` (shown in the build output).
7. Lighthouse spot-check on the new route: Performance, SEO, Accessibility all green (no blocker — widgets aren't here yet).
8. Manual browser check: resize to mobile width; callout and type scale still comfortable.

## Open questions

1. **URL slug for section 1.** Proposal: `/is-100-enough`. Alternatives: `/small-samples`, `/noise-vs-signal`, `/sample-size-intro`. Which do you prefer? (Slug is easy to change now, painful later once linked from other content.)
2. **What should `/` be?** Options:
   - (a) A tiny landing page with one sentence + a link to `/is-100-enough` (proposed).
   - (b) Redirect `/` → `/is-100-enough` so the first section IS the homepage.
   - (c) Leave `/` as the current placeholder for now.
3. **"Signup button" in your request — did you mean an actual button on the page, or the case-study scenario (which is *about* a signup button)?** I assumed the latter — no functional CTA on this page. Confirm.
4. **Callout label.** I proposed a small label like "Running example" on the case-study block. OK, or do you want something else ("Case study", "The scenario", no label)?
5. **Exact numbers in the hook.** You said "conversion increased by 10%". Should I literally use "10% more signups" or pick a concrete signup-rate pair (e.g., "3.0% → 3.3%") to make it more tangible? The latter is more vivid but commits to numbers we may want to reuse later.
6. **Transition line at the bottom.** Keep it as a plain sentence, or style it as a "Coming up" footer block? Leaning plain sentence for MVP (no other sections exist to link to yet).
7. **Do you want a `tutorialSections` array added to `site-config.ts` now** (so the header can later show section links / progress), or defer until section 2 exists?
