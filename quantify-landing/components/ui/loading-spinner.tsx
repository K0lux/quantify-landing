// ============================================
// components/ui/loading-spinner.tsx - Loading Spinner
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colorClasses = {
  primary: 'text-blue-600',
  secondary: 'text-slate-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  color = 'primary'
}: LoadingSpinnerProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 
          className={cn(
            'animate-spin',
            sizeClasses[size],
            colorClasses[color]
          )} 
        />
        {text && (
          <p className={cn('text-sm font-medium', colorClasses[color])}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

// Variants spécialisés
export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <LoadingSpinner 
        size="lg" 
        text="Chargement..." 
        className="text-center"
      />
    </div>
  )
}

export function LoadingButton({ 
  className, 
  size = 'sm' 
}: { 
  className?: string
  size?: 'sm' | 'md' 
}) {
  return (
    <LoadingSpinner 
      size={size}
      color="secondary"
      className={cn('mr-2', className)} 
    />
  )
}

export function LoadingCard({ 
  text = 'Chargement...',
  className 
}: { 
  text?: string
  className?: string 
}) {
  return (
    <div className={cn(
      'flex items-center justify-center p-8 bg-white rounded-lg border border-slate-200',
      className
    )}>
      <LoadingSpinner 
        size="md" 
        text={text}
      />
    </div>
  )
}

export function LoadingInline({ 
  text,
  size = 'sm' 
}: { 
  text?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <LoadingSpinner size={size} />
      {text && <span className="text-sm text-slate-600">{text}</span>}
    </div>
  )
}