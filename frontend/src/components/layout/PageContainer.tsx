import type { ReactNode } from 'react'

type PageContainerProps = {
  children: ReactNode
  description?: string
  title: string
}

export function PageContainer({
  children,
  description,
  title,
}: PageContainerProps) {
  return (
    <section className="page-shell page-container" aria-labelledby="page-title">
      <div className="page-heading">
        <p className="page-eyebrow">Struttura frontend</p>
        <h1 id="page-title">{title}</h1>
        {description ? <p className="page-description">{description}</p> : null}
      </div>

      {children}
    </section>
  )
}
