import type { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import {
  addProfessional,
  editProfessional,
  listProfessionals,
  removeProfessional,
} from './professional.service'

function getIdParam(request: Request): string {
  const id = request.params.id

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new AppError('Identificativo professionista non valido.', 400)
  }

  return id
}

export async function getProfessionals(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listProfessionals())
}

export async function postProfessional(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addProfessional(request.body))
}

export async function patchProfessional(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await editProfessional(getIdParam(request), request.body))
}

export async function deleteProfessional(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeProfessional(getIdParam(request)))
}
