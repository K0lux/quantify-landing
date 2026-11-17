'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
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

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden max-w-48 truncate text-sm text-slate-600 sm:block">{user.email}</div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-800" aria-hidden="true">
                  {(user.email?.charAt(0) || '?').toUpperCase()}
                </div>
                <button
                  onClick={signOut}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  title="Se déconnecter"
                  aria-label="Se déconnecter"
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
