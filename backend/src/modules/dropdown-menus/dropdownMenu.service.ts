import { AppError } from '../../errors/AppError'
import { ZodError } from 'zod'
import {
  dropdownMenuCreateSchema,
  dropdownMenuUpdateSchema,
  dropdownOptionCreateSchema,
  dropdownOptionUpdateSchema,
  type DropdownMenuCreateInput,
  type DropdownMenuUpdateInput,
  type DropdownOptionCreateInput,
  type DropdownOptionUpdateInput,
} from './dropdownMenu.validation'
import {
  countConfigurableFieldsUsingMenu,
  createDropdownMenu,
  createDropdownOption,
  deactivateDropdownMenu,
  findDropdownMenuById,
  findDropdownMenuByTechnicalKey,
  findDropdownMenus,
  findDropdownOptionById,
  findDropdownOptionByValue,
  findDropdownOptions,
  softDeleteDropdownOption,
  updateDropdownMenu,
  updateDropdownOption,
} from './dropdownMenu.repository'
import type {
  DropdownMenuPayload,
  DropdownMenuUpdatePayload,
  DropdownOptionPayload,
  DropdownOptionUpdatePayload,
} from './dropdownMenu.types'

function toAppError(error: unknown, fallback: string): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    return new AppError(
      error.issues.map((issue) => issue.message).join('; '),
      400,
    )
  }

  return new AppError(fallback, 400)
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function normalizeMenuKey(input: DropdownMenuCreateInput | DropdownMenuUpdateInput) {
  const source = input.technicalKey ?? input.name

  return source ? normalizeKey(source) : undefined
}

function normalizeOptionValue(
  input: DropdownOptionCreateInput | DropdownOptionUpdateInput,
) {
  const source = input.value ?? input.label

  return source ? normalizeKey(source) : undefined
}

function shouldTriggerPecBlock(label: string, value: string): boolean {
  return normalizeKey(label) === 'pec' || normalizeKey(value) === 'pec'
}

async function ensureUniqueMenuKey(technicalKey: string, excludedId?: string) {
  const existing = await findDropdownMenuByTechnicalKey(technicalKey, excludedId)

  if (existing) {
    throw new AppError('Esiste gia un menu con questo valore tecnico.', 409)
  }
}

async function ensureUniqueOptionValue(
  menuId: string,
  value: string,
  excludedId?: string,
) {
  const existing = await findDropdownOptionByValue(menuId, value, excludedId)

  if (existing) {
    throw new AppError('Esiste gia una opzione con questo valore nel menu.', 409)
  }
}

function createMenuPayload(input: DropdownMenuCreateInput): DropdownMenuPayload {
  const technicalKey = normalizeMenuKey(input)

  if (!technicalKey) {
    throw new AppError('Valore tecnico menu non valido.', 400)
  }

  return {
    name: input.name,
    technicalKey,
    scope: input.scope ?? null,
    isSystem: input.isSystem ?? false,
    isActive: input.isActive ?? true,
  }
}

function createMenuUpdatePayload(
  input: DropdownMenuUpdateInput,
): DropdownMenuUpdatePayload {
  const data: DropdownMenuUpdatePayload = {
    ...input,
  }
  const technicalKey = normalizeMenuKey(input)

  if (technicalKey) {
    data.technicalKey = technicalKey
  }

  return data
}

function createOptionPayload(
  input: DropdownOptionCreateInput,
): DropdownOptionPayload {
  const value = normalizeOptionValue(input)

  if (!value) {
    throw new AppError('Valore opzione non valido.', 400)
  }

  return {
    label: input.label,
    value,
    order: input.order ?? 0,
    triggersPecBlock:
      input.triggersPecBlock ?? shouldTriggerPecBlock(input.label, value),
    isActive: input.isActive ?? true,
  }
}

function createOptionUpdatePayload(
  current: { label: string; value: string },
  input: DropdownOptionUpdateInput,
): DropdownOptionUpdatePayload {
  const label = input.label ?? current.label
  const value = normalizeOptionValue(input) ?? current.value
  const data: DropdownOptionUpdatePayload = {
    ...input,
  }

  if (input.value !== undefined || input.label !== undefined) {
    data.value = value
  }

  if (
    input.triggersPecBlock === undefined &&
    (input.value !== undefined || input.label !== undefined) &&
    shouldTriggerPecBlock(label, value)
  ) {
    data.triggersPecBlock = true
  }

  return data
}

export function listDropdownMenus() {
  return findDropdownMenus()
}

export async function addDropdownMenu(body: unknown) {
  try {
    const input = dropdownMenuCreateSchema.parse(body)
    const data = createMenuPayload(input)

    await ensureUniqueMenuKey(data.technicalKey)

    return createDropdownMenu(data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati menu non validi')
  }
}

export async function editDropdownMenu(id: string, body: unknown) {
  const current = await findDropdownMenuById(id)

  if (!current || !current.isActive) {
    throw new AppError('Menu a tendina non trovato.', 404)
  }

  try {
    const input = dropdownMenuUpdateSchema.parse(body)
    const data = createMenuUpdatePayload(input)

    if (data.technicalKey) {
      await ensureUniqueMenuKey(data.technicalKey, id)
    }

    return updateDropdownMenu(id, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati menu non validi')
  }
}

export async function removeDropdownMenu(id: string) {
  const current = await findDropdownMenuById(id)

  if (!current || !current.isActive) {
    throw new AppError('Menu a tendina non trovato.', 404)
  }

  await countConfigurableFieldsUsingMenu(id)

  return deactivateDropdownMenu(id)
}

export async function listDropdownOptions(menuId: string) {
  const menu = await findDropdownMenuById(menuId)

  if (!menu || !menu.isActive) {
    throw new AppError('Menu a tendina non trovato.', 404)
  }

  return findDropdownOptions(menuId)
}

export async function addDropdownOption(menuId: string, body: unknown) {
  const menu = await findDropdownMenuById(menuId)

  if (!menu || !menu.isActive) {
    throw new AppError('Menu a tendina non trovato.', 404)
  }

  try {
    const input = dropdownOptionCreateSchema.parse(body)
    const data = createOptionPayload(input)

    await ensureUniqueOptionValue(menuId, data.value)

    return createDropdownOption(menuId, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati opzione non validi')
  }
}

export async function editDropdownOption(id: string, body: unknown) {
  const current = await findDropdownOptionById(id)

  if (!current) {
    throw new AppError('Opzione menu non trovata.', 404)
  }

  try {
    const input = dropdownOptionUpdateSchema.parse(body)
    const data = createOptionUpdatePayload(current, input)

    if (data.value) {
      await ensureUniqueOptionValue(current.menuId, data.value, id)
    }

    return updateDropdownOption(id, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati opzione non validi')
  }
}

export async function removeDropdownOption(id: string) {
  const current = await findDropdownOptionById(id)

  if (!current) {
    throw new AppError('Opzione menu non trovata.', 404)
  }

  return softDeleteDropdownOption(id)
}
