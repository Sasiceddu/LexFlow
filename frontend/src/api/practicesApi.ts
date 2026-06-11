import { apiClient } from './apiClient'
import type {
  CreatePracticePayload,
  PracticeDetail,
  PracticeFilters,
  PracticeListItem,
  PracticeListResponse,
} from '../types/practice.types'

type GetPracticesOptions = {
  filters?: PracticeFilters
  signal?: AbortSignal
}

type GetByIdOptions = {
  signal?: AbortSignal
}

function appendParam(
  params: URLSearchParams,
  key: string,
  value: number | string | undefined,
) {
  if (value === undefined || value === '') {
    return
  }

  params.set(key, String(value))
}

function buildPracticeQuery(filters: PracticeFilters = {}): string {
  const params = new URLSearchParams()

  appendParam(params, 'search', filters.search?.trim())
  appendParam(params, 'phaseId', filters.phaseId)
  appendParam(params, 'collaboratorId', filters.collaboratorId)
  appendParam(params, 'professionalId', filters.professionalId)
  appendParam(params, 'page', filters.page)
  appendParam(params, 'pageSize', filters.pageSize)

  const query = params.toString()

  return query ? `?${query}` : ''
}

export function getPractices({
  filters,
  signal,
}: GetPracticesOptions = {}): Promise<PracticeListResponse> {
  return apiClient.get<PracticeListResponse>(
    `/api/practices${buildPracticeQuery(filters)}`,
    { signal },
  )
}

export function createPractice(
  payload: CreatePracticePayload,
): Promise<PracticeListItem> {
  return apiClient.post<PracticeListItem>('/api/practices', { body: payload })
}

export function getPracticeById(
  id: string,
  { signal }: GetByIdOptions = {},
): Promise<PracticeDetail> {
  return apiClient.get<PracticeDetail>(`/api/practices/${id}`, { signal })
}
