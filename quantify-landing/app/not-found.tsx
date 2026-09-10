// ============================================
// app/not-found.tsx
// ============================================

'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center text-white max-w-2xl">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 opacity-20 blur-3xl" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Page introuvable
        </h2>
        
        <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Page précédente
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-slate-400 mb-4">Pages populaires :</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { name: 'Solution', href: '/solution' },
              { name: 'Marché', href: '/marche' },
              { name: 'Équipe', href: '/equipe' },
              { name: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}