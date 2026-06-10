import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import type { DropdownMenu } from '../../../types/dropdownMenu.types'

export type DropdownMenuFormValues = {
  isActive: boolean
  name: string
  scope: string
  technicalKey: string
}

type DropdownMenuFormProps = {
  initialMenu?: DropdownMenu
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: DropdownMenuFormValues) => Promise<void>
}

const emptyValues: DropdownMenuFormValues = {
  isActive: true,
  name: '',
  scope: '',
  technicalKey: '',
}

function toFormValues(menu?: DropdownMenu): DropdownMenuFormValues {
  return menu
    ? {
        isActive: menu.isActive,
        name: menu.name,
        scope: menu.scope ?? '',
        technicalKey: menu.technicalKey,
      }
    : emptyValues
}

export function DropdownMenuForm({
  initialMenu,
  isSaving,
  onCancel,
  onSubmit,
}: DropdownMenuFormProps) {
  const [values, setValues] = useState<DropdownMenuFormValues>(
    toFormValues(initialMenu),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(toFormValues(initialMenu))
    setError(null)
  }, [initialMenu])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.name.trim()) {
      setError('Il nome del menu e obbligatorio.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <FormField label="Nome menu">
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
      <FormField label="Ambito">
        <Input
          value={values.scope}
          onChange={(event) =>
            setValues((current) => ({ ...current, scope: event.target.value }))
          }
          disabled={isSaving}
          placeholder="Opzionale"
        />
      </FormField>
      <Checkbox
        label="Menu attivo"
        checked={values.isActive}
        onChange={(event) =>
          setValues((current) => ({
            ...current,
            isActive: event.target.checked,
          }))
        }
        disabled={isSaving}
      />
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
