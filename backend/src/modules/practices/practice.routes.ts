import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { getPracticeDetail, getPractices, postPractice } from './practice.controller'

export const practiceRouter = Router()

practiceRouter.get('/', asyncHandler(getPractices))
practiceRouter.post('/', asyncHandler(postPractice))
practiceRouter.get('/:id', asyncHandler(getPracticeDetail))
