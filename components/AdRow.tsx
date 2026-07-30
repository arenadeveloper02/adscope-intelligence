"use client"

import { useState } from 'react'
import type { AdItem } from '@/lib/types'

interface AdRowProps {
  ad: AdItem
  index: number
}

const FORMAT_COLORS: Record<string, string> = {
  Search: '#22d3ee',
  Display: '#8b5cf6',
  Video: '#e879f9',
  Shopping: '#34d399',
}

function computeDaysRunning(firstSeen: string, lastSeen?: string): number | null {
  const start = new Date(firstSeen).getTime()
  const end = lastSeen ? new Date(lastSeen).getTime() : Date.now()
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null
  return Math.max(1, Math.round((end - start) / 86400000))
}

export default function AdRow({ ad, index }: AdRowProps) {
  const [open, setOpen] = useState(false)

  // HARD GUARANTEE: this row renders currently-live ads ONLY. Even if
  // upstream filtering ever regresses, any non-Active ad is dropped here
  // and never reaches the DOM. A 'Paused' label can never render.
  if (ad.status !== 'Active') return null

  const color = FORMAT_COLORS[ad.format] ?? '#22d3ee'
  const days = computeDaysRunning(ad.firstSeen, ad.lastSeen)
  const regions = ad.regions && ad.regions.length > 0 ? ad.regions : [ad.region]
  const hasCreativeSlot = ad.format !== 'Search'

  return (
    <div className="frow-wrap fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      {/* Summary row (unchanged layout) */}
      <div className="frow-head">
        <div className="flex min-w-0 items-start gap-3">
          <span className="chip-avatar" style={{ borderColor: `${color}55`, color }}>
            {ad.headline.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{ad.headline}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted">{ad.description}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className="tag-chip"
                style={{ color, borderColor: `${color}44`, background: `${color}14` }}
              >
                {ad.format}
              </span>
              <span className="text-[11px] text-muted">{ad.region}</span>
              <span className="text-[11px] text-muted">First seen {ad.firstSeen}</span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
          <span className="live-pill">
            <span className="live-pill-dot" />
            Live
          </span>
          <p className="text-sm font-semibold text-ink">{ad.impressions}</p>
        </div>
      </div>

      {/* Expand / collapse toggle */}
      <button
        type="button"
        className="detail-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? 'Hide details' : 'More details'}
        <span className={`chev ${open ? 'chev-open' : ''}`}>▾</span>
      </button>

      {open && (
        <div className="detail-panel">
          {/* Creative preview */}
          {hasCreativeSlot ? (
            ad.creativeUrl ? (
              ad.format === 'Video' ? (
                <video src={ad.creativeUrl} controls className="creative-media" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.creativeUrl} alt={`${ad.headline} creative`} className="creative-media" />
              )
            ) : (
              <div className="creative-ph" style={{ borderColor: `${color}33` }}>
                <span className="chip-avatar" style={{ borderColor: `${color}55`, color }}>
                  {ad.format.charAt(0)}
                </span>
                <span className="text-xs text-muted">
                  No {ad.format.toLowerCase()} creative preview available
                </span>
              </div>
            )
          ) : null}

          {/* Full ad copy — untruncated body text */}
          <div>
            <p className="dt-label">Ad Copy</p>
            <p className="dt-value">{ad.description}</p>
          </div>

          {/* Full creative + placement fields — only rendered when data exists */}
          <div className="detail-grid">
            {ad.advertiser ? (
              <div>
                <p className="dt-label">Advertiser</p>
                <p className="dt-value">{ad.advertiser}</p>
              </div>
            ) : null}
            {ad.secondaryHeadline ? (
              <div>
                <p className="dt-label">Headline 2</p>
                <p className="dt-value">{ad.secondaryHeadline}</p>
              </div>
            ) : null}
            {ad.ctaText ? (
              <div>
                <p className="dt-label">Call to Action</p>
                <p className="dt-value">{ad.ctaText}</p>
              </div>
            ) : null}
            {ad.creativeType ? (
              <div>
                <p className="dt-label">Creative Type</p>
                <p className="dt-value">{ad.creativeType}</p>
              </div>
            ) : null}
            {ad.displayUrl ? (
              <div>
                <p className="dt-label">Display URL</p>
                <p className="dt-value">{ad.displayUrl}</p>
              </div>
            ) : null}
            {ad.finalUrl ? (
              <div>
                <p className="dt-label">Landing Page</p>
                <p className="dt-value">
                  <a href={ad.finalUrl} target="_blank" rel="noopener noreferrer" className="detail-link">
                    {ad.finalUrl.replace(/^https?:\/\//, '').split('?')[0]} ↗
                  </a>
                </p>
              </div>
            ) : null}
            {ad.placement ? (
              <div>
                <p className="dt-label">Placement</p>
                <p className="dt-value">{ad.placement}</p>
              </div>
            ) : null}
            {ad.network ? (
              <div>
                <p className="dt-label">Network</p>
                <p className="dt-value">{ad.network}</p>
              </div>
            ) : null}
          </div>

          {/* Timing metadata row */}
          <div className="detail-meta">
            <span>First seen {ad.firstSeen}</span>
            {ad.lastSeen ? <span>Last seen {ad.lastSeen}</span> : null}
            {days !== null ? <span>{days} days running</span> : null}
          </div>

          {/* Regions / geo */}
          {regions.length > 0 ? (
            <div>
              <p className="dt-label mb-1.5">Regions</p>
              <div className="flex flex-wrap gap-1.5">
                {regions.map((r) => (
                  <span key={r} className="stat-chip">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Device targeting */}
          {ad.devices && ad.devices.length > 0 ? (
            <div>
              <p className="dt-label mb-1.5">Devices</p>
              <div className="flex flex-wrap gap-1.5">
                {ad.devices.map((d) => (
                  <span key={d} className="stat-chip" style={{ color: '#67e8f9', borderColor: 'rgba(103,232,249,0.3)' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Audience / targeting hints */}
          {ad.audienceHints && ad.audienceHints.length > 0 ? (
            <div>
              <p className="dt-label mb-1.5">Targeting Hints</p>
              <div className="flex flex-wrap gap-1.5">
                {ad.audienceHints.map((h) => (
                  <span key={h} className="stat-chip" style={{ color: '#a78bfa', borderColor: 'rgba(167,139,250,0.3)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Metric ranges */}
          <div>
            <p className="dt-label mb-1.5">Metrics</p>
            <div className="flex flex-wrap gap-1.5">
              {ad.impressions ? <span className="stat-chip">Impressions {ad.impressions}</span> : null}
              {ad.spend ? <span className="stat-chip">Spend {ad.spend}</span> : null}
              {ad.reach ? <span className="stat-chip">Reach {ad.reach}</span> : null}
            </div>
          </div>

          {/* Transparency link */}
          {ad.transparencyUrl ? (
            <a
              href={ad.transparencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-link"
            >
              View on Google Ads Transparency ↗
            </a>
          ) : null}
        </div>
      )}
    </div>
  )
}
