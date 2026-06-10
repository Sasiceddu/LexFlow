import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDropdownMenu,
  createDropdownOption,
  deleteDropdownMenu,
  deleteDropdownOption,
  getDropdownMenus,
  updateDropdownMenu,
  updateDropdownOption,
} from '../api/dropdownMenusApi'
import type {
  DropdownMenuInput,
  DropdownMenuUpdateInput,
  DropdownOptionInput,
  DropdownOptionUpdateInput,
} from '../types/dropdownMenu.types'
import { dropdownMenusQueryKey } from './queryKeys'
import { instanceSettingsOverviewQueryKey } from './useInstanceSettingsOverview'

function useInvalidateDropdownQueries() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: dropdownMenusQueryKey })
    void queryClient.invalidateQueries({
      queryKey: instanceSettingsOverviewQueryKey,
    })
  }
}

export function useDropdownMenus() {
  return useQuery({
    queryKey: dropdownMenusQueryKey,
    queryFn: getDropdownMenus,
  })
}

export function useCreateDropdownMenu() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: (input: DropdownMenuInput) => createDropdownMenu(input),
    onSuccess: invalidateDropdownQueries,
  })
}

export function useUpdateDropdownMenu() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: DropdownMenuUpdateInput
    }) => updateDropdownMenu(id, input),
    onSuccess: invalidateDropdownQueries,
  })
}

export function useDeleteDropdownMenu() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: deleteDropdownMenu,
    onSuccess: invalidateDropdownQueries,
  })
}

export function useCreateDropdownOption() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: ({
      menuId,
      input,
    }: {
      input: DropdownOptionInput
      menuId: string
    }) => createDropdownOption(menuId, input),
    onSuccess: invalidateDropdownQueries,
  })
}

export function useUpdateDropdownOption() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: DropdownOptionUpdateInput
    }) => updateDropdownOption(id, input),
    onSuccess: invalidateDropdownQueries,
  })
}

export function useDeleteDropdownOption() {
  const invalidateDropdownQueries = useInvalidateDropdownQueries()

  return useMutation({
    mutationFn: deleteDropdownOption,
    onSuccess: invalidateDropdownQueries,
  })
}
