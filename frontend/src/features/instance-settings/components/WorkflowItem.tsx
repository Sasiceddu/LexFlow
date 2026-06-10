import { ActionRow } from '../../../components/shared/ActionRow'
import { Button } from '../../../components/ui/Button'
import type {
  Workflow,
  WorkflowPhase,
  WorkflowTransition,
} from '../../../types/workflow.types'
import { formatPluralCount, joinCountParts } from '../../../utils/formatCount'
import { WorkflowPhaseList } from './WorkflowPhaseList'
import { WorkflowTransitionList } from './WorkflowTransitionList'

type WorkflowItemProps = {
  onAddPhase: (workflow: Workflow) => void
  onAddTransition: (workflow: Workflow) => void
  onDeletePhase: (phase: WorkflowPhase) => void
  onDeleteWorkflow: (workflow: Workflow) => void
  onEditPhase: (workflow: Workflow, phase: WorkflowPhase) => void
  onEditTransition: (
    workflow: Workflow,
    transition: WorkflowTransition,
  ) => void
  onEditWorkflow: (workflow: Workflow) => void
  onToggleTransition: (transition: WorkflowTransition) => void
  workflow: Workflow
}

function getWorkflowMeta(workflow: Workflow): string {
  const initialPhase = workflow.phases.find((phase) => phase.isInitial)
  const finalPhases = workflow.phases.filter((phase) => phase.isFinal)

  return joinCountParts([
    formatPluralCount(workflow.phases.length, 'fase', 'fasi'),
    formatPluralCount(
      workflow.transitions.length,
      'transizione',
      'transizioni',
    ),
    initialPhase ? `iniziale: ${initialPhase.name}` : 'iniziale: non definita',
    finalPhases.length > 0
      ? `finali: ${finalPhases.map((phase) => phase.name).join(', ')}`
      : 'finali: non definite',
  ])
}

export function WorkflowItem({
  onAddPhase,
  onAddTransition,
  onDeletePhase,
  onDeleteWorkflow,
  onEditPhase,
  onEditTransition,
  onEditWorkflow,
  onToggleTransition,
  workflow,
}: WorkflowItemProps) {
  return (
    <article className="workflow-item">
      <div className="workflow-item-header">
        <div className="person-summary">
          <strong>{workflow.name}</strong>
          <span>{getWorkflowMeta(workflow)}</span>
          {workflow.description ? <span>{workflow.description}</span> : null}
          {workflow.isDefault ? <span>Workflow default</span> : null}
          {!workflow.isActive ? <span>Disattivato</span> : null}
        </div>
        <ActionRow>
          <Button onClick={() => onEditWorkflow(workflow)}>
            Modifica workflow
          </Button>
          <Button onClick={() => onDeleteWorkflow(workflow)} variant="danger">
            Disattiva workflow
          </Button>
        </ActionRow>
      </div>

      <div className="workflow-inner-grid">
        <section className="workflow-subsection">
          <div className="workflow-subsection-header">
            <h4>Fasi</h4>
            <Button onClick={() => onAddPhase(workflow)} variant="primary">
              Aggiungi fase
            </Button>
          </div>
          <WorkflowPhaseList
            phases={workflow.phases}
            onDelete={onDeletePhase}
            onEdit={(phase) => onEditPhase(workflow, phase)}
          />
        </section>

        <section className="workflow-subsection">
          <div className="workflow-subsection-header">
            <h4>Transizioni</h4>
            <Button
              onClick={() => onAddTransition(workflow)}
              variant="primary"
              disabled={workflow.phases.length < 2}
            >
              Aggiungi transizione
            </Button>
          </div>
          <WorkflowTransitionList
            transitions={workflow.transitions}
            onEdit={(transition) => onEditTransition(workflow, transition)}
            onToggleActive={onToggleTransition}
          />
        </section>
      </div>
    </article>
  )
}
