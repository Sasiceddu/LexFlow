import type { PersonFormValues } from '../components/shared/PersonForm'

type EditablePerson = {
  email?: string | null
  firstName: string
  isActive: boolean
  lastName: string
  notes?: string | null
  phone?: string | null
}

export function toPersonFormValues(
  person?: EditablePerson,
): PersonFormValues | undefined {
  if (!person) {
    return undefined
  }

  return {
    email: person.email ?? '',
    firstName: person.firstName,
    isActive: person.isActive,
    lastName: person.lastName,
    notes: person.notes ?? '',
    phone: person.phone ?? '',
  }
}
