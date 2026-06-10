import { useEffect, useState, type FormEvent } from 'react'

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
        <label>
          <span>Nome</span>
          <input
            value={values.firstName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                firstName: event.target.value,
              }))
            }
            disabled={isSaving}
          />
        </label>
        <label>
          <span>Cognome</span>
          <input
            value={values.lastName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                lastName: event.target.value,
              }))
            }
            disabled={isSaving}
          />
        </label>
        {isProfessional ? (
          <>
            <label>
              <span>Email</span>
              <input
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
            </label>
            <label>
              <span>Telefono</span>
              <input
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                disabled={isSaving}
              />
            </label>
          </>
        ) : null}
      </div>
      <label>
        <span>Note</span>
        <textarea
          value={values.notes}
          onChange={(event) =>
            setValues((current) => ({ ...current, notes: event.target.value }))
          }
          disabled={isSaving}
          rows={3}
        />
      </label>
      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isActive: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <span>Attivo</span>
      </label>
      {localError || errorMessage ? (
        <p className="form-error">{localError ?? errorMessage}</p>
      ) : null}
      <div className="form-actions">
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvataggio...' : 'Salva'}
        </button>
        <button type="button" onClick={onCancel} disabled={isSaving}>
          Annulla
        </button>
      </div>
    </form>
  )
}
