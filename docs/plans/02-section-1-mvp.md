# 02 — Section 1 MVP (intro + case study, no widget)

Status: proposed — awaiting approval.

## Goal

Ship a static first version of Section 1. Lead with the hook (the reader's flawed instinct), introduce the running SaaS case study, and plant the problem — without the coin-flip widget and without the calculator. This page should already *make the point* through prose alone; the animation will be added later as reinforcement.

Framing note: the target reader won't ask "is 100 enough?" — they don't know that's the question yet. So the page doesn't open with that question. It opens with the mistake they're about to make.

## Scope

In scope:
- A new route for section 1 (per the routing decision in `architecture.md`).
- Page composition: H1 hook, intro, a standout case-study callout with concrete numbers, the "implement the better one, right?" trap, a short explanation of why that conclusion is premature.
- Uses the existing `SiteHeader`, `SiteFooter`, and `Container`.
- Page-level metadata (title, description) for SEO.

Explicitly out of scope (deferred):
- The coin-flip widget / any animation or interactivity.
- Calculator embed or links into the calculator's logic.
- Cross-section progress indicator ("Section 1 of 4") and Prev/Next nav — other sections don't exist yet.
- URL state / localStorage wiring.
- MDX — prose lives in plain TSX for this section.
- Real signup CTA — the case study describes a signup button; the page itself doesn't render a functional one.
- `tutorialSections` in `site-config.ts` — deferred until section 2 exists.

## Routing

- Section 1 URL: **`/why-you-cant-trust-your-experiment`** (working slug — leads with the hook, not the answer; matches the SEO intent of someone who just ran a small test and is about to ship).
  - Alternates if preferred: `/you-cant-trust-your-experiment`, `/your-experiment-is-lying`, `/dont-ship-that-variant-yet`. Final choice to confirm during build.
- `/` **redirects to `/why-you-cant-trust-your-experiment`** (section 1 IS the entry point). Implemented via Next.js `redirect()` in `app/page.tsx` (or `redirects` in `next.config.ts` — pick whichever the Next.js 16 docs recommend at build time; `redirect()` from `next/navigation` in a server page is the default choice).
- Header nav: the "Tutorial" link continues to point to `/` — the redirect handles the rest, so the nav stays stable as more sections arrive.

## Page structure (top to bottom)

1. **H1 — the trap, phrased as the reader's own thought.** Working copy (to be polished during implementation):
   > "I ran an experiment on 100 people. 10% more converted. That's it — ship the winner, right?"
   Shorter polish candidates: "I ran my experiment. 10% more converted. Ship it, right?" / "100 visitors. 15 signups vs. 10. Ship the winner, right?" Final wording chosen during build — the intent is: reader's inner monologue, confident, slightly premature.
2. **Intro paragraph (2–3 sentences).** Warm, not condescending. Almost everyone makes this call; it looks obvious; it isn't. Ends with a promise that the next few minutes will show why.
3. **Case-study callout.** Visually distinct block (border, tinted background, small "Running example" label). Contents:
   - "You run a SaaS. You want more signups."
   - You A/B tested your signup button copy. **Group A (original copy): 100 visitors, 10 signups → 10% conversion.** **Group B (new copy): 100 visitors, 15 signups → 15% conversion.** (Equal 100-per-group sizes so percentages and absolute counts line up; makes later sections' math trivial.)
   - One-line metric reminder: signup rate = signups ÷ visitors.
   - Short note that this same scenario carries through every section.
4. **The trap.** Short subsection that names the instinct the H1 just voiced: B beat A by 5 points. Done. Ship it. This paragraph makes the instinct legible so the next section can dismantle it.
5. **Why that conclusion is premature (3 short paragraphs or a tight list).**
   - At 100 visitors per group, the signal is tiny — one or two signups either way swings the rate by a whole percentage point.
   - Even two *identical* versions would routinely show a 10-vs-15 gap by pure chance.
   - You can't tell, from this small a sample, whether B is genuinely better or you got lucky. Shipping on this evidence is a coin flip in a trenchcoat.
   - One-liner close: the rest of this tutorial teaches you how to separate a real signal from lucky noise.
6. **Transition — plain sentence** at the bottom: something like "How many visitors *would* it take? That depends on a few things — unpacked in the next sections." No styled footer block, no Next button (no destination yet).

## Design direction

- Typography-first; no imagery.
- Callout uses a subtle border + tinted background that reads in both light and dark mode, using existing CSS variables. Example tokens: `border-foreground/15`, `bg-foreground/[0.03]`. Label "Running example" in small-caps/uppercase muted text.
- The H1 gets the strongest visual weight on the page — it's the hook.
- The case-study numbers (10/100 vs. 15/100) are typeset to be scannable; consider a small two-column or definition-list layout inside the callout rather than prose.
- Keep line length comfortable (existing `max-w-3xl` container is fine).
- No new colors or design tokens introduced — work within what's already in `globals.css`.

## Files to create / change

Create:
- `app/why-you-cant-trust-your-experiment/page.tsx` — the section 1 page (server component; exports `metadata`).
- `components/tutorial/case-study-callout.tsx` — the reusable callout block (will be referenced in later sections too; keeps the scenario and numbers consistent).

Modify:
- `app/page.tsx` — replace placeholder with a server-side redirect to `/why-you-cant-trust-your-experiment`.

Do not touch:
- `layout.tsx`, `SiteHeader`, `SiteFooter`, `Container`, `globals.css`, `lib/site-config.ts`.

## Next.js 16 notes

- Section page is a Server Component (no `'use client'` needed — pure prose + layout).
- Metadata exported per-route as `export const metadata: Metadata = { ... }`. Title template in the root layout will append the site name automatically.
- Redirect from `/`: check `node_modules/next/dist/docs/` for the idiomatic Next.js 16 pattern before writing it (either `redirect()` from `next/navigation` in the server component, or `redirects` in `next.config.ts`). Prefer whichever is recommended for static-friendly builds.
- Links use `next/link`.
- No dynamic routes, so no async `params` to handle.
- Before writing code: re-read relevant entries in `node_modules/next/dist/docs/` (routing, metadata, redirects) — APIs have drifted from training data.

## Verification

1. `npm run dev` — dev server starts clean.
2. `/why-you-cant-trust-your-experiment` renders: H1, intro, callout with 10/100 vs. 15/100 numbers, trap, explanation, transition.
3. Hitting `/` redirects to `/why-you-cant-trust-your-experiment` (check Network tab: single redirect, not a client-side bounce if we can help it).
4. Header "Tutorial" link leads there via the redirect; no visible double-navigation.
5. Page is readable in both light and dark OS settings.
6. `npm run lint` passes.
7. `npm run build` statically generates the new route (shown in build output).
8. Lighthouse spot-check on the new route: Performance, SEO, Accessibility all green.
9. Manual browser check at mobile width — callout numbers and type scale still comfortable.

## Answered / resolved

- **Slug:** lead with the hook (final choice among `/why-you-cant-trust-your-experiment` and close variants — decide at build time).
- **`/` behavior:** redirect to section 1.
- **Signup button:** scenario only — no functional CTA on the page.
- **Hook numbers:** concrete. 100 visitors per group; A = 10/100 (10%), B = 15/100 (15%). Equal groups keep the math clean and let later sections use either percentages or absolute counts interchangeably.
- **Transition:** plain sentence, no styled block.
- **`tutorialSections` in `site-config.ts`:** deferred.

## Open questions

1. **Callout label.** Defaulting to "Running example" (matches the phrasing in `chapters.md`). OK, or prefer "Case study" / "The scenario" / no label?
2. **Final slug wording.** Happy to commit to `/why-you-cant-trust-your-experiment`, or want to pick from the shorter alternatives listed in Routing?
