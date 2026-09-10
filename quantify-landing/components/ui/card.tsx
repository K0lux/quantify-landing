// ============================================
// components/ui/card.tsx - Card Components
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { ReactNode, forwardRef } from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-sm',
  outline: 'bg-transparent border-2 border-gray-200',
  ghost: 'bg-gray-50/50 border border-transparent',
  elevated: 'bg-white border border-gray-200 shadow-lg'
}

const paddingVariants = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg transition-colors',
        cardVariants[variant],
        paddingVariants[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: ReactNode
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    >
      {children}
    </Component>
  )
)
CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode
}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  )
)
CardDescription.displayName = 'CardDescription'

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardContent.displayName = 'CardContent'

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  align?: 'start' | 'center' | 'end' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'start', children, ...props }, ref) => {
    const alignmentClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center pt-4',
          alignmentClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardFooter.displayName = 'CardFooter'

// Composants de cartes spécialisées
export interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: ReactNode
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  trend, 
  icon, 
  className 
}: StatsCardProps) {
  return (
    <Card variant="default" className={cn('hover:shadow-md transition-shadow', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {trend && (
          <p className={cn(
            'text-xs mt-1 flex items-center gap-1',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            {Math.abs(trend.value)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export interface FeatureCardProps {
  title: string
  description: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  action, 
  className 
}: FeatureCardProps) {
  return (
    <Card variant="outline" className={cn('hover:border-gray-300 transition-colors', className)}>
      <CardHeader>
        {icon && <div className="text-gray-600 mb-2">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {action && (
        <CardFooter>
          <button
            onClick={action.onClick}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {action.label} →
          </button>
        </CardFooter>
      )}
    </Card>
  )
}

export interface NotificationCardProps {
  title: string
  message: string
  timestamp: string
  read?: boolean
  type?: 'info' | 'success' | 'warning' | 'error'
  onMarkAsRead?: () => void
  onDismiss?: () => void
  className?: string
}

export function NotificationCard({
  title,
  message,
  timestamp,
  read = false,
  type = 'info',
  onMarkAsRead,
  onDismiss,
  className
}: NotificationCardProps) {
  const typeColors = {
    info: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-yellow-500',
    error: 'border-l-red-500'
  }

  return (
    <Card 
      variant="ghost" 
      padding="sm"
      className={cn(
        'border-l-4 transition-all',
        typeColors[type],
        read ? 'opacity-75' : '',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{timestamp}</span>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{message}</p>
      </CardContent>
      {!read && onMarkAsRead && (
        <CardFooter>
          <button
            onClick={onMarkAsRead}
            className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            Mark as read
          </button>
        </CardFooter>
      )}
    </Card>
  )
}