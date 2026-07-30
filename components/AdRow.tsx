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

export default function AdRow({ ad, index }: AdRowProps) {
  // HARD GUARANTEE: this row renders currently-live ads ONLY. Even if
  // upstream filtering ever regresses, any non-Active ad is dropped here
  // and never reaches the DOM. A 'Paused' label can never render.
  if (ad.status !== 'Active') return null

  const color = FORMAT_COLORS[ad.format] ?? '#22d3ee'
  return (
    <div className="frow fade-up" style={{ animationDelay: `${index * 60}ms` }}>
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
  )
}
