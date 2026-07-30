export default function OrbitSpinner() {
  return (
    <div className="flex flex-col items-center gap-5 py-16">
      <div className="orbit">
        <span className="orbit-ring orbit-ring-a" />
        <span className="orbit-ring orbit-ring-b" />
        <span className="orbit-core" />
      </div>
      <p className="text-sm text-muted">Scanning Google Ads Transparency signals…</p>
    </div>
  )
}
