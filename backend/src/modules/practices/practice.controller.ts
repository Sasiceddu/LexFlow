import type { Request, Response } from 'express'
import { listPractices } from './practice.service'

export async function getPractices(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await listPractices(request.query))
}
