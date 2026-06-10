import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { getPractices } from './practice.controller'

export const practiceRouter = Router()

practiceRouter.get('/', asyncHandler(getPractices))
