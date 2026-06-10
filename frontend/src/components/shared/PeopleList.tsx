import { EmptyState } from './EmptyState'
import { Button } from '../ui/Button'
import { ActionRow } from './ActionRow'

export type ManagedPersonItem = {
  displayName: string
  email?: string | null
  id: string
  isActive: boolean
  notes?: string | null
  phone?: string | null
}

type PeopleListProps<TPerson extends ManagedPersonItem> = {
  emptyMessage: string
  emptyTitle: string
  items: TPerson[]
  onDelete: (person: TPerson) => void
  onEdit: (person: TPerson) => void
  onToggleActive: (person: TPerson) => void
}

export function PeopleList<TPerson extends ManagedPersonItem>({
  emptyMessage,
  emptyTitle,
  items,
  onDelete,
  onEdit,
  onToggleActive,
}: PeopleListProps<TPerson>) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />
  }

  return (
    <ul className="people-list">
      {items.map((person) => (
        <li key={person.id}>
          <div className="person-summary">
            <strong>{person.displayName}</strong>
            <span>{person.isActive ? 'Attivo' : 'Disattivato'}</span>
            {person.email ? <span>{person.email}</span> : null}
            {person.phone ? <span>{person.phone}</span> : null}
            {person.notes ? <p>{person.notes}</p> : null}
          </div>
          <ActionRow>
            <Button onClick={() => onEdit(person)}>
              Modifica
            </Button>
            <Button onClick={() => onToggleActive(person)}>
              {person.isActive ? 'Disattiva' : 'Attiva'}
            </Button>
            <Button variant="danger" onClick={() => onDelete(person)}>
              Cestina
            </Button>
          </ActionRow>
        </li>
      ))}
    </ul>
  )
}
