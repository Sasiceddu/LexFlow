import { ActionRow } from '../../../components/shared/ActionRow'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import type { WorkflowTransition } from '../../../types/workflow.types'

type WorkflowTransitionListProps = {
  onEdit: (transition: WorkflowTransition) => void
  onToggleActive: (transition: WorkflowTransition) => void
  transitions: WorkflowTransition[]
}

export function WorkflowTransitionList({
  onEdit,
  onToggleActive,
  transitions,
}: WorkflowTransitionListProps) {
  if (transitions.length === 0) {
    return (
      <EmptyState
        title="Nessuna transizione"
        message="Questo workflow non ha ancora transizioni configurate."
      />
    )
  }

  return (
    <ul className="workflow-transition-list">
      {transitions.map((transition) => (
        <li
          key={transition.id}
          className={transition.isActive ? undefined : 'is-disabled'}
        >
          <div className="person-summary">
            <strong>{transition.actionLabel}</strong>
            <span>
              {transition.fromPhase.name} -&gt; {transition.toPhase.name}
            </span>
            <span>Ordine: {transition.order}</span>
            <span>Valore tecnico: {transition.technicalKey}</span>
            <span>{transition.isActive ? 'Attiva' : 'Disattivata'}</span>
          </div>
          <ActionRow>
            <Button onClick={() => onEdit(transition)}>
              Modifica transizione
            </Button>
            <Button
              onClick={() => onToggleActive(transition)}
              variant={transition.isActive ? 'danger' : 'primary'}
            >
              {transition.isActive ? 'Disattiva' : 'Riattiva'}
            </Button>
          </ActionRow>
        </li>
      ))}
    </ul>
  )
}
