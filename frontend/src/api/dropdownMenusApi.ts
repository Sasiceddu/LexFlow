import { apiClient } from './apiClient'
import type {
  DropdownMenu,
  DropdownMenuInput,
  DropdownMenuUpdateInput,
  DropdownOption,
  DropdownOptionInput,
  DropdownOptionUpdateInput,
} from '../types/dropdownMenu.types'

export function getDropdownMenus(): Promise<DropdownMenu[]> {
  return apiClient.get<DropdownMenu[]>('/api/dropdown-menus')
}

export function createDropdownMenu(
  input: DropdownMenuInput,
): Promise<DropdownMenu> {
  return apiClient.post<DropdownMenu>('/api/dropdown-menus', { body: input })
}

export function updateDropdownMenu(
  id: string,
  input: DropdownMenuUpdateInput,
): Promise<DropdownMenu> {
  return apiClient.patch<DropdownMenu>(`/api/dropdown-menus/${id}`, {
    body: input,
  })
}

export function deleteDropdownMenu(id: string): Promise<DropdownMenu> {
  return apiClient.delete<DropdownMenu>(`/api/dropdown-menus/${id}`)
}

export function getDropdownOptions(menuId: string): Promise<DropdownOption[]> {
  return apiClient.get<DropdownOption[]>(`/api/dropdown-menus/${menuId}/options`)
}

export function createDropdownOption(
  menuId: string,
  input: DropdownOptionInput,
): Promise<DropdownOption> {
  return apiClient.post<DropdownOption>(
    `/api/dropdown-menus/${menuId}/options`,
    {
      body: input,
    },
  )
}

export function updateDropdownOption(
  id: string,
  input: DropdownOptionUpdateInput,
): Promise<DropdownOption> {
  return apiClient.patch<DropdownOption>(`/api/dropdown-options/${id}`, {
    body: input,
  })
}

export function deleteDropdownOption(id: string): Promise<DropdownOption> {
  return apiClient.delete<DropdownOption>(`/api/dropdown-options/${id}`)
}
