import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Checkbox } from '../ui/Checkbox'
import { FormField } from '../ui/FormField'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { ActionRow } from './ActionRow'
import { FormErrorMessage } from './FormErrorMessage'

export type PersonFormValues = {
  email: string
  firstName: string
  isActive: boolean
  lastName: string
  notes: string
  phone: string
}

type PersonFormProps = {
  errorMessage?: string | null
  initialValues?: PersonFormValues
  isSaving: boolean
  kind: 'collaborator' | 'professional'
  onCancel: () => void
  onSubmit: (values: PersonFormValues) => Promise<void>
}

const emptyValues: PersonFormValues = {
  email: '',
  firstName: '',
  isActive: true,
  lastName: '',
  notes: '',
  phone: '',
}

export function PersonForm({
  errorMessage,
  initialValues,
  isSaving,
  kind,
  onCancel,
  onSubmit,
}: PersonFormProps) {
  const [values, setValues] = useState<PersonFormValues>(
    initialValues ?? emptyValues,
  )
  const [localError, setLocalError] = useState<string | null>(null)
  const isProfessional = kind === 'professional'

  useEffect(() => {
    setValues(initialValues ?? emptyValues)
    setLocalError(null)
  }, [initialValues])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.firstName.trim() || !values.lastName.trim()) {
      setLocalError('Nome e cognome sono obbligatori.')
      return
    }

    setLocalError(null)
    await onSubmit(values)
  }

  return (
    <form className="person-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Nome">
          <Input
            value={values.firstName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                firstName: event.target.value,
              }))
            }
            disabled={isSaving}
          />
        </FormField>
        <FormField label="Cognome">
          <Input
            value={values.lastName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                lastName: event.target.value,
              }))
            }
            disabled={isSaving}
          />
        </FormField>
        {isProfessional ? (
          <>
            <FormField label="Email">
              <Input
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                disabled={isSaving}
              />
            </FormField>
            <FormField label="Telefono">
              <Input
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                disabled={isSaving}
              />
            </FormField>
          </>
        ) : null}
      </div>
      <FormField label="Note">
        <Textarea
          value={values.notes}
          onChange={(event) =>
            setValues((current) => ({ ...current, notes: event.target.value }))
          }
          disabled={isSaving}
          rows={3}
        />
      </FormField>
      <Checkbox
        label="Attivo"
        checked={values.isActive}
        onChange={(event) =>
          setValues((current) => ({
            ...current,
            isActive: event.target.checked,
          }))
        }
        disabled={isSaving}
      />
      {localError || errorMessage ? (
        <FormErrorMessage message={localError ?? errorMessage ?? ''} />
      ) : null}
      <ActionRow>
        <Button type="submit" disabled={isSaving} variant="primary">
          {isSaving ? 'Salvataggio...' : 'Salva'}
        </Button>
        <Button onClick={onCancel} disabled={isSaving}>
          Annulla
        </Button>
      </ActionRow>
    </form>
  )
}
