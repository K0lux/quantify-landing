import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { Shield, Zap } from 'lucide-react'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Connexion Admin - Quantify',
  description: 'Accès réservé aux administrateurs Quantify',
}

export default async function AdminConnexionPage() {
  const user = await getCurrentUser()

  if (user) {
    const admin = await isAdmin()
    if (admin) {
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Administration</h1>
          <p className="text-white/60">Accès réservé aux administrateurs</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 text-orange-500 mb-6">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-bold">Connexion sécurisée</span>
          </div>

          <AdminLoginForm />
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-white/50 hover:text-white text-sm transition-colors">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  )
}
