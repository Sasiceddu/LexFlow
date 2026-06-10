export type CollaboratorListItem = {
  displayName: string
  firstName: string
  id: string
  isActive: boolean
  lastName: string
  notes: string | null
}

export type CollaboratorPayload = {
  displayName?: string
  firstName: string
  isActive?: boolean
  lastName: string
  notes?: string | null
}

export type CollaboratorUpdatePayload = Partial<CollaboratorPayload>
