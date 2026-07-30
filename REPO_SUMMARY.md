# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T13:03:26.581Z.

## Overview

AdScope Intelligence — enter any company name or website and instantly see its live Google Ads footprint: formats, regions, creatives, timing, targeting hints, and volume signals, rendered on a dark glass intelligence dashboard.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Company / domain search with Analyze flow and recent-search chips
- Live-ads-only feed — Paused/Inactive/Ended/Expired creatives are filtered before render
- Expandable ad cards with full creative, placement, timing, targeting, and metric detail
- Pulsing emerald LIVE indicator and per-card Live pills
- KPI tiles, cyan→violet volume score ring, and format breakdown bars
- Neon Postgres persistence of analysis history via Prisma

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

- **Updated at:** 2026-07-30T13:03:26.581Z
- **Request:** Edit the existing adscope-intelligence app. Keep the build passing and all current behavior; the ONLY new work is to SHOW MORE AD DETAIL on the page.

0) BUILD MUST STAY GREEN: keep the build script exactly as `prisma generate && prisma db push --accept-data-loss && next build`. Do not remove the --accept-data-loss flag.

1) KEEP LIVE-ADS-ONLY (unchanged): only render Google Ads that are CURRENTLY LIVE. Continue filtering out Paused/Inactive/Ended/Expired ads before rendering. Header count chip counts LIVE ads only. Keep the pulsing emerald 'LIVE' indicator left of the count chip and the small emerald 'Live' pill on each ad card. Keep the empty state 'No live ads currently running for this company'.

2) SHOW MORE AD DETAIL (the new work): For each live ad card, surface all available fields returned by the ad-detail source (ScrapeCreators / getAdDetail). Expand each card from the current summary into a richer detail layout including, wherever the data exists:
   - Full ad creative: headline(s), description/body text, display URL and final landing URL (as a clickable link), and the advertiser/brand name.
   - Creative preview: image/thumbnail or video creative if present; render a proper <img>/video, with a graceful placeholder when no creative URL is available.
   - Format & placement: ad format (text/image/video/responsive), and any placement/network info.
   - Timing: first-seen date, last-seen date, and total days running (computed), shown as a small metadata row.
   - Targeting/geo: regions/countries the ad is shown in, and any audience/targeting hints available.
   - Metrics: impressions / spend / reach ranges if provided, shown as compact stat chips.
   - A 'View on Google Ads Transparency' external link when an ad URL/id is available.
   Make each card EXPANDABLE: show the key summary by default and a 'More details' toggle (or accordion) that reveals the full field set, so cards stay scannable. Only render fields that actually have data — never show empty labels or 'undefined'/'null'.

3) STYLING: keep the dark intelligence.position2.com theme, glass cards, cyan->violet gradient, KPI tiles, live-signal feed styling, and animations. New detail rows should use the existing muted-label + value styling, hairline dividers, and the same chip styling used elsewhere. Keep everything responsive.

Keep everything else EXACTLY as-is: the company search + Analyze flow, recent-search chips, the Sim API key, and the Neon Postgres persistence.
