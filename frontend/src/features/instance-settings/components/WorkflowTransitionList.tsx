import { ActionRow } from '../../../components/shared/ActionRow'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import type { WorkflowTransition } from '../../../types/workflow.types'

type WorkflowTransitionListProps = {
  onDelete: (transition: WorkflowTransition) => void
  onEdit: (transition: WorkflowTransition) => void
  transitions: WorkflowTransition[]
}

export function WorkflowTransitionList({
  onDelete,
  onEdit,
  transitions,
}: WorkflowTransitionListProps) {
  if (transitions.length === 0) {
    return (
      <EmptyState
        title="Nessuna transizione"
        message="Questo workflow non ha ancora transizioni attive."
      />
    )
  }

  return (
    <ul className="workflow-transition-list">
      {transitions.map((transition) => (
        <li key={transition.id}>
          <div className="person-summary">
            <strong>{transition.actionLabel}</strong>
            <span>
              {transition.fromPhase.name} -&gt; {transition.toPhase.name}
            </span>
            <span>Ordine: {transition.order}</span>
            <span>Valore tecnico: {transition.technicalKey}</span>
            {!transition.isActive ? <span>Disattivata</span> : null}
          </div>
          <ActionRow>
            <Button onClick={() => onEdit(transition)}>
              Modifica transizione
            </Button>
            <Button onClick={() => onDelete(transition)} variant="danger">
              Disattiva transizione
            </Button>
          </ActionRow>
        </li>
      ))}
    </ul>
  )
}
