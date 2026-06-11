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
  createdAt: string
}

export type PracticeDetail = {
  id: string
  code: string
  name: string
  activityType: string | null
  hearingDate: string | null
  depositDate: string | null
  office: string | null
  judicialAuthority: string | null
  requestedAmount: string | null
  grantedAmount: string | null
  invoicedAmount: string | null
  liquidatedAmount: string | null
  notes: string | null
  customData: JsonObject | null
  createdAt: string
  updatedAt: string
  collaborator: PracticeRelatedPerson | null
  professional: PracticeRelatedPerson | null
  workflow: PracticeRelatedWorkflow
  currentPhase: PracticeRelatedPhase
  histories: PracticeHistoryItem[]
  availableTransitions: PracticeAvailableTransition[]
}

export type PracticePhaseData = JsonObject

export type AdvancePracticePayload = {
  transitionId: string
  occurredAt?: string
  notes?: string
  phaseData?: PracticePhaseData
}

export type AdvancePracticeResponse = PracticeDetail
