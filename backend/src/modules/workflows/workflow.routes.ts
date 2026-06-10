import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import {
  deleteWorkflow,
  deleteWorkflowPhase,
  deleteWorkflowTransition,
  getWorkflowPhases,
  getWorkflowTransitions,
  getWorkflows,
  patchWorkflow,
  patchWorkflowPhase,
  patchWorkflowTransition,
  postWorkflow,
  postWorkflowPhase,
  postWorkflowTransition,
} from './workflow.controller'

export const workflowRouter = Router()
export const workflowPhaseRouter = Router()
export const workflowTransitionRouter = Router()

workflowRouter.get('/', asyncHandler(getWorkflows))
workflowRouter.post('/', asyncHandler(postWorkflow))
workflowRouter.get('/:workflowId/phases', asyncHandler(getWorkflowPhases))
workflowRouter.post('/:workflowId/phases', asyncHandler(postWorkflowPhase))
workflowRouter.get(
  '/:workflowId/transitions',
  asyncHandler(getWorkflowTransitions),
)
workflowRouter.post(
  '/:workflowId/transitions',
  asyncHandler(postWorkflowTransition),
)
workflowRouter.patch('/:id', asyncHandler(patchWorkflow))
workflowRouter.delete('/:id', asyncHandler(deleteWorkflow))

workflowPhaseRouter.patch('/:id', asyncHandler(patchWorkflowPhase))
workflowPhaseRouter.delete('/:id', asyncHandler(deleteWorkflowPhase))

workflowTransitionRouter.patch('/:id', asyncHandler(patchWorkflowTransition))
workflowTransitionRouter.delete('/:id', asyncHandler(deleteWorkflowTransition))
