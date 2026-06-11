import type { ConfigurableField } from '../../../types/configurableField.types'

export function getActivePhaseFields(
  fields: ConfigurableField[],
  phaseId: string,
): ConfigurableField[] {
  return fields
    .filter(
      (field) =>
        field.scope === 'PHASE' && field.phaseId === phaseId && field.isActive,
    )
    .sort((first, second) =>
      first.sectionKey === second.sectionKey
        ? first.order - second.order
        : first.sectionKey.localeCompare(second.sectionKey),
    )
}
