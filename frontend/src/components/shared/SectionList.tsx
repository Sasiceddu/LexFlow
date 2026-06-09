import { EmptyState } from './EmptyState'

type SectionListProps = {
  emptyMessage: string
  emptyTitle: string
  items: string[]
}

export function SectionList({
  emptyMessage,
  emptyTitle,
  items,
}: SectionListProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <ul className="section-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  )
}
