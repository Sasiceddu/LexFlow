import type { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import {
  addCollaborator,
  editCollaborator,
  listCollaborators,
  removeCollaborator,
} from './collaborator.service'

function getIdParam(request: Request): string {
  const id = request.params.id

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new AppError('Identificativo collaboratore non valido.', 400)
  }

  return id
}

export async function getCollaborators(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listCollaborators())
}

export async function postCollaborator(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addCollaborator(request.body))
}

export async function patchCollaborator(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await editCollaborator(getIdParam(request), request.body))
}

export async function deleteCollaborator(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeCollaborator(getIdParam(request)))
}
