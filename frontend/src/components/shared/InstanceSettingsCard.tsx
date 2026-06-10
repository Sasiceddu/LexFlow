import type { ReactNode } from 'react'
import { CountBadge } from './CountBadge'

type InstanceSettingsCardProps = {
  children: ReactNode
  count?: number
  countText?: string
  description: string
  title: string
}

export function InstanceSettingsCard({
  children,
  count,
  countText,
  description,
  title,
}: InstanceSettingsCardProps) {
  return (
    <section className="instance-settings-card">
      <div className="instance-settings-card-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <CountBadge count={count} text={countText} />
      </div>
      {children}
    </section>
  )
}
