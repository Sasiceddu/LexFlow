export const workflowPhaseCategoryOptions = [
  { label: 'Depositata', value: 'deposited' },
  { label: 'In attesa decreto', value: 'waiting_decree' },
  { label: 'Sollecito', value: 'reminder' },
  { label: 'Integrazione', value: 'integration' },
  { label: 'Rifiutata', value: 'rejected' },
  { label: 'Decreto', value: 'decree' },
  { label: 'SCP', value: 'scp' },
  { label: 'Liquidazione', value: 'liquidation' },
  { label: 'Chiusa', value: 'closed' },
  { label: 'Sospesa', value: 'suspended' },
  { label: 'Annullata', value: 'cancelled' },
  { label: 'Personalizzata', value: 'custom' },
] as const

export function getWorkflowPhaseCategoryLabel(value: string): string {
  return (
    workflowPhaseCategoryOptions.find((option) => option.value === value)
      ?.label ?? value
  )
}
