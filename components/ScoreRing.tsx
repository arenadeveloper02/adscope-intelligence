interface ScoreRingProps {
  score: number
  label: string
}

export default function ScoreRing({ score, label }: ScoreRingProps) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, score))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[140px] w-[140px]">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            className="ring-anim"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-ink">{clamped}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted">/ 100</span>
        </div>
      </div>
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{label}</p>
    </div>
  )
}
