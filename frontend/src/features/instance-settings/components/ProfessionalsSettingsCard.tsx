import type { PersonFormValues } from '../../../components/shared/PersonForm'
import {
  useCreateProfessional,
  useDeleteProfessional,
  useProfessionals,
  useUpdateProfessional,
} from '../../../hooks/useProfessionals'
import type { Professional } from '../../../types/professional.types'
import { formatPluralCount } from '../../../utils/formatCount'
import { toOptionalText } from '../../../utils/personForm'
import { ManagedPeopleCard } from './ManagedPeopleCard'

function toProfessionalInput(values: PersonFormValues) {
  return {
    email: toOptionalText(values.email),
    firstName: values.firstName.trim(),
    isActive: values.isActive,
    lastName: values.lastName.trim(),
    notes: toOptionalText(values.notes),
    phone: toOptionalText(values.phone),
  }
}

export function ProfessionalsSettingsCard() {
  const professionalsQuery = useProfessionals()
  const createMutation = useCreateProfessional()
  const updateMutation = useUpdateProfessional()
  const deleteMutation = useDeleteProfessional()
  const professionals = professionalsQuery.data ?? []

  return (
    <ManagedPeopleCard
      title="Professionisti"
      description="Professionisti non cestinati disponibili per le pratiche."
      countText={formatPluralCount(
        professionals.length,
        'professionista',
        'professionisti',
      )}
      addLabel="Aggiungi professionista"
      deleteConfirmLabel={(person) =>
        `Spostare nel cestino ${person.displayName}?`
      }
      emptyTitle="Nessun professionista"
      emptyMessage="Non sono presenti professionisti nel database locale."
      error={professionalsQuery.error}
      isLoading={professionalsQuery.isPending}
      isSaving={
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending
      }
      items={professionals}
      kind="professional"
      onDelete={async (person: Professional) => {
        await deleteMutation.mutateAsync(person.id)
      }}
      onSubmit={async (id, values) => {
        if (id) {
          await updateMutation.mutateAsync({
            id,
            input: toProfessionalInput(values),
          })
          return
        }

        await createMutation.mutateAsync(toProfessionalInput(values))
      }}
      onToggleActive={async (person: Professional) => {
        await updateMutation.mutateAsync({
          id: person.id,
          input: { isActive: !person.isActive },
        })
      }}
    />
  )
}
