import type { ConfigurableField } from '../../../types/configurableField.types'
import type { DropdownMenu } from '../../../types/dropdownMenu.types'
import type { JsonObject, JsonValue } from '../../../types/practice.types'
import { getConfigurableFieldSectionLabel } from '../../instance-settings/constants/configurableFieldSections'
import { getDropdownOptionsByMenuId } from '../utils/dropdownHelpers'
import { groupConfigurableFieldsBySection } from '../utils/groupConfigurableFieldsBySection'
import { DynamicFieldRenderer } from './DynamicFieldRenderer'

type PhaseFieldsFormProps = {
  fields: ConfigurableField[]
  menus: DropdownMenu[]
  onChange: (technicalKey: string, value: JsonValue | undefined) => void
  values: JsonObject
}

export function PhaseFieldsForm({
  fields,
  menus,
  onChange,
  values,
}: PhaseFieldsFormProps) {
  if (fields.length === 0) {
    return null
  }

  const groups = groupConfigurableFieldsBySection(fields)

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
