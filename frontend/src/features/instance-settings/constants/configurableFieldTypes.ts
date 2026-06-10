import type { ConfigurableFieldType } from '../../../types/configurableField.types'

export type ConfigurableFieldTypeOption = {
  label: string
  value: ConfigurableFieldType
}

export const configurableFieldTypeOptions: ConfigurableFieldTypeOption[] = [
  { label: 'Testo breve', value: 'SHORT_TEXT' },
  { label: 'Testo lungo', value: 'LONG_TEXT' },
  { label: 'Numero', value: 'NUMBER' },
  { label: 'Importo', value: 'AMOUNT' },
  { label: 'Data', value: 'DATE' },
  { label: 'Menu a tendina', value: 'DROPDOWN' },
  { label: 'Sì/No', value: 'BOOLEAN' },
  { label: 'Nota', value: 'NOTE' },
  { label: 'File', value: 'FILE' },
]

export function getConfigurableFieldTypeLabel(
  value: ConfigurableFieldType,
): string {
  return (
    configurableFieldTypeOptions.find((option) => option.value === value)
      ?.label ?? value
  )
}
