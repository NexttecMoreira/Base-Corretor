import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useLockBodyScroll, useOnEscape } from '@/lib/hooks'
import { IconClose } from '@/components/icons'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  label: string
  size?: 'md' | 'lg' | 'sheet'
}

export function Modal({ open, onClose, children, label, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useLockBodyScroll(open)
  useOnEscape(onClose, open)

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={panelRef}
        className={`${styles.panel} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar"
        >
          <IconClose />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
