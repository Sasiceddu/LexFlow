import type { Request, Response } from 'express'
import { getInstanceSettingsOverview } from './instanceSettings.service'

export async function getOverview(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await getInstanceSettingsOverview())
}
