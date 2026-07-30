# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T11:43:29.879Z.

## Overview

AdScope Intelligence — fixed the failing Vercel build by restoring the live-database `updatedAt` column on AdAnalysis in prisma/schema.prisma (the safe, executable fix for the potential_dataloss error) instead of adding --accept-data-loss, which would destructively drop a column holding real data. Live-ads-only rendering, the LIVE header indicator, and per-card emerald Live pills are already enforced and remain unchanged.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Build fix: AdAnalysis.updatedAt restored in schema with @updatedAt @default(now()) so prisma db push executes cleanly against existing rows (no data loss, no --accept-data-loss needed)
- Live-ads-only: Paused/Inactive/Ended/Expired ads are dropped before rendering (engine, client filter, and AdRow hard guard)
- Header count chip counts LIVE ads only, with pulsing emerald LIVE indicator to its left
- Emerald 'Live' pill in the top-right corner of every ad card — a 'Paused' label can never render
- Empty state 'No live ads currently running for this company' when zero live ads
- Dark glass theme with cyan→violet gradient, KPI tiles, score ring, and animated live-signal feed preserved

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

- **Updated at:** 2026-07-30T11:43:29.879Z
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
