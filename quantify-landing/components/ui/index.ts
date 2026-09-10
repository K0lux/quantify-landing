// ============================================
// components/ui/index.ts - UI Components Index
// ============================================

// Basic components
export * from './button'
export * from './input'
export * from './card'
export * from './alert'
export * from './loading-spinner'
export * from './error-boundary'

// Advanced components
export * from './modal'
export * from './toast'

// Re-export commonly used types for convenience
export type { 
  ButtonProps, 
  IconButtonProps, 
  CTAButtonProps,
  ButtonGroupProps,
  ConfirmButtonProps,
  CopyButtonProps,
  DownloadButtonProps
} from './button'

export type {
  InputProps,
  PasswordInputProps,
  SearchInputProps,
  InputGroupProps,
  NumberInputProps,
  AutocompleteInputProps
} from './input'

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardFooterProps,
  StatsCardProps,
  FeatureCardProps,
  NotificationCardProps
} from './card'

export type {
  AlertProps
} from './alert'

export type {
  LoadingSpinnerProps
} from './loading-spinner'

export type {
  ErrorBoundaryProps,
  ErrorBoundaryState
} from './error-boundary'

export type {
  ModalProps,
  ConfirmModalProps,
  AlertModalProps
} from './modal'

export type {
  Toast,
  ToastProps,
  ToastPosition
} from './toast'