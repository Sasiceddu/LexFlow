export type CollaboratorOverviewItem = {
  displayName: string
  id: string
  isActive: boolean
}

export type ProfessionalOverviewItem = {
  displayName: string
  email: string | null
  id: string
  isActive: boolean
}

export type WorkflowOverviewItem = {
  description: string | null
  id: string
  isDefault: boolean
  name: string
}

export type WorkflowPhaseOverviewItem = {
  category: string
  id: string
  isFinal: boolean
  isInitial: boolean
  name: string
  order: number
  technicalKey: string
  workflowId: string
}

export type WorkflowTransitionOverviewItem = {
  actionLabel: string
  fromPhaseId: string
  fromPhase: {
    name: string
  }
  id: string
  order: number
  technicalKey: string
  toPhaseId: string
  toPhase: {
    name: string
  }
  workflowId: string
}

export type ConfigurableFieldScope = 'GENERAL' | 'PHASE'

export type ConfigurableFieldOverviewItem = {
  fieldType: string
  id: string
  isRequired: boolean
  label: string
  order: number
  phaseId: string | null
  scope: ConfigurableFieldScope
  sectionKey: string
  technicalKey: string
}

export type DropdownMenuOverviewItem = {
  id: string
  isSystem: boolean
  name: string
  scope: string | null
  technicalKey: string
}

export type DropdownOptionOverviewItem = {
  id: string
  label: string
  menuId: string
  order: number
  triggersPecBlock: boolean
  value: string
}

export type InstanceSettingsOverview = {
  collaborators: CollaboratorOverviewItem[]
  configurableFields: ConfigurableFieldOverviewItem[]
  dropdownMenus: DropdownMenuOverviewItem[]
  dropdownOptions: DropdownOptionOverviewItem[]
  phases: WorkflowPhaseOverviewItem[]
  professionals: ProfessionalOverviewItem[]
  transitions: WorkflowTransitionOverviewItem[]
  workflows: WorkflowOverviewItem[]
}
