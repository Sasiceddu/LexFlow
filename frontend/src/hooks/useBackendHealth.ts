import { useQuery } from '@tanstack/react-query'
import { getBackendHealth } from '../api/healthApi'

export const backendHealthQueryKey = ['backend-health'] as const

export function useBackendHealth() {
  return useQuery({
    queryKey: backendHealthQueryKey,
    queryFn: ({ signal }) => getBackendHealth({ signal }),
  })
}
