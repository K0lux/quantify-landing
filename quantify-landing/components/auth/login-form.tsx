'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps {
  className?: string
  redirectTo?: string
}

export function LoginForm({ className, redirectTo: redirectToProp = '/dashboard' }: LoginFormProps) {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || redirectToProp
  const [supabase] = useState(() => createClient())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email ou mot de passe incorrect. Avez-vous créé votre compte sur /creer-compte ?')
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Veuillez confirmer votre email avant de vous connecter')
        } else {
          setError(authError.message || 'Erreur de connexion')
        }
        setIsLoading(false)
        return
      }

      if (!data.session) {
        setError('Session non créée. Veuillez réessayer.')
        setIsLoading(false)
        return
      }

      window.location.replace(redirectTo)
    } catch {
      setError('Une erreur réseau est survenue. Veuillez réessayer.')
      setIsLoading(false)
    }
  }, [email, password, redirectTo, supabase])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      noValidate
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Adresse email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="votre@email.com"
            required
            disabled={isLoading}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="login-password" className="block text-sm font-semibold text-slate-800">
            Mot de passe
          </label>
          <Link
            href="/mot-de-passe-oublie"
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            required
            disabled={isLoading}
            className="w-full pl-11 pr-12 py-3 border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className={cn(
          'w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200',
          'bg-gradient-to-r from-blue-600 to-purple-600',
          'hover:from-blue-700 hover:to-purple-700',
          'focus:ring-4 focus:ring-blue-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Connexion en cours...
          </>
        ) : (
          'Se connecter'
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link href="/rejoindre" className="text-blue-600 font-semibold hover:text-blue-800">
          Rejoindre la waitlist
        </Link>
      </p>
    </form>
  )
}
