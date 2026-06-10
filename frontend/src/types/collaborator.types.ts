export type Collaborator = {
  createdAt: string
  displayName: string
  firstName: string
  id: string
  isActive: boolean
  lastName: string
  notes: string | null
  updatedAt: string
}

export type CollaboratorInput = {
  firstName: string
  isActive?: boolean
  lastName: string
  notes?: string | null
}

export type CollaboratorUpdateInput = Partial<CollaboratorInput>
