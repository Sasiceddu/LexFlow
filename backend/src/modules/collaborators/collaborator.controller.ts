import type { Request, Response } from 'express'
import {
  addCollaborator,
  editCollaborator,
  listCollaborators,
  removeCollaborator,
} from './collaborator.service'
import { getParam } from '../../utils/requestParams'

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
  response.json(
    await editCollaborator(
      getParam(request, 'id', 'Identificativo collaboratore'),
      request.body,
    ),
  )
}

export async function deleteCollaborator(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await removeCollaborator(getParam(request, 'id', 'Identificativo collaboratore')),
  )
}
