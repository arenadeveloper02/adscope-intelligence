# Repository Summary: adscope-intelligence

> Auto-maintained by Sim Development. Last updated: 2026-08-03T11:07:01.124Z.

## Overview

AdScope Intelligence — enter any company name or website and run a live Google Ads intelligence workflow that returns advertiser identity, creatives, positioning, services, keywords, and audience data, all rendered in full in the UI.

**Repository:** `adscope-intelligence`  
**File count:** 26

## Features

- Live workflow API analysis on Analyze click (agent.thearena.ai workflow execute)
- All returned record columns rendered in the UI with labeled fields
- Workflow summary KPIs (active ads, excluded, audit status)
- CSV export of the full record table
- Recent searches persisted via Prisma + Neon Postgres

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

- **Updated at:** 2026-08-03T11:07:01.124Z
- **Request:** Update the API once the Analyse Is clicked the 
curl -X POST \
  -H "X-API-Key: $SIM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"competitorDomain":"example","stream":true,"selectedOutputs":["formatdata.result"]}' \
  https://agent.thearena.ai/api/workflows/1bc61d1b-c9f0-47fe-bf2d-b181579a1c70/execute


Response:
{
  "result": {
    "rows": "[[\"position2.com\",\"POSITION2, Inc.\",\"AR14266320531836895233\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"AI plus human expertise rather than AI replacing marketers; real agentic AI that automates execution, monitoring, reporting, and campaign builds; ROI-focused and data-driven performance; multi-channel growth; qualified-lead generation; sustainable scaling; healthcare patient-volume growth; HIPAA-compliant marketing; dental-practice growth; consistency and repeatable execution across multiple locations; event-based relationship building at healthcare and dental conferences; creative innovation through AI and 3D visualization.\",\"\",\"Managed growth-marketing services; paid and performance media; organic search and content; creative and design services; analytics and attribution; marketing automation and RevOps; account-based marketing; AI and agentic-marketing solutions; healthcare and dental marketing; SaaS marketing; lead-generation and affiliate solutions; web management; Arena/Calibrate marketing technology; Studioˣ browser-based 3D rendering and product-visualization technology.\",\"growth marketing agency, AI marketing services, agentic AI marketing, AI growth technology, performance marketing agency, paid marketing, multi-channel paid marketing, ROI-focused paid marketing, data-driven marketing, marketing analytics, marketing automation, account-based marketing, ABM agency, SEO services, content strategy, creative assets, healthcare marketing agency, dental marketing agency, multi-location healthcare marketing, HIPAA-compliant marketing, SaaS marketing, affiliate marketing, lead generation solutions, AI agents for marketing, RevOps, 3D product visualization, browser-based rendering.\",\"An AI-powered growth engine combining expert human creativity with technology and data; rapid but sustainable growth; improved marketing efficiency and output through agentic AI; measurable ROI and qualified-lead growth; integrated execution across media, creative, analytics, automation, and content; scalable and repeatable programs for multi-location businesses; compliance-aware healthcare marketing; stronger brand awareness and acquisition readiness.\",\"LinkedIn: https://www.linkedin.com/company/position2; YouTube: https://www.youtube.com/@Position2Inc and legacy channel URL https://www.youtube.com/c/position2. No verified official Facebook, Instagram, or X profile was identified in the research results.\",\"Position² is a growth marketing agency that combines human marketing expertise, data, creative production, technology, analytics, and AI to help companies acquire customers and scale. Its current positioning centers on being an AI-powered growth engine. The business serves general B2B and growth-stage clients while maintaining dedicated offerings for healthcare, dental and multi-location organizations, SaaS companies, and account-based marketing programs.\",\"Performance marketing; multi-channel paid media; paid search and paid social; SEO; account-based marketing; content strategy; creative strategy and asset production; AI-assisted visual storytelling; marketing analytics and measurement; marketing automation; lead generation and affiliate marketing; website and webmaster services; AI growth technology; agentic AI marketing workflows; campaign monitoring, execution, reporting, and optimization; healthcare and dental growth marketing.\",\"Position2 does not prominently publish standardized prices on its website. The apparent model is custom B2B agency pricing based on scope, channels, media requirements, technology, creative output, and engagement duration. Prospects are directed toward consultations and custom proposals. Paid-media relationships may combine professional-service retainers or project fees with separately funded advertising spend.\",\"Marketing leaders, growth leaders, revenue and RevOps executives, founders, and business-unit leaders at B2B, SaaS, growth-stage, and enterprise companies. Vertical targeting includes healthcare MSOs, physician groups, dental groups and practices, multi-location operators, med-tech organizations, private-equity-backed platforms, and companies preparing to scale or improve acquisition value.\",\"2026-08-03T10:57:57.222Z\"]]",
    "summary": {
      "advertiserFound": true,
      "advertiserName": "POSITION2, Inc.",
      "activeAdsFound": 0,
      "pausedOrInactiveExcluded": 7,
      "creativesProcessed": 0,
      "rowsToAdd": 1,
      "failedCreativeCount": 0,
      "ctaFilled": 0,
      "displayUrlsFilled": 0,
      "landingPagesFilled": 0,
      "auditStatus": "pass_with_fixes",
      "executionStatus": "completed"
    }
  },
  "stdout": ""
}


you get rows data.. Make all the records in the all the columns to be visible in the UI
