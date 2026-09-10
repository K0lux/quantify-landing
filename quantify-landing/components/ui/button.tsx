// ============================================
// components/ui/button.tsx - Enhanced Button Component
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { LoadingSpinner } from './loading-spinner'
import { Slot } from '@radix-ui/react-slot'
import { ReactNode, forwardRef } from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loading?: boolean
  loadingText?: string
  asChild?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const buttonVariants = {
  default: 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:ring-gray-900',
  destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-gray-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-900',
  ghost: 'text-gray-900 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-900',
  link: 'text-gray-900 underline-offset-4 hover:underline focus-visible:ring-gray-900'
}

const sizeVariants = {
  default: 'h-10 px-4 py-2 text-sm',
  sm: 'h-9 px-3 py-1 text-xs',
  lg: 'h-11 px-8 py-2 text-base',
  icon: 'h-10 w-10 p-0'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    loading = false,
    loadingText,
    asChild = false,
    leftIcon,
    rightIcon,
    disabled,
    children,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : 'button'
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner variant="button" size="sm" />
            {loadingText || 'Loading...'}
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className={cn(size === 'icon' ? 'sr-only' : '')}>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

// Variants de boutons spécialisés
export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'leftIcon' | 'rightIcon' | 'children'> {
  icon: ReactNode
  'aria-label': string
  size?: 'sm' | 'default' | 'lg'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'default', className, ...props }, ref) => {
    const iconSizes = {
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12'
    }

    return (
      <Button
        ref={ref}
        size="icon"
        className={cn(iconSizes[size], className)}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = 'IconButton'

export interface CTAButtonProps extends Omit<ButtonProps, 'variant'> {
  gradient?: boolean
  pulse?: boolean
}

export const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ gradient = true, pulse = false, className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="default"
        size="lg"
        className={cn(
          gradient && [
            'bg-gradient-to-r from-blue-600 to-purple-600',
            'hover:from-blue-700 hover:to-purple-700',
            'focus-visible:ring-blue-600'
          ],
          pulse && 'animate-pulse',
          'shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
CTAButton.displayName = 'CTAButton'

export interface ButtonGroupProps {
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md'
  className?: string
}

export function ButtonGroup({ 
  children, 
  orientation = 'horizontal', 
  spacing = 'sm', 
  className 
}: ButtonGroupProps) {
  const orientationClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4'
  }

  return (
    <div 
      className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  )
}

// Composants de boutons contextuels
export interface ConfirmButtonProps extends Omit<ButtonProps, 'onClick'> {
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  requireConfirmation?: boolean
}

export function ConfirmButton({
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  requireConfirmation = true,
  children,
  ...props
}: ConfirmButtonProps) {
  const handleClick = () => {
    if (requireConfirmation) {
      const confirmed = window.confirm(`Are you sure you want to ${children?.toString().toLowerCase()}?`)
      if (confirmed) {
        onConfirm()
      } else {
        onCancel?.()
      }
    } else {
      onConfirm()
    }
  }

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  textToCopy: string
  successMessage?: string
  onCopySuccess?: () => void
  onCopyError?: (error: Error) => void
}

export function CopyButton({
  textToCopy,
  successMessage = 'Copied!',
  onCopySuccess,
  onCopyError,
  children,
  ...props
}: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      onCopySuccess?.()
      
      // Optional: Show temporary success feedback
      // This could be enhanced with a toast system
      console.log(successMessage)
    } catch (error) {
      const err = error as Error
      onCopyError?.(err)
      console.error('Copy failed:', err)
    }
  }

  return (
    <Button onClick={handleCopy} {...props}>
      {children}
    </Button>
  )
}

export interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  href: string
  filename?: string
  onDownloadStart?: () => void
  onDownloadError?: (error: Error) => void
}

export function DownloadButton({
  href,
  filename,
  onDownloadStart,
  onDownloadError,
  children,
  ...props
}: DownloadButtonProps) {
  const handleDownload = () => {
    try {
      onDownloadStart?.()
      
      const link = document.createElement('a')
      link.href = href
      if (filename) {
        link.download = filename
      }
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      const err = error as Error
      onDownloadError?.(err)
      console.error('Download failed:', err)
    }
  }

  return (
    <Button onClick={handleDownload} {...props}>
      {children}
    </Button>
  )
}
/* // ============================================
// components/ui/button.tsx (shadcn/ui style)
// ============================================
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-slate-900 text-white hover:bg-slate-800': variant === 'default',
            'bg-red-500 text-white hover:bg-red-600': variant === 'destructive',
            'border border-slate-200 bg-white hover:bg-slate-100': variant === 'outline',
            'bg-slate-100 text-slate-900 hover:bg-slate-200': variant === 'secondary',
            'hover:bg-slate-100': variant === 'ghost',
            'underline-offset-4 hover:underline text-slate-900': variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }*/