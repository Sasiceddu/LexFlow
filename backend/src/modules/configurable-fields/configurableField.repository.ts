import { prisma } from '../../database/prismaClient'
import type {
  ConfigurableFieldPayload,
  ConfigurableFieldUpdatePayload,
} from './configurableField.types'

const configurableFieldSelect = {
  id: true,
  scope: true,
  sectionKey: true,
  phaseId: true,
  label: true,
  technicalKey: true,
  fieldType: true,
  isRequired: true,
  showInTable: true,
  useInFilters: true,
  includeInExport: true,
  order: true,
  dropdownMenuId: true,
  isActive: true,
  phase: {
    select: {
      id: true,
      name: true,
    },
  },
  dropdownMenu: {
    select: {
      id: true,
      name: true,
    },
  },
} as const

export function findConfigurableFields() {
  return prisma.configurableField.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ sectionKey: 'asc' }, { order: 'asc' }, { label: 'asc' }],
    select: configurableFieldSelect,
  })
}

export function findConfigurableFieldById(id: string) {
  return prisma.configurableField.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  })
}

export function findConfigurableFieldDetailsById(id: string) {
  return prisma.configurableField.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: configurableFieldSelect,
  })
}

export function findConfigurableFieldByTechnicalKey(
  scope: ConfigurableFieldPayload['scope'],
  sectionKey: string,
  technicalKey: string,
  excludedId?: string,
) {
  return prisma.configurableField.findFirst({
    where: {
      scope,
      sectionKey,
      technicalKey,
      deletedAt: null,
      id: excludedId ? { not: excludedId } : undefined,
    },
  })
}

export function findWorkflowPhaseById(id: string) {
  return prisma.workflowPhase.findFirst({
    where: {
      id,
      deletedAt: null,
      isActive: true,
    },
  })
}

export function findDropdownMenuById(id: string) {
  return prisma.dropdownMenu.findFirst({
    where: {
      id,
      isActive: true,
    },
  })
}

export async function createConfigurableField(data: ConfigurableFieldPayload) {
  const created = await prisma.configurableField.create({
    data,
  })

  return findConfigurableFieldDetailsById(created.id)
}

export async function updateConfigurableField(
  id: string,
  data: ConfigurableFieldUpdatePayload,
) {
  await prisma.configurableField.update({
    where: {
      id,
    },
    data,
  })

  return findConfigurableFieldDetailsById(id)
}

export async function softDeleteConfigurableField(id: string) {
  await prisma.configurableField.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
      isActive: false,
    },
  })

  return findConfigurableFieldDetailsById(id)
}
