import { AppError } from '../../errors/AppError'
import {
  professionalCreateSchema,
  professionalUpdateSchema,
  type ProfessionalCreateInput,
  type ProfessionalUpdateInput,
} from './professional.validation'
import {
  createProfessional,
  findProfessionalByDisplayName,
  findProfessionalById,
  findProfessionals,
  softDeleteProfessional,
  updateProfessional,
} from './professional.repository'
import type {
  ProfessionalListItem,
  ProfessionalPayload,
  ProfessionalUpdatePayload,
} from './professional.types'
import { toAppError } from '../../utils/appError'
import { normalizeDisplayName } from '../../utils/normalizeDisplayName'

function normalizeOptional(value: string | null | undefined): string | null {
  const normalized = value?.trim()

  return normalized && normalized.length > 0 ? normalized : null
}

async function ensureUniqueDisplayName(displayName: string, excludedId?: string) {
  const existing = await findProfessionalByDisplayName(displayName, excludedId)

  if (existing) {
    throw new AppError('Esiste gia un professionista con questo nome.', 409)
  }
}

function createPayload(input: ProfessionalCreateInput): Required<ProfessionalPayload> {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    displayName: normalizeDisplayName(
      input.firstName,
      input.lastName,
      input.displayName,
    ),
    email: normalizeOptional(input.email),
    phone: input.phone ?? null,
    notes: input.notes ?? null,
    isActive: input.isActive ?? true,
  }
}

function createUpdatePayload(
  current: { firstName: string; lastName: string },
  input: ProfessionalUpdateInput,
): ProfessionalUpdatePayload {
  const firstName = input.firstName ?? current.firstName
  const lastName = input.lastName ?? current.lastName
  const data: ProfessionalUpdatePayload = {
    ...input,
  }

  if (input.firstName || input.lastName || input.displayName !== undefined) {
    data.displayName = normalizeDisplayName(firstName, lastName, input.displayName)
  }

  if (input.email !== undefined) {
    data.email = normalizeOptional(input.email)
  }

  return data
}

export function listProfessionals(): Promise<ProfessionalListItem[]> {
  return findProfessionals()
}

export async function addProfessional(body: unknown) {
  try {
    const input = professionalCreateSchema.parse(body)
    const data = createPayload(input)

    await ensureUniqueDisplayName(data.displayName)

    return createProfessional(data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati professionista non validi')
  }
}

export async function editProfessional(id: string, body: unknown) {
  const current = await findProfessionalById(id)

  if (!current) {
    throw new AppError('Professionista non trovato.', 404)
  }

  try {
    const input = professionalUpdateSchema.parse(body)
    const data = createUpdatePayload(current, input)

    if (data.displayName) {
      await ensureUniqueDisplayName(data.displayName, id)
    }

    return updateProfessional(id, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati professionista non validi')
  }
}

export async function removeProfessional(id: string) {
  const current = await findProfessionalById(id)

  if (!current) {
    throw new AppError('Professionista non trovato.', 404)
  }

  return softDeleteProfessional(id)
}
