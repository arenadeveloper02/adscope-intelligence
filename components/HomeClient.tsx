"use client"

import { useState } from 'react'
import { analyzeCompany } from '@/lib/actions'
import type { RecentSearch, WorkflowAnalysis } from '@/lib/types'
import PillEye from '@/components/PillEye'
import OrbitSpinner from '@/components/OrbitSpinner'
import KpiTile from '@/components/KpiTile'

interface HomeClientProps {
  recentSearches: RecentSearch[]
}

// ---------- CSV export helpers (client-side only) ----------

function csvEscape(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return '"' + value.replace(/"/g, '""') + '"'
  }
  return value
}

function buildCsv(columns: string[], rows: string[][]): string {
  const header = columns.map(csvEscape).join(',')
  const lines = rows.map((row) => columns.map((_, i) => csvEscape(row[i] ?? '')).join(','))
  return [header, ...lines].join('\r\n')
}

function isUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim())
}

export default function HomeClient({ recentSearches }: HomeClientProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<WorkflowAnalysis | null>(null)
  const [recents, setRecents] = useState<RecentSearch[]>(recentSearches)

  async function runQuery(q: string) {
    const trimmed = q.trim()
    if (!trimmed || loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    const res = await analyzeCompany(trimmed)
    setLoading(false)
    if (!res.success || !res.data) {
      setError(res.error ?? 'Something went wrong.')
      return
    }
    const data = res.data
    setResult(data)
    setRecents((prev) => {
      const entry: RecentSearch = {
        id: `${data.domain}-${Date.now()}`,
        companyName: data.companyName,
        domain: data.domain,
        totalAds: data.summary ? data.summary.activeAdsFound : data.rows.length,
        createdAt: new Date().toISOString(),
      }
      return [entry, ...prev.filter((p) => p.domain !== entry.domain)].slice(0, 6)
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void runQuery(query)
  }

  function handleExportCsv() {
    if (!result || result.rows.length === 0) return
    const csv = buildCsv(result.columns, result.rows)
    const slug =
      result.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'company'
    const date = new Date().toISOString().slice(0, 10)
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `adscope-${slug}-${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const summary = result ? result.summary : null

  return (
    <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-20 sm:pt-28">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <PillEye label="Google Ads Intelligence" />
        <h1 className="hero-title mt-6 text-ink">
          See every Google Ad they run —{' '}
          <span className="ital-grad">before your next move.</span>
        </h1>
        <p className="lead mt-5 max-w-2xl">
          Enter any company name or website and we run a live intelligence workflow — advertiser
          identity, creatives, positioning, services, keywords, pricing signals, and audiences.
        </p>

        <form onSubmit={handleSubmit} className="glass mt-9 flex w-full max-w-2xl items-center gap-2 p-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. acme.com or Acme Robotics"
            className="search-input"
            aria-label="Company name or website"
          />
          <button type="submit" className="btn-grad shrink-0" disabled={loading}>
            {loading ? 'Analyzing…' : 'Analyze'}
          </button>
        </form>

        {recents.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted">Recent</span>
            {recents.map((r) => (
              <button
                key={r.id}
                type="button"
                className="btn-ghost !px-3 !py-1.5 text-xs"
                onClick={() => {
                  setQuery(r.domain)
                  void runQuery(r.domain)
                }}
              >
                {r.companyName} · {r.totalAds} ads
              </button>
            ))}
          </div>
        )}

        {error && <p className="mt-6 text-sm text-rose-400">{error}</p>}
      </section>

      {loading && (
        <div className="mt-16 flex flex-col items-center gap-5">
          <OrbitSpinner />
          <p className="text-sm text-muted">Running live workflow analysis — this can take a minute…</p>
        </div>
      )}

      {result && !loading && (
        <section className="mt-16">
          {/* Company header */}
          <div className="fade-up mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="chip-avatar chip-avatar-lg">{result.companyName.charAt(0)}</span>
              <div>
                <h2 className="section-title text-ink">{result.companyName}</h2>
                <p className="text-sm text-muted">{result.domain}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn-ghost !px-3 !py-1.5 text-xs"
              onClick={handleExportCsv}
              disabled={result.rows.length === 0}
              aria-label="Export all records as CSV"
            >
              Export CSV
            </button>
          </div>

          {/* Workflow summary KPIs */}
          {summary && (
            <>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KpiTile label="Active Ads Found" value={String(summary.activeAdsFound)} delta="live now" />
                <KpiTile label="Paused / Excluded" value={String(summary.pausedOrInactiveExcluded)} />
                <KpiTile label="Records Returned" value={String(result.rows.length)} />
                <KpiTile label="Audit Status" value={summary.auditStatus || '—'} />
              </div>
              <div className="glass fade-up mt-4 p-5">
                <p className="kpi-label mb-3">Workflow Summary</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="stat-chip">Advertiser {summary.advertiserFound ? 'found' : 'not found'}</span>
                  {summary.advertiserName ? <span className="stat-chip">Name: {summary.advertiserName}</span> : null}
                  <span className="stat-chip">Creatives processed: {summary.creativesProcessed}</span>
                  <span className="stat-chip">Rows to add: {summary.rowsToAdd}</span>
                  <span className="stat-chip">Failed creatives: {summary.failedCreativeCount}</span>
                  <span className="stat-chip">CTA filled: {summary.ctaFilled}</span>
                  <span className="stat-chip">Display URLs filled: {summary.displayUrlsFilled}</span>
                  <span className="stat-chip">Landing pages filled: {summary.landingPagesFilled}</span>
                  {summary.executionStatus ? (
                    <span className="stat-chip">Execution: {summary.executionStatus}</span>
                  ) : null}
                </div>
              </div>
            </>
          )}

          {/* Full record data — EVERY column of EVERY record is rendered */}
          {result.rows.length === 0 ? (
            <div className="glass fade-up mt-4 flex flex-col items-center px-6 py-16 text-center">
              <span className="pill-eye">
                <span className="pill-dot" />
                0 records
              </span>
              <h3 className="mt-6 text-lg font-semibold text-ink">
                The workflow returned no records for this company
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                Try another company name or a full website domain.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {result.rows.map((row, ri) => (
                <div key={`record-${ri}`} className="glass fade-up p-6" style={{ animationDelay: `${ri * 60}ms` }}>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="kpi-label">
                      Record {ri + 1} of {result.rows.length}
                    </p>
                    <span className="live-pill">
                      <span className="live-pill-dot" />
                      Live data
                    </span>
                  </div>
                  <div className="detail-grid">
                    {result.columns.map((label, ci) => {
                      const value = (row[ci] ?? '').trim()
                      const wide = value.length > 160
                      return (
                        <div key={`${ri}-${ci}`} style={wide ? { gridColumn: '1 / -1' } : undefined}>
                          <p className="dt-label">{label}</p>
                          {value ? (
                            isUrl(value) ? (
                              <p className="dt-value">
                                <a
                                  href={value}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="detail-link"
                                >
                                  {value}
                                </a>
                              </p>
                            ) : (
                              <p className="dt-value">{value}</p>
                            )
                          ) : (
                            <p className="dt-value" style={{ color: 'var(--muted)' }}>—</p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
