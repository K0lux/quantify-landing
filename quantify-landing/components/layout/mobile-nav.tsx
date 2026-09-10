// ============================================
// components/layout/mobile-nav.tsx
// ============================================
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Solution', href: '/solution' },
    { name: 'Marché', href: '/marche' },
    { name: 'Équipe', href: '/equipe' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-slate-900/98 backdrop-blur-xl border-t border-slate-800">
          <nav className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium py-2 transition-colors ${
                  pathname === item.href
                    ? 'text-yellow-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}