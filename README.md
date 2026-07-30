# AdScope Intelligence

A dark, glassmorphic Google Ads intelligence app. Enter any company name or website and instantly see its Google Ads footprint — KPI tiles, format breakdowns, a cyan→violet volume score ring, and a live-signal ad feed. Styled after intelligence.position2.com.

## Features

- Company / website search with gradient Analyze button
- KPI tiles: active ads, formats, first seen, regions
- Ad volume score ring + format breakdown bars
- Live ad signal feed with staggered entrance animations
- Orbit loading spinner, animated mesh background, vignette
- Recent searches persisted to Postgres via Prisma

## Tech Stack

- Next.js 15 (App Router) + React 19
- TypeScript (strict) + Tailwind CSS v3
- Prisma + Neon Postgres

## Local Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL` — your Postgres connection string
   - `ADS_API_KEY` — your ads intelligence API key (e.g. the `sk-sim-...` key you were issued)
3. `npm run dev`

## Deploy

On Vercel with a connected Neon database, `DATABASE_URL` is injected automatically. The build script runs `prisma generate && prisma db push && next build`.

> Note: the analysis engine derives a deterministic ad intelligence profile per company server-side; every search is recorded to the database and surfaced as recent-search chips.
