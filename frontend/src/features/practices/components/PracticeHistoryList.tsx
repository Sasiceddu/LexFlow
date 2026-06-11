import { EmptyState } from '../../../components/shared/EmptyState'
import { useConfigurableFields } from '../../../hooks/useConfigurableFields'
import type {
  JsonObject,
  JsonValue,
  PracticeHistoryItem,
} from '../../../types/practice.types'
import { formatDateTime } from '../../../utils/formatters'
import { formatCustomValue } from '../utils/formatCustomValue'

type PracticeHistoryListProps = {
  histories: PracticeHistoryItem[]
}

type PhaseDataSummary = {
  entries: [string, JsonValue][]
  hasUnreadableData: boolean
}

function summarizePhaseData(data: JsonObject | null): PhaseDataSummary {
  const phaseData = data?.phaseData

  if (!phaseData || typeof phaseData !== 'object' || Array.isArray(phaseData)) {
    return { entries: [], hasUnreadableData: false }
  }

  const entries = Object.entries(phaseData)

  if (entries.length === 0) {
    return { entries: [], hasUnreadableData: false }
  }

  const isSimple = entries.every(
    ([, value]) => value === null || typeof value !== 'object',
  )

  return isSimple
    ? { entries, hasUnreadableData: false }
    : { entries: [], hasUnreadableData: true }
}

export function PracticeHistoryList({ histories }: PracticeHistoryListProps) {
  const fieldsQuery = useConfigurableFields()
  const fields = fieldsQuery.data ?? []
  const labelByKey = new Map(fields.map((field) => [field.technicalKey, field.label]))

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
          {histories.map((history) => {
            const phaseDataSummary = summarizePhaseData(history.data)

            return (
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
                {phaseDataSummary.entries.length > 0 ? (
                  <div className="detail-grid">
                    {phaseDataSummary.entries.map(([key, value]) => (
                      <div className="detail-field" key={key}>
                        <span>{labelByKey.get(key) ?? key}</span>
                        <strong>{formatCustomValue(value)}</strong>
                      </div>
                    ))}
                  </div>
                ) : null}
                {phaseDataSummary.hasUnreadableData ? (
                  <p className="section-meta">Sono stati registrati dati fase.</p>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
