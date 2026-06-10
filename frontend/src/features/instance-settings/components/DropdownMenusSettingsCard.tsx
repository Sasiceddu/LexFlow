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
  useCreateDropdownMenu,
  useCreateDropdownOption,
  useDeleteDropdownMenu,
  useDeleteDropdownOption,
  useDropdownMenus,
  useUpdateDropdownMenu,
  useUpdateDropdownOption,
} from '../../../hooks/useDropdownMenus'
import { useDisclosure } from '../../../hooks/useDisclosure'
import type {
  DropdownMenu,
  DropdownOption,
} from '../../../types/dropdownMenu.types'
import { formatPluralCount, joinCountParts } from '../../../utils/formatCount'
import {
  DropdownMenuForm,
  type DropdownMenuFormValues,
} from './DropdownMenuForm'
import { DropdownMenuItem } from './DropdownMenuItem'
import {
  DropdownOptionForm,
  type DropdownOptionFormValues,
} from './DropdownOptionForm'

type ActiveForm =
  | { menu?: DropdownMenu; type: 'menu' }
  | { menu: DropdownMenu; option?: DropdownOption; type: 'option' }
  | null

type DeleteTarget =
  | { menu: DropdownMenu; type: 'menu' }
  | { option: DropdownOption; type: 'option' }
  | null

function toOptionalText(value: string): string | null {
  const normalized = value.trim()

  return normalized.length > 0 ? normalized : null
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function DropdownMenusSettingsCard() {
  const menusQuery = useDropdownMenus()
  const createMenuMutation = useCreateDropdownMenu()
  const updateMenuMutation = useUpdateDropdownMenu()
  const deleteMenuMutation = useDeleteDropdownMenu()
  const createOptionMutation = useCreateDropdownOption()
  const updateOptionMutation = useUpdateDropdownOption()
  const deleteOptionMutation = useDeleteDropdownOption()
  const formModal = useDisclosure()
  const deleteDialog = useDisclosure()
  const [activeForm, setActiveForm] = useState<ActiveForm>(null)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const menus = menusQuery.data ?? []
  const optionCount = menus.reduce((total, menu) => total + menu.options.length, 0)
  const isSaving =
    createMenuMutation.isPending ||
    updateMenuMutation.isPending ||
    deleteMenuMutation.isPending ||
    createOptionMutation.isPending ||
    updateOptionMutation.isPending ||
    deleteOptionMutation.isPending

  function openForm(form: ActiveForm) {
    setActiveForm(form)
    setActionError(null)
    formModal.open()
  }

  async function handleMenuSubmit(values: DropdownMenuFormValues) {
    setActionError(null)

    try {
      const input = {
        isActive: values.isActive,
        name: values.name.trim(),
        scope: toOptionalText(values.scope),
        technicalKey: values.technicalKey.trim() || undefined,
      }

      if (activeForm?.type === 'menu' && activeForm.menu) {
        await updateMenuMutation.mutateAsync({
          id: activeForm.menu.id,
          input,
        })
      } else {
        await createMenuMutation.mutateAsync(input)
      }

      formModal.close()
      setActiveForm(null)
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile salvare il menu.'))
    }
  }

  async function handleOptionSubmit(values: DropdownOptionFormValues) {
    if (activeForm?.type !== 'option') {
      return
    }

    setActionError(null)

    try {
      const input = {
        isActive: values.isActive,
        label: values.label.trim(),
        order: values.order,
        triggersPecBlock: values.triggersPecBlock,
        value: values.value.trim() || undefined,
      }

      if (activeForm.option) {
        await updateOptionMutation.mutateAsync({
          id: activeForm.option.id,
          input,
        })
      } else {
        await createOptionMutation.mutateAsync({
          menuId: activeForm.menu.id,
          input,
        })
      }

      formModal.close()
      setActiveForm(null)
    } catch (error: unknown) {
      setActionError(getErrorMessage(error, 'Impossibile salvare l opzione.'))
    }
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    setActionError(null)

    try {
      if (deleteTarget.type === 'menu') {
        await deleteMenuMutation.mutateAsync(deleteTarget.menu.id)
      } else {
        await deleteOptionMutation.mutateAsync(deleteTarget.option.id)
      }

      setDeleteTarget(null)
      deleteDialog.close()
    } catch (error: unknown) {
      setActionError(
        getErrorMessage(error, 'Impossibile completare lo spostamento.'),
      )
    }
  }

  function getFormTitle() {
    if (activeForm?.type === 'option') {
      return activeForm.option ? 'Modifica opzione' : 'Aggiungi opzione'
    }

    return activeForm?.menu ? 'Modifica menu' : 'Aggiungi menu'
  }

  return (
    <ExpandableCard
      title="Menu a tendina personalizzabili"
      description="Questa sezione serve per gestire le opzioni dei campi configurabili di tipo menu a tendina. Quando crei un campo con scelta da elenco, le alternative disponibili vengono gestite qui e compariranno automaticamente nel relativo campo della pratica."
    >
      <p className="section-meta">
        {joinCountParts([
          formatPluralCount(menus.length, 'menu', 'menu'),
          formatPluralCount(optionCount, 'opzione', 'opzioni'),
        ])}
      </p>

      <ActionRow>
        <Button onClick={() => openForm({ type: 'menu' })} variant="primary">
          Aggiungi menu
        </Button>
      </ActionRow>

      {menusQuery.isPending ? (
        <LoadingSpinner label="Caricamento menu a tendina" />
      ) : null}

      {menusQuery.error ? (
        <ErrorMessage
          title="Menu a tendina non disponibili"
          message={menusQuery.error.message}
        />
      ) : null}

      {actionError ? (
        <ErrorMessage title="Operazione non completata" message={actionError} />
      ) : null}

      {!menusQuery.isPending && !menusQuery.error ? (
        menus.length > 0 ? (
          <div className="dropdown-menu-list">
            {menus.map((menu) => (
              <DropdownMenuItem
                key={menu.id}
                menu={menu}
                onAddOption={(selectedMenu) =>
                  openForm({ menu: selectedMenu, type: 'option' })
                }
                onDeleteMenu={(selectedMenu) => {
                  setDeleteTarget({ menu: selectedMenu, type: 'menu' })
                  deleteDialog.open()
                }}
                onDeleteOption={(option) => {
                  setDeleteTarget({ option, type: 'option' })
                  deleteDialog.open()
                }}
                onEditMenu={(selectedMenu) =>
                  openForm({ menu: selectedMenu, type: 'menu' })
                }
                onEditOption={(option) =>
                  openForm({ menu, option, type: 'option' })
                }
                onTogglePecBlock={(option) =>
                  void updateOptionMutation.mutateAsync({
                    id: option.id,
                    input: { triggersPecBlock: !option.triggersPecBlock },
                  })
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nessun menu"
            message="Non sono presenti menu a tendina attivi nel database locale."
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
        {activeForm?.type === 'option' ? (
          <DropdownOptionForm
            initialOption={activeForm.option}
            isSaving={isSaving}
            onCancel={() => {
              setActiveForm(null)
              formModal.close()
            }}
            onSubmit={handleOptionSubmit}
          />
        ) : (
          <DropdownMenuForm
            initialMenu={activeForm?.type === 'menu' ? activeForm.menu : undefined}
            isSaving={isSaving}
            onCancel={() => {
              setActiveForm(null)
              formModal.close()
            }}
            onSubmit={handleMenuSubmit}
          />
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        isConfirming={isSaving}
        title="Conferma spostamento"
        message={
          deleteTarget?.type === 'menu'
            ? `Disattivare il menu ${deleteTarget.menu.name}?`
            : deleteTarget?.type === 'option'
              ? `Cestinare l opzione ${deleteTarget.option.label}?`
              : 'Confermare l operazione?'
        }
        confirmLabel={deleteTarget?.type === 'menu' ? 'Disattiva' : 'Cestina'}
        onCancel={() => {
          setDeleteTarget(null)
          deleteDialog.close()
        }}
        onConfirm={() => void handleConfirmDelete()}
      />
    </ExpandableCard>
  )
}
