// ============================================
// components/ui/alert.tsx - Alert Component
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { ReactNode, useState } from 'react'

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  className?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
}

const alertVariants = {
  default: 'bg-blue-50 border-blue-200 text-blue-900',
  destructive: 'bg-red-50 border-red-200 text-red-900',
  success: 'bg-green-50 border-green-200 text-green-900',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-900'
}

const iconVariants = {
  default: Info,
  destructive: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle
}

const iconColorVariants = {
  default: 'text-blue-600',
  destructive: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600'
}

export function Alert({ 
  variant = 'default', 
  className, 
  children, 
  dismissible = false,
  onDismiss,
  ...props 
}: AlertProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) {
    return null
  }

  const Icon = iconVariants[variant]

  return (
    <div
      className={cn(
        'relative w-full rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorVariants[variant])} />
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors',
              iconColorVariants[variant]
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}

// Variants spécialisés
export function SuccessAlert({ 
  title, 
  children, 
  dismissible = true,
  onDismiss,
  className 
}: {
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}) {
  return (
    <Alert 
      variant="success" 
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function ErrorAlert({ 
  title, 
  children, 
  dismissible = true,
  onDismiss,
  className 
}: {
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}) {
  return (
    <Alert 
      variant="destructive" 
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function WarningAlert({ 
  title, 
  children, 
  dismissible = true,
  onDismiss,
  className 
}: {
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}) {
  return (
    <Alert 
      variant="warning" 
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export function InfoAlert({ 
  title, 
  children, 
  dismissible = true,
  onDismiss,
  className 
}: {
  title?: string
  children: ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}) {
  return (
    <Alert 
      variant="default" 
      dismissible={dismissible}
      onDismiss={onDismiss}
      className={className}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}