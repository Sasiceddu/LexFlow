import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type EntityLinkProps = {
  ariaLabel?: string
  children: ReactNode
  to: string
}

export function EntityLink({ ariaLabel, children, to }: EntityLinkProps) {
  return (
    <Link className="entity-link" to={to} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}
