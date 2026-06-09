import type { ReactNode } from 'react'
import { CountBadge } from './CountBadge'

type InstanceSettingsCardProps = {
  children: ReactNode
  count: number
  description: string
  title: string
}

export function InstanceSettingsCard({
  children,
  count,
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
        <CountBadge count={count} />
      </div>
      {children}
    </section>
  )
}
