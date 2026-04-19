# 01 — Scaffold the app

Status: implemented.

## Context

The repo started from a fresh `create-next-app` scaffold (Next.js 16, React 19, Tailwind 4, TypeScript strict) plus planning docs in `docs/`. Before building tutorial sections or the calculator, we needed a clean structural foundation: shared layout/chrome, page routes for the tutorial and calculator, and conventions for where shared components and config will live.

Decisions:
- **Tutorial URL:** `/` (the homepage IS the tutorial) — matches the beginner-first ethos; no marketing page in front.
- **Calculator URL:** `/calculator`.
- **Shared chrome:** minimal `<SiteHeader />` + `<SiteFooter />` in the root layout.
- **Folder conventions:** `components/` for React components, `lib/` for non-React shared code. Both reachable via the existing `@/*` path alias.
- **GitHub URL:** `https://github.com/codedebugrepeat/ab-test-guide` (public).

Scope: scaffold only. No tutorial section content, no calculator inputs/logic, no widgets, no state management, no MDX setup. Each page renders a minimal placeholder that confirms routing works.

## Next.js 16 notes

- Root layout at `app/layout.tsx` owns `<html>` and `<body>` (required).
- Server Components by default — nothing in this scaffold needs `'use client'`.
- `<Link>` from `next/link` for internal nav (prefetches static routes).
- Site-wide metadata via `export const metadata: Metadata` from the root layout.
- No dynamic routes in this scaffold, so no async `params` plumbing yet.

## What was built

### Created

- `lib/site-config.ts` — central site metadata + nav links.
- `components/container.tsx` — shared max-width/padding wrapper for page content.
- `components/site-header.tsx` — top nav with wordmark, Tutorial/Calculator links, external GitHub link.
- `components/site-footer.tsx` — copyright + MIT + GitHub.
- `app/calculator/page.tsx` — placeholder page.
- `app/not-found.tsx` — custom 404 with link back to `/`.

### Modified

- `app/layout.tsx` — pulls metadata from `site-config`, wraps children with `SiteHeader` + `<main>` + `SiteFooter`, body is a flex column so the footer sticks at the bottom on short pages.
- `app/page.tsx` — Next.js boilerplate replaced with a minimal tutorial placeholder.
- `app/globals.css` — removed the stray `body { font-family: Arial, ... }` rule that fought the Geist font.

## Folder structure

```
app/
  layout.tsx               # root layout: font, metadata, shared chrome
  page.tsx                 # / — tutorial placeholder
  calculator/
    page.tsx               # /calculator — calculator placeholder
  not-found.tsx            # 404
  globals.css
  favicon.ico

components/
  site-header.tsx
  site-footer.tsx
  container.tsx

lib/
  site-config.ts

docs/
  architecture.md
  chapters.md
  plans/
    01-scaffold.md         # this doc
```

## Non-goals (deferred)

- Tutorial sections / widgets.
- Calculator inputs / logic.
- State management via URL params / localStorage.
- MDX setup.
- `sitemap.ts` / `robots.txt` (added when we have a real domain).
- Design tokens beyond Tailwind defaults.
- Dark-mode toggle (auto `prefers-color-scheme` stays).
- Analytics / Vercel integration.
- OG image generation.

## Verification

1. `npm run dev` — dev server starts without errors.
2. `/` shows site header, "Tutorial" placeholder, footer.
3. `/calculator` shows same header/footer with "Calculator" placeholder.
4. Header links navigate via prefetched `<Link>` (no full reload).
5. `/nonsense` shows the custom not-found page with a back-home link.
6. `npm run lint` passes.
7. `npm run build` completes with both routes statically generated.
