import { prisma } from '../../database/prismaClient'

export function findCollaborators() {
  return prisma.collaborator.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ displayName: 'asc' }],
    select: {
      id: true,
      displayName: true,
      isActive: true,
    },
  })
}

export function findProfessionals() {
  return prisma.professional.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ displayName: 'asc' }],
    select: {
      id: true,
      displayName: true,
      email: true,
      isActive: true,
    },
  })
}

export function findWorkflows() {
  return prisma.workflow.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      description: true,
      isDefault: true,
    },
  })
}

export function findWorkflowPhases() {
  return prisma.workflowPhase.findMany({
    where: {
      deletedAt: null,
      isActive: true,
    },
    orderBy: [{ workflowId: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      workflowId: true,
      name: true,
      technicalKey: true,
      category: true,
      order: true,
      isInitial: true,
      isFinal: true,
    },
  })
}

export function findWorkflowTransitions() {
  return prisma.workflowTransition.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ workflowId: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      workflowId: true,
      fromPhaseId: true,
      toPhaseId: true,
      actionLabel: true,
      technicalKey: true,
      order: true,
    },
  })
}

export function findConfigurableFields() {
  return prisma.configurableField.findMany({
    where: {
      deletedAt: null,
      isActive: true,
    },
    orderBy: [{ sectionKey: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      scope: true,
      sectionKey: true,
      phaseId: true,
      label: true,
      technicalKey: true,
      fieldType: true,
      isRequired: true,
      order: true,
    },
  })
}

export function findDropdownMenus() {
  return prisma.dropdownMenu.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ name: 'asc' }],
    select: {
      id: true,
      name: true,
      technicalKey: true,
      scope: true,
      isSystem: true,
    },
  })
}

export function findDropdownOptions() {
  return prisma.dropdownOption.findMany({
    where: {
      deletedAt: null,
      isActive: true,
    },
    orderBy: [{ menuId: 'asc' }, { order: 'asc' }],
    select: {
      id: true,
      menuId: true,
      label: true,
      value: true,
      order: true,
      triggersPecBlock: true,
    },
  })
}
