import { useMutation, useQueryClient } from '@tanstack/react-query'
import { advancePractice } from '../api/practicesApi'
import type { AdvancePracticePayload } from '../types/practice.types'
import { practiceDetailQueryKey, practicesQueryKey } from './queryKeys'

export function useAdvancePractice(practiceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdvancePracticePayload) =>
      advancePractice(practiceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...practiceDetailQueryKey, practiceId],
      })
      void queryClient.invalidateQueries({ queryKey: practicesQueryKey })
    },
  })
}
