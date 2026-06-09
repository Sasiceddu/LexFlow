import { apiClient } from './apiClient'
import type { InstanceSettingsOverview } from '../types/instanceSettings.types'

type GetInstanceSettingsOverviewOptions = {
  signal?: AbortSignal
}

export function getInstanceSettingsOverview(
  options: GetInstanceSettingsOverviewOptions = {},
): Promise<InstanceSettingsOverview> {
  return apiClient.get<InstanceSettingsOverview>(
    '/api/instance-settings/overview',
    {
      signal: options.signal,
    },
  )
}
