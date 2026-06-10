import { apiClient } from './apiClient'
import type {
  Professional,
  ProfessionalInput,
  ProfessionalUpdateInput,
} from '../types/professional.types'

export function getProfessionals(): Promise<Professional[]> {
  return apiClient.get<Professional[]>('/api/professionals')
}

export function createProfessional(
  input: ProfessionalInput,
): Promise<Professional> {
  return apiClient.post<Professional>('/api/professionals', { body: input })
}

export function updateProfessional(
  id: string,
  input: ProfessionalUpdateInput,
): Promise<Professional> {
  return apiClient.patch<Professional>(`/api/professionals/${id}`, {
    body: input,
  })
}

export function deleteProfessional(id: string): Promise<Professional> {
  return apiClient.delete<Professional>(`/api/professionals/${id}`)
}
