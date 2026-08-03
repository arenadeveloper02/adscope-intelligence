'use server'

import { prisma } from '@/lib/prisma'
import type { RecentSearch, WorkflowAnalyzeResponse, WorkflowSummary } from '@/lib/types'

const WORKFLOW_URL =
  'https://agent.thearena.ai/api/workflows/1bc61d1b-c9f0-47fe-bf2d-b181579a1c70/execute'

const DEFAULT_SIM_API_KEY = 'sk-sim-bhhlAgoUtFzmzP8M-KMkQGwAbVDBZ0-o'

// The workflow can take well over a minute — keep a generous ceiling that still
// finishes before the serverless function itself is killed (maxDuration = 300).
const WORKFLOW_TIMEOUT_MS = 280_000

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
  let value: unknown = raw
  if (typeof raw === 'string') {
    const trimmed = raw.trim()
    if (!trimmed) return null
    try {
      value = JSON.parse(trimmed)
    } catch {
      return null
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const o = value as Record<string, unknown>
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

// ---------- Robust payload extraction ----------
// The workflow endpoint can answer with plain JSON, SSE ("data: {...}" lines),
// or numbered NDJSON chunks ("0:{...}"). We parse every candidate line into
// JSON values, then deep-search each value for the node that carries `rows`.

function parseLoose(text: string): unknown[] {
  const values: unknown[] = []
  const trimmed = text.trim()
  if (!trimmed) return values
  try {
    values.push(JSON.parse(trimmed))
    return values
  } catch {
    // fall through to line-based parsing
  }
  for (const rawLine of trimmed.split(/\r?\n/)) {
    let line = rawLine.trim()
    if (!line) continue
    if (line.startsWith('data:')) {
      line = line.slice(5).trim()
    } else {
      const numbered = line.match(/^[a-zA-Z0-9]+:\s*(\{.*|\[.*)$/)
      if (numbered) line = numbered[1]
    }
    if (!line || line === '[DONE]') continue
    try {
      values.push(JSON.parse(line))
    } catch {
      // skip unparseable chunk
    }
  }
  return values
}

interface ResultNode {
  rows: unknown
  summary: unknown
}

function findResultNode(node: unknown, depth: number): ResultNode | null {
  if (!node || typeof node !== 'object' || depth > 8) return null
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findResultNode(item, depth + 1)
      if (found) return found
    }
    return null
  }
  const o = node as Record<string, unknown>
  if ('rows' in o) {
    return { rows: o.rows, summary: 'summary' in o ? o.summary : null }
  }
  for (const key of Object.keys(o)) {
    const found = findResultNode(o[key], depth + 1)
    if (found) return found
  }
  return null
}

function findSummaryNode(node: unknown, depth: number): unknown {
  if (!node || typeof node !== 'object' || depth > 8) return null
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findSummaryNode(item, depth + 1)
      if (found) return found
    }
    return null
  }
  const o = node as Record<string, unknown>
  if ('activeAdsFound' in o || 'advertiserFound' in o) return o
  if ('summary' in o && o.summary && typeof o.summary === 'object') return o.summary
  for (const key of Object.keys(o)) {
    const found = findSummaryNode(o[key], depth + 1)
    if (found) return found
  }
  return null
}

function findErrorMessage(node: unknown, depth: number): string | null {
  if (!node || typeof node !== 'object' || depth > 6) return null
  if (Array.isArray(node)) {
    for (const item of node) {
      const found = findErrorMessage(item, depth + 1)
      if (found) return found
    }
    return null
  }
  const o = node as Record<string, unknown>
  if (o.success === false && typeof o.error === 'string' && o.error.trim()) {
    return o.error.trim()
  }
  if (typeof o.error === 'string' && o.error.trim() && !('rows' in o)) {
    return o.error.trim()
  }
  for (const key of Object.keys(o)) {
    const found = findErrorMessage(o[key], depth + 1)
    if (found) return found
  }
  return null
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

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), WORKFLOW_TIMEOUT_MS)

  let res: Response
  try {
    // IMPORTANT: stream must be false — a streamed response is not a single
    // JSON document and res.json() throws, which surfaced as the generic
    // "Analysis failed" error users were seeing.
    res = await fetch(WORKFLOW_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        competitorDomain: trimmed,
        stream: false,
        selectedOutputs: ['formatdata.result'],
      }),
      cache: 'no-store',
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timer)
    const aborted = err instanceof Error && err.name === 'AbortError'
    return {
      success: false,
      error: aborted
        ? 'The analysis took too long and timed out. Please try again — large advertisers can take several minutes.'
        : 'Could not reach the analysis service. Check your connection and try again.',
    }
  }
  clearTimeout(timer)

  let text: string
  try {
    text = await res.text()
  } catch {
    return { success: false, error: 'The analysis service response could not be read. Please try again.' }
  }

  if (!res.ok) {
    const candidates = parseLoose(text)
    for (const c of candidates) {
      const msg = findErrorMessage(c, 0)
      if (msg) return { success: false, error: `Analysis service error: ${msg}` }
    }
    return {
      success: false,
      error: `Analysis service responded with status ${res.status}. Please try again in a moment.`,
    }
  }

  try {
    const candidates = parseLoose(text)
    if (candidates.length === 0) {
      return {
        success: false,
        error: 'The analysis service returned an empty or unreadable response. Please try again.',
      }
    }

    let resultNode: ResultNode | null = null
    for (const c of candidates) {
      const found = findResultNode(c, 0)
      if (found) {
        resultNode = found
        break
      }
    }

    let summaryRaw: unknown = resultNode ? resultNode.summary : null
    if (!summaryRaw) {
      for (const c of candidates) {
        const found = findSummaryNode(c, 0)
        if (found) {
          summaryRaw = found
          break
        }
      }
    }

    if (!resultNode && !summaryRaw) {
      for (const c of candidates) {
        const msg = findErrorMessage(c, 0)
        if (msg) return { success: false, error: `Analysis service error: ${msg}` }
      }
      return {
        success: false,
        error: 'The analysis service returned an unexpected response format. Please try again.',
      }
    }

    const rows = resultNode ? parseRows(resultNode.rows) : []
    const summary = parseSummary(summaryRaw)

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
    return {
      success: false,
      error: 'Something went wrong while processing the analysis results. Please try again.',
    }
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
