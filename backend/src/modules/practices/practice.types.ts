import type { Prisma } from '../../generated/prisma/client'

export type JsonPrimitive = boolean | number | string | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export type JsonObject = {
  [key: string]: JsonValue
}

export type CreatePracticePayload = {
  activityType?: string | null
  collaboratorId?: string | null
  customData?: JsonObject
  depositDate?: Date | null
  hearingDate: Date
  judicialAuthority?: string | null
  notes?: string | null
  office?: string | null
  professionalId?: string | null
  requestedAmount?: string | null
}

export type PracticeCreateData = {
  activityType: string | null
  code: string
  collaboratorId: string | null
  customData: Prisma.InputJsonValue | undefined
  depositDate: Date | null
  hearingDate: Date
  judicialAuthority: string | null
  name: string
  notes: string | null
  office: string | null
  professionalId: string | null
  requestedAmount: string | null
  currentPhaseId: string
  workflowId: string
}

export type PracticeListFilters = {
  collaboratorId?: string
  page: number
  pageSize: number
  phaseId?: string
  professionalId?: string
  search?: string
}

export type PracticeListItem = {
  activityType: string | null
  code: string
  collaboratorName: string | null
  createdAt: Date
  currentPhaseName: string | null
  depositDate: Date | null
  grantedAmount: string | null
  hearingDate: Date | null
  id: string
  invoicedAmount: string | null
  liquidatedAmount: string | null
  name: string
  professionalName: string | null
  requestedAmount: string | null
  updatedAt: Date
  workflowName: string | null
}

export type PracticeListPagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type PracticeListResponse = {
  items: PracticeListItem[]
  pagination: PracticeListPagination
}

export type PracticeCreatedHistoryData = JsonObject

export type PracticeRelatedPerson = {
  id: string
  displayName: string
}

export type PracticeRelatedWorkflow = {
  id: string
  name: string
  isDefault: boolean
}

export type PracticeRelatedPhase = {
  id: string
  name: string
  technicalKey: string
  category: string
  isInitial: boolean
  isFinal: boolean
  isActive: boolean
}

export type PracticeAvailableTransition = {
  id: string
  actionLabel: string
  fromPhaseId: string
  toPhaseId: string
  toPhaseName: string
  order: number
}

export type PracticeHistoryPhaseRef = {
  id: string
  name: string
}

export type PracticeHistoryItem = {
  id: string
  eventType: string
  title: string
  description: string | null
  fromPhase: PracticeHistoryPhaseRef | null
  toPhase: PracticeHistoryPhaseRef | null
  data: JsonObject | null
  createdAt: Date
}

export type PracticeDetail = {
  id: string
  code: string
  name: string
  activityType: string | null
  hearingDate: Date | null
  depositDate: Date | null
  office: string | null
  judicialAuthority: string | null
  requestedAmount: string | null
  grantedAmount: string | null
  invoicedAmount: string | null
  liquidatedAmount: string | null
  notes: string | null
  customData: JsonObject | null
  createdAt: Date
  updatedAt: Date
  collaborator: PracticeRelatedPerson | null
  professional: PracticeRelatedPerson | null
  workflow: PracticeRelatedWorkflow
  currentPhase: PracticeRelatedPhase
  histories: PracticeHistoryItem[]
  availableTransitions: PracticeAvailableTransition[]
}
