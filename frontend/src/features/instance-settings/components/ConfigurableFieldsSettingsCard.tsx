import { useState } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { ErrorMessage } from '../../../components/shared/ErrorMessage'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Button } from '../../../components/ui/Button'
import { ExpandableCard } from '../../../components/ui/ExpandableCard'
import { Modal } from '../../../components/ui/Modal'
import {
  useConfigurableFields,
  useCreateConfigurableField,
  useDeleteConfigurableField,
  useUpdateConfigurableField,
} from '../../../hooks/useConfigurableFields'
import { useDisclosure } from '../../../hooks/useDisclosure'
import { useInstanceSettingsOverview } from '../../../hooks/useInstanceSettingsOverview'
import type {
  ConfigurableField,
  ConfigurableFieldInput,
} from '../../../types/configurableField.types'
import { getErrorMessage } from '../../../utils/errors'
import { formatPluralCount } from '../../../utils/formatCount'
import {
  ConfigurableFieldForm,
  type ConfigurableFieldFormValues,
} from './ConfigurableFieldForm'
import { ConfigurableFieldList } from './ConfigurableFieldList'

function toOptionalId(value: string): string | null {
  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}

function toInput(values: ConfigurableFieldFormValues): ConfigurableFieldInput {
  return {
    dropdownMenuId:
      values.fieldType === 'DROPDOWN' ? toOptionalId(values.dropdownMenuId) : null,
    fieldType: values.fieldType,
    includeInExport: values.includeInExport,
    isActive: values.isActive,
    isRequired: values.isRequired,
    label: values.label.trim(),
    order: values.order,
    phaseId: values.scope === 'PHASE' ? toOptionalId(values.phaseId) : null,
    scope: values.scope,
    sectionKey: values.sectionKey,
    showInTable: values.showInTable,
    technicalKey: values.technicalKey.trim() || undefined,
    useInFilters: values.useInFilters,
  }
}

export function ConfigurableFieldsSettingsCard() {
  const fieldsQuery = useConfigurableFields()
  const overviewQuery = useInstanceSettingsOverview()
  const createMutation = useCreateConfigurableField()
  const updateMutation = useUpdateConfigurableField()
  const deleteMutation = useDeleteConfigurableField()
  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()
  const [activeField, setActiveField] = useState<ConfigurableField | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<ConfigurableField | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const fields = fieldsQuery.data ?? []
  const generalFields = fields.filter((field) => field.scope === 'GENERAL')
  const phaseFields = fields.filter((field) => field.scope === 'PHASE')
  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending

  function openForm(field?: ConfigurableField) {
    setActiveField(field)
    setActionError(null)
    formModal.open()
  }

  async function handleSubmit(values: ConfigurableFieldFormValues) {
    setActionError(null)

    try {
      if (activeField) {
        await updateMutation.mutateAsync({
          id: activeField.id,
          input: toInput(values),
        })
      } else {
        await createMutation.mutateAsync(toInput(values))
      }

      setActiveField(undefined)
      formModal.close()
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile salvare il campo.'))
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    setActionError(null)

    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      deleteDialog.close()
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile cestinare il campo.'))
    }
  }

  return (
    <ExpandableCard
      title="Campi configurabili"
      description="Questa sezione serve per personalizzare i dati da raccogliere nelle pratiche. Puoi aggiungere nuovi campi, modificarli, spostarli nelle sezioni corrette e decidere se devono comparire in tabelle, filtri o esportazioni."
    >
      <p className="section-meta">
        {formatPluralCount(fields.length, 'campo', 'campi')}
      </p>

      <ActionRow>
        <Button onClick={() => openForm()} variant="primary">
          Aggiungi campo
        </Button>
      </ActionRow>

      {fieldsQuery.isPending || overviewQuery.isPending ? (
        <LoadingSpinner label="Caricamento campi configurabili" />
      ) : null}

      {fieldsQuery.error ? (
        <ErrorMessage
          title="Campi configurabili non disponibili"
          message={fieldsQuery.error.message}
        />
      ) : null}

      {overviewQuery.error ? (
        <ErrorMessage
          title="Dati collegati non disponibili"
          message={overviewQuery.error.message}
        />
      ) : null}

      {actionError ? (
        <ErrorMessage title="Operazione non completata" message={actionError} />
      ) : null}

      {!fieldsQuery.isPending && !fieldsQuery.error ? (
        <div className="split-list">
          <ConfigurableFieldList
            fields={generalFields}
            scope="GENERAL"
            onDelete={(field) => {
              setDeleteTarget(field)
              deleteDialog.open()
            }}
            onEdit={openForm}
          />
          <ConfigurableFieldList
            fields={phaseFields}
            scope="PHASE"
            onDelete={(field) => {
              setDeleteTarget(field)
              deleteDialog.open()
            }}
            onEdit={openForm}
          />
        </div>
      ) : null}

      <Modal
        isOpen={formModal.isOpen}
        onClose={() => {
          setActiveField(undefined)
          setActionError(null)
          formModal.close()
        }}
        title={activeField ? 'Modifica campo' : 'Aggiungi campo'}
      >
        <ConfigurableFieldForm
          dropdownMenus={overviewQuery.data?.dropdownMenus ?? []}
          initialField={activeField}
          isSaving={isSaving}
          onCancel={() => {
            setActiveField(undefined)
            formModal.close()
          }}
          onSubmit={handleSubmit}
          phases={overviewQuery.data?.phases ?? []}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        isConfirming={isSaving}
        title="Conferma cestinamento"
        message={
          deleteTarget
            ? `Cestinare il campo ${deleteTarget.label}?`
            : 'Confermare il cestinamento del campo?'
        }
        confirmLabel="Cestina"
        onCancel={() => {
          setDeleteTarget(null)
          deleteDialog.close()
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </ExpandableCard>
  )
}
