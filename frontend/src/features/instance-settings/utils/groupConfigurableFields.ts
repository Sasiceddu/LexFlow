import type { ConfigurableField } from '../../../types/configurableField.types'

export type GroupedConfigurableFields = {
  general: Record<string, ConfigurableField[]>
  phase: Record<string, Record<string, ConfigurableField[]>>
}

function appendToSection(
  sections: Record<string, ConfigurableField[]>,
  sectionKey: string,
  field: ConfigurableField,
) {
  const fields = sections[sectionKey] ?? []

  sections[sectionKey] = [...fields, field]
}

export function groupConfigurableFields(
  fields: ConfigurableField[],
): GroupedConfigurableFields {
  return fields.reduce<GroupedConfigurableFields>(
    (groups, field) => {
      if (field.scope === 'GENERAL') {
        appendToSection(groups.general, field.sectionKey, field)
        return groups
      }

      const phaseKey = field.phaseId ?? 'unassigned'
      const phaseSections = groups.phase[phaseKey] ?? {}

      appendToSection(phaseSections, field.sectionKey, field)
      groups.phase[phaseKey] = phaseSections

      return groups
    },
    { general: {}, phase: {} },
  )
}
