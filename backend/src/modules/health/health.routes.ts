import { Router } from 'express'
import { getHealth } from './health.controller'
import { asyncHandler } from '../../utils/asyncHandler'

export const healthRouter = Router()

healthRouter.get('/health', asyncHandler(getHealth))
