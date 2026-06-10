import { AppError } from '../../errors/AppError'
import { ZodError } from 'zod'
import {
  workflowCreateSchema,
  workflowPhaseCreateSchema,
  workflowPhaseUpdateSchema,
  workflowTransitionCreateSchema,
  workflowTransitionUpdateSchema,
  workflowUpdateSchema,
  type WorkflowCreateInput,
  type WorkflowPhaseCreateInput,
  type WorkflowPhaseUpdateInput,
  type WorkflowTransitionCreateInput,
  type WorkflowTransitionUpdateInput,
} from './workflow.validation'
import {
  createWorkflow,
  createWorkflowPhase,
  createWorkflowTransition,
  deactivateTransitionsForPhase,
  deactivateWorkflow,
  deactivateWorkflowTransition,
  findDuplicateWorkflowTransition,
  findWorkflowById,
  findWorkflowPhaseById,
  findWorkflowPhaseByTechnicalKey,
  findWorkflowPhases,
  findWorkflowTransitionById,
  findWorkflowTransitions,
  findWorkflows,
  softDeleteWorkflowPhase,
  unsetDefaultWorkflows,
  unsetInitialWorkflowPhases,
  updateWorkflow,
  updateWorkflowPhase,
  updateWorkflowTransition,
} from './workflow.repository'
import type {
  WorkflowPayload,
  WorkflowPhasePayload,
  WorkflowPhaseUpdatePayload,
  WorkflowTransitionPayload,
  WorkflowTransitionUpdatePayload,
} from './workflow.types'

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof ZodError) {
    return new AppError(
      error.issues.map((issue) => issue.message).join('; '),
      400,
    )
  }

  return new AppError('Dati workflow non validi', 400)
}

function normalizeKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function normalizeTechnicalKey(label: string, technicalKey?: string): string {
  const normalized = technicalKey?.trim()

  return normalized && normalized.length > 0
    ? normalizeKey(normalized)
    : normalizeKey(label)
}

async function assertWorkflowExists(workflowId: string) {
  const workflow = await findWorkflowById(workflowId)

  if (!workflow) {
    throw new AppError('Workflow non trovato.', 404)
  }

  return workflow
}

async function ensureUniquePhaseKey(
  workflowId: string,
  technicalKey: string,
  excludedId?: string,
) {
  const existing = await findWorkflowPhaseByTechnicalKey(
    workflowId,
    technicalKey,
    excludedId,
  )

  if (existing) {
    throw new AppError('Esiste gia una fase con questo valore tecnico.', 409)
  }
}

async function assertTransitionPhases(
  workflowId: string,
  fromPhaseId: string,
  toPhaseId: string,
) {
  if (fromPhaseId === toPhaseId) {
    throw new AppError('La transizione non puo collegare una fase a se stessa.', 400)
  }

  const fromPhase = await findWorkflowPhaseById(fromPhaseId)
  const toPhase = await findWorkflowPhaseById(toPhaseId)

  if (!fromPhase || !toPhase) {
    throw new AppError('Fase di partenza o arrivo non trovata.', 404)
  }

  if (fromPhase.workflowId !== workflowId || toPhase.workflowId !== workflowId) {
    throw new AppError('Le fasi devono appartenere allo stesso workflow.', 400)
  }
}

async function ensureUniqueTransition(
  workflowId: string,
  fromPhaseId: string,
  toPhaseId: string,
  technicalKey: string,
  excludedId?: string,
) {
  const existing = await findDuplicateWorkflowTransition(
    workflowId,
    fromPhaseId,
    toPhaseId,
    technicalKey,
    excludedId,
  )

  if (existing) {
    throw new AppError('Esiste gia una transizione equivalente.', 409)
  }
}

function createWorkflowPayload(input: WorkflowCreateInput): WorkflowPayload {
  return {
    name: input.name,
    description: input.description ?? null,
    isDefault: input.isDefault ?? false,
    isActive: input.isActive ?? true,
  }
}

function createPhasePayload(
  workflowId: string,
  input: WorkflowPhaseCreateInput,
): WorkflowPhasePayload {
  return {
    workflowId,
    name: input.name,
    technicalKey: normalizeTechnicalKey(input.name, input.technicalKey),
    category: input.category,
    description: input.description ?? null,
    order: input.order,
    color: input.color ?? null,
    isInitial: input.isInitial ?? false,
    isFinal: input.isFinal ?? false,
    isActive: input.isActive ?? true,
  }
}

function createPhaseUpdatePayload(
  current: { name: string },
  input: WorkflowPhaseUpdateInput,
): WorkflowPhaseUpdatePayload {
  const data: WorkflowPhaseUpdatePayload = { ...input }

  if (input.name !== undefined || input.technicalKey !== undefined) {
    data.technicalKey = normalizeTechnicalKey(
      input.name ?? current.name,
      input.technicalKey,
    )
  }

  return data
}

function createTransitionPayload(
  workflowId: string,
  input: WorkflowTransitionCreateInput,
): WorkflowTransitionPayload {
  return {
    workflowId,
    fromPhaseId: input.fromPhaseId,
    toPhaseId: input.toPhaseId,
    actionLabel: input.actionLabel,
    technicalKey: normalizeTechnicalKey(input.actionLabel, input.technicalKey),
    order: input.order,
    isActive: input.isActive ?? true,
  }
}

function createTransitionUpdatePayload(
  current: { actionLabel: string },
  input: WorkflowTransitionUpdateInput,
): WorkflowTransitionUpdatePayload {
  const data: WorkflowTransitionUpdatePayload = { ...input }

  if (input.actionLabel !== undefined || input.technicalKey !== undefined) {
    data.technicalKey = normalizeTechnicalKey(
      input.actionLabel ?? current.actionLabel,
      input.technicalKey,
    )
  }

  return data
}

export function listWorkflows() {
  return findWorkflows()
}

export async function addWorkflow(body: unknown) {
  try {
    const input = workflowCreateSchema.parse(body)
    const data = createWorkflowPayload(input)

    if (data.isDefault) {
      await unsetDefaultWorkflows()
    }

    return await createWorkflow(data)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function editWorkflow(id: string, body: unknown) {
  await assertWorkflowExists(id)

  try {
    const input = workflowUpdateSchema.parse(body)

    if (input.isDefault) {
      await unsetDefaultWorkflows(id)
    }

    return await updateWorkflow(id, input)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function removeWorkflow(id: string) {
  await assertWorkflowExists(id)

  return deactivateWorkflow(id)
}

export async function listPhases(workflowId: string) {
  await assertWorkflowExists(workflowId)

  return findWorkflowPhases(workflowId)
}

export async function addPhase(workflowId: string, body: unknown) {
  await assertWorkflowExists(workflowId)

  try {
    const input = workflowPhaseCreateSchema.parse(body)
    const data = createPhasePayload(workflowId, input)

    await ensureUniquePhaseKey(workflowId, data.technicalKey)

    if (data.isInitial) {
      await unsetInitialWorkflowPhases(workflowId)
    }

    return await createWorkflowPhase(data)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function editPhase(id: string, body: unknown) {
  const current = await findWorkflowPhaseById(id)

  if (!current) {
    throw new AppError('Fase workflow non trovata.', 404)
  }

  try {
    const input = workflowPhaseUpdateSchema.parse(body)
    const data = createPhaseUpdatePayload(current, input)

    if (data.technicalKey) {
      await ensureUniquePhaseKey(current.workflowId, data.technicalKey, id)
    }

    if (data.isInitial) {
      await unsetInitialWorkflowPhases(current.workflowId, id)
    }

    return await updateWorkflowPhase(id, data)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function removePhase(id: string) {
  const current = await findWorkflowPhaseById(id)

  if (!current) {
    throw new AppError('Fase workflow non trovata.', 404)
  }

  await deactivateTransitionsForPhase(id)

  return softDeleteWorkflowPhase(id)
}

export async function listTransitions(workflowId: string) {
  await assertWorkflowExists(workflowId)

  return findWorkflowTransitions(workflowId)
}

export async function addTransition(workflowId: string, body: unknown) {
  await assertWorkflowExists(workflowId)

  try {
    const input = workflowTransitionCreateSchema.parse(body)
    const data = createTransitionPayload(workflowId, input)

    await assertTransitionPhases(workflowId, data.fromPhaseId, data.toPhaseId)
    await ensureUniqueTransition(
      workflowId,
      data.fromPhaseId,
      data.toPhaseId,
      data.technicalKey,
    )

    return await createWorkflowTransition(data)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function editTransition(id: string, body: unknown) {
  const current = await findWorkflowTransitionById(id)

  if (!current) {
    throw new AppError('Transizione workflow non trovata.', 404)
  }

  try {
    const input = workflowTransitionUpdateSchema.parse(body)
    const data = createTransitionUpdatePayload(current, input)
    const fromPhaseId = data.fromPhaseId ?? current.fromPhaseId
    const toPhaseId = data.toPhaseId ?? current.toPhaseId
    const technicalKey = data.technicalKey ?? current.technicalKey

    await assertTransitionPhases(current.workflowId, fromPhaseId, toPhaseId)
    await ensureUniqueTransition(
      current.workflowId,
      fromPhaseId,
      toPhaseId,
      technicalKey,
      id,
    )

    return await updateWorkflowTransition(id, data)
  } catch (error: unknown) {
    throw toAppError(error)
  }
}

export async function removeTransition(id: string) {
  const current = await findWorkflowTransitionById(id)

  if (!current) {
    throw new AppError('Transizione workflow non trovata.', 404)
  }

  return deactivateWorkflowTransition(id)
}
