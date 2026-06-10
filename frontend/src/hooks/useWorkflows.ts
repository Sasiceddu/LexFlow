import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkflow,
  createWorkflowPhase,
  createWorkflowTransition,
  deleteWorkflow,
  deleteWorkflowPhase,
  deleteWorkflowTransition,
  getWorkflows,
  updateWorkflow,
  updateWorkflowPhase,
  updateWorkflowTransition,
} from '../api/workflowsApi'
import type {
  WorkflowInput,
  WorkflowPhaseInput,
  WorkflowPhaseUpdateInput,
  WorkflowTransitionInput,
  WorkflowTransitionUpdateInput,
  WorkflowUpdateInput,
} from '../types/workflow.types'
import { workflowsQueryKey } from './queryKeys'
import { instanceSettingsOverviewQueryKey } from './useInstanceSettingsOverview'

function useInvalidateWorkflowQueries() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: workflowsQueryKey })
    void queryClient.invalidateQueries({
      queryKey: instanceSettingsOverviewQueryKey,
    })
  }
}

export function useWorkflows() {
  return useQuery({
    queryKey: workflowsQueryKey,
    queryFn: getWorkflows,
  })
}

export function useCreateWorkflow() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: (input: WorkflowInput) => createWorkflow(input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useUpdateWorkflow() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkflowUpdateInput }) =>
      updateWorkflow(id, input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useDeleteWorkflow() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useCreateWorkflowPhase() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: ({
      input,
      workflowId,
    }: {
      input: WorkflowPhaseInput
      workflowId: string
    }) => createWorkflowPhase(workflowId, input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useUpdateWorkflowPhase() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: WorkflowPhaseUpdateInput
    }) => updateWorkflowPhase(id, input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useDeleteWorkflowPhase() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: deleteWorkflowPhase,
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useCreateWorkflowTransition() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: ({
      input,
      workflowId,
    }: {
      input: WorkflowTransitionInput
      workflowId: string
    }) => createWorkflowTransition(workflowId, input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useUpdateWorkflowTransition() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: WorkflowTransitionUpdateInput
    }) => updateWorkflowTransition(id, input),
    onSuccess: invalidateWorkflowQueries,
  })
}

export function useDeleteWorkflowTransition() {
  const invalidateWorkflowQueries = useInvalidateWorkflowQueries()

  return useMutation({
    mutationFn: deleteWorkflowTransition,
    onSuccess: invalidateWorkflowQueries,
  })
}
