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
