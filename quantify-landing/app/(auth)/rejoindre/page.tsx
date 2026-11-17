import { Metadata } from 'next'
import { ArrowLeft, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { WaitlistForm } from '@/components/waitlist/waitlist-form'
import { WaitlistCounter } from '@/components/waitlist/waitlist-counter'
import { QWordmark } from '@/components/brand/QMark'

export const metadata: Metadata = {
  title: 'Rejoindre Quantify - Inscription Liste d\'Attente',
  description: 'Inscrivez-vous gratuitement sur la liste d\'attente de Quantify. Soyez parmi les premiers à transformer votre gestion énergétique.',
  keywords: ['inscription quantify', 'waitlist', 'beta test', 'early access'],
}

export default function Rejoindre() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-5 text-center sm:p-8">
        <QWordmark height={34} variant="white" className="mx-auto mb-4" />
        <h1 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
          Rejoignez Quantify
        </h1>
        <p className="text-white/90">
          Soyez parmi les premiers à mieux maîtriser votre consommation énergétique.
        </p>
      </div>

      {/* Form */}
      <div className="p-4 sm:p-8">
        <Suspense fallback={<p className="text-center text-sm text-slate-500">Chargement du formulaire…</p>}>
          <WaitlistForm compact className="border-0 p-0 shadow-none" />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="space-y-4 border-t border-slate-200 bg-slate-50 px-4 py-5 sm:px-8 sm:py-6">
        <div className="text-center mb-4">
          <WaitlistCounter />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/creer-compte"
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors text-sm font-semibold"
          >
            <UserPlus className="w-4 h-4" />
            Déjà inscrit ? Créer mon compte
          </Link>
          <span className="hidden sm:inline text-slate-300">|</span>
          <Link
            href="/connexion"
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-semibold"
          >
            Se connecter
          </Link>
        </div>

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
