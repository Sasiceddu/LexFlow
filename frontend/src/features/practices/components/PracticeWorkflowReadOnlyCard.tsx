import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/shared/EmptyState'
import type { PracticeDetail } from '../../../types/practice.types'

type PracticeWorkflowReadOnlyCardProps = {
  practice: PracticeDetail
}

export function PracticeWorkflowReadOnlyCard({
  practice,
}: PracticeWorkflowReadOnlyCardProps) {
  return (
    <section className="detail-card">
      <h2>Workflow e avanzamento</h2>
      <div className="detail-grid">
        <div className="detail-field">
          <span>Workflow</span>
          <strong>{practice.workflow.name}</strong>
        </div>
        <div className="detail-field">
          <span>Fase corrente</span>
          <strong>{practice.currentPhase.name}</strong>
        </div>
      </div>
      <p className="section-meta">
        Nel prossimo passaggio potrai avanzare la pratica usando le transizioni
        configurate nelle impostazioni.
      </p>
      {practice.availableTransitions.length > 0 ? (
        <ul className="workflow-transition-list">
          {practice.availableTransitions.map((transition) => (
            <li key={transition.id}>
              <div className="detail-grid">
                <div className="detail-field">
                  <span>Azione</span>
                  <strong>{transition.actionLabel}</strong>
                </div>
                <div className="detail-field">
                  <span>Fase di destinazione</span>
                  <strong>{transition.toPhaseName}</strong>
                </div>
              </div>
              <Button
                disabled
                title="L'avanzamento pratica sara disponibile in un prossimo aggiornamento."
              >
                {transition.actionLabel}
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Nessuna transizione configurata"
          message="Configura le transizioni del workflow nelle impostazioni per abilitare l'avanzamento della pratica."
        />
      )}
    </section>
  )
}
