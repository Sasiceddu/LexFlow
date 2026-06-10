import type { Request, Response } from 'express'
import { addPractice, listPractices } from './practice.service'

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
