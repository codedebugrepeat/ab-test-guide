# [learnabtest.org](https://learnabtest.org) — A/B test guide & calculator

A guide and pre-experiment calculator for A/B testing. It assumes you don't know the statistical jargon and uses interactive widgets to build intuition instead. By the end you understand which levers matter and how big a sample size you'll need.

## Why this exists

Most A/B test calculators hit you with a wall of jargon — power, MDE, alpha, two-tailed — and assume you already know what to plug in. They aren't beginner-friendly. This guide exists to fill that gap: teach the core concepts and build the intuition first, so the calculator at the end actually means something.

To stay beginner-friendly, it makes a few opinionated choices: tests are one-tailed, only conversion-rate A/B tests are covered, and the calculator fixes statistical power at 80%. That keeps the focus on the three levers that matter most — [baseline](https://learnabtest.org/your-baseline-matters), [effect size](https://learnabtest.org/how-big-a-jump-are-you-looking-for), and [confidence](https://learnabtest.org/how-sure-do-you-need-to-be).

It started as just the pre-experiment calculator. More tools and chapters may follow based on user feedback.

## What it is

Each chapter introduces one concept and pairs it with one or multiple interactive widgets — drag a slider, pull samples from a jar, watch a distribution form. The final chapter is a sample-size calculator, but by the time you reach it you already know what every input means and why it moves the number it does.

## Who it is for

**Primary audience:** beginners. PMs, founders, and engineers who have never run an A/B test, or who opened a stats textbook once and forgot all of it.

**Secondary audience:** experienced analysts and growth PMs who want a refresher or a sharable explainer. The calculator is one click away in the menu.

## Stack

- Next.js 16 + React 19, hosted on Vercel
- Tailwind CSS v4 for styling
- visx (axis, group, scale) for SVG chart primitives
- PostHog for product analytics
- Statically generated pages for SEO, client-side hydration for interactive widgets
- No server or database needed

## Docs

- [Architecture](docs/architecture.md) — routing model, rendering pattern, open technical decisions
- [Chapter plan](docs/chapters.md) — tutorial sections, concepts, widget progression

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT. Public GitHub from day one.
