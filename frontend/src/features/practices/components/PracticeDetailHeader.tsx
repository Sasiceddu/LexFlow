import type { PracticeDetail } from '../../../types/practice.types'
import { formatDateTime } from '../../../utils/formatters'

type PracticeDetailHeaderProps = {
  practice: PracticeDetail
}

export function PracticeDetailHeader({ practice }: PracticeDetailHeaderProps) {
  return (
    <header className="detail-card">
      <div className="practice-detail-heading">
        <p className="practice-detail-code">{practice.code}</p>
        <h2>{practice.name}</h2>
      </div>
      <div className="detail-grid">
        <div className="detail-field">
          <span>Fase corrente</span>
          <strong>{practice.currentPhase.name}</strong>
        </div>
        <div className="detail-field">
          <span>Ultima modifica</span>
          <strong>{formatDateTime(practice.updatedAt)}</strong>
        </div>
      </div>
    </header>
  )
}
