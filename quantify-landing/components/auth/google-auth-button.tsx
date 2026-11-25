'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface GoogleAuthButtonProps {
  intent: 'login' | 'signup'
  redirectTo?: string
  disabled?: boolean
}

export function GoogleAuthButton({
  intent,
  redirectTo = '/dashboard',
  disabled = false,
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogleAuth() {
    setError(null)
    setIsLoading(true)

    try {
      const callbackUrl = new URL('/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('next', redirectTo)
      callbackUrl.searchParams.set('intent', intent)

      const { error: authError } = await createClient().auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: { prompt: 'select_account' },
        },
      })

      if (authError) {
        setError('La connexion avec Google a échoué. Veuillez réessayer.')
        setIsLoading(false)
      }
    } catch {
      setError('Une erreur réseau est survenue. Veuillez réessayer.')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleAuth}
        disabled={disabled || isLoading}
        className={cn(
          'w-full py-3 px-6 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold',
          'hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20',
          'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
          'flex items-center justify-center gap-3',
        )}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <span className="text-lg font-bold text-blue-600" aria-hidden="true">G</span>
        )}
        {isLoading ? 'Redirection vers Google...' : 'Continuer avec Google'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
