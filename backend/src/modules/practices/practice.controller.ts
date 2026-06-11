import type { Request, Response } from 'express'
import { addPractice, advancePractice, getPracticeById, listPractices } from './practice.service'
import { getParam } from '../../utils/requestParams'

export async function getPractices(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await listPractices(request.query))
}

export async function postPractice(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addPractice(request.body))
}

export async function getPracticeDetail(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await getPracticeById(getParam(request, 'id', 'Identificativo pratica')),
  )
}

export async function postPracticeAdvance(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await advancePractice(
      getParam(request, 'id', 'Identificativo pratica'),
      request.body,
    ),
  )
}
