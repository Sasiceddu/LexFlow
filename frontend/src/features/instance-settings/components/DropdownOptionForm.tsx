import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import type { DropdownOption } from '../../../types/dropdownMenu.types'

export type DropdownOptionFormValues = {
  isActive: boolean
  label: string
  order: number
  triggersPecBlock: boolean
  value: string
}

type DropdownOptionFormProps = {
  initialOption?: DropdownOption
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: DropdownOptionFormValues) => Promise<void>
}

const emptyValues: DropdownOptionFormValues = {
  isActive: true,
  label: '',
  order: 0,
  triggersPecBlock: false,
  value: '',
}

function toFormValues(option?: DropdownOption): DropdownOptionFormValues {
  return option
    ? {
        isActive: option.isActive,
        label: option.label,
        order: option.order,
        triggersPecBlock: option.triggersPecBlock,
        value: option.value,
      }
    : emptyValues
}

export function DropdownOptionForm({
  initialOption,
  isSaving,
  onCancel,
  onSubmit,
}: DropdownOptionFormProps) {
  const [values, setValues] = useState<DropdownOptionFormValues>(
    toFormValues(initialOption),
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setValues(toFormValues(initialOption))
    setError(null)
  }, [initialOption])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.label.trim()) {
      setError('Il nome dell opzione e obbligatorio.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <FormField label="Etichetta">
        <Input
          value={values.label}
          onChange={(event) =>
            setValues((current) => ({ ...current, label: event.target.value }))
          }
          disabled={isSaving}
        />
      </FormField>
      <FormField label="Valore">
        <Input
          value={values.value}
          onChange={(event) =>
            setValues((current) => ({ ...current, value: event.target.value }))
          }
          disabled={isSaving}
          placeholder="Generato dall'etichetta se vuoto"
        />
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
      <Checkbox
        label="Attiva blocco PEC"
        checked={values.triggersPecBlock}
        onChange={(event) =>
          setValues((current) => ({
            ...current,
            triggersPecBlock: event.target.checked,
          }))
        }
        disabled={isSaving}
      />
      <Checkbox
        label="Opzione attiva"
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
