'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { label: 'Vue générale', href: '/dashboard' },
  { label: 'Parrainages', href: '/dashboard/referrals' },
  { label: 'Progression', href: '/dashboard/progress' },
  { label: 'Récompenses', href: '/dashboard/rewards' },
  { label: 'Paramètres', href: '/dashboard/settings' },
  { label: 'Aide', href: '/dashboard/help' },
]

export function DashboardNavigation() {
  const pathname = usePathname()

  return (
    <div className="border-b border-slate-200 bg-white">
      <nav aria-label="Navigation du compte" className="mx-auto grid max-w-7xl grid-cols-3 gap-1 px-4 py-2 sm:px-6 md:flex md:w-full md:justify-center md:gap-1 md:px-8 md:py-0">
        {navigation.map((item) => {
          const active = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex min-h-12 min-w-0 items-center justify-center border-b-2 px-1 text-center text-xs font-medium leading-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-700 sm:px-2 sm:text-sm md:min-h-0 md:whitespace-nowrap md:px-3 md:py-3 ${
                active
                  ? 'border-orange-600 text-orange-800'
                  : 'border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
