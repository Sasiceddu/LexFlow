import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  deleteProfessional,
  getProfessionals,
  patchProfessional,
  postProfessional,
} from './professional.controller'

export const professionalRouter = Router()

professionalRouter.get('/', asyncHandler(getProfessionals))
professionalRouter.post('/', asyncHandler(postProfessional))
professionalRouter.patch('/:id', asyncHandler(patchProfessional))
professionalRouter.delete('/:id', asyncHandler(deleteProfessional))
