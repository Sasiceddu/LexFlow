import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProfessional,
  deleteProfessional,
  getProfessionals,
  updateProfessional,
} from '../api/professionalsApi'
import { instanceSettingsOverviewQueryKey } from './useInstanceSettingsOverview'
import type {
  ProfessionalInput,
  ProfessionalUpdateInput,
} from '../types/professional.types'
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

export function useProfessionals() {
  return useQuery({
    queryKey: professionalsQueryKey,
    queryFn: getProfessionals,
  })
}

export function useCreateProfessional() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: (input: ProfessionalInput) => createProfessional(input),
    onSuccess: invalidatePeopleQueries,
  })
}

export function useUpdateProfessional() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: ProfessionalUpdateInput
    }) => updateProfessional(id, input),
    onSuccess: invalidatePeopleQueries,
  })
}

export function useDeleteProfessional() {
  const invalidatePeopleQueries = useInvalidatePeopleQueries()

  return useMutation({
    mutationFn: deleteProfessional,
    onSuccess: invalidatePeopleQueries,
  })
}
