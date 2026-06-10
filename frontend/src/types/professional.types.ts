export type Professional = {
  createdAt: string
  displayName: string
  email: string | null
  firstName: string
  id: string
  isActive: boolean
  lastName: string
  notes: string | null
  phone: string | null
  updatedAt: string
}

export type ProfessionalInput = {
  email?: string | null
  firstName: string
  isActive?: boolean
  lastName: string
  notes?: string | null
  phone?: string | null
}

export type ProfessionalUpdateInput = Partial<ProfessionalInput>
