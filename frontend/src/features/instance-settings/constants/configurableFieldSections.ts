export type ConfigurableFieldSectionOption = {
  label: string
  value: string
}

export const configurableFieldSectionOptions: ConfigurableFieldSectionOption[] = [
  { label: 'Generale', value: 'general' },
  { label: 'Deposito', value: 'deposit' },
  { label: 'Solleciti', value: 'reminders' },
  { label: 'Integrazioni', value: 'integrations' },
  { label: 'Rifiuto', value: 'rejection' },
  { label: 'Decreto', value: 'decree' },
  { label: 'SCP', value: 'scp' },
  { label: 'Liquidazione', value: 'liquidation' },
  { label: 'Documenti', value: 'documents' },
  { label: 'Note', value: 'notes' },
  { label: 'Report', value: 'reports' },
]

export function getConfigurableFieldSectionLabel(value: string): string {
  return (
    configurableFieldSectionOptions.find((option) => option.value === value)
      ?.label ?? value
  )
}
