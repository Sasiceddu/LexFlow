import { Button } from '../../../components/ui/Button'
import type { PracticeAvailableTransition } from '../../../types/practice.types'

type AvailableTransitionsListProps = {
  onSelect: (transition: PracticeAvailableTransition) => void
  transitions: PracticeAvailableTransition[]
}

export function AvailableTransitionsList({
  onSelect,
  transitions,
}: AvailableTransitionsListProps) {
  return (
    <ul className="workflow-transition-list">
      {transitions.map((transition) => (
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
          <div className="card-toolbar">
            <Button variant="primary" onClick={() => onSelect(transition)}>
              {transition.actionLabel}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
