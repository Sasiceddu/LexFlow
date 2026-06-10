import { useEffect, useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { Button } from '../../../components/ui/Button'
import { Checkbox } from '../../../components/ui/Checkbox'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import type {
  ConfigurableField,
  ConfigurableFieldScope,
  ConfigurableFieldType,
} from '../../../types/configurableField.types'
import type {
  DropdownMenuOverviewItem,
  WorkflowPhaseOverviewItem,
} from '../../../types/instanceSettings.types'
import { configurableFieldSectionOptions } from '../constants/configurableFieldSections'
import { configurableFieldTypeOptions } from '../constants/configurableFieldTypes'

export type ConfigurableFieldFormValues = {
  dropdownMenuId: string
  fieldType: ConfigurableFieldType
  includeInExport: boolean
  isActive: boolean
  isRequired: boolean
  label: string
  order: number
  phaseId: string
  scope: ConfigurableFieldScope
  sectionKey: string
  showInTable: boolean
  technicalKey: string
  useInFilters: boolean
}

type ConfigurableFieldFormProps = {
  dropdownMenus: DropdownMenuOverviewItem[]
  initialField?: ConfigurableField
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: ConfigurableFieldFormValues) => Promise<void>
  phases: WorkflowPhaseOverviewItem[]
}

const emptyValues: ConfigurableFieldFormValues = {
  dropdownMenuId: '',
  fieldType: 'SHORT_TEXT',
  includeInExport: false,
  isActive: true,
  isRequired: false,
  label: '',
  order: 0,
  phaseId: '',
  scope: 'GENERAL',
  sectionKey: 'general',
  showInTable: false,
  technicalKey: '',
  useInFilters: false,
}

function toFormValues(field?: ConfigurableField): ConfigurableFieldFormValues {
  return field
    ? {
        dropdownMenuId: field.dropdownMenuId ?? '',
        fieldType: field.fieldType,
        includeInExport: field.includeInExport,
        isActive: field.isActive,
        isRequired: field.isRequired,
        label: field.label,
        order: field.order,
        phaseId: field.phaseId ?? '',
        scope: field.scope,
        sectionKey: field.sectionKey,
        showInTable: field.showInTable,
        technicalKey: field.technicalKey,
        useInFilters: field.useInFilters,
      }
    : emptyValues
}

export function ConfigurableFieldForm({
  dropdownMenus,
  initialField,
  isSaving,
  onCancel,
  onSubmit,
  phases,
}: ConfigurableFieldFormProps) {
  const [values, setValues] = useState<ConfigurableFieldFormValues>(
    toFormValues(initialField),
  )
  const [error, setError] = useState<string | null>(null)
  const requiresPhase = values.scope === 'PHASE'
  const requiresDropdown = values.fieldType === 'DROPDOWN'

  useEffect(() => {
    setValues(toFormValues(initialField))
    setError(null)
  }, [initialField])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!values.label.trim()) {
      setError('La label del campo e obbligatoria.')
      return
    }

    if (requiresPhase && !values.phaseId) {
      setError('La fase e obbligatoria per i campi PHASE.')
      return
    }

    if (requiresDropdown && !values.dropdownMenuId) {
      setError('Il menu a tendina e obbligatorio per i campi DROPDOWN.')
      return
    }

    setError(null)
    await onSubmit(values)
  }

  return (
    <form className="stack-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <FormField label="Label">
          <Input
            value={values.label}
            onChange={(event) =>
              setValues((current) => ({ ...current, label: event.target.value }))
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
            placeholder="Generato dalla label se vuoto"
          />
        </FormField>
        <FormField label="Scope">
          <Select
            value={values.scope}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                phaseId: event.target.value === 'GENERAL' ? '' : current.phaseId,
                scope: event.target.value as ConfigurableFieldScope,
              }))
            }
            disabled={isSaving}
          >
            <option value="GENERAL">GENERAL</option>
            <option value="PHASE">PHASE</option>
          </Select>
        </FormField>
        <FormField label="Sezione">
          <Select
            value={values.sectionKey}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                sectionKey: event.target.value,
              }))
            }
            disabled={isSaving}
          >
            {configurableFieldSectionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        {requiresPhase ? (
          <FormField label="Fase">
            <Select
              value={values.phaseId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  phaseId: event.target.value,
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
        ) : null}
        <FormField label="Tipo campo">
          <Select
            value={values.fieldType}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                dropdownMenuId:
                  event.target.value === 'DROPDOWN'
                    ? current.dropdownMenuId
                    : '',
                fieldType: event.target.value as ConfigurableFieldType,
              }))
            }
            disabled={isSaving}
          >
            {configurableFieldTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        {requiresDropdown ? (
          <FormField label="Menu a tendina">
            <Select
              value={values.dropdownMenuId}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  dropdownMenuId: event.target.value,
                }))
              }
              disabled={isSaving}
            >
              <option value="">Seleziona menu</option>
              {dropdownMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name}
                </option>
              ))}
            </Select>
          </FormField>
        ) : null}
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
          label="Obbligatorio"
          checked={values.isRequired}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              isRequired: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Visibile in tabella"
          checked={values.showInTable}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              showInTable: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Usabile nei filtri"
          checked={values.useInFilters}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              useInFilters: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Incluso negli export"
          checked={values.includeInExport}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              includeInExport: event.target.checked,
            }))
          }
          disabled={isSaving}
        />
        <Checkbox
          label="Campo attivo"
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
