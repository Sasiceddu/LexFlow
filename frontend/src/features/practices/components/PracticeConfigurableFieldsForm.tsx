import { EmptyState } from '../../../components/shared/EmptyState'
import type { ConfigurableField } from '../../../types/configurableField.types'
import type { DropdownMenu } from '../../../types/dropdownMenu.types'
import type { JsonObject, JsonValue } from '../../../types/practice.types'
import { getConfigurableFieldSectionLabel } from '../../instance-settings/constants/configurableFieldSections'
import { getDropdownOptionsByMenuId } from '../utils/dropdownHelpers'
import { groupConfigurableFieldsBySection } from '../utils/groupConfigurableFieldsBySection'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'

type PracticeConfigurableFieldsFormProps = {
  fields: ConfigurableField[]
  menus: DropdownMenu[]
  onChange: (technicalKey: string, value: JsonValue | undefined) => void
  values: JsonObject
}

export function PracticeConfigurableFieldsForm({
  fields,
  menus,
  onChange,
  values,
}: PracticeConfigurableFieldsFormProps) {
  const generalFields = fields
    .filter((field) => field.scope === 'GENERAL' && field.isActive)
    .sort((first, second) =>
      first.sectionKey === second.sectionKey
        ? first.order - second.order
        : first.sectionKey.localeCompare(second.sectionKey),
    )
  const groups = groupConfigurableFieldsBySection(generalFields)

  if (generalFields.length === 0) {
    return (
      <EmptyState
        title="Nessun campo configurabile generale"
        message="I campi configurabili GENERAL potranno essere aggiunti da Impostazioni istanze."
      />
    )
  }

  return (
    <div className="practice-configurable-fields">
      {groups.map((group) => (
        <section key={group.sectionKey} className="practice-form-section">
          <h3>{getConfigurableFieldSectionLabel(group.sectionKey)}</h3>
          <div className="practice-form-grid">
            {group.fields.map((field) => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={values[field.technicalKey]}
                options={getDropdownOptionsByMenuId(menus, field.dropdownMenuId)}
                onChange={onChange}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
