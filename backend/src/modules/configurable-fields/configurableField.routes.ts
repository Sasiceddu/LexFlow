import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  deleteConfigurableField,
  getConfigurableFields,
  patchConfigurableField,
  postConfigurableField,
} from './configurableField.controller'

export const configurableFieldRouter = Router()

configurableFieldRouter.get('/', asyncHandler(getConfigurableFields))
configurableFieldRouter.post('/', asyncHandler(postConfigurableField))
configurableFieldRouter.patch('/:id', asyncHandler(patchConfigurableField))
configurableFieldRouter.delete('/:id', asyncHandler(deleteConfigurableField))
