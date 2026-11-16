import { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { QWordmark } from '@/components/brand/QMark'

export const metadata: Metadata = {
  title: 'Connexion - Quantify',
  description: 'Connectez-vous à votre compte Quantify pour accéder à votre tableau de bord.',
}

export default function ConnexionPage() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#E04400] p-8 text-center">
        <QWordmark height={34} variant="white" className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">
          Connexion
        </h1>
        <p className="text-white/90">
          Accédez à votre espace Quantify
        </p>
      </div>

      <div className="p-8">
        <LoginForm />
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
