import { EmptyState } from '../../../components/shared/EmptyState'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Textarea } from '../../../components/ui/Textarea'
import type { ConfigurableField } from '../../../types/configurableField.types'
import type { DropdownOption } from '../../../types/dropdownMenu.types'
import type { JsonValue } from '../../../types/practice.types'

type DynamicFieldRendererProps = {
  field: ConfigurableField
  onChange: (technicalKey: string, value: JsonValue | undefined) => void
  options: DropdownOption[]
  value: JsonValue | undefined
}

function toInputValue(value: JsonValue | undefined): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return ''
}

function getSelectedOption(
  options: DropdownOption[],
  value: JsonValue | undefined,
): DropdownOption | undefined {
  return options.find((option) => option.value === value)
}

export function DynamicFieldRenderer({
  field,
  onChange,
  options,
  value,
}: DynamicFieldRendererProps) {
  const label = field.isRequired ? `${field.label} *` : field.label
  const selectedOption = getSelectedOption(options, value)

  if (field.fieldType === 'FILE') {
    return (
      <div className="dynamic-field-file-note">
        <strong>{field.label}</strong>
        <span>Gestione file disponibile in un passaggio successivo.</span>
      </div>
    )
  }

  if (field.fieldType === 'LONG_TEXT' || field.fieldType === 'NOTE') {
    return (
      <FormField label={label}>
        <Textarea
          value={toInputValue(value)}
          onChange={(event) =>
            onChange(field.technicalKey, event.target.value || undefined)
          }
          rows={3}
        />
      </FormField>
    )
  }

  if (field.fieldType === 'NUMBER' || field.fieldType === 'AMOUNT') {
    return (
      <FormField label={label}>
        <Input
          type="number"
          step={field.fieldType === 'AMOUNT' ? '0.01' : '1'}
          value={toInputValue(value)}
          onChange={(event) =>
            onChange(
              field.technicalKey,
              event.target.value ? event.target.valueAsNumber : undefined,
            )
          }
        />
      </FormField>
    )
  }

  if (field.fieldType === 'DATE') {
    return (
      <FormField label={label}>
        <Input
          type="date"
          value={toInputValue(value)}
          onChange={(event) =>
            onChange(field.technicalKey, event.target.value || undefined)
          }
        />
      </FormField>
    )
  }

  if (field.fieldType === 'DROPDOWN') {
    return (
      <div className="dynamic-field-stack">
        <FormField label={label}>
          <Select
            value={toInputValue(value)}
            onChange={(event) =>
              onChange(field.technicalKey, event.target.value || undefined)
            }
          >
            <option value="">Seleziona</option>
            {options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        {options.length === 0 ? (
          <EmptyState
            title="Nessuna opzione"
            message="Il menu collegato non contiene opzioni attive."
          />
        ) : null}
        {selectedOption?.triggersPecBlock ? (
          <p className="section-meta">
            Questa opzione attivera i dati PEC nei passaggi successivi.
          </p>
        ) : null}
      </div>
    )
  }

  if (field.fieldType === 'BOOLEAN') {
    return (
      <Checkbox
        label={label}
        checked={value === true}
        onChange={(event) => onChange(field.technicalKey, event.target.checked)}
      />
    )
  }

  return (
    <FormField label={label}>
      <Input
        value={toInputValue(value)}
        onChange={(event) =>
          onChange(field.technicalKey, event.target.value || undefined)
        }
      />
    </FormField>
  )
}
