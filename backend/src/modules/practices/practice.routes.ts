import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { getPractices, postPractice } from './practice.controller'

export const practiceRouter = Router()

practiceRouter.get('/', asyncHandler(getPractices))
practiceRouter.post('/', asyncHandler(postPractice))
