import type { ReactNode } from 'react'
import { useDisclosure } from '../../hooks/useDisclosure'

type ExpandableCardProps = {
  children: ReactNode
  defaultOpen?: boolean
  description?: string
  subtitle?: string
  title: string
}

// Main LexFlow sections use a vertical list of ExpandableCard; grids belong inside expanded content.
export function ExpandableCard({
  children,
  defaultOpen = false,
  description,
  subtitle,
  title,
}: ExpandableCardProps) {
  const disclosure = useDisclosure(defaultOpen)
  const helperText = description ?? subtitle

  return (
    <section className="expandable-card">
      <button
        type="button"
        className="expandable-card-header"
        aria-expanded={disclosure.isOpen}
        onClick={disclosure.toggle}
      >
        <span className="expandable-card-heading">
          <span className="expandable-card-title">{title}</span>
          {helperText ? (
            <span className="expandable-card-description">{helperText}</span>
          ) : null}
        </span>
        <span className="expandable-card-indicator" aria-hidden="true">
          {disclosure.isOpen ? 'v' : '>'}
        </span>
      </button>

      {disclosure.isOpen ? (
        <div className="expandable-card-body">
          {children}
        </div>
      ) : null}
    </section>
  )
}
