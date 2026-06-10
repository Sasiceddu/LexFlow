import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCollaborator,
  deleteCollaborator,
  getCollaborators,
  updateCollaborator,
} from '../api/collaboratorsApi'
import { instanceSettingsOverviewQueryKey } from './useInstanceSettingsOverview'
import type {
  CollaboratorInput,
  CollaboratorUpdateInput,
} from '../types/collaborator.types'
import {
  collaboratorsQueryKey,
  professionalsQueryKey,
} from './queryKeys'

function useInvalidatePeopleQueries() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: collaboratorsQueryKey })
    void queryClient.invalidateQueries({ queryKey: professionalsQueryKey })
    void queryClient.invalidateQueries({
      queryKey: instanceSettingsOverviewQueryKey,
    })
  }
}

export function useCollaborators() {
  return useQuery({
    queryKey: collaboratorsQueryKey,
    queryFn: getCollaborators,
  })
}

export function useCreateCollaborator() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: (input: CollaboratorInput) => createCollaborator(input),
    onSuccess: invalidatePeopleQueries,
  })
}

export function useUpdateCollaborator() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: CollaboratorUpdateInput
    }) => updateCollaborator(id, input),
    onSuccess: invalidatePeopleQueries,
  })
}

export function useDeleteCollaborator() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: deleteCollaborator,
    onSuccess: invalidatePeopleQueries,
  })
}
