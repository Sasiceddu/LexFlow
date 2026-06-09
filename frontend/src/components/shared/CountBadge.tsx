type CountBadgeProps = {
  count: number
  label?: string
}

export function CountBadge({ count, label = 'elementi' }: CountBadgeProps) {
  return (
    <span className="count-badge">
      {count} {label}
    </span>
  )
}
