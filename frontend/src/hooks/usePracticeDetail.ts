import { useQuery } from '@tanstack/react-query'
import { getPracticeById } from '../api/practicesApi'
import { practiceDetailQueryKey } from './queryKeys'

export function usePracticeDetail(id: string | undefined) {
  return useQuery({
    enabled: Boolean(id),
    queryKey: [...practiceDetailQueryKey, id],
    queryFn: ({ signal }) => getPracticeById(id as string, { signal }),
  })
}
