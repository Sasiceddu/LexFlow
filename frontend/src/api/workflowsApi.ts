import { apiClient } from './apiClient'
import type {
  Workflow,
  WorkflowInput,
  WorkflowPhase,
  WorkflowPhaseInput,
  WorkflowPhaseUpdateInput,
  WorkflowTransition,
  WorkflowTransitionInput,
  WorkflowTransitionUpdateInput,
  WorkflowUpdateInput,
} from '../types/workflow.types'

export function getWorkflows(): Promise<Workflow[]> {
  return apiClient.get<Workflow[]>('/api/workflows')
}

export function createWorkflow(input: WorkflowInput): Promise<Workflow> {
  return apiClient.post<Workflow>('/api/workflows', { body: input })
}

export function updateWorkflow(
  id: string,
  input: WorkflowUpdateInput,
): Promise<Workflow> {
  return apiClient.patch<Workflow>(`/api/workflows/${id}`, { body: input })
}

export function deleteWorkflow(id: string): Promise<Workflow> {
  return apiClient.delete<Workflow>(`/api/workflows/${id}`)
}

export function createWorkflowPhase(
  workflowId: string,
  input: WorkflowPhaseInput,
): Promise<WorkflowPhase> {
  return apiClient.post<WorkflowPhase>(`/api/workflows/${workflowId}/phases`, {
    body: input,
  })
}

export function updateWorkflowPhase(
  id: string,
  input: WorkflowPhaseUpdateInput,
): Promise<WorkflowPhase> {
  return apiClient.patch<WorkflowPhase>(`/api/workflow-phases/${id}`, {
    body: input,
  })
}

export function deleteWorkflowPhase(id: string): Promise<WorkflowPhase> {
  return apiClient.delete<WorkflowPhase>(`/api/workflow-phases/${id}`)
}

export function createWorkflowTransition(
  workflowId: string,
  input: WorkflowTransitionInput,
): Promise<WorkflowTransition> {
  return apiClient.post<WorkflowTransition>(
    `/api/workflows/${workflowId}/transitions`,
    { body: input },
  )
}

export function updateWorkflowTransition(
  id: string,
  input: WorkflowTransitionUpdateInput,
): Promise<WorkflowTransition> {
  return apiClient.patch<WorkflowTransition>(
    `/api/workflow-transitions/${id}`,
    { body: input },
  )
}

export function deleteWorkflowTransition(
  id: string,
): Promise<WorkflowTransition> {
  return apiClient.delete<WorkflowTransition>(
    `/api/workflow-transitions/${id}`,
  )
}
