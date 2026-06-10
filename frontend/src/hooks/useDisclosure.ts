import { useState } from 'react'

export function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return {
    close: () => setIsOpen(false),
    isOpen,
    open: () => setIsOpen(true),
    toggle: () => setIsOpen((current) => !current),
  }
}
