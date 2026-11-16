'use client'

import Link from 'next/link'
import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { QWordmark } from '@/components/brand/QMark'

export function DashboardHeader() {
  const { signOut, user } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <QWordmark height={27} variant="dark" />
          </Link>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#FF8C42] to-[#E04400] rounded-full flex items-center justify-center text-white font-bold text-sm">
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
