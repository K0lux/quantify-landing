// ============================================
// app/error.tsx - CORRIGÉ avec "use client"
// ============================================
'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Oups ! Une erreur est survenue
        </h2>
        <p className="text-slate-600 mb-6">
          Nous sommes désolés, quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}