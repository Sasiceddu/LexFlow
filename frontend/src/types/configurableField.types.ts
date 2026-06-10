export type ConfigurableFieldScope = 'GENERAL' | 'PHASE'

export type ConfigurableFieldType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'NUMBER'
  | 'AMOUNT'
  | 'DATE'
  | 'DROPDOWN'
  | 'BOOLEAN'
  | 'NOTE'
  | 'FILE'

export type ConfigurableField = {
  dropdownMenu: {
    id: string
    name: string
  } | null
  dropdownMenuId: string | null
  fieldType: ConfigurableFieldType
  id: string
  includeInExport: boolean
  isActive: boolean
  isRequired: boolean
  label: string
  order: number
  phase: {
    id: string
    name: string
  } | null
  phaseId: string | null
  scope: ConfigurableFieldScope
  sectionKey: string
  showInTable: boolean
  technicalKey: string
  useInFilters: boolean
}

export type ConfigurableFieldInput = {
  dropdownMenuId?: string | null
  fieldType: ConfigurableFieldType
  includeInExport?: boolean
  isActive?: boolean
  isRequired?: boolean
  label: string
  order: number
  phaseId?: string | null
  scope: ConfigurableFieldScope
  sectionKey: string
  showInTable?: boolean
  technicalKey?: string
  useInFilters?: boolean
}

export type ConfigurableFieldUpdateInput = Partial<ConfigurableFieldInput>
