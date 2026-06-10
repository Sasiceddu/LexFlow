export type ProfessionalListItem = {
  displayName: string
  email: string | null
  firstName: string
  id: string
  isActive: boolean
  lastName: string
  notes: string | null
  phone: string | null
}

export type ProfessionalPayload = {
  displayName?: string
  email?: string | null
  firstName: string
  isActive?: boolean
  lastName: string
  notes?: string | null
  phone?: string | null
}

export type ProfessionalUpdatePayload = Partial<ProfessionalPayload>
