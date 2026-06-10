import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Textarea } from '../../../components/ui/Textarea'
import type { Workflow } from '../../../types/workflow.types'

export type WorkflowFormValues = {
  description: string
  isActive: boolean
  isDefault: boolean
  name: string
}

type WorkflowFormProps = {
  initialWorkflow?: Workflow
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: WorkflowFormValues) => Promise<void>
}

const emptyValues: WorkflowFormValues = {
  description: '',
  isActive: true,
  isDefault: false,
  name: '',
}

function toFormValues(workflow?: Workflow): WorkflowFormValues {
  return workflow
    ? {
        description: workflow.description ?? '',
        isActive: workflow.isActive,
        isDefault: workflow.isDefault,
        name: workflow.name,
      }
    : emptyValues
}

export function WorkflowForm({
  initialWorkflow,
  isSaving,
  onCancel,
  onSubmit,
}: WorkflowFormProps) {
  const [values, setValues] = useState<WorkflowFormValues>(
    toFormValues(initialWorkflow),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(toFormValues(initialWorkflow))
    setError(null)
  }, [initialWorkflow])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Il nome del workflow e obbligatorio.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Nome">
          <Input
            value={values.name}
            onChange={(event) =>
              setValues((current) => ({ ...current, name: event.target.value }))
            }
            disabled={isSaving}
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
          label="Workflow default"
          checked={values.isDefault}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isDefault: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Workflow attivo"
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
