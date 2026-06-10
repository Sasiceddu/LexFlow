import { prisma } from '../../database/prismaClient'
import type { PracticeListFilters, PracticeListItem } from './practice.types'

type PracticeWhereInput = NonNullable<
  Parameters<typeof prisma.practice.findMany>[0]
>['where']

const practiceListSelect = {
  activityType: true,
  code: true,
  collaborator: {
    select: {
      displayName: true,
    },
  },
  createdAt: true,
  currentPhase: {
    select: {
      name: true,
    },
  },
  depositDate: true,
  grantedAmount: true,
  hearingDate: true,
  id: true,
  invoicedAmount: true,
  liquidatedAmount: true,
  name: true,
  professional: {
    select: {
      displayName: true,
    },
  },
  requestedAmount: true,
  updatedAt: true,
  workflow: {
    select: {
      name: true,
    },
  },
} as const

function toDecimalString(value: { toString: () => string } | null): string | null {
  return value ? value.toString() : null
}

function buildPracticeWhere(filters: PracticeListFilters): PracticeWhereInput {
  return {
    deletedAt: null,
    ...(filters.phaseId ? { currentPhaseId: filters.phaseId } : {}),
    ...(filters.collaboratorId
      ? { collaboratorId: filters.collaboratorId }
      : {}),
    ...(filters.professionalId
      ? { professionalId: filters.professionalId }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { code: { contains: filters.search } },
            { name: { contains: filters.search } },
          ],
        }
      : {}),
  }
}

export async function countPractices(filters: PracticeListFilters) {
  return prisma.practice.count({
    where: buildPracticeWhere(filters),
  })
}

export async function findPractices(
  filters: PracticeListFilters,
): Promise<PracticeListItem[]> {
  const practices = await prisma.practice.findMany({
    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    select: practiceListSelect,
    skip: (filters.page - 1) * filters.pageSize,
    take: filters.pageSize,
    where: buildPracticeWhere(filters),
  })

  return practices.map((practice) => ({
    activityType: practice.activityType,
    code: practice.code,
    collaboratorName: practice.collaborator?.displayName ?? null,
    createdAt: practice.createdAt,
    currentPhaseName: practice.currentPhase.name,
    depositDate: practice.depositDate,
    grantedAmount: toDecimalString(practice.grantedAmount),
    hearingDate: practice.hearingDate,
    id: practice.id,
    invoicedAmount: toDecimalString(practice.invoicedAmount),
    liquidatedAmount: toDecimalString(practice.liquidatedAmount),
    name: practice.name,
    professionalName: practice.professional?.displayName ?? null,
    requestedAmount: toDecimalString(practice.requestedAmount),
    updatedAt: practice.updatedAt,
    workflowName: practice.workflow.name,
  }))
}
