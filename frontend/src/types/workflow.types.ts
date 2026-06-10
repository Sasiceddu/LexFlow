export type WorkflowPhase = {
  category: string
  color: string | null
  deletedAt?: string | null
  description: string | null
  id: string
  isActive: boolean
  isFinal: boolean
  isInitial: boolean
  name: string
  order: number
  technicalKey: string
  workflowId: string
}

export type WorkflowTransition = {
  actionLabel: string
  fromPhase: {
    name: string
  }
  fromPhaseId: string
  id: string
  isActive: boolean
  order: number
  technicalKey: string
  toPhase: {
    name: string
  }
  toPhaseId: string
  workflowId: string
}

export type Workflow = {
  description: string | null
  id: string
  isActive: boolean
  isDefault: boolean
  name: string
  phases: WorkflowPhase[]
  transitions: WorkflowTransition[]
}

export type WorkflowInput = {
  description?: string | null
  isActive?: boolean
  isDefault?: boolean
  name: string
}

export type WorkflowUpdateInput = Partial<WorkflowInput>

export type WorkflowPhaseInput = {
  category: string
  color?: string | null
  description?: string | null
  isActive?: boolean
  isFinal?: boolean
  isInitial?: boolean
  name: string
  order: number
  technicalKey?: string
}

export type WorkflowPhaseUpdateInput = Partial<WorkflowPhaseInput>

export type WorkflowTransitionInput = {
  actionLabel: string
  fromPhaseId: string
  isActive?: boolean
  order: number
  technicalKey?: string
  toPhaseId: string
}

export type WorkflowTransitionUpdateInput =
  Partial<WorkflowTransitionInput>
