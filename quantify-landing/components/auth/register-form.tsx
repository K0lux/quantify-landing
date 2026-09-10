'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, AlertCircle, Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface RegisterFormProps {
  className?: string
  prefilledEmail?: string
}

export function RegisterForm({ className, prefilledEmail }: RegisterFormProps) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState(prefilledEmail || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    match: password === confirmPassword && confirmPassword.length > 0,
  }

  const isPasswordValid = passwordChecks.length && passwordChecks.uppercase &&
    passwordChecks.lowercase && passwordChecks.number

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (!isPasswordValid) {
      setError('Le mot de passe ne respecte pas les critères de sécurité')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.message || 'Erreur lors de la création du compte')
        return
      }

      // Sign in on the browser client to establish the session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      setSuccess(true)

      if (signInError) {
        // Account created but auto-login failed, redirect to login
        setTimeout(() => {
          window.location.href = '/connexion'
        }, 1500)
      } else {
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch {
      setError('Une erreur réseau est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }, [email, password, confirmPassword, fullName, isPasswordValid, router, supabase])

  if (success) {
    return (
      <div className={cn('text-center', className)}>
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Compte créé !</h2>
        {needsConfirmation ? (
          <p className="text-slate-600">
            Un email de confirmation a été envoyé à <strong>{email}</strong>.
            Vérifiez votre boîte de réception pour activer votre compte.
          </p>
        ) : (
          <p className="text-slate-600">
            Redirection vers votre tableau de bord...
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('space-y-5', className)}
      noValidate
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Nom complet
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="reg-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            placeholder="Prénom Nom"
            required
            disabled={isLoading}
            className="w-full pl-11 pr-4 py-3 border-2 border-slate-300 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Email (utilisé lors de l&apos;inscription waitlist)
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="reg-email"
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
        <p className="text-xs text-slate-500 mt-1">
          Utilisez le même email que celui de votre inscription à la waitlist
        </p>
      </div>

      <div>
        <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Créez un mot de passe sécurisé"
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

        {password.length > 0 && (
          <div className="mt-2 space-y-1">
            {[
              { check: passwordChecks.length, label: 'Au moins 8 caractères' },
              { check: passwordChecks.uppercase, label: 'Une majuscule' },
              { check: passwordChecks.lowercase, label: 'Une minuscule' },
              { check: passwordChecks.number, label: 'Un chiffre' },
            ].map(({ check, label }) => (
              <p key={label} className={cn('text-xs flex items-center gap-1.5', check ? 'text-green-600' : 'text-slate-400')}>
                <CheckCircle className={cn('w-3.5 h-3.5', check ? 'text-green-500' : 'text-slate-300')} />
                {label}
              </p>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="reg-confirm" className="block text-sm font-semibold text-slate-800 mb-1.5">
          Confirmer le mot de passe
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Confirmez votre mot de passe"
            required
            disabled={isLoading}
            className={cn(
              'w-full pl-11 pr-4 py-3 border-2 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:outline-none transition-all duration-200 disabled:opacity-50',
              confirmPassword && !passwordChecks.match ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
            )}
          />
        </div>
        {confirmPassword && !passwordChecks.match && (
          <p className="text-red-600 text-xs mt-1">Les mots de passe ne correspondent pas</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !email || !password || !fullName || !passwordChecks.match || !isPasswordValid}
        className={cn(
          'w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-200',
          'bg-gradient-to-r from-yellow-500 to-orange-600',
          'hover:from-yellow-600 hover:to-orange-700',
          'focus:ring-4 focus:ring-yellow-500/50',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Création du compte...
          </>
        ) : (
          'Créer mon compte'
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-blue-600 font-semibold hover:text-blue-800">
          Se connecter
        </Link>
      </p>
    </form>
  )
}
