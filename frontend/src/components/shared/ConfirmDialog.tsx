import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { ActionRow } from './ActionRow'

type ConfirmDialogProps = {
  cancelLabel?: string
  confirmLabel?: string
  isConfirming?: boolean
  isOpen: boolean
  message: string
  onCancel: () => void
  onConfirm: () => void
  title: string
}

export function ConfirmDialog({
  cancelLabel = 'Annulla',
  confirmLabel = 'Conferma',
  isConfirming = false,
  isOpen,
  message,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      footer={
        <ActionRow>
          <Button onClick={onConfirm} disabled={isConfirming} variant="danger">
            {isConfirming ? 'Operazione in corso...' : confirmLabel}
          </Button>
          <Button onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>
        </ActionRow>
      }
    >
      <p>{message}</p>
    </Modal>
  )
}
