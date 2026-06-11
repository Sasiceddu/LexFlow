import { EmptyState } from '../../../components/shared/EmptyState'
import { useConfigurableFields } from '../../../hooks/useConfigurableFields'
import type { JsonObject, JsonValue } from '../../../types/practice.types'

type PracticeCustomDataCardProps = {
  customData: JsonObject | null
}

function formatCustomValue(value: JsonValue): string {
  if (value === null) {
    return 'Non inserito'
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No'
  }

  if (typeof value === 'string') {
    return value.trim().length > 0 ? value : 'Non inserito'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value.length > 0
      ? value.map((item) => formatCustomValue(item)).join(', ')
      : 'Non inserito'
  }

  return JSON.stringify(value)
}

export function PracticeCustomDataCard({ customData }: PracticeCustomDataCardProps) {
  const configurableFieldsQuery = useConfigurableFields()
  const fields = configurableFieldsQuery.data ?? []
  const labelByKey = new Map(
    fields
      .filter((field) => field.scope === 'GENERAL')
      .map((field) => [field.technicalKey, field.label]),
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
