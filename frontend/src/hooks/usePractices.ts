import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPractice, getPractices } from '../api/practicesApi'
import type {
  CreatePracticePayload,
  PracticeFilters,
} from '../types/practice.types'
import { practicesQueryKey } from './queryKeys'

function normalizeFilterValue(value: string | undefined): string | undefined {
  const normalized = value?.trim()

  return normalized && normalized.length > 0 ? normalized : undefined
}

function normalizePracticeFilters(filters: PracticeFilters): PracticeFilters {
  return {
    collaboratorId: normalizeFilterValue(filters.collaboratorId),
    page: filters.page ?? 1,
    pageSize: filters.pageSize ?? 20,
    phaseId: normalizeFilterValue(filters.phaseId),
    professionalId: normalizeFilterValue(filters.professionalId),
    search: normalizeFilterValue(filters.search),
  }
}

export function usePractices(filters: PracticeFilters = {}) {
  const normalizedFilters = normalizePracticeFilters(filters)

  return useQuery({
    queryKey: [...practicesQueryKey, normalizedFilters],
    queryFn: ({ signal }) =>
      getPractices({ filters: normalizedFilters, signal }),
  })
}

export function useCreatePractice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePracticePayload) => createPractice(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: practicesQueryKey })
    },
  })
}
