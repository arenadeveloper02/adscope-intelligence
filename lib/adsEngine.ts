import type { AdFormat, AdItem, AnalysisResult, FormatBreakdown } from '@/lib/types'

function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function createRng(seed: number): () => number {
  let s = seed || 1
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

const FORMAT_COLORS: Record<AdFormat, string> = {
  Search: '#22d3ee',
  Display: '#8b5cf6',
  Video: '#e879f9',
  Shopping: '#34d399',
}

const REGIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'India',
  'Australia',
  'Singapore',
  'France',
]

const IMPRESSION_BUCKETS = ['1K–10K', '10K–50K', '50K–100K', '100K–500K', '500K–1M', '1M+']
const SPEND_BUCKETS = ['<$1K', '$1K–$5K', '$5K–$25K', '$25K–$100K', '$100K+']
const REACH_BUCKETS = ['5K–25K', '25K–100K', '100K–500K', '500K–2M', '2M+']

const PATHS = ['/', '/pricing', '/demo', '/features', '/signup', '/compare']

const PLACEMENTS: Record<AdFormat, string> = {
  Search: 'Google Search results',
  Display: 'Google Display Network',
  Video: 'YouTube & video partners',
  Shopping: 'Google Shopping tab',
}

const NETWORKS: Record<AdFormat, string> = {
  Search: 'Search Network',
  Display: 'Display Network',
  Video: 'Video Network',
  Shopping: 'Shopping Network',
}

const CREATIVE_TYPES: Record<AdFormat, string> = {
  Search: 'Responsive text ad',
  Display: 'Responsive display ad (image)',
  Video: 'In-stream video ad',
  Shopping: 'Product listing ad',
}

const CTA_TEXTS = [
  'Learn More',
  'Get Started',
  'Try Free',
  'Book a Demo',
  'Shop Now',
  'Sign Up',
  'Compare Plans',
]

const DEVICE_SETS: string[][] = [
  ['Desktop', 'Mobile'],
  ['Mobile'],
  ['Desktop', 'Mobile', 'Tablet'],
  ['Desktop'],
]

const AUDIENCE_HINTS = [
  'In-market: Business Software',
  'Remarketing list',
  'Custom intent: competitor terms',
  'Keyword: brand terms',
  'Affinity: Business Professionals',
  'Similar audiences',
  'Life events: job change',
]

const HEADLINES = [
  '{name} — Official Site',
  'Try {name} Free Today',
  '{name}: Built for Growth Teams',
  'Why Leaders Choose {name}',
  'Get Started with {name} in Minutes',
  '{name} Pricing & Plans',
  'The Smarter Way — {name}',
  '{name} vs. The Competition',
  'New from {name}: 2025 Edition',
  '{name} — Rated #1 by Customers',
  'Scale Faster with {name}',
  'Limited Offer from {name}',
]

const DESCRIPTIONS = [
  'Discover how thousands of teams accelerate results. Start your free trial — no credit card required.',
  'Trusted by industry leaders worldwide. See plans, pricing, and a live demo today.',
  'Cut costs and move faster with an all-in-one platform built for modern teams.',
  'Join a growing community of customers who switched and never looked back.',
  'Award-winning support, enterprise-grade security, and transparent pricing.',
  'Book a personalized walkthrough and see measurable impact in your first week.',
  'Everything you need in one place — automation, analytics, and insights.',
  'Compare features side by side and see why reviewers rank us first.',
]

function titleCase(s: string): string {
  return s
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function runAnalysis(rawQuery: string): AnalysisResult {
  const cleaned = rawQuery
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .trim()

  let domain: string
  let baseName: string
  if (cleaned.includes('.')) {
    domain = cleaned
    baseName = cleaned.split('.')[0]
  } else {
    baseName = cleaned
    domain = cleaned.replace(/[^a-z0-9]/g, '') + '.com'
  }
  const companyName = titleCase(baseName) || 'Unknown'

  const rng = createRng(hashString(domain))
  const candidateCount = 8 + Math.floor(rng() * 14)

  // ONLY currently-live ads are kept. Paused / inactive / ended / expired
  // creatives are dropped here so they never reach the UI, KPIs, format
  // breakdown, or the count chip.
  const ads: AdItem[] = []
  const formatCounts: Record<AdFormat, number> = { Search: 0, Display: 0, Video: 0, Shopping: 0 }
  let earliest = '9999-12-31'
  const regionSet = new Set<string>()

  for (let i = 0; i < candidateCount; i++) {
    const fr = rng()
    const format: AdFormat = fr < 0.45 ? 'Search' : fr < 0.7 ? 'Display' : fr < 0.87 ? 'Video' : 'Shopping'

    const daysAgo = 20 + Math.floor(rng() * 640)
    const firstSeen = new Date(Date.now() - daysAgo * 86400000).toISOString().slice(0, 10)

    const region = REGIONS[Math.floor(rng() * REGIONS.length)]
    const headlineIdx = Math.floor(rng() * HEADLINES.length)
    const descIdx = Math.floor(rng() * DESCRIPTIONS.length)
    const impressionsIdx = Math.floor(rng() * IMPRESSION_BUCKETS.length)
    const isLive = rng() < 0.88

    if (!isLive) continue // drop paused / ended / expired ads before rendering

    formatCounts[format] += 1
    if (firstSeen < earliest) earliest = firstSeen
    regionSet.add(region)

    // ---- extended detail fields (all deterministic per domain) ----
    const path = PATHS[Math.floor(rng() * PATHS.length)]
    const displayUrl = path === '/' ? domain : `${domain}${path}`
    const finalUrl = `https://${domain}${path === '/' ? '' : path}?utm_source=google&utm_medium=cpc`

    const lastSeenDaysAgo = Math.floor(rng() * 7)
    const lastSeen = new Date(Date.now() - lastSeenDaysAgo * 86400000).toISOString().slice(0, 10)

    const hasSecondary = rng() < 0.65
    const secondaryHeadline = hasSecondary
      ? HEADLINES[(headlineIdx + 3 + Math.floor(rng() * 4)) % HEADLINES.length].replace('{name}', companyName)
      : undefined

    const adRegions: string[] = [region]
    const extraRegions = Math.floor(rng() * 3)
    for (let k = 0; k < extraRegions; k++) {
      const candidate = REGIONS[Math.floor(rng() * REGIONS.length)]
      if (!adRegions.includes(candidate)) {
        adRegions.push(candidate)
        regionSet.add(candidate)
      }
    }

    const hintCount = 1 + Math.floor(rng() * 3)
    const hints: string[] = []
    for (let k = 0; k < hintCount; k++) {
      const candidate = AUDIENCE_HINTS[Math.floor(rng() * AUDIENCE_HINTS.length)]
      if (!hints.includes(candidate)) hints.push(candidate)
    }

    const spend = SPEND_BUCKETS[Math.floor(rng() * SPEND_BUCKETS.length)]
    const reach = REACH_BUCKETS[Math.floor(rng() * REACH_BUCKETS.length)]

    const hasCta = rng() < 0.8
    const ctaText = hasCta ? CTA_TEXTS[Math.floor(rng() * CTA_TEXTS.length)] : undefined
    const devices = DEVICE_SETS[Math.floor(rng() * DEVICE_SETS.length)]

    ads.push({
      id: `${domain}-${i}`,
      headline: HEADLINES[headlineIdx].replace('{name}', companyName),
      description: DESCRIPTIONS[descIdx],
      format,
      firstSeen,
      region,
      impressions: IMPRESSION_BUCKETS[impressionsIdx],
      status: 'Active',
      secondaryHeadline,
      advertiser: companyName,
      displayUrl,
      finalUrl,
      placement: PLACEMENTS[format],
      network: NETWORKS[format],
      lastSeen,
      regions: adRegions,
      audienceHints: hints,
      spend,
      reach,
      transparencyUrl: `https://adstransparency.google.com/?domain=${encodeURIComponent(domain)}&region=anywhere`,
      ctaText,
      devices,
      creativeType: CREATIVE_TYPES[format],
    })
  }

  const liveCount = ads.length

  const formats: FormatBreakdown[] = (Object.keys(formatCounts) as AdFormat[])
    .filter((f) => formatCounts[f] > 0)
    .map((f) => ({ format: f, count: formatCounts[f], color: FORMAT_COLORS[f] }))

  const volumeScore = liveCount === 0 ? 0 : 42 + Math.floor(rng() * 56)

  return {
    companyName,
    domain,
    volumeScore,
    kpis: {
      totalAds: liveCount,
      formatCount: formats.length,
      firstSeen: liveCount === 0 ? '—' : earliest,
      regionCount: regionSet.size,
    },
    formats,
    ads,
  }
}
