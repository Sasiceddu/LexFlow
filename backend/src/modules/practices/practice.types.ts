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
