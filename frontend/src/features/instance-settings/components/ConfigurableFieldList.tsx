import { EmptyState } from '../../../components/shared/EmptyState'
import type { ConfigurableField } from '../../../types/configurableField.types'
import { ConfigurableFieldItem } from './ConfigurableFieldItem'

type ConfigurableFieldListProps = {
  fields: ConfigurableField[]
  onDelete: (field: ConfigurableField) => void
  onEdit: (field: ConfigurableField) => void
  scope: ConfigurableField['scope']
}

export function ConfigurableFieldList({
  fields,
  onDelete,
  onEdit,
  scope,
}: ConfigurableFieldListProps) {
  if (fields.length === 0) {
    return (
      <EmptyState
        title={`Nessun campo ${scope}`}
        message={`Non sono presenti campi configurabili ${scope}.`}
      />
    )
  }

  return (
    <ul className="configurable-field-list">
      {fields.map((field) => (
        <ConfigurableFieldItem
          key={field.id}
          field={field}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
