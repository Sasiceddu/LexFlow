export type ConfigurableFieldScopeValue = 'GENERAL' | 'PHASE'

export type ConfigurableFieldTypeValue =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'NUMBER'
  | 'AMOUNT'
  | 'DATE'
  | 'DROPDOWN'
  | 'BOOLEAN'
  | 'NOTE'
  | 'FILE'

export type ConfigurableFieldPayload = {
  dropdownMenuId?: string | null
  fieldType: ConfigurableFieldTypeValue
  includeInExport?: boolean
  isActive?: boolean
  isRequired?: boolean
  label: string
  order: number
  phaseId?: string | null
  scope: ConfigurableFieldScopeValue
  sectionKey: string
  showInTable?: boolean
  technicalKey: string
  useInFilters?: boolean
}

export type ConfigurableFieldUpdatePayload =
  Partial<ConfigurableFieldPayload>
