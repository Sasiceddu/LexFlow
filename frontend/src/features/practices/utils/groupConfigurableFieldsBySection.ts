import type { ConfigurableField } from '../../../types/configurableField.types'

export type ConfigurableFieldSectionGroup = {
  fields: ConfigurableField[]
  sectionKey: string
}

export function groupConfigurableFieldsBySection(
  fields: ConfigurableField[],
): ConfigurableFieldSectionGroup[] {
  const groups = fields.reduce<Record<string, ConfigurableField[]>>(
    (result, field) => {
      const sectionFields = result[field.sectionKey] ?? []

      result[field.sectionKey] = [...sectionFields, field]

      return result
    },
    {},
  )

  return Object.entries(groups).map(([sectionKey, sectionFields]) => ({
    fields: sectionFields.sort((first, second) => first.order - second.order),
    sectionKey,
  }))
}
