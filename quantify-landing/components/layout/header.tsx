'use client'

import { useAuth } from '@/hooks/use-auth'
import { useWaitlistModal } from '@/hooks/use-waitlist-modal'
import { QWordmark } from '@/components/brand/QMark'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { open } = useWaitlistModal()
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMobileMenuOpen])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Solution', href: '/solution' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 lg:top-6 lg:left-6 lg:right-6 z-50 transition-all duration-300 rounded-2xl lg:rounded-3xl border ${
      isMobileMenuOpen ? 'overflow-hidden' : ''
    } ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border border-slate-700/50' : 'bg-slate-900/60 backdrop-blur-md border border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-2 z-10">
            <QWordmark height={26} variant="white" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-yellow-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {authLoading ? (
              <div className="hidden sm:block w-24 h-9" />
            ) : isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white hover:text-yellow-400 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/connexion"
                  className="px-4 py-2 text-sm font-semibold text-white hover:text-yellow-400 transition-colors"
                >
                  Connexion
                </Link>
                <button
                  onClick={open}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                >
                  Rejoindre
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="site-mobile-nav"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div id="site-mobile-nav" className="max-h-[calc(100svh-5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-slate-900/98 backdrop-blur-xl lg:hidden">
          <nav className="px-4 py-3 sm:px-6 sm:py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex min-h-11 items-center rounded-xl px-3 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  pathname === item.href
                    ? 'bg-white/10 text-yellow-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-yellow-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false) }}
                  className="w-full min-h-11 rounded-xl px-3 text-left text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  Connexion
                </Link>
                <button
                  onClick={() => {
                    open()
                    setIsMobileMenuOpen(false)
                  }}
                  className="mt-3 min-h-12 w-full rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-3 font-semibold text-slate-950 shadow-sm transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Rejoindre la liste d&apos;attente
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
