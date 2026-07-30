# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T11:39:37.273Z.

## Overview

AdScope Intelligence — Google Ads competitive intel: enter any company and see only its currently-live Google Ads with formats, regions, and volume signals, now with explicit LIVE indicators.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Live-ads-only enforcement: Paused/Inactive/Ended ads are filtered out before rendering
- Pulsing green LIVE indicator next to the header count chip
- Subtle emerald 'Live' pill on every ad card
- KPI tiles and format breakdown computed from live ads only
- Empty state when a company has zero currently-live ads
- Recent searches persisted in Postgres via Prisma

## Tech Stack

- Next.js ^15.3.3 (App Router)
- React ^19.0.0
- Tailwind CSS v3
- TypeScript
- Prisma + PostgreSQL (Neon on Vercel)

## Infrastructure

- **DATABASE_URL:** set on Vercel when Neon is connected — do not commit real credentials

## Routes & Pages

- `/` — `app/page.tsx`

## Database Models

- `AdAnalysis`

## File Inventory

### App pages

- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/page.tsx`

### Components

- `components/AdRow.tsx`
- `components/BackgroundFX.tsx`
- `components/HomeClient.tsx`
- `components/KpiTile.tsx`
- `components/OrbitSpinner.tsx`
- `components/PillEye.tsx`
- `components/ScoreRing.tsx`

### Libraries

- `lib/actions.ts`
- `lib/adsEngine.ts`
- `lib/prisma.ts`
- `lib/types.ts`
- `prisma/schema.prisma`

### Config

- `.env.example`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `tsconfig.json`

### Other

- `README.md`
- `REPO_SUMMARY.md`

## Complete File Index

- `.env.example`
- `README.md`
- `REPO_SUMMARY.md`
- `app/error.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/not-found.tsx`
- `app/page.tsx`
- `components/AdRow.tsx`
- `components/BackgroundFX.tsx`
- `components/HomeClient.tsx`
- `components/KpiTile.tsx`
- `components/OrbitSpinner.tsx`
- `components/PillEye.tsx`
- `components/ScoreRing.tsx`
- `lib/actions.ts`
- `lib/adsEngine.ts`
- `lib/prisma.ts`
- `lib/types.ts`
- `next-env.d.ts`
- `next.config.ts`
- `package.json`
- `postcss.config.mjs`
- `prisma/schema.prisma`
- `tailwind.config.ts`
- `tsconfig.json`

## Latest Change

- **Updated at:** 2026-07-30T11:39:37.273Z
- **Request:** Edit the existing adscope-intelligence app. Two things:

A) LIVE-ADS-ONLY (re-verify and harden this — it must be enforced):
- Only render Google Ads that are CURRENTLY LIVE / actively running. Filter out every Paused, Inactive, Ended, or Expired ad BEFORE rendering (drop status !== 'active' / is_running === false / any ad whose end date is in the past).
- Never render a 'Paused' label anywhere. If you show a status pill at all, it must only ever read 'Live'.
- The header count chip must count LIVE ads only, after filtering.
- If a company has zero currently-live ads, show the empty state 'No live ads currently running for this company' instead of listing stale ads.

B) NEW visible change so the edit has something to push — add a small live-status indicator to each ad card and the header:
- Add a pulsing green dot (a subtle CSS keyframe pulse) immediately to the LEFT of the header count chip, with the label 'LIVE' next to it, so users can see the results are filtered to live ads only.
- On each ad card, add a tiny green 'Live' pill (rounded, subtle green glow) in the top-right corner of the card.
- Keep the green tasteful and consistent with the dark theme — use a muted emerald (#34d399) with low-opacity glow, not a harsh bright green.

Keep everything else EXACTLY as-is: the dark intelligence.position2.com theme, glass cards, cyan->violet gradient, KPI tiles, live-signal feed styling, animations, the company search + Analyze flow, and the Sim API key.
