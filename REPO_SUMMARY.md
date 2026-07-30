# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T13:46:31.808Z.

## Overview

AdScope Intelligence — enter any company name or website and instantly see its live Google Ads footprint, now with client-side CSV export of live ad results.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Company / domain Google Ads analysis with live-ads-only filtering
- KPI tiles, volume score ring, and format breakdown derived from live ads
- Expandable ad cards with full creative, placement, timing, geo, and metric detail
- Client-side Export CSV button for all currently displayed live ads
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

- **Updated at:** 2026-07-30T13:46:31.808Z
- **Request:** Edit the existing adscope-intelligence app. Keep the build passing and all current behavior; the ONLY new work is to ADD A CSV EXPORT BUTTON for the live ad results.

0) BUILD MUST STAY GREEN: keep the build script exactly as `prisma generate && prisma db push --accept-data-loss && next build`. Do not remove the --accept-data-loss flag.

1) KEEP EVERYTHING CURRENT (unchanged): live-ads-only filtering (Paused/Inactive/Ended/Expired removed before rendering), the header count chip counting LIVE ads only, the pulsing emerald 'LIVE' indicator, the per-card 'Live' pill, the empty state, the expandable ad cards with the full ad detail (creative headline/body, display + final landing URL link, advertiser/brand, image/video preview with placeholder, format & placement, first-seen/last-seen/days-running, targeting/geo, impressions/spend/reach chips, and the 'View on Google Ads Transparency' link), plus the 'More details' toggle. Do not remove or regress any of this.

2) ADD CSV EXPORT (the new work): Add an 'Export CSV' button in the results header area, near the count chip / next to the LIVE indicator. Behavior:
   - Client-side download only (no server round-trip): build the CSV in the browser from the CURRENTLY DISPLAYED LIVE ADS and trigger a download via a Blob + object URL.
   - Include one row per live ad with columns for every meaningful field: advertiser/brand, headline, body/description, format, display URL, final landing URL, first seen, last seen, days running, regions/geo, impressions, spend, reach, and the Google Ads Transparency URL. Only include columns that have data across the set; leave cells blank where a field is missing (never write 'undefined'/'null').
   - Properly escape CSV values (wrap in quotes, escape embedded quotes and commas/newlines).
   - Filename should include the searched company and date, e.g. `adscope-<company>-<YYYY-MM-DD>.csv`.
   - Disable/hide the button when there are no live ads to export.

3) STYLING: style the Export CSV button to match the site — use the existing ghost/secondary button styling (hairline border, muted-to-white text, subtle hover) with a small download icon, consistent with the dark intelligence.position2.com theme, glass cards, and cyan->violet gradient accents. Keep it responsive and aligned with the count chip.

Keep everything else EXACTLY as-is: the company search + Analyze flow, recent-search chips, the Sim API key, and the Neon Postgres persistence.
