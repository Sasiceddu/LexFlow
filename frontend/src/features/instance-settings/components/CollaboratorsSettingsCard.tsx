import {
  useCollaborators,
  useCreateCollaborator,
  useDeleteCollaborator,
  useUpdateCollaborator,
} from '../../../hooks/useCollaborators'
import type { Collaborator } from '../../../types/collaborator.types'
import { formatPluralCount } from '../../../utils/formatCount'
import { toOptionalText } from '../../../utils/strings'
import type { PersonFormValues } from '../../../components/shared/PersonForm'
import { ManagedPeopleCard } from './ManagedPeopleCard'

function toCollaboratorInput(values: PersonFormValues) {
  return {
    firstName: values.firstName.trim(),
    isActive: values.isActive,
    lastName: values.lastName.trim(),
    notes: toOptionalText(values.notes),
  }
}

export function CollaboratorsSettingsCard() {
  const collaboratorsQuery = useCollaborators()
  const createMutation = useCreateCollaborator()
  const updateMutation = useUpdateCollaborator()
  const deleteMutation = useDeleteCollaborator()
  const collaborators = collaboratorsQuery.data ?? []

  return (
    <ManagedPeopleCard
      title="Collaboratori di giustizia"
      description="Questa sezione serve per registrare i collaboratori di giustizia e organizzare le pratiche collegate a ciascuno di essi. Puoi inserire nuovi nominativi, modificare quelli esistenti e usare questi dati nelle istanze."
      countText={formatPluralCount(
        collaborators.length,
        'collaboratore',
        'collaboratori',
      )}
      addLabel="Aggiungi collaboratore"
      deleteConfirmLabel={(person) =>
        `Spostare nel cestino ${person.displayName}?`
      }
      emptyTitle="Nessun collaboratore"
      emptyMessage="Non sono presenti collaboratori di giustizia nel database locale."
      error={collaboratorsQuery.error}
      isLoading={collaboratorsQuery.isPending}
      isSaving={
        createMutation.isPending ||
        updateMutation.isPending ||
        deleteMutation.isPending
      }
      items={collaborators}
      kind="collaborator"
      onDelete={async (person: Collaborator) => {
        await deleteMutation.mutateAsync(person.id)
      }}
      onSubmit={async (id, values) => {
        if (id) {
          await updateMutation.mutateAsync({
            id,
            input: toCollaboratorInput(values),
          })
          return
        }

        await createMutation.mutateAsync(toCollaboratorInput(values))
      }}
      onToggleActive={async (person: Collaborator) => {
        await updateMutation.mutateAsync({
          id: person.id,
          input: { isActive: !person.isActive },
        })
      }}
    />
  )
}
