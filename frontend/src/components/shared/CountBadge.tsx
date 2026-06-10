type CountBadgeProps = {
  count?: number
  label?: string
  text?: string
}

export function CountBadge({ count = 0, label = 'elementi', text }: CountBadgeProps) {
  return <span className="count-badge">{text ?? `${count} ${label}`}</span>
}
