// ============================================
// components/ui/error-boundary.tsx - Error Boundary React
// ============================================

'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from './button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: React.ComponentType<ErrorBoundaryState>
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log l'erreur en production
    if (process.env.NODE_ENV === 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  retry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }))
  }

  render() {
    if (this.state.hasError) {
      // Utiliser le fallback personnalisé si fourni
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent {...this.state} />
      }

      // Fallback par défaut
      return <DefaultErrorFallback {...this.state} onRetry={this.retry} />
    }

    return this.props.children
  }
}

// ==========================================
// FALLBACK PAR DÉFAUT
// ==========================================

interface DefaultErrorFallbackProps extends ErrorBoundaryState {
  onRetry: () => void
}

function DefaultErrorFallback({ error, onRetry, retryCount }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Une erreur inattendue s'est produite
        </h2>
        
        <p className="text-slate-600 mb-6">
          Nous nous excusons pour ce désagrément. L'équipe technique a été notifiée 
          et travaille à résoudre le problème.
        </p>

        {/* Message d'erreur en développement */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <summary className="cursor-pointer font-medium text-red-800 mb-2">
              Détails de l'erreur (dev)
            </summary>
            <pre className="text-xs text-red-700 whitespace-pre-wrap overflow-auto">
              {error.message}
              {'\n'}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} disabled={retryCount >= 3}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {retryCount >= 3 ? 'Limite atteinte' : 'Réessayer'}
          </Button>
          
          <Button variant="outline" asChild>
            <a href="/">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </a>
          </Button>
        </div>

        {retryCount >= 3 && (
          <p className="mt-4 text-sm text-slate-500">
            Si le problème persiste, veuillez{' '}
            <a href="/contact" className="text-blue-600 hover:underline">
              contacter le support
            </a>
          </p>
        )}
      </div>
    </div>
  )
}

// ==========================================
// HOC ERROR BOUNDARY
// ==========================================

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorBoundaryState>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}