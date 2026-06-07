import type { Request, Response } from 'express'
import { getHealthStatus } from './health.service'

export async function getHealth(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await getHealthStatus())
}
