# Side Project: A/B Test Calculator

Last updated: 2026-04-19

## Why this project
- Closes a known gap in my profile: no shipped A/B test artifact (currently framed as "hypothesis testing" + theoretical stats knowledge).
- Public GitHub + live deploy = visible code artifact for product-engineer-flavored applications without committing to a full PE pivot.
- Evergreen organic-search demand around A/B testing = real users without marketing spend.
- Demonstrates modern React stack proficiency (Next.js 15, RSC, MDX, lazy-hydrated interactive components) in a focused, polished way.

## Audience
**This site is for absolute beginners.** PMs, engineers, and founders who have never run an A/B test, never opened a stats textbook, or did once and forgot all of it. The default experience assumes zero prior knowledge of statistics, experimentation, or even the word "variant."

Power users (analysts, experienced growth PMs) are a *secondary* audience. They are welcome and well-served by a quiet "skip to calculator" link, but the home page, URL structure, visual hierarchy, copy, and interactivity are all optimized for a first-timer.

If a single design choice has to be made between "delights an experienced user" and "doesn't lose a beginner in the first 10 seconds," the beginner wins.

### One-line pitch
**An interactive guide to A/B testing that assumes you know nothing — and at the end, you can run a real test and trust the result.**

## What "interactive tutorial" actually means here
The whole site is the tutorial. It is not a calculator with a tutorial bolted on; it is a teaching experience with a calculator embedded inside.

The experience is structured as a sequence of short chapters. Each chapter:
- Has one clear concept (one idea per chapter, no exceptions).
- Opens with a relatable scenario (CTA color test, signup flow change, pricing page).
- Contains at least one interactive visualization (chart, slider, simulation, animation).
- Ends with a "got it?" check that lets the user advance.
- Carries the user's running state forward (a baseline rate the user entered in chapter 5 is still there in chapter 9).

By the end of the chapter sequence, the user has effectively used the sample size planner and the significance calculator without ever clicking a "calculator" button. The standalone calculator pages exist mainly for return visits and direct deep links.

## Plain-language style guide
Every piece of copy on the site follows these rules:
- Short sentences. Most under 15 words.
- Active voice. No "it is recommended that..."
- Concrete scenarios, never "the experiment." Always "your CTA color test" or "your pricing change."
- No Latin. No "i.e.," "e.g.," "vis-à-vis."
- Numbers as digits. "12 visitors" not "twelve visitors."
- Define every stats term on first use, in parentheses, in the user's words. Then use the user's word, not the stats term.
  - Example: "You need a baseline (in plain English: how often the thing you're testing happens today, before any change)."
- Stats vocabulary is offered as a *sidecar*, not the main road:
  - Pattern: at the end of each chapter, a collapsible "What stats people call this" panel shows the formal terms (MDE, alpha, beta, power, p-value, type I error, etc.). Curious users can learn the vocab; everyone else never sees it.
- No emoji unless the user explicitly asks (also a repo convention).
- Code-style fonts only for actual values the user typed in.

## Chapter sequence (v1)
The site walks the user through the entire process of designing, running, and interpreting an A/B test. Each chapter is its own URL for SEO and direct linking. Each chapter has a back/next pair and a progress indicator.

### Part I: Why testing matters
1. **What is an A/B test?** Plain-language definition. Scenario: you have a button, you want to know if changing the color gets more clicks. Interactive: a side-by-side animated mockup of two pages with synthetic visitors flowing in.
2. **Why eyeballing doesn't work.** The core "you cannot look at 100 users and decide" insight. Interactive: a coin-flip race. Two coins (both fair, 50/50). Press a button, flip 100 times each, see the gap. Press again, gap is different. Run 1000 times, watch how often a 4-point gap shows up by pure chance. Big "aha" moment.
3. **The cost of being wrong.** What happens if you ship a change that didn't actually help (or actively hurt). Interactive: a simulation showing how a "winning" small-sample test that was really noise plays out over 6 months at scale.

### Part II: Designing your test
4. **What are you measuring?** Picking a single metric. Why "vibes" don't count. Interactive: pick from a list of common metrics (signup rate, purchase rate, CTR), with a one-line "good for X" summary.
5. **What's your starting point?** How to estimate your current conversion rate (the "baseline"). Interactive: a slider for "how many visitors do you get per week" and "how many convert" — outputs the baseline rate with a visual.
6. **How big a change do you actually care about?** Introduce minimum detectable effect in plain language. Interactive: a slider for "smallest improvement worth shipping" with a live "what this means in money/time" calculator on the side.
7. **How long are you willing to wait?** The traffic vs. patience tradeoff. Interactive: a chart that plots "weeks to result" vs. "smallest detectable lift" given the baseline and traffic.
8. **How sure do you want to be?** Significance and power, in plain English. Interactive: two sliders, two animated false-positive / false-negative bar charts that update live.
9. **Your test plan.** Pulls everything together. Interactive: shows a "test plan card" with the user's numbers, weeks needed, sample size needed, and a copy-to-clipboard plain-English summary.

### Part III: Running your test
10. **The one rule: don't peek.** Why early stopping breaks everything. Interactive: a "peeking simulator." Run the same test 1000 times. Show the false-positive rate when you check once at the end (about 5%) versus when you check every day and stop at the first significant reading (often 25%+). User can drag a "checking frequency" slider and watch the false-positive rate climb.
11. **Random assignment, fixed for the duration.** Why the same user must always see the same variant. Interactive: a small simulation showing what happens when assignment leaks (users bouncing between A and B).
12. **What can go wrong while it's running.** Novelty effects, seasonal effects, outages. Brief, with one chart per concept.

### Part IV: Reading the results
13. **Did your variant actually win?** Interactive: enter your numbers (or use the demo data carried from earlier chapters), see a confidence-interval chart with two horizontal bars (control and variant) that overlap or don't.
14. **What "95% confident" actually means.** Plain-language explanation, with a frequency visualization (100 little squares, ~5 colored to show what "5% wrong" looks like).
15. **Effect size vs. significance.** A "significant" 0.1% lift is probably not worth shipping. Interactive: a chart with two axes — significance (yes/no) on one, business impact ($) on the other — to teach the four quadrants.
16. **What if the result is "inconclusive"?** Plain-language guide to what to do next. Interactive: a decision tree the user clicks through ("did you hit your sample size? → yes/no").

### Part V: Beyond the basics (peek, optional)
17. **When NOT to A/B test.** Small audiences, qualitative questions, ethical concerns. No interactivity, just a checklist.
18. **What stats people call all of this.** A glossary chapter that finally names the formal terms. Optional. The "show me the vocabulary" page for curious users.

## Interactive widget catalog
Each widget is a reusable React client component, lazy-loaded into the static MDX/RSC chapter pages. Each ships with a static SVG fallback so the page is meaningful before hydration.

### Widget 1: Coin-flip race
- Two columns (A, B), each shows running count of "heads" out of N flips.
- Slider for N (10, 100, 1000, 10000).
- Big "Flip again" button.
- Counter for "how many times have you seen a gap of X% or more by pure noise?"
- Animation: coins flip rapidly; tally bars animate up.

### Widget 2: Sampling distribution sandbox
- Two overlapping bell curves (control and variant).
- Sliders: sample size, true difference between variants.
- As sample size grows, curves narrow; as true difference grows, they pull apart.
- Shaded overlap area updates live; "this overlap is the source of doubt" caption.

### Widget 3: Sample size slider playground
- Four sliders: baseline rate, MDE, significance level, power (each labeled in plain English first, stats name in sidecar).
- One big number on the right: required sample size per variant.
- Secondary line: "at your traffic of X/week, that's Y weeks."
- Each slider has a tiny inline explanation that reveals on hover/focus.

### Widget 4: Peeking simulator
- Runs N=1000 simulated A/A tests in a Web Worker (no actual difference between A and B).
- User picks: "I check at the end" vs. "I check every day and stop early."
- Live bar showing the % of those tests that "fooled" the user.
- The point: ~5% under the first option, often 25%+ under the second.
- Slider for "how often I check" to show the gradient.

### Widget 5: Confidence interval chart
- Two horizontal bars representing the conversion rates of A and B with error bars (95% CI).
- Inputs: visitors and conversions for each.
- Visual rule: if the bars don't overlap horizontally, the result is "significant."
- Color: green when separated, gray when overlapping (always paired with text label and shape).

### Widget 6: 100-square frequency grid
- A 10x10 grid of squares.
- Used to make probabilities tangible: "5% of the time, you'll get this wrong" → 5 squares colored.
- Reused across multiple chapters with different captions.

### Widget 7: Test plan card
- Carries the user's running answers from chapters 4–8.
- Renders as a compact summary: scenario, baseline, MDE, significance, power, sample size, weeks needed.
- "Copy to clipboard" generates a plain-English summary suitable for sharing in Slack.
- "Start over" resets the running state.

### Widget 8: Decision tree (inconclusive results)
- A small click-through flow with three or four branches.
- Each leaf has a one-paragraph recommendation.

### Widget 9: Two-page mockup with flowing visitors
- Used on the "what is an A/B test" landing chapter.
- Animated dots flow into a Y-split: half go to page A, half to page B.
- Each page has a button; some dots click, some don't.
- Counter at the bottom updates live.
- Pure visual, no inputs.

## Power-user surface (kept minimal in v1)
Two unstyled, dense pages for return visitors and direct organic traffic. No tutorial, no animations, no scroll narrative. They exist mainly so that someone who Googled "ab test sample size calculator" doesn't have to scroll through chapters.

- `/calculator/sample-size` — the four sliders from Widget 3, full-page, plus links back to the relevant chapters for explanations.
- `/calculator/significance` — the inputs and the confidence-interval chart from Widget 5, full-page.

These pages are NOT linked from the home page above the fold. They are reachable from the nav and from a "skip to calculator" link inside the chapters. The home page is the tutorial.

## SEO architecture
The tension: we want fast static loads (good for SEO) AND many heavy interactive widgets (bad for SEO if loaded eagerly). The solution is an islands architecture.

Approach:
- **Every chapter is a separate route.** Each chapter is its own URL (e.g., `/why-eyeballing-doesnt-work`, `/sample-size-explained`), each statically generated at build time, each independently indexable.
- **Chapter content is static text + images.** The chapter copy, headings, examples, and recommendations are server-rendered HTML. Crawlers see the full content immediately; nothing depends on JS to be readable.
- **Interactive widgets are client components, lazy-loaded.** Each widget is dynamically imported (`next/dynamic`, with `ssr: false` for canvas-heavy ones), with a static SVG fallback so the page is meaningful before hydration.
- **Above-the-fold widgets get prioritized hydration.** The first widget on a chapter hydrates eagerly. Subsequent widgets hydrate on scroll into view (IntersectionObserver).
- **No client-side routing for the chapter sequence.** Use real `<a>` links between chapters so each navigation is a fresh static load (cached by Vercel CDN). Faster perceived load and better crawl behavior than SPA-style transitions.
- **Long-form content as MDX.** Chapter prose lives in MDX so it's searchable and editable as text, with widgets as inline components.
- **Image strategy.** Use `next/image` for any raster images. Use SVG for diagrams (smaller, sharper, animatable).
- **Performance budget.** Lighthouse goals: 95+ Performance, 100 SEO and Accessibility for every chapter page. CLS < 0.1. LCP < 2.5s on a throttled 4G profile.
- **Schema.org markup.** Each chapter is marked up as `Article` with author, datePublished, dateModified. The calculators are marked up as `WebApplication`. Glossary chapter as `DefinedTermSet`.
- **Internal linking.** Every chapter links to the next chapter, the previous chapter, and any chapter that defines a term used here. The glossary chapter (chapter 18) links to and from every chapter where its terms first appear.
- **Sitemap and robots.** Auto-generated `sitemap.xml`. Open Graph images per chapter (auto-generated at build time using `@vercel/og`).

### Static-text-first, hydrate-second concretely
For each chapter:
- Server renders: heading, body text, illustration (SVG), and a placeholder for the widget that says "loading interactive demo" plus a static SVG snapshot of what the widget will look like.
- Client hydrates: the placeholder is replaced with the real interactive widget.
- The static SVG snapshot is what Google sees and what the user sees during the ~50–200ms before hydration.

### SEO targets (revised)
Don't fight the established calculators on short-tail terms at launch. Aim for natural-language beginner queries and intent-rich long-tail mistakes:

Beginner intent (chapter pages):
- "what is an a/b test"
- "how many users do I need for an a/b test"
- "is 100 users enough for an a/b test"
- "what does statistical significance mean"
- "can I stop my a/b test early"
- "why did my a/b test fail"
- "how do I run an a/b test as a startup"
- "do I need a data scientist to run an a/b test"

Each of these maps to a specific chapter. Chapter URLs reflect the natural query language.

## Tech stack (updated for SEO + interactivity)
- **Framework**: Next.js 15 (App Router) with React Server Components.
- **Language**: TypeScript (strict).
- **Content**: MDX for chapter prose, with custom React widgets inline.
- **Styling**: Tailwind CSS v4. Mobile-first.
- **Components**: shadcn/ui for primitives (buttons, sliders, sheets, accordions for the stats-vocab sidecars).
- **Charts**: Visx (D3 wrapped in React, SSR-friendly) for static-rendered charts. Framer Motion for animations. Pure SVG over Canvas where possible (better for SEO + accessibility).
- **Heavy simulations**: Web Workers via Comlink for the peeking simulator and coin-flip race (don't block the main thread).
- **Stats math**: simple-statistics + jStat. Hand-rolled where simple. Unit-tested with Vitest.
- **State**: React state per widget. The "carried state" across chapters uses URL search params + localStorage so it survives refresh and is shareable.
- **OG image generation**: `@vercel/og` for per-chapter social cards.
- **Hosting**: Vercel (free tier).
- **Analytics**: Vercel Analytics + Plausible (no cookies, GDPR-friendly).
- **Repo**: public GitHub, MIT license.

## Accessibility (non-negotiable)
- Every chart has a text alternative ("In plain English: ...") and proper ARIA labels.
- Every slider is keyboard-operable and announces value changes.
- Color is never the only signal (always paired with shape, label, or pattern).
- Color palette tested against deuteranopia and protanopia.
- Animations respect `prefers-reduced-motion`.
- Touch targets at least 44x44px.

## Mobile considerations
- Sliders are non-trivial on mobile. Pair every slider with a stepped +/- control and a numeric input.
- Charts reflow to vertical stacks on narrow viewports.
- Tutorial chapters are designed for portrait scrolling first.

## Non-goals (v1)
- No accounts, no database, no backend.
- No monetization (no ads, no paywall, no email capture).
- No native or PWA.
- No multi-language.
- No power-user-first home page. The home is the tutorial.

## Revised timeline (honest)
The original "weekend build" was correct only for a calculator. A tutorial-first experience with this many widgets is a 4–6 weekend project for a careful build. Suggested phasing:

- **Weekend 1**: Scaffold. Pick domain. Tech setup (Next.js, MDX, Tailwind, Visx, Vitest). Stub all chapter routes with placeholder content. Build Widget 1 (coin-flip race) end-to-end as the reference implementation.
- **Weekend 2**: Build chapters 1–3 with their widgets (coin-flip race, sampling distribution sandbox). Validate the widget pattern, the chapter component pattern, the SSR + hydration approach.
- **Weekend 3**: Build chapters 4–9 (designing your test) and Widgets 3, 6, 7. The "test plan card" (Widget 7) is the spine.
- **Weekend 4**: Build chapters 10–12 (running your test) and Widget 4 (peeking simulator). Hardest chapter content-wise.
- **Weekend 5**: Build chapters 13–16 (reading results) and Widget 5 (confidence interval chart).
- **Weekend 6**: Polish pass. Power-user pages. Accessibility audit. Lighthouse pass. SEO metadata. OG images. Launch.

Ship public progress at the end of every weekend (deploy to Vercel from `main`).

## Success criteria
- v1 deployed within 6 weekends.
- Every chapter is statically rendered and scores 95+ Lighthouse Performance / 100 SEO and Accessibility.
- Every chapter has at least one interactive widget.
- One beginner says "this is the first explanation that made it click."
- One organic Google visit within 4 weeks of launch.
- Shareable on Twitter/LinkedIn without embarrassment (clear OG images, polished UX, no dead links).

## Differentiation summary
- Existing tools: calculator-first, expert audience, dense UI, static prose.
- This tool: tutorial-first, beginner audience, every concept paired with a custom interactive widget, plain language with stats vocabulary tucked into a sidecar.
- SEO play: per-chapter static routes targeting natural-language beginner queries, with islands of interactivity that don't slow down the static load.

## Competitor scan (top Google results)
1. **CXL — `cxl.com/ab-test-calculator/`**: bare-bones calculator, no explanations. Beginners bounce.
2. **AB Test Calculator — `abtestcalculator.com`**: assumes the user already understands significance and sample size. Useful only with the vocabulary.
3. **SurveyMonkey — `surveymonkey.com/learn/research-and-analysis/ab-testing-significance-calculator/`**: best of the four for prose, but still skips the foundational intuition. No interactivity in the explanation itself.
4. **OmniCalculator — `omnicalculator.com/statistics/ab-test`**: textbook framing, dense static prose, no scenario.

Common failure across all four: their interactive elements are basic JS forms with no teaching. None has per-concept lazy-hydrated widgets, plain-language framing, or a beginner-first scroll narrative.

## Next actions
1. Reserve a domain. Candidates: `abtestkit.dev`, `splittest.tools`, `learnabtesting.com`, `whichvariant.com`. Lean toward something that names the audience or the journey, not just the math.
2. Scaffold Next.js 15 + MDX + Tailwind + Visx + Vitest + shadcn/ui repo on GitHub. Public from day one.
3. Build Widget 1 (coin-flip race) end-to-end as the reference for every other widget. Document the pattern in CONTRIBUTING.md.
4. Stub all 18 chapter routes with placeholder MDX so the site shape is real from day one.
5. Set Lighthouse + a11y CI checks on every PR.
6. Ship a "skeleton" version (chapters 1–3 only) to Vercel after weekend 1; share as a build-in-public moment.
7. Iterate weekend by weekend; keep `main` shippable.
