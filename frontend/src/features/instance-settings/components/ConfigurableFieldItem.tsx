import { ActionRow } from '../../../components/shared/ActionRow'
import { Button } from '../../../components/ui/Button'
import type { ConfigurableField } from '../../../types/configurableField.types'
import { getConfigurableFieldSectionLabel } from '../constants/configurableFieldSections'
import { getConfigurableFieldTypeLabel } from '../constants/configurableFieldTypes'

type ConfigurableFieldItemProps = {
  field: ConfigurableField
  onDelete: (field: ConfigurableField) => void
  onEdit: (field: ConfigurableField) => void
}

function formatBoolean(value: boolean): string {
  return value ? 'si' : 'no'
}

export function ConfigurableFieldItem({
  field,
  onDelete,
  onEdit,
}: ConfigurableFieldItemProps) {
  return (
    <li className="configurable-field-item">
      <div className="person-summary">
        <strong>{field.label}</strong>
        <span>Scope: {field.scope}</span>
        <span>Sezione: {getConfigurableFieldSectionLabel(field.sectionKey)}</span>
        <span>Tipo: {getConfigurableFieldTypeLabel(field.fieldType)}</span>
        {field.phase ? <span>Fase: {field.phase.name}</span> : null}
        {field.dropdownMenu ? (
          <span>Menu collegato: {field.dropdownMenu.name}</span>
        ) : null}
        <span>Valore tecnico: {field.technicalKey}</span>
        <span>Ordine: {field.order}</span>
        <span>Obbligatorio: {formatBoolean(field.isRequired)}</span>
        <span>Tabella: {formatBoolean(field.showInTable)}</span>
        <span>Filtri: {formatBoolean(field.useInFilters)}</span>
        <span>Export: {formatBoolean(field.includeInExport)}</span>
        <span>{field.isActive ? 'Attivo' : 'Disattivato'}</span>
      </div>
      <ActionRow>
        <Button onClick={() => onEdit(field)}>Modifica campo</Button>
        <Button onClick={() => onDelete(field)} variant="danger">
          Cestina campo
        </Button>
      </ActionRow>
    </li>
  )
}
