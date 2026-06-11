import { prisma } from '../../database/prismaClient'
import type { Prisma } from '../../generated/prisma/client'
import type {
  JsonObject,
  PracticeCreatedHistoryData,
  PracticeCreateData,
  PracticeDetail,
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

const practiceDetailSelect = {
  activityType: true,
  code: true,
  collaborator: {
    select: {
      displayName: true,
      id: true,
    },
  },
  createdAt: true,
  currentPhase: {
    select: {
      category: true,
      id: true,
      isActive: true,
      isFinal: true,
      isInitial: true,
      name: true,
      technicalKey: true,
      transitionsFromPhase: {
        orderBy: { order: 'asc' },
        select: {
          actionLabel: true,
          fromPhaseId: true,
          id: true,
          order: true,
          toPhase: {
            select: {
              name: true,
            },
          },
          toPhaseId: true,
        },
        where: {
          isActive: true,
        },
      },
    },
  },
  customData: true,
  depositDate: true,
  grantedAmount: true,
  hearingDate: true,
  histories: {
    orderBy: { createdAt: 'asc' },
    select: {
      createdAt: true,
      data: true,
      description: true,
      eventType: true,
      fromPhase: {
        select: {
          id: true,
          name: true,
        },
      },
      id: true,
      title: true,
      toPhase: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  id: true,
  invoicedAmount: true,
  judicialAuthority: true,
  liquidatedAmount: true,
  name: true,
  notes: true,
  office: true,
  professional: {
    select: {
      displayName: true,
      id: true,
    },
  },
  requestedAmount: true,
  updatedAt: true,
  workflow: {
    select: {
      id: true,
      isDefault: true,
      name: true,
    },
  },
} as const

function toDecimalString(value: { toString: () => string } | null): string | null {
  return value ? value.toString() : null
}

export function toJsonObject(value: Prisma.JsonValue | null): JsonObject | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as JsonObject
  }

  return null
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

export function findPracticeDetailById(id: string) {
  return prisma.practice.findFirst({
    select: practiceDetailSelect,
    where: {
      deletedAt: null,
      id,
    },
  })
}

export function mapPracticeDetail(
  practice: NonNullable<Awaited<ReturnType<typeof findPracticeDetailById>>>,
): PracticeDetail {
  const { currentPhase } = practice

  return {
    activityType: practice.activityType,
    availableTransitions: currentPhase.transitionsFromPhase.map((transition) => ({
      actionLabel: transition.actionLabel,
      fromPhaseId: transition.fromPhaseId,
      id: transition.id,
      order: transition.order,
      toPhaseId: transition.toPhaseId,
      toPhaseName: transition.toPhase.name,
    })),
    code: practice.code,
    collaborator: practice.collaborator,
    createdAt: practice.createdAt,
    currentPhase: {
      category: currentPhase.category,
      id: currentPhase.id,
      isActive: currentPhase.isActive,
      isFinal: currentPhase.isFinal,
      isInitial: currentPhase.isInitial,
      name: currentPhase.name,
      technicalKey: currentPhase.technicalKey,
    },
    customData: toJsonObject(practice.customData),
    depositDate: practice.depositDate,
    grantedAmount: toDecimalString(practice.grantedAmount),
    hearingDate: practice.hearingDate,
    histories: practice.histories.map((history) => ({
      createdAt: history.createdAt,
      data: toJsonObject(history.data),
      description: history.description,
      eventType: history.eventType,
      fromPhase: history.fromPhase,
      id: history.id,
      title: history.title,
      toPhase: history.toPhase,
    })),
    id: practice.id,
    invoicedAmount: toDecimalString(practice.invoicedAmount),
    judicialAuthority: practice.judicialAuthority,
    liquidatedAmount: toDecimalString(practice.liquidatedAmount),
    name: practice.name,
    notes: practice.notes,
    office: practice.office,
    professional: practice.professional,
    requestedAmount: toDecimalString(practice.requestedAmount),
    updatedAt: practice.updatedAt,
    workflow: practice.workflow,
  }
}

export function findPracticeForAdvance(id: string) {
  return prisma.practice.findFirst({
    where: {
      deletedAt: null,
      id,
    },
    select: {
      currentPhaseId: true,
      customData: true,
      id: true,
      workflowId: true,
    },
  })
}

export function findTransitionForAdvance(id: string) {
  return prisma.workflowTransition.findFirst({
    where: { id },
    select: {
      actionLabel: true,
      fromPhaseId: true,
      id: true,
      isActive: true,
      toPhase: {
        select: {
          deletedAt: true,
          isActive: true,
        },
      },
      toPhaseId: true,
      workflowId: true,
    },
  })
}

export function findPhaseFields(phaseId: string) {
  return prisma.configurableField.findMany({
    where: {
      deletedAt: null,
      isActive: true,
      phaseId,
      scope: 'PHASE',
    },
    orderBy: [{ sectionKey: 'asc' }, { order: 'asc' }],
    select: {
      dropdownMenuId: true,
      fieldType: true,
      id: true,
      isRequired: true,
      label: true,
      technicalKey: true,
    },
  })
}

export function findActiveDropdownOptionValues(menuIds: string[]) {
  return prisma.dropdownOption.findMany({
    where: {
      deletedAt: null,
      isActive: true,
      menuId: { in: menuIds },
    },
    select: {
      menuId: true,
      value: true,
    },
  })
}

export async function updatePracticePhase({
  customData,
  id,
  toPhaseId,
}: {
  customData: Prisma.InputJsonValue
  id: string
  toPhaseId: string
}) {
  await prisma.practice.update({
    where: { id },
    data: {
      currentPhaseId: toPhaseId,
      customData,
    },
  })
}

export function createPhaseChangedHistoryEvent({
  data,
  description,
  fromPhaseId,
  practiceId,
  title,
  toPhaseId,
}: {
  data: JsonObject
  description: string | null
  fromPhaseId: string
  practiceId: string
  title: string
  toPhaseId: string
}) {
  return prisma.practiceHistory.create({
    data: {
      data: data as Prisma.InputJsonValue,
      description,
      eventType: 'PHASE_CHANGED',
      fromPhaseId,
      practiceId,
      title,
      toPhaseId,
    },
  })
}
