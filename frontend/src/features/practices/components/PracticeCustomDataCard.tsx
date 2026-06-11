import { EmptyState } from '../../../components/shared/EmptyState'
import { useConfigurableFields } from '../../../hooks/useConfigurableFields'
import type { JsonObject } from '../../../types/practice.types'
import { formatCustomValue } from '../utils/formatCustomValue'

type PracticeCustomDataCardProps = {
  customData: JsonObject | null
}

export function PracticeCustomDataCard({ customData }: PracticeCustomDataCardProps) {
  const configurableFieldsQuery = useConfigurableFields()
  const fields = configurableFieldsQuery.data ?? []
  const labelByKey = new Map(
    fields.map((field) => [field.technicalKey, field.label]),
  )
  const entries = Object.entries(customData ?? {})

  return (
    <section className="detail-card">
      <h2>Campi personalizzati</h2>
      {entries.length === 0 ? (
        <EmptyState
          title="Nessun campo personalizzato"
          message="I valori dei campi configurabili compilati per questa pratica appariranno qui."
        />
      ) : (
        <div className="detail-grid">
          {entries.map(([key, value]) => (
            <div className="detail-field" key={key}>
              <span>{labelByKey.get(key) ?? key}</span>
              <strong>{formatCustomValue(value)}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
