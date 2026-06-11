import { useState } from 'react'
import { EmptyState } from '../../../components/shared/EmptyState'
import type {
  PracticeAvailableTransition,
  PracticeDetail,
} from '../../../types/practice.types'
import { AdvancePracticeModal } from './AdvancePracticeModal'
import { AvailableTransitionsList } from './AvailableTransitionsList'

type PracticeWorkflowCardProps = {
  practice: PracticeDetail
}

export function PracticeWorkflowCard({ practice }: PracticeWorkflowCardProps) {
  const [selectedTransition, setSelectedTransition] =
    useState<PracticeAvailableTransition | null>(null)

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

      {practice.availableTransitions.length === 0 ? (
        <EmptyState
          title={
            practice.currentPhase.isFinal
              ? 'Fase finale raggiunta'
              : 'Nessuna azione disponibile'
          }
          message={
            practice.currentPhase.isFinal
              ? 'La pratica ha raggiunto una fase finale del workflow: non sono previste ulteriori transizioni.'
              : 'Nessuna azione disponibile dalla fase corrente.'
          }
        />
      ) : (
        <AvailableTransitionsList
          transitions={practice.availableTransitions}
          onSelect={setSelectedTransition}
        />
      )}

      {selectedTransition ? (
        <AdvancePracticeModal
          isOpen
          practice={practice}
          transition={selectedTransition}
          onClose={() => setSelectedTransition(null)}
        />
      ) : null}
    </section>
  )
}
