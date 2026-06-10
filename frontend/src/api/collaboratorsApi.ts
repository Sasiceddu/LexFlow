import { apiClient } from './apiClient'
import type {
  Collaborator,
  CollaboratorInput,
  CollaboratorUpdateInput,
} from '../types/collaborator.types'

export function getCollaborators(): Promise<Collaborator[]> {
  return apiClient.get<Collaborator[]>('/api/collaborators')
}

export function createCollaborator(
  input: CollaboratorInput,
): Promise<Collaborator> {
  return apiClient.post<Collaborator>('/api/collaborators', { body: input })
}

export function updateCollaborator(
  id: string,
  input: CollaboratorUpdateInput,
): Promise<Collaborator> {
  return apiClient.patch<Collaborator>(`/api/collaborators/${id}`, {
    body: input,
  })
}

export function deleteCollaborator(id: string): Promise<Collaborator> {
  return apiClient.delete<Collaborator>(`/api/collaborators/${id}`)
}
