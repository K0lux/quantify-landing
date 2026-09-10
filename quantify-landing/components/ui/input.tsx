// ============================================
// components/ui/input.tsx - Input Components
// ============================================

'use client'

import { cn } from '@/lib/utils'
import { Eye, EyeOff, X, Check, AlertCircle } from 'lucide-react'
import { ReactNode, forwardRef, useState, useId } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  variant?: 'default' | 'filled' | 'underlined'
  inputSize?: 'sm' | 'md' | 'lg'
  clearable?: boolean
  onClear?: () => void
}

const inputVariants = {
  default: 'border border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
  filled: 'border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
  underlined: 'border-0 border-b border-gray-300 bg-transparent rounded-none focus:border-blue-500 focus:ring-0 focus:ring-offset-0'
}

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label,
    error,
    success,
    hint,
    leftIcon,
    rightIcon,
    variant = 'default',
    inputSize = 'md',
    clearable = false,
    onClear,
    disabled,
    value,
    ...props 
  }, ref) => {
    const id = useId()
    const hasError = !!error
    const hasSuccess = !!success
    const showClear = clearable && value && !disabled

    const handleClear = () => {
      onClear?.()
    }

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={id} 
            className={cn(
              'block text-sm font-medium',
              hasError ? 'text-red-700' : 'text-gray-700',
              disabled && 'text-gray-400'
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            ref={ref}
            type={type}
            className={cn(
              'flex w-full rounded-md transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100',
              'placeholder:text-gray-400',
              inputVariants[variant],
              inputSizes[inputSize],
              leftIcon && 'pl-10',
              (rightIcon || showClear || hasError || hasSuccess) && 'pr-10',
              hasError && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              hasSuccess && 'border-green-300 focus:border-green-500 focus:ring-green-500',
              className
            )}
            disabled={disabled}
            value={value}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {hasSuccess && !hasError && (
              <Check className="h-4 w-4 text-green-500" />
            )}
            {showClear && !hasError && !hasSuccess && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            {rightIcon && !showClear && !hasError && !hasSuccess && rightIcon}
          </div>
        </div>
        
        {/* Messages */}
        {error && (
          <p className="text-xs text-red-600 mt-1">{error}</p>
        )}
        {success && !error && (
          <p className="text-xs text-green-600 mt-1">{success}</p>
        )}
        {hint && !error && !success && (
          <p className="text-xs text-gray-500 mt-1">{hint}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

// Input avec mot de passe
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showToggle?: boolean
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <Input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        rightIcon={
          showToggle ? (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : undefined
        }
        {...props}
      />
    )
  }
)
PasswordInput.displayName = 'PasswordInput'

// Input de recherche
export interface SearchInputProps extends Omit<InputProps, 'type'> {
  onSearch?: (value: string) => void
  searchDelay?: number
}

export function SearchInput({ 
  onSearch, 
  searchDelay = 300, 
  onChange,
  ...props 
}: SearchInputProps) {
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout>()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Call original onChange if provided
    onChange?.(e)
    
    // Handle search with debounce
    if (onSearch) {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      
      const timeout = setTimeout(() => {
        onSearch(value)
      }, searchDelay)
      
      setSearchTimeout(timeout)
    }
  }

  return (
    <Input
      type="search"
      onChange={handleChange}
      placeholder="Search..."
      clearable
      {...props}
    />
  )
}

// Groupe d'inputs
export interface InputGroupProps {
  children: ReactNode
  label?: string
  error?: string
  hint?: string
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md'
  className?: string
}

export function InputGroup({
  children,
  label,
  error,
  hint,
  orientation = 'vertical',
  spacing = 'sm',
  className
}: InputGroupProps) {
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
    <div className={cn('space-y-1', className)}>
      {label && (
        <label className={cn(
          'block text-sm font-medium',
          error ? 'text-red-700' : 'text-gray-700'
        )}>
          {label}
        </label>
      )}
      
      <div className={cn(
        'flex',
        orientationClasses[orientation],
        spacingClasses[spacing]
      )}>
        {children}
      </div>
      
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  )
}

// Input numérique avec contrôles
export interface NumberInputProps extends Omit<InputProps, 'type'> {
  min?: number
  max?: number
  step?: number
  showControls?: boolean
  onIncrement?: () => void
  onDecrement?: () => void
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ 
    min, 
    max, 
    step = 1, 
    showControls = true,
    onIncrement,
    onDecrement,
    value,
    onChange,
    disabled,
    ...props 
  }, ref) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : (value as number) || 0

    const handleIncrement = () => {
      if (disabled) return
      
      const newValue = numericValue + step
      const clampedValue = max !== undefined ? Math.min(newValue, max) : newValue
      
      const syntheticEvent = {
        target: { value: clampedValue.toString() }
      } as React.ChangeEvent<HTMLInputElement>
      
      onChange?.(syntheticEvent)
      onIncrement?.()
    }

    const handleDecrement = () => {
      if (disabled) return
      
      const newValue = numericValue - step
      const clampedValue = min !== undefined ? Math.max(newValue, min) : newValue
      
      const syntheticEvent = {
        target: { value: clampedValue.toString() }
      } as React.ChangeEvent<HTMLInputElement>
      
      onChange?.(syntheticEvent)
      onDecrement?.()
    }

    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rightIcon={
          showControls ? (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || (max !== undefined && numericValue >= max)}
                className="px-1 py-0.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || (min !== undefined && numericValue <= min)}
                className="px-1 py-0.5 text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▼
              </button>
            </div>
          ) : undefined
        }
        {...props}
      />
    )
  }
)
NumberInput.displayName = 'NumberInput'

// Input avec autocomplétion
export interface AutocompleteInputProps extends Omit<InputProps, 'onChange'> {
  suggestions: string[]
  onSelect?: (value: string) => void
  onChange?: (value: string) => void
  maxSuggestions?: number
}

export function AutocompleteInput({
  suggestions,
  onSelect,
  onChange,
  maxSuggestions = 10,
  value,
  ...props
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange?.(inputValue)
    
    if (inputValue) {
      const filtered = suggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, maxSuggestions)
      
      setFilteredSuggestions(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setIsOpen(false)
    }
  }

  const handleSelect = (suggestion: string) => {
    onChange?.(suggestion)
    onSelect?.(suggestion)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onFocus={() => {
          if (filteredSuggestions.length > 0) {
            setIsOpen(true)
          }
        }}
        {...props}
      />
      
      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}