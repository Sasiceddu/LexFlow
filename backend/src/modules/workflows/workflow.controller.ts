import type { Request, Response } from 'express'
import {
  addPhase,
  addTransition,
  addWorkflow,
  editPhase,
  editTransition,
  editWorkflow,
  listPhases,
  listTransitions,
  listWorkflows,
  removePhase,
  removeTransition,
  removeWorkflow,
} from './workflow.service'
import { getParam } from '../../utils/requestParams'

export async function getWorkflows(
  _request: Request,
  response: Response,
): Promise<void> {
  response.json(await listWorkflows())
}

export async function postWorkflow(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(await addWorkflow(request.body))
}

export async function patchWorkflow(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await editWorkflow(getParam(request, 'id', 'Workflow'), request.body))
}

export async function deleteWorkflow(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeWorkflow(getParam(request, 'id', 'Workflow')))
}

export async function getWorkflowPhases(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await listPhases(getParam(request, 'workflowId', 'Workflow')))
}

export async function postWorkflowPhase(
  request: Request,
  response: Response,
): Promise<void> {
  response
    .status(201)
    .json(await addPhase(getParam(request, 'workflowId', 'Workflow'), request.body))
}

export async function patchWorkflowPhase(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await editPhase(getParam(request, 'id', 'Fase'), request.body))
}

export async function deleteWorkflowPhase(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removePhase(getParam(request, 'id', 'Fase')))
}

export async function getWorkflowTransitions(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await listTransitions(getParam(request, 'workflowId', 'Workflow')))
}

export async function postWorkflowTransition(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(201).json(
    await addTransition(getParam(request, 'workflowId', 'Workflow'), request.body),
  )
}

export async function patchWorkflowTransition(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(
    await editTransition(getParam(request, 'id', 'Transizione'), request.body),
  )
}

export async function deleteWorkflowTransition(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(await removeTransition(getParam(request, 'id', 'Transizione')))
}
