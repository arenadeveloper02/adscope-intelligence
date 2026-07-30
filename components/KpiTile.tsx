interface KpiTileProps {
  label: string
  value: string
  delta?: string
}

export default function KpiTile({ label, value, delta }: KpiTileProps) {
  return (
    <div className="glass kpi fade-up">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value">{value}</p>
      {delta ? <p className="kpi-delta">▲ {delta}</p> : null}
    </div>
  )
}
