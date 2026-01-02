interface CheckmarkIconProps {
  primary?: string
  secondary?: string
}

export default function CheckmarkIcon({ primary = '#ff4136', secondary = '#fff' }: CheckmarkIconProps) {
  return (
    <div
      className="checkmark-icon"
      style={{
        '--primary': primary,
        '--secondary': secondary
      } as React.CSSProperties}
    />
  )
}
