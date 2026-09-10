'use client'

import Link from 'next/link'
import { Zap, Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export function DashboardHeader() {
  const { signOut, user } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-slate-900">Quantify</span>
          </Link>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {(user.email?.charAt(0) || '?').toUpperCase()}
                </div>
                <button
                  onClick={signOut}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
