// ============================================
// components/ui/toast.tsx - Toast Notifications
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ToastProps extends Toast {
  onClose: (id: string) => void
  isVisible: boolean
  position: ToastPosition
}

export type ToastPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'top-center' 
  | 'bottom-center'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-900',
  error: 'bg-red-50 border-red-200 text-red-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900'
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500'
}

function ToastComponent({
  id,
  type,
  title,
  message,
  persistent,
  action,
  onClose,
  isVisible,
  position
}: ToastProps) {
  const [mounted, setMounted] = useState(false)
  const Icon = iconMap[type]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    onClose(id)
  }

  if (!mounted) return null

  const positionStyles = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  }

  const animationClasses = {
    'top-left': isVisible ? 'animate-in slide-in-from-left-full' : 'animate-out slide-out-to-left-full',
    'top-right': isVisible ? 'animate-in slide-in-from-right-full' : 'animate-out slide-out-to-right-full',
    'bottom-left': isVisible ? 'animate-in slide-in-from-left-full' : 'animate-out slide-out-to-left-full',
    'bottom-right': isVisible ? 'animate-in slide-in-from-right-full' : 'animate-out slide-out-to-right-full',
    'top-center': isVisible ? 'animate-in slide-in-from-top' : 'animate-out slide-out-to-top',
    'bottom-center': isVisible ? 'animate-in slide-in-from-bottom' : 'animate-out slide-out-to-bottom'
  }

  return (
    <div
      className={cn(
        'fixed z-[100] w-full max-w-sm pointer-events-auto',
        positionStyles[position],
        animationClasses[position]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn(
        'relative flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        'transform transition-all duration-300 ease-out',
        typeStyles[type]
      )}>
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[type])} />
        
        <div className="flex-1 space-y-1">
          {title && (
            <div className="text-sm font-semibold">{title}</div>
          )}
          <div className="text-sm opacity-90">{message}</div>
          
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium underline hover:no-underline transition-all"
            >
              {action.label}
            </button>
          )}
        </div>
        
        {!persistent && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors opacity-70 hover:opacity-100"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Progress bar for duration */}
        {!persistent && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
            <div 
              className="h-full bg-current opacity-30 transition-all ease-linear"
              style={{
                animation: `toast-progress ${(typeof window !== 'undefined' ? 5 : 0)}s linear`
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// Context pour gérer les toasts
interface ToastContextType {
  toasts: (Toast & { isVisible: boolean })[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
  position: ToastPosition
  setPosition: (position: ToastPosition) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export function ToastProvider({ 
  children, 
  position: initialPosition = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<(Toast & { isVisible: boolean })[]>([])
  const [position, setPosition] = useState<ToastPosition>(initialPosition)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateId()
    const newToast: Toast & { isVisible: boolean } = {
      id,
      duration: 5000,
      persistent: false,
      ...toastData,
      isVisible: true
    }

    setToasts(current => {
      const updated = [newToast, ...current]
      // Limiter le nombre de toasts
      if (updated.length > maxToasts) {
        return updated.slice(0, maxToasts)
      }
      return updated
    })

    // Auto-remove non-persistent toasts
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [maxToasts])

  const removeToast = useCallback((id: string) => {
    // Animation de sortie
    setToasts(current =>
      current.map(toast =>
        toast.id === id ? { ...toast, isVisible: false } : toast
      )
    )

    // Supprimer après animation
    setTimeout(() => {
      setToasts(current => current.filter(toast => toast.id !== id))
    }, 300)
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      clearAllToasts,
      position,
      setPosition
    }}>
      {children}
      {typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {toasts.map(toast => (
            <ToastComponent
              key={toast.id}
              {...toast}
              onClose={removeToast}
              position={position}
            />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

// Hook simplifié pour les notifications courantes
export function useNotifications() {
  const { addToast } = useToast()

  const success = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', message, title, ...options })
  }, [addToast])

  const error = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', message, title, ...options })
  }, [addToast])

  const warning = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', message, title, ...options })
  }, [addToast])

  const info = useCallback((message: string, title?: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', message, title, ...options })
  }, [addToast])

  return {
    success,
    error,
    warning,
    info,
    custom: addToast
  }
}

// Composant pour afficher les toasts (optionnel, si vous voulez plus de contrôle)
interface ToastContainerProps {
  position?: ToastPosition
  className?: string
}

export function ToastContainer({ position = 'top-right', className }: ToastContainerProps) {
  const { toasts, removeToast } = useToast()

  const positionStyles = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2'
  }

  return (
    <div className={cn(
      'fixed z-[100] p-4 space-y-2 pointer-events-none',
      positionStyles[position],
      className
    )}>
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          {...toast}
          onClose={removeToast}
          position={position}
        />
      ))}
    </div>
  )
}

// Styles CSS à ajouter à votre fichier global (globals.css)
export const toastStyles = `
@keyframes toast-progress {
  from { width: 100%; }
  to { width: 0%; }
}

@keyframes slide-in-from-right-full {
  from { transform: translateX(100%); }
  to { transform: translateX(0%); }
}

@keyframes slide-out-to-right-full {
  from { transform: translateX(0%); }
  to { transform: translateX(100%); }
}

@keyframes slide-in-from-left-full {
  from { transform: translateX(-100%); }
  to { transform: translateX(0%); }
}

@keyframes slide-out-to-left-full {
  from { transform: translateX(0%); }
  to { transform: translateX(-100%); }
}

@keyframes slide-in-from-top {
  from { transform: translateY(-100%); }
  to { transform: translateY(0%); }
}

@keyframes slide-out-to-top {
  from { transform: translateY(0%); }
  to { transform: translateY(-100%); }
}

@keyframes slide-in-from-bottom {
  from { transform: translateY(100%); }
  to { transform: translateY(0%); }
}

@keyframes slide-out-to-bottom {
  from { transform: translateY(0%); }
  to { transform: translateY(100%); }
}

.animate-in {
  animation-duration: 200ms;
  animation-fill-mode: forwards;
}

.animate-out {
  animation-duration: 150ms;
  animation-fill-mode: forwards;
}
`