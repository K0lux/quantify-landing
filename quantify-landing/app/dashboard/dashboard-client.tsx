'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { UnifiedUserData } from '@/lib/services/user-service'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { WaitlistStatus } from '@/components/dashboard/waitlist-status'
import { EnergyDashboard } from '@/components/dashboard/energy-dashboard'
import { ProfileCompletion } from '@/components/dashboard/profile-completion'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react'

interface DashboardClientProps {
  initialData: UnifiedUserData
  hasError?: boolean
  errorMessage?: string
}

interface DashboardState {
  userData: UnifiedUserData
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  showProfileCompletion: boolean
  syncSuccessBanner: boolean
}

export function DashboardClient({ 
  initialData, 
  hasError = false, 
  errorMessage 
}: DashboardClientProps) {
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  
  const [state, setState] = useState<DashboardState>({
    userData: initialData,
    isLoading: hasError,
    error: hasError ? errorMessage || null : null,
    lastUpdated: hasError ? null : new Date(),
    showProfileCompletion: !initialData.userProfile?.onboarding_completed,
    syncSuccessBanner: initialData.syncStatus.isFromWaitlist && initialData.syncStatus.syncCompleted
  })

  const refreshUserData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const response = await fetch('/api/user/profile?include_waitlist=true', {
        method: 'GET',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setState(prev => ({
          ...prev,
          userData: result.data,
          isLoading: false,
          error: null,
          lastUpdated: new Date()
        }))
      } else {
        throw new Error(result.message || 'Erreur de récupération des données')
      }

    } catch (error) {
      console.error('[Dashboard] Refresh error:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }))
    }
  }

  const dismissProfileCompletion = () => {
    setState(prev => ({ ...prev, showProfileCompletion: false }))
  }

  const dismissSyncBanner = () => {
    setState(prev => ({ ...prev, syncSuccessBanner: false }))
  }

  useEffect(() => {
    const interval = setInterval(refreshUserData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-slate-600">Chargement de votre espace...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<DashboardError onRetry={refreshUserData} />}>
      <div className="min-h-screen bg-slate-50">
        <DashboardHeader 
          user={state.userData}
          onRefresh={refreshUserData}
          isLoading={state.isLoading}
          lastUpdated={state.lastUpdated}
        />

        {state.syncSuccessBanner && (
          <div className="bg-green-50 border-b border-green-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">
                    Vos données de la liste d&apos;attente ont été synchronisées avec succès !
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissSyncBanner}
                  className="text-green-800 hover:text-green-900"
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
        )}

        {state.showProfileCompletion && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <ProfileCompletion 
                userProfile={state.userData.userProfile}
                onDismiss={dismissProfileCompletion}
                onComplete={refreshUserData}
              />
            </div>
          </div>
        )}

        {state.error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{state.error}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshUserData}
                    disabled={state.isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
                    Réessayer
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        <div className="flex">
          <DashboardSidebar 
            user={state.userData}
            className="hidden lg:block"
          />

          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              <WaitlistStatus 
                userData={state.userData}
                isLoading={state.isLoading}
                onRefresh={refreshUserData}
              />

              {state.userData.userProfile?.subscription_status === 'active' || 
               state.userData.waitlistData?.status === 'converted' ? (
                <EnergyDashboard 
                  userData={state.userData}
                  isLoading={state.isLoading}
                />
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="text-center max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Gestion énergétique bientôt disponible
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Votre tableau de bord énergétique sera activé dès votre invitation ou conversion.
                    </p>
                    {state.userData.waitlistData && (
                      <p className="text-sm text-slate-500">
                        Position actuelle: #{state.userData.waitlistData.position}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {process.env.NODE_ENV === 'development' && (
                <details className="bg-slate-100 rounded-lg p-4 text-xs font-mono">
                  <summary className="cursor-pointer font-bold">Debug Info</summary>
                  <pre className="mt-4 overflow-auto">
                    {JSON.stringify(state.userData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}

function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Oups ! Une erreur est survenue
        </h2>
        <p className="text-slate-600 mb-6">
          Nous n&apos;arrivons pas à charger votre tableau de bord. 
          Veuillez réessayer ou contacter le support si le problème persiste.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
          <Button variant="outline" asChild>
            <a href="/contact">Contacter le support</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardClient
