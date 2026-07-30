# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T11:43:21.965Z.

## Overview

AdScope Intelligence — enter any company name or website and instantly see its currently-live Google Ads footprint: formats, regions, first-seen dates, and volume signals.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Company / domain search with instant Google Ads analysis
- Live-ads-only feed — Paused/Ended/Expired creatives are filtered before rendering
- Pulsing emerald LIVE indicator next to the live-count chip and a Live pill on every ad row
- KPI tiles, cyan→violet ad-volume score ring, and format breakdown derived from live ads only
- Recent searches persisted in Neon Postgres via Prisma

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

- **Updated at:** 2026-07-30T11:43:21.965Z
- **Request:** Edit the existing adscope-intelligence app. The Vercel build is currently FAILING on a Prisma migration error, not on app code. Fix the build first, then keep the live-ads behavior. Do ALL of the following:

1) FIX THE BUILD (root cause): The build command runs `prisma db push` and it fails with `code: potential_dataloss` because it wants to drop the `updatedAt` column on the `AdAnalysis` table which still has non-null data. Fix this by making the `db push` non-blocking:
   - In package.json, change the build script's `prisma db push` to `prisma db push --accept-data-loss` (keep `prisma generate` before it and `next build` after it). So the build script becomes: `prisma generate && prisma db push --accept-data-loss && next build`.
   - Do NOT otherwise change the Prisma schema data model unless needed to compile.

2) LIVE-ADS-ONLY (must stay enforced):
   - Only render Google Ads that are CURRENTLY LIVE / actively running. Filter out every Paused, Inactive, Ended, or Expired ad BEFORE rendering.
   - Never render a 'Paused' label. Any status pill may only ever read 'Live'.
   - The header count chip counts LIVE ads only, after filtering.
   - If a company has zero currently-live ads, show the empty state 'No live ads currently running for this company'.

3) LIVE INDICATOR (visible change):
   - Add a pulsing muted-emerald (#34d399, low-opacity glow) dot with a 'LIVE' label to the LEFT of the header count chip.
   - Add a small emerald 'Live' pill in the top-right corner of each ad card.

Keep everything else EXACTLY as-is: the dark intelligence.position2.com theme, glass cards, cyan->violet gradient, KPI tiles, live-signal feed styling, animations, the company search + Analyze flow, and the Sim API key.
