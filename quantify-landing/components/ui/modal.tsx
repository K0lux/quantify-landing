// ============================================
// components/ui/modal.tsx - Modal Component
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { ReactNode, useEffect, useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  className?: string
  overlayClassName?: string
  contentClassName?: string
  preventBodyScroll?: boolean
  initialFocus?: 'close' | 'content' | 'none'
  onAfterOpen?: () => void
  onAfterClose?: () => void
}

const sizeVariants = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full m-4'
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closable = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className,
  overlayClassName,
  contentClassName,
  preventBodyScroll = true,
  initialFocus = 'close',
  onAfterOpen,
  onAfterClose
}: ModalProps) {
  const [mounted, setMounted] = useState(false)
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'leaving' | 'left'>('left')
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Mount/unmount logic
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Animation logic
  useEffect(() => {
    if (isOpen) {
      setAnimationState('entering')
      const timer = setTimeout(() => {
        setAnimationState('entered')
        onAfterOpen?.()
      }, 10)
      return () => clearTimeout(timer)
    } else if (animationState === 'entered') {
      setAnimationState('leaving')
      const timer = setTimeout(() => {
        setAnimationState('left')
        onAfterClose?.()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, animationState, onAfterOpen, onAfterClose])

  // Body scroll prevention
  useEffect(() => {
    if (!preventBodyScroll) return

    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen, preventBodyScroll])

  // Focus management
  useEffect(() => {
    if (!isOpen) return

    // Store previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Set initial focus
    const timer = setTimeout(() => {
      if (initialFocus === 'close' && closeButtonRef.current) {
        closeButtonRef.current.focus()
      } else if (initialFocus === 'content' && contentRef.current) {
        const firstFocusable = contentRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement
        firstFocusable?.focus()
      }
    }, 10)

    return () => {
      clearTimeout(timer)
      // Restore focus to previously focused element
      previousActiveElement.current?.focus()
    }
  }, [isOpen, initialFocus])

  // Escape key handler
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEscape && closable) {
      onClose()
    }
  }, [onClose, closeOnEscape, closable])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  // Focus trap
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusableElements = contentRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (!focusableElements || focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  // Click handler
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current && closeOnOverlayClick && closable) {
      onClose()
    }
  }, [onClose, closeOnOverlayClick, closable])

  if (!mounted || animationState === 'left') {
    return null
  }

  const modalContent = (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/80 backdrop-blur-sm transition-opacity duration-200',
        animationState === 'entering' && 'opacity-0',
        animationState === 'entered' && 'opacity-100',
        animationState === 'leaving' && 'opacity-0',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={contentRef}
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl',
          'transform transition-all duration-200',
          animationState === 'entering' && 'scale-95 opacity-0',
          animationState === 'entered' && 'scale-100 opacity-100',
          animationState === 'leaving' && 'scale-95 opacity-0',
          sizeVariants[size],
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className={cn(
            'flex items-center justify-between p-6 pb-4',
            !title && !description && showCloseButton && 'pb-0'
          )}>
            <div className="flex-1">
              {title && (
                <h2 
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p 
                  id="modal-description"
                  className={cn(
                    'text-sm text-gray-600',
                    title && 'mt-1'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && closable && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'px-6',
          (title || description || showCloseButton) ? 'pb-6' : 'py-6',
          className
        )}>
          {children}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

// Composants de modal spécialisés
export interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) {
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      closable={!loading}
      closeOnEscape={!loading}
      closeOnOverlayClick={!loading}
    >
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'border border-gray-300 bg-white text-gray-700',
              'hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
              variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700'
            )}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  actionText?: string
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  actionText = 'OK'
}: AlertModalProps) {
  const typeStyles = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  const defaultTitles = {
    info: 'Information',
    success: 'Success',
    warning: 'Warning',
    error: 'Error'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitles[type]}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md transition-colors',
              'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {actionText}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Hook pour gérer l'état des modals
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const toggleModal = useCallback(() => setIsOpen(!isOpen), [isOpen])

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal
  }
}

// Hook pour les modals de confirmation
export function useConfirmModal() {
  const { isOpen, openModal, closeModal } = useModal()
  const [config, setConfig] = useState<Partial<ConfirmModalProps>>({})

  const confirm = useCallback((options: Omit<ConfirmModalProps, 'isOpen' | 'onClose'>) => {
    return new Promise<boolean>((resolve) => {
      setConfig({
        ...options,
        onConfirm: () => {
          options.onConfirm()
          resolve(true)
          closeModal()
        }
      })
      openModal()
    })
  }, [openModal, closeModal])

  const ConfirmModalComponent = useCallback((props: Partial<ConfirmModalProps>) => (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      {...config}
      {...props}
    />
  ), [isOpen, closeModal, config])

  return {
    confirm,
    ConfirmModal: ConfirmModalComponent,
    isOpen,
    closeModal
  }
}