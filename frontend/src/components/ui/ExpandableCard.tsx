import type { ReactNode } from 'react'
import { useDisclosure } from '../../hooks/useDisclosure'

type ExpandableCardProps = {
  children: ReactNode
  defaultOpen?: boolean
  subtitle?: string
  title: string
}

// Long LexFlow sections should prefer ExpandableCard to keep pages compact and readable.
export function ExpandableCard({
  children,
  defaultOpen = false,
  subtitle,
  title,
}: ExpandableCardProps) {
  const disclosure = useDisclosure(defaultOpen)

  return (
    <section className="expandable-card">
      <button
        type="button"
        className="expandable-card-header"
        aria-expanded={disclosure.isOpen}
        onClick={disclosure.toggle}
      >
        <span>{title}</span>
        <span className="expandable-card-indicator" aria-hidden="true">
          {disclosure.isOpen ? 'v' : '>'}
        </span>
      </button>

      {disclosure.isOpen ? (
        <div className="expandable-card-body">
          {subtitle ? <p className="expandable-card-subtitle">{subtitle}</p> : null}
          {children}
        </div>
      ) : null}
    </section>
  )
}
