# Architecture

## Pages

Three top-level destinations:

1. **Tutorial** (`/` or `/learn`) — 4–6 sequential concept sections, linear by default but fully skippable. Optimized for the first-timer.
2. **Calculator** (`/calculator`) — standalone page, two modes toggled: pre-experiment (sample size planning) and post-experiment (significance testing). Powerful enough to use alone; also where tutorial users land after they understand the concepts.
3. Individual section pages if we split the tutorial into separate routes (TBD — see open questions).

## Rendering model

Tutorial sections and the calculator are statically generated at build time. Interactive widgets are client components, lazy-loaded. The page is meaningful before JS hydrates — server-rendered text and a static visual placeholder are what Google indexes and what users see first.

The first widget on a page hydrates eagerly. Any below-the-fold widgets hydrate on scroll into view.

## Routing

**Decision: one route per section.** Each tutorial concept is its own URL (e.g., `/sample-size`, `/peeking`). Reasons:

- Better SEO per concept — each page can target its own query intent and metadata.
- Deep-linkable — share or bookmark a specific idea.
- Smaller initial payload per section; widgets stay scoped to the page that needs them.
- Progress and next/prev navigation map cleanly onto routes.

The calculator is its own page at `/calculator`. Exact section slugs are decided per section when it's built (see `docs/plans/`).

## State

User inputs in the tutorial carry forward to later sections and to the calculator. The source of truth is URL search params (shareable, survives refresh), mirrored to `localStorage` as a fallback.

Key values to carry: baseline rate, weekly traffic, minimum lift, significance level, power. Exact param names TBD when we build the relevant sections.

## Calculator page

One page, one toggle: **Pre-experiment** / **Post-experiment**.

- **Pre-experiment:** given baseline, desired lift, significance, and power → outputs required sample size and estimated runtime.
- **Post-experiment:** given visitors and conversions for each variant → outputs whether the result is significant and the confidence interval.

Copy and labels match the tutorial's plain language. Stats terms (MDE, alpha, p-value) appear as secondary labels only, not the primary question.

## Widget pattern

Each interactive widget is a client component dynamically imported into an otherwise server-rendered page. Each ships with a static fallback (SVG or simple HTML) so the page is useful before hydration.

Specific libraries for charts, animations, and simulations are not decided yet.

## Accessibility baseline (non-negotiable regardless of stack)

- Every chart has a text alternative and proper ARIA labels.
- Every slider is keyboard-operable, paired with `+`/`-` step buttons and a numeric input.
- Color is never the only signal (always paired with shape, label, or text).
- Animations respect `prefers-reduced-motion`.
- Touch targets: min 44×44px.

## Performance targets

- Lighthouse Performance: 95+
- Lighthouse SEO: 100
- Lighthouse Accessibility: 100
- CLS < 0.1, LCP < 2.5s on throttled 4G

## Open questions

- Content format for tutorial prose — MDX, plain TSX, or something else?
- Charting/animation library?
- Do heavy simulations need Web Workers, or is the complexity low enough to run on the main thread?
- Advanced deep-dives: expandable accordions on the same page, or linked sub-pages? (deferred post-MVP)
