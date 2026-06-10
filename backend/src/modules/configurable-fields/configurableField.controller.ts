import type { Request, Response } from 'express'
import { AppError } from '../../errors/AppError'
import {
  addConfigurableField,
  editConfigurableField,
  listConfigurableFields,
  removeConfigurableField,
} from './configurableField.service'

function getIdParam(request: Request): string {
  const id = request.params.id

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new AppError('Identificativo campo non valido.', 400)
  }

  return id
}

export async function getConfigurableFields(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listConfigurableFields())
}

export async function postConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addConfigurableField(request.body))
}

export async function patchConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await editConfigurableField(getIdParam(request), request.body))
}

export async function deleteConfigurableField(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeConfigurableField(getIdParam(request)))
}
