import { AppError } from '../../errors/AppError'
import {
  collaboratorCreateSchema,
  collaboratorUpdateSchema,
  type CollaboratorCreateInput,
  type CollaboratorUpdateInput,
} from './collaborator.validation'
import {
  createCollaborator,
  findCollaboratorByDisplayName,
  findCollaboratorById,
  findCollaborators,
  softDeleteCollaborator,
  updateCollaborator,
} from './collaborator.repository'
import type {
  CollaboratorListItem,
  CollaboratorPayload,
  CollaboratorUpdatePayload,
} from './collaborator.types'
import { toAppError } from '../../utils/appError'
import { normalizeDisplayName } from '../../utils/normalizeDisplayName'

async function ensureUniqueDisplayName(displayName: string, excludedId?: string) {
  const existing = await findCollaboratorByDisplayName(displayName, excludedId)

  if (existing) {
    throw new AppError('Esiste gia un collaboratore con questo nome.', 409)
  }
}

function createPayload(input: CollaboratorCreateInput): Required<CollaboratorPayload> {
  return {
    firstName: input.firstName,
    lastName: input.lastName,
    displayName: normalizeDisplayName(
      input.firstName,
      input.lastName,
      input.displayName,
    ),
    notes: input.notes ?? null,
    isActive: input.isActive ?? true,
  }
}

function createUpdatePayload(
  current: { firstName: string; lastName: string },
  input: CollaboratorUpdateInput,
): CollaboratorUpdatePayload {
  const firstName = input.firstName ?? current.firstName
  const lastName = input.lastName ?? current.lastName
  const data: CollaboratorUpdatePayload = {
    ...input,
  }

  if (input.firstName || input.lastName || input.displayName !== undefined) {
    data.displayName = normalizeDisplayName(firstName, lastName, input.displayName)
  }

  return data
}

export function listCollaborators(): Promise<CollaboratorListItem[]> {
  return findCollaborators()
}

export async function addCollaborator(body: unknown) {
  try {
    const input = collaboratorCreateSchema.parse(body)
    const data = createPayload(input)

    await ensureUniqueDisplayName(data.displayName)

    return createCollaborator(data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati collaboratore non validi')
  }
}

export async function editCollaborator(id: string, body: unknown) {
  const current = await findCollaboratorById(id)

  if (!current) {
    throw new AppError('Collaboratore non trovato.', 404)
  }

  try {
    const input = collaboratorUpdateSchema.parse(body)
    const data = createUpdatePayload(current, input)

    if (data.displayName) {
      await ensureUniqueDisplayName(data.displayName, id)
    }

    return updateCollaborator(id, data)
  } catch (error: unknown) {
    throw toAppError(error, 'Dati collaboratore non validi')
  }
}

export async function removeCollaborator(id: string) {
  const current = await findCollaboratorById(id)

  if (!current) {
    throw new AppError('Collaboratore non trovato.', 404)
  }

  return softDeleteCollaborator(id)
}
