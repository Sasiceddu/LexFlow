import { apiClient } from './apiClient'
import type {
  ConfigurableField,
  ConfigurableFieldInput,
  ConfigurableFieldUpdateInput,
} from '../types/configurableField.types'

export function getConfigurableFields(): Promise<ConfigurableField[]> {
  return apiClient.get<ConfigurableField[]>('/api/configurable-fields')
}

export function createConfigurableField(
  input: ConfigurableFieldInput,
): Promise<ConfigurableField> {
  return apiClient.post<ConfigurableField>('/api/configurable-fields', {
    body: input,
  })
}

export function updateConfigurableField(
  id: string,
  input: ConfigurableFieldUpdateInput,
): Promise<ConfigurableField> {
  return apiClient.patch<ConfigurableField>(`/api/configurable-fields/${id}`, {
    body: input,
  })
}

export function deleteConfigurableField(id: string): Promise<ConfigurableField> {
  return apiClient.delete<ConfigurableField>(`/api/configurable-fields/${id}`)
}
