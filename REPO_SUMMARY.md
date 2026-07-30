# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T11:38:58.326Z.

## Overview

AdScope Intelligence — Google Ads competitive intel that surfaces only currently-live ads for any company, with formats, regions, first-seen dates, and volume scoring.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Company search with instant Google Ads footprint analysis
- Live-only ad feed — Paused/Inactive/Ended/Expired ads are filtered out before rendering
- KPI tiles and count chips computed exclusively from live ads
- Graceful empty state when a company has zero live ads
- Ad Volume Score ring with cyan→violet gradient
- Format breakdown bars derived from live ads only
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

- **Updated at:** 2026-07-30T11:38:58.326Z
- **Request:** Edit the existing app so it ONLY shows Google Ads that are CURRENTLY LIVE / actively running. Do not show ads that are Paused, Inactive, Ended, Expired, or otherwise no longer running.

Specifically:
1. When fetching ads, filter the results to keep ONLY ads whose status is currently active/live (e.g. status === 'active' / is_running === true / no end date in the past). Drop every Paused/Inactive/Ended ad before rendering.
2. Remove the per-row status label entirely (no 'Active' or 'Paused' text next to the metric) OR only ever render 'Active' since every shown ad is live — but do NOT render 'Paused'.
3. The header count chip (e.g. 'N ACTIVE') must reflect the count of LIVE ads only, after filtering.
4. If a company has zero currently-live ads, show a graceful empty state ('No live ads currently running for this company') instead of listing stale ads.

Keep everything else exactly as-is: the dark intelligence.position2.com theme, glass cards, cyan->violet gradient, KPI tiles, live-signal feed styling, animations, the company search + Analyze flow, and the Sim API key.
