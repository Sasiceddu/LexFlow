import { useQuery } from '@tanstack/react-query'
import { getInstanceSettingsOverview } from '../api/instanceSettingsApi'

export const instanceSettingsOverviewQueryKey = [
  'instance-settings-overview',
] as const

export function useInstanceSettingsOverview() {
  return useQuery({
    queryKey: instanceSettingsOverviewQueryKey,
    queryFn: ({ signal }) => getInstanceSettingsOverview({ signal }),
  })
}
