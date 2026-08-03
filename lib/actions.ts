'use server'

import { prisma } from '@/lib/prisma'
import type { RecentSearch, WorkflowAnalyzeResponse, WorkflowSummary } from '@/lib/types'

const WORKFLOW_URL =
  'https://agent.thearena.ai/api/workflows/1bc61d1b-c9f0-47fe-bf2d-b181579a1c70/execute'

const DEFAULT_SIM_API_KEY = 'sk-sim-bhhlAgoUtFzmzP8M-KMkQGwAbVDBZ0-o'

const COLUMN_LABELS: string[] = [
  'Domain',
  'Advertiser Name',
  'Advertiser ID',
  'Ad Headline',
  'Ad Headline 2',
  'Ad Description',
  'Ad Format',
  'Creative Type',
  'Call To Action',
  'Display URL',
  'Landing Page URL',
  'Creative URL',
  'Placement',
  'Network',
  'First Seen',
  'Last Seen',
  'Days Running',
  'Regions',
  'Devices',
  'Impressions',
  'Spend',
  'Reach',
  'Transparency URL',
  'Positioning & Themes',
  'Notes',
  'Services',
  'Keywords',
  'Value Proposition',
  'Social Profiles',
  'Company Overview',
  'Capabilities',
  'Pricing Model',
  'Target Audience',
  'Analyzed At',
]

function normalizeCell(v: unknown): string {
  if (v === null || v === undefined) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  try {
    return JSON.stringify(v)
  } catch {
    return ''
  }
}

function parseRows(raw: unknown): string[][] {
  let value: unknown = raw
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return []
    try {
      value = JSON.parse(trimmed)
    } catch {
      return []
    }
  }
  if (!Array.isArray(value)) return []
  return value.map((row) => (Array.isArray(row) ? row.map(normalizeCell) : [normalizeCell(row)]))
}

function parseSummary(raw: unknown): WorkflowSummary | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const num = (k: string): number => (typeof o[k] === 'number' ? (o[k] as number) : 0)
  const str = (k: string): string => (typeof o[k] === 'string' ? (o[k] as string) : '')
  return {
    advertiserFound: o.advertiserFound === true,
    advertiserName: str('advertiserName'),
    activeAdsFound: num('activeAdsFound'),
    pausedOrInactiveExcluded: num('pausedOrInactiveExcluded'),
    creativesProcessed: num('creativesProcessed'),
    rowsToAdd: num('rowsToAdd'),
    failedCreativeCount: num('failedCreativeCount'),
    ctaFilled: num('ctaFilled'),
    displayUrlsFilled: num('displayUrlsFilled'),
    landingPagesFilled: num('landingPagesFilled'),
    auditStatus: str('auditStatus'),
    executionStatus: str('executionStatus'),
  }
}

function normalizeDomain(raw: string): string {
  const cleaned = raw
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .trim()
  if (cleaned.includes('.')) return cleaned
  return cleaned.replace(/[^a-z0-9-]/g, '') + '.com'
}

function titleCase(s: string): string {
  return s
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export async function analyzeCompany(query: string): Promise<WorkflowAnalyzeResponse> {
  const trimmed = query.trim()
  if (!trimmed) {
    return { success: false, error: 'Enter a company name or website to analyze.' }
  }
  if (trimmed.length > 120) {
    return { success: false, error: 'Query is too long.' }
  }
  const apiKey = process.env.SIM_API_KEY || DEFAULT_SIM_API_KEY
  try {
    const res = await fetch(WORKFLOW_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        competitorDomain: trimmed,
        stream: true,
        selectedOutputs: ['formatdata.result'],
      }),
      cache: 'no-store',
    })
    if (!res.ok) {
      return { success: false, error: `Analysis service responded with status ${res.status}.` }
    }
    const payload = (await res.json()) as { result?: { rows?: unknown; summary?: unknown } }
    const rows = parseRows(payload.result?.rows)
    const summary = parseSummary(payload.result?.summary)

    const maxRowLen = rows.reduce((m, r) => Math.max(m, r.length), 0)
    const columns = Array.from({ length: maxRowLen }, (_, i) => COLUMN_LABELS[i] ?? `Field ${i + 1}`)

    const firstRow = rows.length > 0 ? rows[0] : null
    const rowDomain = firstRow && firstRow.length > 0 ? firstRow[0].trim() : ''
    const rowAdvertiser = firstRow && firstRow.length > 1 ? firstRow[1].trim() : ''
    const fallbackDomain = normalizeDomain(trimmed)
    const companyName =
      (summary ? summary.advertiserName.trim() : '') ||
      rowAdvertiser ||
      titleCase(fallbackDomain.split('.')[0]) ||
      trimmed
    const domain = rowDomain || fallbackDomain
    const totalAds = summary ? summary.activeAdsFound : rows.length

    try {
      await prisma.adAnalysis.create({
        data: {
          query: trimmed,
          companyName,
          domain,
          totalAds,
          volumeScore: rows.length,
        },
      })
    } catch {
      // Logging failure must never block the analysis result
    }

    return {
      success: true,
      data: {
        query: trimmed,
        companyName,
        domain,
        columns,
        rows,
        summary,
      },
    }
  } catch {
    return { success: false, error: 'Analysis failed. Please try again.' }
  }
}

export async function getRecentSearches(): Promise<RecentSearch[]> {
  try {
    const rows = await prisma.adAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    })
    return rows.map((r) => ({
      id: r.id,
      companyName: r.companyName,
      domain: r.domain,
      totalAds: r.totalAds,
      createdAt: r.createdAt.toISOString(),
    }))
  } catch {
    return []
  }
}
