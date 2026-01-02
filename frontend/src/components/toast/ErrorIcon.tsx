interface ErrorIconProps {
  primary?: string
  secondary?: string
}

export default function ErrorIcon({ primary = '#ff4b4b', secondary = '#fff' }: ErrorIconProps) {
  return (
    <div
      className="error-icon"
      style={{
        '--primary': primary,
        '--secondary': secondary
      } as React.CSSProperties}
    />
  )
}
