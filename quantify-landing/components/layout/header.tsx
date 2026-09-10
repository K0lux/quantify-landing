'use client'

import { useAuth } from '@/hooks/use-auth'
import { useWaitlistModal } from '@/hooks/use-waitlist-modal'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { open } = useWaitlistModal()
  const { isAuthenticated, isLoading: authLoading, signOut, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Solution', href: '/solution' },
    { name: 'Marché', href: '/marche' },
    { name: 'Équipe', href: '/equipe' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`fixed top-6 left-6 right-6 z-50 transition-all duration-300 rounded-3
      xl:rounded-4xl ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-lg shadow-lg border border-slate-700/50' : 'bg-slate-900/60 backdrop-blur-md border border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2 z-10">
            <Image
              src="/logo.svg"
              alt="Quantify"
              width={40}
              height={55}
              className="w-10 h-auto"
            />
            <span className="text-xl sm:text-2xl font-bold text-white">Quantify</span>
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
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
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
        <div className="lg:hidden bg-slate-900/98 backdrop-blur-xl border-t border-slate-800">
          <nav className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-base font-medium py-2 transition-colors ${
                  pathname === item.href
                    ? 'text-yellow-400'
                    : 'text-slate-300 hover:text-white'
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
                  className="block text-base font-medium py-2 text-yellow-400"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setIsMobileMenuOpen(false) }}
                  className="w-full text-left text-base font-medium py-2 text-slate-300 hover:text-white"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium py-2 text-slate-300 hover:text-white"
                >
                  Connexion
                </Link>
                <button
                  onClick={() => {
                    open()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg font-semibold mt-4"
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
