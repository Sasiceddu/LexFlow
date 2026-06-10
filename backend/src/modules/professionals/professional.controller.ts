import type { Request, Response } from 'express'
import {
  addProfessional,
  editProfessional,
  listProfessionals,
  removeProfessional,
} from './professional.service'
import { getParam } from '../../utils/requestParams'

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
  response.json(
    await editProfessional(
      getParam(request, 'id', 'Identificativo professionista'),
      request.body,
    ),
  )
}

export async function deleteProfessional(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await removeProfessional(getParam(request, 'id', 'Identificativo professionista')),
  )
}
