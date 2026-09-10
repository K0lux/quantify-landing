'use client'

import Link from 'next/link'
import { Zap, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import type { User } from '@supabase/supabase-js'

export function AdminHeader({ user }: { user: User }) {
  const { signOut } = useAuth()

  return (
    <header className="bg-blue-900 border-b border-blue-800 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Quantify</span>
              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-bold rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Voir le site
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {(user.email?.charAt(0) || '?').toUpperCase()}
              </div>
              <button
                onClick={signOut}
                className="p-2 text-white/50 hover:text-white transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
