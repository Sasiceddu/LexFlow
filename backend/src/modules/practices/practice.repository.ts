import { prisma } from '../../database/prismaClient'
import type {
  PracticeCreatedHistoryData,
  PracticeCreateData,
  PracticeListFilters,
  PracticeListItem,
} from './practice.types'

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

  return practices.map(mapPracticeListItem)
}

export function findCollaboratorById(id: string) {
  return prisma.collaborator.findFirst({
    where: {
      deletedAt: null,
      id,
    },
    select: {
      displayName: true,
      id: true,
    },
  })
}

export function findProfessionalById(id: string) {
  return prisma.professional.findFirst({
    where: {
      deletedAt: null,
      id,
    },
    select: {
      displayName: true,
      id: true,
    },
  })
}

export function findDefaultWorkflowWithInitialPhase() {
  return prisma.workflow.findFirst({
    where: {
      isActive: true,
      isDefault: true,
    },
    orderBy: {
      name: 'asc',
    },
    select: {
      id: true,
      name: true,
      phases: {
        where: {
          deletedAt: null,
          isActive: true,
          isInitial: true,
        },
        orderBy: [{ order: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          name: true,
        },
        take: 1,
      },
    },
  })
}

export function findPracticeCodesByYear(year: string) {
  return prisma.practice.findMany({
    where: {
      code: {
        startsWith: year,
      },
    },
    select: {
      code: true,
    },
  })
}

export function findPracticeByCode(code: string) {
  return prisma.practice.findUnique({
    where: {
      code,
    },
    select: {
      id: true,
    },
  })
}

export async function createPractice(data: PracticeCreateData) {
  const created = await prisma.practice.create({
    data: {
      activityType: data.activityType,
      code: data.code,
      collaboratorId: data.collaboratorId,
      currentPhaseId: data.currentPhaseId,
      customData: data.customData,
      depositDate: data.depositDate,
      hearingDate: data.hearingDate,
      judicialAuthority: data.judicialAuthority,
      name: data.name,
      notes: data.notes,
      office: data.office,
      professionalId: data.professionalId,
      requestedAmount: data.requestedAmount,
      workflowId: data.workflowId,
    },
  })

  return findPracticeListItemById(created.id)
}

export function findPracticeListItemById(id: string) {
  return prisma.practice.findUniqueOrThrow({
    where: { id },
    select: practiceListSelect,
  })
}

export function createPracticeHistoryEvent({
  data,
  practiceId,
  toPhaseId,
}: {
  data: PracticeCreatedHistoryData
  practiceId: string
  toPhaseId: string
}) {
  return prisma.practiceHistory.create({
    data: {
      data,
      eventType: 'PRACTICE_CREATED',
      practiceId,
      title: 'Pratica creata',
      toPhaseId,
    },
  })
}

export function mapPracticeListItem(
  practice: Awaited<ReturnType<typeof createPractice>>,
): PracticeListItem {
  return {
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
  }
}
