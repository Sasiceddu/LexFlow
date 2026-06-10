import { useState } from 'react'
import { ActionRow } from '../../../components/shared/ActionRow'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import { EmptyState } from '../../../components/shared/EmptyState'
import { ErrorMessage } from '../../../components/shared/ErrorMessage'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Button } from '../../../components/ui/Button'
import { ExpandableCard } from '../../../components/ui/ExpandableCard'
import { Modal } from '../../../components/ui/Modal'
import {
  useCreateWorkflow,
  useCreateWorkflowPhase,
  useCreateWorkflowTransition,
  useDeleteWorkflow,
  useDeleteWorkflowPhase,
  useDeleteWorkflowTransition,
  useUpdateWorkflow,
  useUpdateWorkflowPhase,
  useUpdateWorkflowTransition,
  useWorkflows,
} from '../../../hooks/useWorkflows'
import { useDisclosure } from '../../../hooks/useDisclosure'
import type {
  Workflow,
  WorkflowPhase,
  WorkflowPhaseInput,
  WorkflowTransition,
  WorkflowTransitionInput,
} from '../../../types/workflow.types'
import { formatPluralCount, joinCountParts } from '../../../utils/formatCount'
import { WorkflowForm, type WorkflowFormValues } from './WorkflowForm'
import {
  WorkflowPhaseForm,
  type WorkflowPhaseFormValues,
} from './WorkflowPhaseForm'
import {
  WorkflowTransitionForm,
  type WorkflowTransitionFormValues,
} from './WorkflowTransitionForm'
import { WorkflowItem } from './WorkflowItem'

type ActiveForm =
  | { type: 'workflow'; workflow?: Workflow }
  | { type: 'phase'; phase?: WorkflowPhase; workflow: Workflow }
  | {
      transition?: WorkflowTransition
      type: 'transition'
      workflow: Workflow
    }
  | null

type DeleteTarget =
  | { type: 'workflow'; workflow: Workflow }
  | { phase: WorkflowPhase; type: 'phase' }
  | { transition: WorkflowTransition; type: 'transition' }
  | null

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function toOptionalText(value: string): string | null {
  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}

function toPhaseInput(values: WorkflowPhaseFormValues): WorkflowPhaseInput {
  return {
    category: values.category,
    color: toOptionalText(values.color),
    description: toOptionalText(values.description),
    isActive: values.isActive,
    isFinal: values.isFinal,
    isInitial: values.isInitial,
    name: values.name.trim(),
    order: values.order,
    technicalKey: values.technicalKey.trim() || undefined,
  }
}

function toTransitionInput(
  values: WorkflowTransitionFormValues,
): WorkflowTransitionInput {
  return {
    actionLabel: values.actionLabel.trim(),
    fromPhaseId: values.fromPhaseId,
    isActive: values.isActive,
    order: values.order,
    technicalKey: values.technicalKey.trim() || undefined,
    toPhaseId: values.toPhaseId,
  }
}

function getWorkflowCountText(workflows: Workflow[]): string {
  const phaseCount = workflows.reduce(
    (total, workflow) => total + workflow.phases.length,
    0,
  )
  const transitionCount = workflows.reduce(
    (total, workflow) => total + workflow.transitions.length,
    0,
  )

  return joinCountParts([
    formatPluralCount(workflows.length, 'workflow', 'workflow'),
    formatPluralCount(phaseCount, 'fase', 'fasi'),
    formatPluralCount(transitionCount, 'transizione', 'transizioni'),
  ])
}

export function WorkflowsSettingsCard() {
  const workflowsQuery = useWorkflows()
  const createWorkflowMutation = useCreateWorkflow()
  const updateWorkflowMutation = useUpdateWorkflow()
  const deleteWorkflowMutation = useDeleteWorkflow()
  const createPhaseMutation = useCreateWorkflowPhase()
  const updatePhaseMutation = useUpdateWorkflowPhase()
  const deletePhaseMutation = useDeleteWorkflowPhase()
  const createTransitionMutation = useCreateWorkflowTransition()
  const updateTransitionMutation = useUpdateWorkflowTransition()
  const deleteTransitionMutation = useDeleteWorkflowTransition()
  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()
  const [activeForm, setActiveForm] = useState<ActiveForm>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const workflows = workflowsQuery.data ?? []
  const isSaving =
    createWorkflowMutation.isPending ||
    updateWorkflowMutation.isPending ||
    deleteWorkflowMutation.isPending ||
    createPhaseMutation.isPending ||
    updatePhaseMutation.isPending ||
    deletePhaseMutation.isPending ||
    createTransitionMutation.isPending ||
    updateTransitionMutation.isPending ||
    deleteTransitionMutation.isPending

  function openForm(form: ActiveForm) {
    setActiveForm(form)
    setActionError(null)
    formModal.open()
  }

  async function handleWorkflowSubmit(values: WorkflowFormValues) {
    setActionError(null)

    try {
      const input = {
        description: toOptionalText(values.description),
        isActive: values.isActive,
        isDefault: values.isDefault,
        name: values.name.trim(),
      }

      if (activeForm?.type === 'workflow' && activeForm.workflow) {
        await updateWorkflowMutation.mutateAsync({
          id: activeForm.workflow.id,
          input,
        })
      } else {
        await createWorkflowMutation.mutateAsync(input)
      }

      formModal.close()
      setActiveForm(null)
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile salvare il workflow.'))
    }
  }

  async function handlePhaseSubmit(values: WorkflowPhaseFormValues) {
    if (activeForm?.type !== 'phase') {
      return
    }

    setActionError(null)

    try {
      const input = toPhaseInput(values)

      if (activeForm.phase) {
        await updatePhaseMutation.mutateAsync({
          id: activeForm.phase.id,
          input,
        })
      } else {
        await createPhaseMutation.mutateAsync({
          input,
          workflowId: activeForm.workflow.id,
        })
      }

      formModal.close()
      setActiveForm(null)
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile salvare la fase.'))
    }
  }

  async function handleTransitionSubmit(values: WorkflowTransitionFormValues) {
    if (activeForm?.type !== 'transition') {
      return
    }

    setActionError(null)

    try {
      const input = toTransitionInput(values)

      if (activeForm.transition) {
        await updateTransitionMutation.mutateAsync({
          id: activeForm.transition.id,
          input,
        })
      } else {
        await createTransitionMutation.mutateAsync({
          input,
          workflowId: activeForm.workflow.id,
        })
      }

      formModal.close()
      setActiveForm(null)
    } catch (error: unknown) {
      setActionError(
        getErrorMessage(error, 'Impossibile salvare la transizione.'),
      )
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    setActionError(null)

    try {
      if (deleteTarget.type === 'workflow') {
        await deleteWorkflowMutation.mutateAsync(deleteTarget.workflow.id)
      } else if (deleteTarget.type === 'phase') {
        await deletePhaseMutation.mutateAsync(deleteTarget.phase.id)
      } else {
        await deleteTransitionMutation.mutateAsync(deleteTarget.transition.id)
      }

      setDeleteTarget(null)
      deleteDialog.close()
    } catch (error: unknown) {
      setActionError(
        getErrorMessage(error, 'Impossibile completare l operazione.'),
      )
    }
  }

  function getFormTitle() {
    if (activeForm?.type === 'phase') {
      return activeForm.phase ? 'Modifica fase' : 'Aggiungi fase'
    }

    if (activeForm?.type === 'transition') {
      return activeForm.transition
        ? 'Modifica transizione'
        : 'Aggiungi transizione'
    }

    return activeForm?.workflow ? 'Modifica workflow' : 'Aggiungi workflow'
  }

  return (
    <ExpandableCard
      title="Fasi e workflow"
      subtitle="Workflow attivi, fasi ordinate e transizioni configurate."
    >
      <p className="section-meta">{getWorkflowCountText(workflows)}</p>

      <ActionRow>
        <Button onClick={() => openForm({ type: 'workflow' })} variant="primary">
          Aggiungi workflow
        </Button>
      </ActionRow>

      {workflowsQuery.isPending ? (
        <LoadingSpinner label="Caricamento workflow" />
      ) : null}

      {workflowsQuery.error ? (
        <ErrorMessage
          title="Workflow non disponibili"
          message={workflowsQuery.error.message}
        />
      ) : null}

      {actionError ? (
        <ErrorMessage title="Operazione non completata" message={actionError} />
      ) : null}

      {!workflowsQuery.isPending && !workflowsQuery.error ? (
        workflows.length > 0 ? (
          <div className="workflow-list">
            {workflows.map((workflow) => (
              <WorkflowItem
                key={workflow.id}
                workflow={workflow}
                onAddPhase={(selectedWorkflow) =>
                  openForm({ type: 'phase', workflow: selectedWorkflow })
                }
                onAddTransition={(selectedWorkflow) =>
                  openForm({ type: 'transition', workflow: selectedWorkflow })
                }
                onDeletePhase={(phase) => {
                  setDeleteTarget({ phase, type: 'phase' })
                  deleteDialog.open()
                }}
                onDeleteTransition={(transition) => {
                  setDeleteTarget({ transition, type: 'transition' })
                  deleteDialog.open()
                }}
                onDeleteWorkflow={(selectedWorkflow) => {
                  setDeleteTarget({
                    type: 'workflow',
                    workflow: selectedWorkflow,
                  })
                  deleteDialog.open()
                }}
                onEditPhase={(selectedWorkflow, phase) =>
                  openForm({
                    phase,
                    type: 'phase',
                    workflow: selectedWorkflow,
                  })
                }
                onEditTransition={(selectedWorkflow, transition) =>
                  openForm({
                    transition,
                    type: 'transition',
                    workflow: selectedWorkflow,
                  })
                }
                onEditWorkflow={(selectedWorkflow) =>
                  openForm({
                    type: 'workflow',
                    workflow: selectedWorkflow,
                  })
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nessun workflow"
            message="Non sono presenti workflow attivi nel database locale."
          />
        )
      ) : null}

      <Modal
        isOpen={formModal.isOpen}
        onClose={() => {
          setActiveForm(null)
          setActionError(null)
          formModal.close()
        }}
        title={getFormTitle()}
      >
        {activeForm?.type === 'phase' ? (
          <WorkflowPhaseForm
            initialPhase={activeForm.phase}
            isSaving={isSaving}
            onCancel={() => {
              setActiveForm(null)
              formModal.close()
            }}
            onSubmit={handlePhaseSubmit}
          />
        ) : activeForm?.type === 'transition' ? (
          <WorkflowTransitionForm
            initialTransition={activeForm.transition}
            isSaving={isSaving}
            onCancel={() => {
              setActiveForm(null)
              formModal.close()
            }}
            onSubmit={handleTransitionSubmit}
            phases={activeForm.workflow.phases}
          />
        ) : (
          <WorkflowForm
            initialWorkflow={
              activeForm?.type === 'workflow' ? activeForm.workflow : undefined
            }
            isSaving={isSaving}
            onCancel={() => {
              setActiveForm(null)
              formModal.close()
            }}
            onSubmit={handleWorkflowSubmit}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        isConfirming={isSaving}
        title="Conferma operazione"
        message={
          deleteTarget?.type === 'workflow'
            ? `Disattivare il workflow ${deleteTarget.workflow.name}?`
            : deleteTarget?.type === 'phase'
              ? `Cestinare la fase ${deleteTarget.phase.name}?`
              : deleteTarget?.type === 'transition'
                ? `Disattivare la transizione ${deleteTarget.transition.actionLabel}?`
                : 'Confermare l operazione?'
        }
        confirmLabel={
          deleteTarget?.type === 'phase' ? 'Cestina' : 'Disattiva'
        }
        onCancel={() => {
          setDeleteTarget(null)
          deleteDialog.close()
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </ExpandableCard>
  )
}
