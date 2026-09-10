import { Metadata } from 'next'
import { Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'

export const metadata: Metadata = {
  title: 'Créer un compte - Quantify',
  description: 'Créez votre compte Quantify. Vous devez être inscrit sur la waitlist pour créer un compte.',
}

export default function CreerComptePage() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-8 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Créer votre compte
        </h1>
        <p className="text-white/90">
          Activez votre accès Quantify avec votre email waitlist
        </p>
      </div>

      <div className="p-8">
        <RegisterForm />
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
