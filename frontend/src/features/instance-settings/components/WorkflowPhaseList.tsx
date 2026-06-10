import { ActionRow } from '../../../components/shared/ActionRow'
import { EmptyState } from '../../../components/shared/EmptyState'
import { Button } from '../../../components/ui/Button'
import type { WorkflowPhase } from '../../../types/workflow.types'
import { getWorkflowPhaseCategoryLabel } from '../constants/workflowPhaseCategories'

type WorkflowPhaseListProps = {
  onDelete: (phase: WorkflowPhase) => void
  onEdit: (phase: WorkflowPhase) => void
  phases: WorkflowPhase[]
}

export function WorkflowPhaseList({
  onDelete,
  onEdit,
  phases,
}: WorkflowPhaseListProps) {
  if (phases.length === 0) {
    return (
      <EmptyState
        title="Nessuna fase"
        message="Questo workflow non ha ancora fasi attive."
      />
    )
  }

  return (
    <ul className="workflow-phase-list">
      {phases.map((phase) => (
        <li key={phase.id}>
          <div className="person-summary">
            <strong>{phase.name}</strong>
            <span>Categoria: {getWorkflowPhaseCategoryLabel(phase.category)}</span>
            <span>Ordine: {phase.order}</span>
            <span>Valore tecnico: {phase.technicalKey}</span>
            {phase.isInitial ? <span>Fase iniziale</span> : null}
            {phase.isFinal ? <span>Fase finale</span> : null}
            {!phase.isActive ? <span>Disattivata</span> : null}
          </div>
          <ActionRow>
            <Button onClick={() => onEdit(phase)}>Modifica fase</Button>
            <Button onClick={() => onDelete(phase)} variant="danger">
              Cestina fase
            </Button>
          </ActionRow>
        </li>
      ))}
    </ul>
  )
}
