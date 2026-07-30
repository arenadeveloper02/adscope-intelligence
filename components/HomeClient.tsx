"use client"

import { useState } from 'react'
import { analyzeCompany } from '@/lib/actions'
import type { AnalysisResult, RecentSearch } from '@/lib/types'
import PillEye from '@/components/PillEye'
import OrbitSpinner from '@/components/OrbitSpinner'
import KpiTile from '@/components/KpiTile'
import ScoreRing from '@/components/ScoreRing'
import AdRow from '@/components/AdRow'

interface HomeClientProps {
  recentSearches: RecentSearch[]
}

export default function HomeClient({ recentSearches }: HomeClientProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)
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
    setResult(res.data)
    setRecents((prev) => {
      const entry: RecentSearch = {
        id: `${res.data?.domain ?? trimmed}-${Date.now()}`,
        companyName: res.data?.companyName ?? trimmed,
        domain: res.data?.domain ?? trimmed,
        totalAds: res.data?.kpis.totalAds ?? 0,
        createdAt: new Date().toISOString(),
      }
      return [entry, ...prev.filter((p) => p.domain !== entry.domain)].slice(0, 6)
    })
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void runQuery(query)
  }

  // HARD FILTER: only currently-live ads are ever rendered. Paused, Inactive,
  // Ended, or Expired creatives are dropped here even if upstream data changes.
  const liveAds = result ? result.ads.filter((a) => a.status === 'Active') : []
  const liveFormats = result
    ? result.formats.filter((f) => liveAds.some((a) => a.format === f.format))
    : []
  const maxFormat = liveFormats.length > 0 ? Math.max(...liveFormats.map((f) => f.count), 1) : 1

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
          Enter any company name or website and instantly surface its live Google Ads footprint —
          formats, regions, first-seen dates, and volume signals.
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

      {loading && <OrbitSpinner />}

      {result && !loading && (
        <section className="mt-16">
          {/* Company header */}
          <div className="fade-up mb-6 flex items-center gap-4">
            <span className="chip-avatar chip-avatar-lg">{result.companyName.charAt(0)}</span>
            <div>
              <h2 className="section-title text-ink">{result.companyName}</h2>
              <p className="text-sm text-muted">{result.domain}</p>
            </div>
          </div>

          {liveAds.length === 0 ? (
            <div className="glass fade-up flex flex-col items-center px-6 py-16 text-center">
              <span className="pill-eye">
                <span className="pill-dot" />
                0 active
              </span>
              <h3 className="mt-6 text-lg font-semibold text-ink">
                No live ads currently running for this company
              </h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                We only surface ads that are actively in rotation right now. Check back later or try
                another company.
              </p>
            </div>
          ) : (
            <>
              {/* KPI tiles — all counts derived from LIVE ads only */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <KpiTile label="Active Ads" value={String(liveAds.length)} delta="live now" />
                <KpiTile label="Formats" value={String(liveFormats.length)} />
                <KpiTile label="First Seen" value={result.kpis.firstSeen} />
                <KpiTile label="Regions" value={String(new Set(liveAds.map((a) => a.region)).size)} delta="expanding" />
              </div>

              {/* Score + format breakdown */}
              <div className="mt-4 grid gap-4 lg:grid-cols-[280px_1fr]">
                <div className="glass fade-up flex items-center justify-center p-6">
                  <ScoreRing score={result.volumeScore} label="Ad Volume Score" />
                </div>
                <div className="glass fade-up p-6">
                  <p className="kpi-label mb-5">Format Breakdown</p>
                  <div className="space-y-4">
                    {liveFormats.map((f) => (
                      <div key={f.format}>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-medium text-ink">{f.format}</span>
                          <span className="text-muted">{f.count} ads</span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{ width: `${Math.round((f.count / maxFormat) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live ad feed — only currently running ads */}
              <div className="glass fade-up mt-4 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="kpi-label">Live Ad Signals</p>
                  <span className="pill-eye !text-[10px]">
                    <span className="pill-dot" />
                    {liveAds.length} active
                  </span>
                </div>
                <div className="divide-y divide-white/5">
                  {liveAds.map((ad, i) => (
                    <AdRow key={ad.id} ad={ad} index={i} />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {!result && !loading && (
        <section className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            { t: 'Every format', d: 'Search, Display, Video, and Shopping placements in one unified feed.' },
            { t: 'First-seen intel', d: 'Know when each creative entered rotation and how long it has survived.' },
            { t: 'Volume scoring', d: 'A single cyan-to-violet score that ranks how aggressively they spend.' },
          ].map((c, i) => (
            <div key={c.t} className="glass fade-up p-6" style={{ animationDelay: `${i * 100}ms` }}>
              <h3 className="text-base font-semibold text-ink">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.d}</p>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
