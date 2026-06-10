export type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type JsonPrimitive = boolean | number | string | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
export type JsonObject = {
  [key: string]: JsonValue
}

export type PracticeListItem = {
  activityType: string | null
  code: string
  collaboratorName: string | null
  createdAt: string
  currentPhaseName: string | null
  depositDate: string | null
  grantedAmount: string | null
  hearingDate: string | null
  id: string
  invoicedAmount: string | null
  liquidatedAmount: string | null
  name: string
  professionalName: string | null
  requestedAmount: string | null
  updatedAt: string
  workflowName: string | null
}

export type PracticeListResponse = {
  items: PracticeListItem[]
  pagination: Pagination
}

export type PracticeFilters = {
  collaboratorId?: string
  page?: number
  pageSize?: number
  phaseId?: string
  professionalId?: string
  search?: string
}

export type CreatePracticePayload = {
  activityType?: string | null
  collaboratorId?: string | null
  customData?: JsonObject
  depositDate?: string | null
  hearingDate: string
  judicialAuthority?: string | null
  notes?: string | null
  office?: string | null
  professionalId?: string | null
  requestedAmount?: string | null
}
