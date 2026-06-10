import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import type { WorkflowPhase } from '../../../types/workflow.types'
import { workflowPhaseCategoryOptions } from '../constants/workflowPhaseCategories'

export type WorkflowPhaseFormValues = {
  category: string
  color: string
  description: string
  isActive: boolean
  isFinal: boolean
  isInitial: boolean
  name: string
  order: number
  technicalKey: string
}

type WorkflowPhaseFormProps = {
  initialPhase?: WorkflowPhase
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: WorkflowPhaseFormValues) => Promise<void>
}

const emptyValues: WorkflowPhaseFormValues = {
  category: 'custom',
  color: '',
  description: '',
  isActive: true,
  isFinal: false,
  isInitial: false,
  name: '',
  order: 0,
  technicalKey: '',
}

function toFormValues(phase?: WorkflowPhase): WorkflowPhaseFormValues {
  return phase
    ? {
        category: phase.category,
        color: phase.color ?? '',
        description: phase.description ?? '',
        isActive: phase.isActive,
        isFinal: phase.isFinal,
        isInitial: phase.isInitial,
        name: phase.name,
        order: phase.order,
        technicalKey: phase.technicalKey,
      }
    : emptyValues
}

export function WorkflowPhaseForm({
  initialPhase,
  isSaving,
  onCancel,
  onSubmit,
}: WorkflowPhaseFormProps) {
  const [values, setValues] = useState<WorkflowPhaseFormValues>(
    toFormValues(initialPhase),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(toFormValues(initialPhase))
    setError(null)
  }, [initialPhase])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Il nome della fase e obbligatorio.')
      return
    }

    if (!values.category.trim()) {
      setError('La categoria della fase e obbligatoria.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Nome fase">
          <Input
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
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
            placeholder="Generato dal nome se vuoto"
          />
        </FormField>
        <FormField label="Categoria">
          <Select
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            disabled={isSaving}
          >
            {workflowPhaseCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
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
        <FormField label="Colore">
          <Input
            value={values.color}
            onChange={(event) =>
              setValues((current) => ({ ...current, color: event.target.value }))
            }
            disabled={isSaving}
            placeholder="#2563eb oppure nome colore"
          />
        </FormField>
        <FormField label="Descrizione">
          <Textarea
            value={values.description}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            disabled={isSaving}
            rows={3}
          />
        </FormField>
      </div>

      <div className="checkbox-grid">
        <Checkbox
          label="Fase iniziale"
          checked={values.isInitial}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isInitial: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Fase finale"
          checked={values.isFinal}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isFinal: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Fase attiva"
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
