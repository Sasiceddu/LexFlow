import { useState, type FormEvent } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { FormErrorMessage } from '../../../components/shared/FormErrorMessage'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Button } from '../../../components/ui/Button'
import { FormField } from '../../../components/ui/FormField'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Textarea } from '../../../components/ui/Textarea'
import { useAdvancePractice } from '../../../hooks/useAdvancePractice'
import { useConfigurableFields } from '../../../hooks/useConfigurableFields'
import { useDropdownMenus } from '../../../hooks/useDropdownMenus'
import type {
  JsonObject,
  JsonValue,
  PracticeAvailableTransition,
  PracticeDetail,
} from '../../../types/practice.types'
import { getErrorMessage } from '../../../utils/errors'
import { toOptionalText } from '../../../utils/strings'
import { getActivePhaseFields } from '../utils/getActivePhaseFields'
import { PhaseFieldsForm } from './PhaseFieldsForm'

type AdvancePracticeModalProps = {
  isOpen: boolean
  onClose: () => void
  practice: PracticeDetail
  transition: PracticeAvailableTransition
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

export function AdvancePracticeModal({
  isOpen,
  onClose,
  practice,
  transition,
}: AdvancePracticeModalProps) {
  const fieldsQuery = useConfigurableFields()
  const menusQuery = useDropdownMenus()
  const advanceMutation = useAdvancePractice(practice.id)
  const [occurredAt, setOccurredAt] = useState('')
  const [notes, setNotes] = useState('')
  const [phaseData, setPhaseData] = useState<JsonObject>({})
  const [formError, setFormError] = useState<string | null>(null)

  const fields = fieldsQuery.data ?? []
  const menus = menusQuery.data ?? []
  const phaseFields = getActivePhaseFields(fields, transition.toPhaseId)
  const isLoadingFields = fieldsQuery.isPending || menusQuery.isPending
  const isSaving = advanceMutation.isPending

  function handlePhaseFieldChange(
    technicalKey: string,
    value: JsonValue | undefined,
  ) {
    setPhaseData((current) => {
      if (value === undefined) {
        const next = { ...current }

        delete next[technicalKey]
        return next
      }

      return { ...current, [technicalKey]: value }
    })
  }

  function handleClose() {
    setOccurredAt('')
    setNotes('')
    setPhaseData({})
    setFormError(null)
    onClose()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const missingField = phaseFields.find(
      (field) => field.isRequired && !isFilledValue(phaseData[field.technicalKey]),
    )

    if (missingField) {
      setFormError(`Il campo "${missingField.label}" e obbligatorio.`)
      return
    }

    setFormError(null)

    try {
      await advanceMutation.mutateAsync({
        notes: toOptionalText(notes) ?? undefined,
        occurredAt: occurredAt || undefined,
        phaseData: Object.keys(phaseData).length > 0 ? phaseData : undefined,
        transitionId: transition.id,
      })
      handleClose()
    } catch (error: unknown) {
      setFormError(getErrorMessage(error, 'Impossibile avanzare la pratica.'))
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Conferma azione: ${transition.actionLabel}`}
    >
      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="detail-grid">
          <div className="detail-field">
            <span>Fase attuale</span>
            <strong>{practice.currentPhase.name}</strong>
          </div>
          <div className="detail-field">
            <span>Fase di destinazione</span>
            <strong>{transition.toPhaseName}</strong>
          </div>
        </div>

        <FormField label="Data evento (opzionale)">
          <Input
            type="date"
            value={occurredAt}
            onChange={(event) => setOccurredAt(event.target.value)}
          />
        </FormField>

        <FormField label="Note (opzionale)">
          <Textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
          />
        </FormField>

        {isLoadingFields ? (
          <LoadingSpinner label="Caricamento campi fase" />
        ) : (
          <PhaseFieldsForm
            fields={phaseFields}
            menus={menus}
            values={phaseData}
            onChange={handlePhaseFieldChange}
          />
        )}

        {formError ? <FormErrorMessage message={formError} /> : null}

        <ActionRow>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Salvataggio...' : 'Conferma avanzamento'}
          </Button>
          <Button onClick={handleClose} disabled={isSaving}>
            Annulla
          </Button>
        </ActionRow>
      </form>
    </Modal>
  )
}
