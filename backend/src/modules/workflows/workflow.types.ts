export type WorkflowPayload = {
  description?: string | null
  isActive?: boolean
  isDefault?: boolean
  name: string
}

export type WorkflowUpdatePayload = Partial<WorkflowPayload>

export type WorkflowPhasePayload = {
  category: string
  color?: string | null
  description?: string | null
  isActive?: boolean
  isFinal?: boolean
  isInitial?: boolean
  name: string
  order: number
  technicalKey: string
  workflowId: string
}

export type WorkflowPhaseUpdatePayload = Partial<
  Omit<WorkflowPhasePayload, 'workflowId'>
>

export type WorkflowTransitionPayload = {
  actionLabel: string
  fromPhaseId: string
  isActive?: boolean
  order: number
  technicalKey: string
  toPhaseId: string
  workflowId: string
}

export type WorkflowTransitionUpdatePayload = Partial<
  Omit<WorkflowTransitionPayload, 'workflowId'>
>
