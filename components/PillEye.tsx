interface PillEyeProps {
  label: string
}

export default function PillEye({ label }: PillEyeProps) {
  return (
    <span className="pill-eye">
      <span className="pill-dot" />
      {label}
    </span>
  )
}
