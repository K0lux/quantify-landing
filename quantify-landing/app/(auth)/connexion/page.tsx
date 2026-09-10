import { Metadata } from 'next'
import { Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Connexion - Quantify',
  description: 'Connectez-vous à votre compte Quantify pour accéder à votre tableau de bord.',
}

export default function ConnexionPage() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-blue-600" />
        </div>
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
