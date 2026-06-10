import { useState } from 'react'
import { ErrorMessage } from '../../../components/shared/ErrorMessage'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {
  PeopleList,
  type ManagedPersonItem,
} from '../../../components/shared/PeopleList'
import {
  PersonForm,
  type PersonFormValues,
} from '../../../components/shared/PersonForm'
import { ExpandableCard } from '../../../components/ui/ExpandableCard'
import { toPersonFormValues } from '../../../utils/personForm'

export type EditablePerson = ManagedPersonItem & {
  firstName: string
  lastName: string
  notes: string | null
}

type ManagedPeopleCardProps<TPerson extends EditablePerson> = {
  addLabel: string
  countText: string
  deleteConfirmLabel: (person: TPerson) => string
  description: string
  emptyMessage: string
  emptyTitle: string
  error: Error | null
  isLoading: boolean
  isSaving: boolean
  items: TPerson[]
  kind: 'collaborator' | 'professional'
  onDelete: (person: TPerson) => Promise<void>
  onSubmit: (id: string | undefined, values: PersonFormValues) => Promise<void>
  onToggleActive: (person: TPerson) => Promise<void>
  title: string
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function ManagedPeopleCard<TPerson extends EditablePerson>({
  addLabel,
  countText,
  deleteConfirmLabel,
  description,
  emptyMessage,
  emptyTitle,
  error,
  isLoading,
  isSaving,
  items,
  kind,
  onDelete,
  onSubmit,
  onToggleActive,
  title,
}: ManagedPeopleCardProps<TPerson>) {
  const [activeId, setActiveId] = useState<string | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const activePerson = activeId
    ? items.find((item) => item.id === activeId)
    : undefined

  async function handleSubmit(values: PersonFormValues) {
    setActionError(null)

    try {
      await onSubmit(activeId, values)
      setActiveId(undefined)
      setIsFormOpen(false)
    } catch (submitError: unknown) {
      setActionError(getErrorMessage(submitError, 'Impossibile salvare i dati.'))
    }
  }

  async function handleDelete(person: TPerson) {
    if (!window.confirm(deleteConfirmLabel(person))) {
      return
    }

    setActionError(null)

    try {
      await onDelete(person)
    } catch (deleteError: unknown) {
      setActionError(
        getErrorMessage(deleteError, 'Impossibile spostare nel cestino.'),
      )
    }
  }

  async function handleToggleActive(person: TPerson) {
    setActionError(null)

    try {
      await onToggleActive(person)
    } catch (toggleError: unknown) {
      setActionError(
        getErrorMessage(toggleError, 'Impossibile aggiornare lo stato.'),
      )
    }
  }

  return (
    <ExpandableCard
      title={title}
      subtitle={description}
    >
      <p className="section-meta">{countText}</p>

      <div className="card-toolbar">
        <button
          type="button"
          onClick={() => {
            setActiveId(undefined)
            setIsFormOpen(true)
            setActionError(null)
          }}
        >
          {addLabel}
        </button>
      </div>

      {isLoading ? <LoadingSpinner label={`Caricamento ${title}`} /> : null}

      {error ? (
        <ErrorMessage
          title={`${title} non disponibili`}
          message={error.message}
        />
      ) : null}

      {actionError ? (
        <ErrorMessage title="Operazione non completata" message={actionError} />
      ) : null}

      {isFormOpen ? (
        <PersonForm
          errorMessage={actionError}
          initialValues={toPersonFormValues(activePerson)}
          isSaving={isSaving}
          kind={kind}
          onCancel={() => {
            setActiveId(undefined)
            setIsFormOpen(false)
            setActionError(null)
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      {!isLoading && !error ? (
        <PeopleList
          items={items}
          emptyTitle={emptyTitle}
          emptyMessage={emptyMessage}
          onDelete={(person) => void handleDelete(person)}
          onEdit={(person) => {
            setActiveId(person.id)
            setIsFormOpen(true)
            setActionError(null)
          }}
          onToggleActive={(person) => void handleToggleActive(person)}
        />
      ) : null}
    </ExpandableCard>
  )
}
