import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  deleteCollaborator,
  getCollaborators,
  patchCollaborator,
  postCollaborator,
} from './collaborator.controller'

export const collaboratorRouter = Router()

collaboratorRouter.get('/', asyncHandler(getCollaborators))
collaboratorRouter.post('/', asyncHandler(postCollaborator))
collaboratorRouter.patch('/:id', asyncHandler(patchCollaborator))
collaboratorRouter.delete('/:id', asyncHandler(deleteCollaborator))
