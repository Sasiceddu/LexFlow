import { AppError } from '../../errors/AppError'
import {
  configurableFieldCreateSchema,
  configurableFieldUpdateSchema,
  type ConfigurableFieldCreateInput,
  type ConfigurableFieldUpdateInput,
} from './configurableField.validation'
import {
  createConfigurableField,
  findConfigurableFieldById,
  findConfigurableFieldByTechnicalKey,
  findConfigurableFields,
  findDropdownMenuById,
  findWorkflowPhaseById,
  softDeleteConfigurableField,
  updateConfigurableField,
} from './configurableField.repository'
import type {
  ConfigurableFieldPayload,
  ConfigurableFieldUpdatePayload,
} from './configurableField.types'
import { toAppError } from '../../utils/appError'
import { normalizeTechnicalKey } from '../../utils/normalizeKey'

type CurrentConfigurableField = {
  dropdownMenuId: string | null
  fieldType: ConfigurableFieldPayload['fieldType']
  label: string
  phaseId: string | null
  scope: ConfigurableFieldPayload['scope']
  sectionKey: string
  technicalKey: string
}

async function ensureUniqueTechnicalKey(
  scope: ConfigurableFieldPayload['scope'],
  sectionKey: string,
  technicalKey: string,
  excludedId?: string,
) {
  const existing = await findConfigurableFieldByTechnicalKey(
    scope,
    sectionKey,
    technicalKey,
    excludedId,
  )

  if (existing) {
    throw new AppError(
      'Esiste gia un campo con questo valore tecnico nella sezione.',
      409,
    )
  }
}

async function validateRelations(data: {
  dropdownMenuId?: string | null
  fieldType: ConfigurableFieldPayload['fieldType']
  phaseId?: string | null
  scope: ConfigurableFieldPayload['scope']
}) {
  if (data.scope === 'PHASE') {
    if (!data.phaseId) {
      throw new AppError('La fase e obbligatoria per i campi PHASE.', 400)
    }

    const phase = await findWorkflowPhaseById(data.phaseId)

    if (!phase) {
      throw new AppError('Fase non trovata.', 404)
    }
  }

  if (data.fieldType === 'DROPDOWN') {
    if (!data.dropdownMenuId) {
      throw new AppError(
        'Il menu a tendina e obbligatorio per i campi DROPDOWN.',
        400,
      )
    }

    const menu = await findDropdownMenuById(data.dropdownMenuId)

    if (!menu) {
      throw new AppError('Menu a tendina non trovato.', 404)
    }
  }
}

function createPayload(
  input: ConfigurableFieldCreateInput,
): ConfigurableFieldPayload {
  return {
    label: input.label,
    technicalKey: normalizeTechnicalKey(input.label, input.technicalKey),
    scope: input.scope,
    sectionKey: input.sectionKey,
    phaseId: input.scope === 'PHASE' ? input.phaseId ?? null : null,
    fieldType: input.fieldType,
    dropdownMenuId:
      input.fieldType === 'DROPDOWN' ? input.dropdownMenuId ?? null : null,
    isRequired: input.isRequired ?? false,
    showInTable: input.showInTable ?? false,
    useInFilters: input.useInFilters ?? false,
    includeInExport: input.includeInExport ?? false,
    order: input.order,
    isActive: input.isActive ?? true,
  }
}

function createUpdatePayload(
  current: CurrentConfigurableField,
  input: ConfigurableFieldUpdateInput,
): ConfigurableFieldUpdatePayload {
  const label = input.label ?? current.label
  const scope = input.scope ?? current.scope
  const fieldType = input.fieldType ?? current.fieldType
  const data: ConfigurableFieldUpdatePayload = {
    ...input,
  }

  if (input.label !== undefined || input.technicalKey !== undefined) {
    data.technicalKey = normalizeTechnicalKey(label, input.technicalKey)
  }

  if (scope === 'GENERAL') {
    data.phaseId = null
  } else if (input.phaseId !== undefined) {
    data.phaseId = input.phaseId
  }

  if (fieldType !== 'DROPDOWN') {
    data.dropdownMenuId = null
  } else if (input.dropdownMenuId !== undefined) {
    data.dropdownMenuId = input.dropdownMenuId
  }

  return data
}

export function listConfigurableFields() {
  return findConfigurableFields()
}

export async function addConfigurableField(body: unknown) {
  try {
    const input = configurableFieldCreateSchema.parse(body)
    const data = createPayload(input)

    await validateRelations(data)
    await ensureUniqueTechnicalKey(
      data.scope,
      data.sectionKey,
      data.technicalKey,
    )

    return await createConfigurableField(data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati campo configurabile non validi')
  }
}

export async function editConfigurableField(id: string, body: unknown) {
  const current = await findConfigurableFieldById(id)

  if (!current) {
    throw new AppError('Campo configurabile non trovato.', 404)
  }

  try {
    const input = configurableFieldUpdateSchema.parse(body)
    const data = createUpdatePayload(current, input)
    const next = {
      dropdownMenuId:
        data.dropdownMenuId !== undefined
          ? data.dropdownMenuId
          : current.dropdownMenuId,
      fieldType: data.fieldType ?? current.fieldType,
      phaseId: data.phaseId !== undefined ? data.phaseId : current.phaseId,
      scope: data.scope ?? current.scope,
    }
    const nextSectionKey = data.sectionKey ?? current.sectionKey
    const nextTechnicalKey = data.technicalKey ?? current.technicalKey

    await validateRelations(next)
    await ensureUniqueTechnicalKey(
      next.scope,
      nextSectionKey,
      nextTechnicalKey,
      id,
    )

    return await updateConfigurableField(id, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati campo configurabile non validi')
  }
}

export async function removeConfigurableField(id: string) {
  const current = await findConfigurableFieldById(id)

  if (!current) {
    throw new AppError('Campo configurabile non trovato.', 404)
  }

  return await softDeleteConfigurableField(id)
}
