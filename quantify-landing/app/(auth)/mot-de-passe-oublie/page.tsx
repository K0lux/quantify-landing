'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap, ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Une erreur est survenue')
        return
      }

      setSent(true)
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Mot de passe oublié
        </h1>
        <p className="text-white/90">
          Réinitialisez votre mot de passe
        </p>
      </div>

      <div className="p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Email envoyé !</h2>
            <p className="text-slate-600 mb-6">
              Si un compte existe avec l&apos;email <strong>{email}</strong>,
              vous recevrez un lien de réinitialisation.
            </p>
            <Link
              href="/connexion"
              className="text-blue-600 font-semibold hover:text-blue-800"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <p className="text-slate-600 text-sm">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <div>
              <label htmlFor="reset-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="reset-email"
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

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien'
              )}
            </button>

            <p className="text-center text-sm text-slate-600">
              <Link href="/connexion" className="text-blue-600 font-semibold hover:text-blue-800">
                Retour à la connexion
              </Link>
            </p>
          </form>
        )}
      </div>

      <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
