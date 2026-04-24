# A/B Test Guide

An interactive tutorial for absolute beginners — PMs, founders, and engineers who have never run an A/B test (or need a refresher) and want to understand the whole process end to end.

This is an interactive guide to A/B testing that assumes you know nothing — and at the end, you can run a real test and trust the result.

## What this is

This is a teaching experience with interactive visualizations to play around and experience the statistics in a fun way. 

The site walks you through a series of chapters, one concept per chapter, each with an interactive visualization. By the end, you have effectively used a sample-size planner and a significance calculator — without ever clicking a "calculator" button.

## Who it is for

**Primary audience:** absolute beginners. People who have never opened a stats textbook, or did once and forgot all of it.

**Secondary audience:** experienced analysts and growth PMs. A "skip to calculator" link gets them there fast.

## Stack

- Next.js 16 + React 19, hosted on Vercel
- Tailwind CSS v4 for styling
- visx (axis, group, scale) for SVG chart primitives
- Statically generated pages for SEO, client-side hydration for interactive charts
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
