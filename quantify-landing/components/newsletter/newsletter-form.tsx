// ============================================
// components/newsletter/newsletter-form.tsx
// ============================================
'use client'

import { useState } from 'react'
import { Check, Loader2, Mail } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erreur lors de l\'inscription')
      }

      setSubmitted(true)
      setEmail('')

      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 lg:flex-row">
      <div className="flex-1 relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="email"
          required
          aria-label="Votre adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          className="min-h-12 w-full rounded-lg border border-slate-600 bg-slate-700 py-3 pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading || submitted}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-3 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 lg:w-auto"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : submitted ? (
          <>
            <Check className="w-5 h-5" />
            <span className="hidden sm:inline">Inscrit !</span>
          </>
        ) : (
          <span>S&apos;inscrire</span>
        )}
      </button>
    </form>
  )
}
