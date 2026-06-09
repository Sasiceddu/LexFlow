import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { getOverview } from './instanceSettings.controller'

export const instanceSettingsRouter = Router()

instanceSettingsRouter.get('/overview', asyncHandler(getOverview))
