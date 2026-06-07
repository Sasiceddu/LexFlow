import { apiClient } from './apiClient'
import type { BackendHealthResponse } from '../types/health.types'

type GetBackendHealthOptions = {
  signal?: AbortSignal
}

export function getBackendHealth(
  options: GetBackendHealthOptions = {},
): Promise<BackendHealthResponse> {
  return apiClient.get<BackendHealthResponse>('/api/health', {
    signal: options.signal,
  })
}
