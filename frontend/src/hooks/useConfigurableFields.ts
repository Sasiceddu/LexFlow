import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createConfigurableField,
  deleteConfigurableField,
  getConfigurableFields,
  updateConfigurableField,
} from '../api/configurableFieldsApi'
import type {
  ConfigurableFieldInput,
  ConfigurableFieldUpdateInput,
} from '../types/configurableField.types'
import { configurableFieldsQueryKey } from './queryKeys'
import { instanceSettingsOverviewQueryKey } from './useInstanceSettingsOverview'

function useInvalidateConfigurableFieldQueries() {
  const queryClient = useQueryClient()

  return () => {
    void queryClient.invalidateQueries({ queryKey: configurableFieldsQueryKey })
    void queryClient.invalidateQueries({
      queryKey: instanceSettingsOverviewQueryKey,
    })
  }
}

export function useConfigurableFields() {
  return useQuery({
    queryKey: configurableFieldsQueryKey,
    queryFn: getConfigurableFields,
  })
}

export function useCreateConfigurableField() {
  const invalidateConfigurableFieldQueries =
    useInvalidateConfigurableFieldQueries()

  return useMutation({
    mutationFn: (input: ConfigurableFieldInput) =>
      createConfigurableField(input),
    onSuccess: invalidateConfigurableFieldQueries,
  })
}

export function useUpdateConfigurableField() {
  const invalidateConfigurableFieldQueries =
    useInvalidateConfigurableFieldQueries()

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string
      input: ConfigurableFieldUpdateInput
    }) => updateConfigurableField(id, input),
    onSuccess: invalidateConfigurableFieldQueries,
  })
}

export function useDeleteConfigurableField() {
  const invalidateConfigurableFieldQueries =
    useInvalidateConfigurableFieldQueries()

  return useMutation({
    mutationFn: deleteConfigurableField,
    onSuccess: invalidateConfigurableFieldQueries,
  })
}
