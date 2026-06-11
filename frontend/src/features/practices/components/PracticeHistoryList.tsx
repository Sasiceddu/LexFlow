import { EmptyState } from '../../../components/shared/EmptyState'
import type { PracticeHistoryItem } from '../../../types/practice.types'
import { formatDateTime } from '../../../utils/formatters'

type PracticeHistoryListProps = {
  histories: PracticeHistoryItem[]
}

export function PracticeHistoryList({ histories }: PracticeHistoryListProps) {
  return (
    <section className="detail-card">
      <h2>Storico pratica</h2>
      {histories.length === 0 ? (
        <EmptyState
          title="Nessun evento registrato"
          message="Lo storico della pratica verra aggiornato man mano che la pratica avanza."
        />
      ) : (
        <ul className="workflow-transition-list">
          {histories.map((history) => (
            <li key={history.id}>
              <div className="detail-field">
                <span>{formatDateTime(history.createdAt)}</span>
                <strong>{history.title}</strong>
              </div>
              {history.description ? <p>{history.description}</p> : null}
              {history.fromPhase || history.toPhase ? (
                <div className="detail-grid">
                  {history.fromPhase ? (
                    <div className="detail-field">
                      <span>Da fase</span>
                      <strong>{history.fromPhase.name}</strong>
                    </div>
                  ) : null}
                  {history.toPhase ? (
                    <div className="detail-field">
                      <span>A fase</span>
                      <strong>{history.toPhase.name}</strong>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
