import type { ReactNode } from 'react'
import { Button } from './Button'

type ModalProps = {
  children: ReactNode
  footer?: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
}

export function Modal({ children, footer, isOpen, onClose, title }: ModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="modal-panel"
        role="dialog"
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <Button aria-label="Chiudi finestra" onClick={onClose}>
            Chiudi
          </Button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </section>
    </div>
  )
}
