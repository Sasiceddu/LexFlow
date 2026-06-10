import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import type {
  WorkflowPhase,
  WorkflowTransition,
} from '../../../types/workflow.types'

export type WorkflowTransitionFormValues = {
  actionLabel: string
  fromPhaseId: string
  isActive: boolean
  order: number
  technicalKey: string
  toPhaseId: string
}

type WorkflowTransitionFormProps = {
  initialTransition?: WorkflowTransition
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: WorkflowTransitionFormValues) => Promise<void>
  phases: WorkflowPhase[]
}

const emptyValues: WorkflowTransitionFormValues = {
  actionLabel: '',
  fromPhaseId: '',
  isActive: true,
  order: 0,
  technicalKey: '',
  toPhaseId: '',
}

function toFormValues(
  transition?: WorkflowTransition,
): WorkflowTransitionFormValues {
  return transition
    ? {
        actionLabel: transition.actionLabel,
        fromPhaseId: transition.fromPhaseId,
        isActive: transition.isActive,
        order: transition.order,
        technicalKey: transition.technicalKey,
        toPhaseId: transition.toPhaseId,
      }
    : emptyValues
}

export function WorkflowTransitionForm({
  initialTransition,
  isSaving,
  onCancel,
  onSubmit,
  phases,
}: WorkflowTransitionFormProps) {
  const [values, setValues] = useState<WorkflowTransitionFormValues>(
    toFormValues(initialTransition),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(toFormValues(initialTransition))
    setError(null)
  }, [initialTransition])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.actionLabel.trim()) {
      setError('L azione della transizione e obbligatoria.')
      return
    }

    if (!values.fromPhaseId || !values.toPhaseId) {
      setError('Seleziona fase di partenza e fase di arrivo.')
      return
    }

    if (values.fromPhaseId === values.toPhaseId) {
      setError('La fase di partenza deve essere diversa dalla fase di arrivo.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Azione">
          <Input
            value={values.actionLabel}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                actionLabel: event.target.value,
              }))
            }
            disabled={isSaving}
          />
        </FormField>
        <FormField label="Valore tecnico">
          <Input
            value={values.technicalKey}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                technicalKey: event.target.value,
              }))
            }
            disabled={isSaving}
            placeholder="Generato dall azione se vuoto"
          />
        </FormField>
        <FormField label="Da fase">
          <Select
            value={values.fromPhaseId}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                fromPhaseId: event.target.value,
              }))
            }
            disabled={isSaving}
          >
            <option value="">Seleziona fase</option>
            {phases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="A fase">
          <Select
            value={values.toPhaseId}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                toPhaseId: event.target.value,
              }))
            }
            disabled={isSaving}
          >
            <option value="">Seleziona fase</option>
            {phases.map((phase) => (
              <option
                key={phase.id}
                value={phase.id}
                disabled={phase.id === values.fromPhaseId}
              >
                {phase.name}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Ordine">
          <Input
            type="number"
            min={0}
            value={values.order}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                order: Number.isNaN(event.target.valueAsNumber)
                  ? 0
                  : event.target.valueAsNumber,
              }))
            }
            disabled={isSaving}
          />
        </FormField>
      </div>

      <div className="checkbox-grid">
        <Checkbox
          label="Transizione attiva"
          checked={values.isActive}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isActive: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
      </div>

      {error ? <FormErrorMessage message={error} /> : null}
      <ActionRow>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Salvataggio...' : 'Salva'}
        </Button>
        <Button onClick={onCancel} disabled={isSaving}>
          Annulla
        </Button>
      </ActionRow>
    </form>
  )
}
