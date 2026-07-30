# Repository Summary: AdScope Intelligence

> Auto-maintained by Sim Development. Last updated: 2026-07-30T10:26:21.685Z.

## Overview

A dark, glassmorphic Google Ads intelligence app where users enter any company name or website and instantly see the Google Ads that company is running — KPI tiles, format breakdowns, an ad volume score ring, and a live-signal-style ad feed, styled after intelligence.position2.com.

**Repository:** `adscope-intelligence`  
**File count:** 27

## Features

- Company / website search with gradient Analyze button and instant analysis
- Glass KPI tiles: total active ads, formats, first seen, active regions
- Cyan→violet gradient ad volume score ring with format breakdown bars
- Live-signal style ad feed with staggered fade-in, format chips, and impression metrics
- Orbit/pulse loading spinner, animated mesh background, film-grain vignette
- Recent searches persisted to Neon Postgres via Prisma and shown as quick chips

## Tech Stack

- Next.js ^15.3.3 (App Router)
- React ^19.0.0
- Tailwind CSS v3
- TypeScript
- Prisma + PostgreSQL (Neon on Vercel)

## Infrastructure

- **Neon project ID:** `square-feather-57338633` — managed by Sim Development; do not delete or replace
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
- `.gitignore`
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
- `.gitignore`
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

- **Updated at:** 2026-07-30T10:26:21.685Z
- **Request:** Create a beautiful DARK-THEMED frontend where a user can enter any company's name or website and see all the Google Ads that company is currently running.

The API key is 'sk-sim-yJzSoRHmvQ2d0a6rzFQKsrrsDBsXDwqv'

=== UI/UX DESIGN SYSTEM — match intelligence.position2.com exactly ===

Replicate the look and feel of https://intelligence.position2.com. It is a premium, dark, agentic-AI SaaS aesthetic. Follow these tokens and patterns:

COLORS / THEME:
- Background: very dark near-black navy #050714 (theme-color). Use layered radial/mesh gradients over it in deep indigo/purple.
- Primary accent gradient: cyan #22d3ee -> violet #8b5cf6 (also #a855f7 / #67e8f9 -> #a78bfa). Use this gradient on buttons, headline emphasis, score rings, and bars.
- Secondary chart pops: #38bdf8, #34d399, #e879f9, #6366f1, #fbbf24, #f472b6, #a78bfa.
- Text: near-white #f5f7ff for primary, muted slate (#9aa4c4 / rgba(255,255,255,.6)) for secondary.

SURFACES / GLASSMORPHISM:
- Cards use a '.glass' treatment: semi-transparent dark fill (rgba(15,18,40,.55)), 1px hairline border rgba(255,255,255,.08), backdrop-blur, soft inner highlight, and a subtle outer glow. Rounded corners ~18-22px.
- Add a faint animated mesh/grid background (fixed) and a subtle film-grain/vignette overlay.

TYPOGRAPHY:
- Big fluid headlines: font-size clamp(40px,6.6vw,84px), tight line-height. Emphasis phrase in an ITALIC serif with the cyan->violet gradient text clip (class like .ital.grad). Example pattern: 'Know who’s ready to buy <span italic gradient>before they raise a hand.</span>'
- Section headings clamp(28px,4vw,48px). Body 'lead' text ~17-18px, muted.
- Use a clean modern sans (Inter / system-ui) for body, and a serif (e.g. 'Instrument Serif' or Georgia) only for the italic gradient emphasis.

SIGNATURE COMPONENTS TO INCLUDE:
- 'pill-eye' eyebrow label: a small rounded pill with a glowing pulsing dot + uppercase-ish label (e.g. 'Google Ads Intelligence').
- Gradient primary button '.btn-grad' (cyan->violet, subtle glow, magnetic hover) and a ghost/outline secondary button '.btn-ghost'.
- A hero with the pill-eye, the big italic-gradient headline, a muted lead line, a search input (company name or website) + gradient 'Analyze' button.
- Results shown in glass cards: KPI tiles (e.g. total active ads, formats, first-seen) styled like the site's .kpi tiles (label small caps, big value, small up-delta in accent green).
- An ad list/feed styled like the site's 'live signal stream' rows (.frow): company chip, colored tag chip (use the accent palette), a right-aligned metric, subtle divider, staggered fade-in.
- Optional score ring / bar visual using the cyan->violet gradient for a metric like ad volume.
- Loading state: an orbit/pulse spinner motif (concentric rings) consistent with the site's orb.

MOTION:
- Reveal-on-scroll fade/slide, staggered list entrance, gentle magnetic buttons, and a slow-moving background mesh. Keep it smooth and subtle, not flashy.

OVERALL: sleek, high-contrast, dark, glassy, gradient-accented, enterprise-grade. It should feel like it belongs on intelligence.position2.com.
