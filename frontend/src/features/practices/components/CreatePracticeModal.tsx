import { useState, type FormEvent } from 'react'
import { ErrorMessage } from '../../../components/shared/ErrorMessage'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Modal } from '../../../components/ui/Modal'
import { useConfigurableFields } from '../../../hooks/useConfigurableFields'
import { useCreatePractice } from '../../../hooks/usePractices'
import { useDropdownMenus } from '../../../hooks/useDropdownMenus'
import type {
  CollaboratorOverviewItem,
  ProfessionalOverviewItem,
} from '../../../types/instanceSettings.types'
import type { ConfigurableField } from '../../../types/configurableField.types'
import type {
  CreatePracticePayload,
  JsonObject,
  JsonValue,
} from '../../../types/practice.types'
import { getErrorMessage } from '../../../utils/errors'
import { toOptionalText } from '../../../utils/strings'
import {
  findDropdownMenuByTechnicalKeyOrName,
  getDropdownOptionsByMenuId,
} from '../utils/dropdownHelpers'
import { PracticeConfigurableFieldsForm } from './PracticeConfigurableFieldsForm'
import {
  PracticeGeneralForm,
  type PracticeGeneralFormValues,
} from './PracticeGeneralForm'
import { PracticeFormActions } from './PracticeFormActions'

type CreatePracticeModalProps = {
  collaborators: CollaboratorOverviewItem[]
  isOpen: boolean
  onClose: () => void
  professionals: ProfessionalOverviewItem[]
}

const emptyGeneralValues: PracticeGeneralFormValues = {
  activityType: '',
  collaboratorId: '',
  depositDate: '',
  hearingDate: '',
  judicialAuthority: '',
  notes: '',
  office: '',
  professionalId: '',
  requestedAmount: '',
}

function isFilledValue(value: JsonValue | undefined): boolean {
  if (value === undefined || value === null) {
    return false
  }

  if (typeof value === 'string') {
    return value.trim().length > 0
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value)
  }

  return true
}

function validateRequiredFields(
  fields: ConfigurableField[],
  customData: JsonObject,
): string | null {
  const missingField = fields.find(
    (field) =>
      field.scope === 'GENERAL' &&
      field.isActive &&
      field.isRequired &&
      field.fieldType !== 'FILE' &&
      !isFilledValue(customData[field.technicalKey]),
  )

  return missingField
    ? `Il campo configurabile "${missingField.label}" e obbligatorio.`
    : null
}

function toPayload(
  generalValues: PracticeGeneralFormValues,
  customData: JsonObject,
): CreatePracticePayload {
  return {
    activityType: toOptionalText(generalValues.activityType),
    collaboratorId: toOptionalText(generalValues.collaboratorId),
    customData: Object.keys(customData).length > 0 ? customData : undefined,
    depositDate: toOptionalText(generalValues.depositDate),
    hearingDate: generalValues.hearingDate,
    judicialAuthority: toOptionalText(generalValues.judicialAuthority),
    notes: toOptionalText(generalValues.notes),
    office: toOptionalText(generalValues.office),
    professionalId: toOptionalText(generalValues.professionalId),
    requestedAmount: toOptionalText(generalValues.requestedAmount),
  }
}

export function CreatePracticeModal({
  collaborators,
  isOpen,
  onClose,
  professionals,
}: CreatePracticeModalProps) {
  const fieldsQuery = useConfigurableFields()
  const menusQuery = useDropdownMenus()
  const createPracticeMutation = useCreatePractice()
  const [generalValues, setGeneralValues] =
    useState<PracticeGeneralFormValues>(emptyGeneralValues)
  const [customData, setCustomData] = useState<JsonObject>({})
  const [formError, setFormError] = useState<string | null>(null)
  const fields = fieldsQuery.data ?? []
  const menus = menusQuery.data ?? []
  const activityMenu = findDropdownMenuByTechnicalKeyOrName(
    menus,
    'tipologia_attivita',
    'Tipologia attivita',
  )
  const activityOptions = getDropdownOptionsByMenuId(
    menus,
    activityMenu?.id ?? null,
  )
  const isSaving =
    createPracticeMutation.isPending || fieldsQuery.isPending || menusQuery.isPending

  function resetForm() {
    setGeneralValues(emptyGeneralValues)
    setCustomData({})
    setFormError(null)
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  function handleCustomFieldChange(
    technicalKey: string,
    value: JsonValue | undefined,
  ) {
    setCustomData((current) => {
      if (value === undefined) {
        const next = { ...current }

        delete next[technicalKey]
        return next
      }

      return {
        ...current,
        [technicalKey]: value,
      }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!generalValues.hearingDate) {
      setFormError('La data interrogatorio/udienza e obbligatoria.')
      return
    }

    const requiredFieldError = validateRequiredFields(fields, customData)

    if (requiredFieldError) {
      setFormError(requiredFieldError)
      return
    }

    setFormError(null)

    try {
      await createPracticeMutation.mutateAsync(toPayload(generalValues, customData))
      handleClose()
    } catch (error: unknown) {
      setFormError(getErrorMessage(error, 'Impossibile creare la pratica.'))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nuova pratica">
      <form className="stack-form" onSubmit={handleSubmit}>
        {fieldsQuery.isPending || menusQuery.isPending ? (
          <LoadingSpinner label="Caricamento configurazione pratica" />
        ) : null}

        {fieldsQuery.error ? (
          <ErrorMessage
            title="Campi configurabili non disponibili"
            message={fieldsQuery.error.message}
          />
        ) : null}

        {menusQuery.error ? (
          <ErrorMessage
            title="Menu a tendina non disponibili"
            message={menusQuery.error.message}
          />
        ) : null}

        <PracticeGeneralForm
          activityOptions={activityOptions}
          collaborators={collaborators}
          professionals={professionals}
          values={generalValues}
          onChange={setGeneralValues}
        />

        {!fieldsQuery.isPending && !menusQuery.isPending ? (
          <PracticeConfigurableFieldsForm
            fields={fields}
            menus={menus}
            values={customData}
            onChange={handleCustomFieldChange}
          />
        ) : null}

        {formError ? <FormErrorMessage message={formError} /> : null}

        <PracticeFormActions isSaving={isSaving} onCancel={handleClose} />
      </form>
    </Modal>
  )
}
