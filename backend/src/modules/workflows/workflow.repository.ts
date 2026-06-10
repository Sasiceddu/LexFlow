import { prisma } from '../../database/prismaClient'
import type {
  WorkflowPayload,
  WorkflowPhasePayload,
  WorkflowPhaseUpdatePayload,
  WorkflowTransitionPayload,
  WorkflowTransitionUpdatePayload,
  WorkflowUpdatePayload,
} from './workflow.types'

const phaseSelect = {
  id: true,
  workflowId: true,
  name: true,
  technicalKey: true,
  category: true,
  description: true,
  order: true,
  color: true,
  isInitial: true,
  isFinal: true,
  isActive: true,
  deletedAt: true,
} as const

const transitionSelect = {
  id: true,
  workflowId: true,
  fromPhaseId: true,
  toPhaseId: true,
  actionLabel: true,
  technicalKey: true,
  order: true,
  isActive: true,
  fromPhase: {
    select: {
      name: true,
    },
  },
  toPhase: {
    select: {
      name: true,
    },
  },
} as const

const workflowPhaseOrderBy = [{ order: 'asc' as const }, { name: 'asc' as const }]
const workflowTransitionOrderBy = [
  { order: 'asc' as const },
  { actionLabel: 'asc' as const },
]

const workflowSelect = {
  id: true,
  name: true,
  description: true,
  isDefault: true,
  isActive: true,
  phases: {
    where: {
      deletedAt: null,
      isActive: true,
    },
    orderBy: workflowPhaseOrderBy,
    select: phaseSelect,
  },
  transitions: {
    where: {
      isActive: true,
    },
    orderBy: workflowTransitionOrderBy,
    select: transitionSelect,
  },
} as const

export function findWorkflows() {
  return prisma.workflow.findMany({
    where: { isActive: true },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    select: workflowSelect,
  })
}

export function findWorkflowById(id: string) {
  return prisma.workflow.findFirst({
    where: {
      id,
      isActive: true,
    },
  })
}

export async function createWorkflow(data: WorkflowPayload) {
  const created = await prisma.workflow.create({ data })

  return prisma.workflow.findUnique({
    where: { id: created.id },
    select: workflowSelect,
  })
}

export async function updateWorkflow(id: string, data: WorkflowUpdatePayload) {
  await prisma.workflow.update({
    where: { id },
    data,
  })

  return prisma.workflow.findUnique({
    where: { id },
    select: workflowSelect,
  })
}

export async function unsetDefaultWorkflows(excludedId?: string) {
  const workflows = await prisma.workflow.findMany({
    where: excludedId ? { id: { not: excludedId } } : {},
    select: { id: true },
  })

  for (const workflow of workflows) {
    await prisma.workflow.update({
      where: { id: workflow.id },
      data: {
        isDefault: false,
      },
    })
  }
}

export async function deactivateWorkflow(id: string) {
  await prisma.workflow.update({
    where: { id },
    data: {
      isActive: false,
      isDefault: false,
    },
  })

  return prisma.workflow.findUnique({
    where: { id },
    select: workflowSelect,
  })
}

export function findWorkflowPhases(workflowId: string) {
  return prisma.workflowPhase.findMany({
    where: {
      workflowId,
      deletedAt: null,
      isActive: true,
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
    select: phaseSelect,
  })
}

export function findWorkflowPhaseById(id: string) {
  return prisma.workflowPhase.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export function findWorkflowPhaseDetailsById(id: string) {
  return prisma.workflowPhase.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: phaseSelect,
  })
}

export function findWorkflowPhaseByTechnicalKey(
  workflowId: string,
  technicalKey: string,
  excludedId?: string,
) {
  return prisma.workflowPhase.findFirst({
    where: {
      workflowId,
      technicalKey,
      deletedAt: null,
      ...(excludedId ? { id: { not: excludedId } } : {}),
    },
  })
}

export async function unsetInitialWorkflowPhases(
  workflowId: string,
  excludedId?: string,
) {
  const phases = await prisma.workflowPhase.findMany({
    where: {
      workflowId,
      deletedAt: null,
      ...(excludedId ? { id: { not: excludedId } } : {}),
    },
    select: { id: true },
  })

  for (const phase of phases) {
    await prisma.workflowPhase.update({
      where: { id: phase.id },
      data: {
        isInitial: false,
      },
    })
  }
}

export async function createWorkflowPhase(data: WorkflowPhasePayload) {
  const created = await prisma.workflowPhase.create({ data })

  return findWorkflowPhaseDetailsById(created.id)
}

export async function updateWorkflowPhase(
  id: string,
  data: WorkflowPhaseUpdatePayload,
) {
  await prisma.workflowPhase.update({
    where: { id },
    data,
  })

  return findWorkflowPhaseDetailsById(id)
}

export async function softDeleteWorkflowPhase(id: string) {
  return prisma.workflowPhase.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
    select: phaseSelect,
  })
}

export async function deactivateTransitionsForPhase(phaseId: string) {
  const transitions = await prisma.workflowTransition.findMany({
    where: {
      OR: [{ fromPhaseId: phaseId }, { toPhaseId: phaseId }],
    },
    select: { id: true },
  })

  for (const transition of transitions) {
    await prisma.workflowTransition.update({
      where: { id: transition.id },
      data: {
        isActive: false,
      },
    })
  }
}

export function findWorkflowTransitions(workflowId: string) {
  return prisma.workflowTransition.findMany({
    where: {
      workflowId,
      isActive: true,
    },
    orderBy: [{ order: 'asc' }, { actionLabel: 'asc' }],
    select: transitionSelect,
  })
}

export function findWorkflowTransitionById(id: string) {
  return prisma.workflowTransition.findFirst({
    where: {
      id,
      isActive: true,
    },
  })
}

export function findWorkflowTransitionDetailsById(id: string) {
  return prisma.workflowTransition.findFirst({
    where: { id },
    select: transitionSelect,
  })
}

export function findDuplicateWorkflowTransition(
  workflowId: string,
  fromPhaseId: string,
  toPhaseId: string,
  technicalKey: string,
  excludedId?: string,
) {
  return prisma.workflowTransition.findFirst({
    where: {
      workflowId,
      isActive: true,
      ...(excludedId ? { id: { not: excludedId } } : {}),
      OR: [
        { technicalKey },
        {
          fromPhaseId,
          toPhaseId,
        },
      ],
    },
  })
}

export async function createWorkflowTransition(data: WorkflowTransitionPayload) {
  const created = await prisma.workflowTransition.create({ data })

  return findWorkflowTransitionDetailsById(created.id)
}

export async function updateWorkflowTransition(
  id: string,
  data: WorkflowTransitionUpdatePayload,
) {
  await prisma.workflowTransition.update({
    where: { id },
    data,
  })

  return findWorkflowTransitionDetailsById(id)
}

export async function deactivateWorkflowTransition(id: string) {
  await prisma.workflowTransition.update({
    where: { id },
    data: {
      isActive: false,
    },
  })

  return findWorkflowTransitionDetailsById(id)
}
