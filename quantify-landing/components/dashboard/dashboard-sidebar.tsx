
// ============================================
// components/dashboard/dashboard-sidebar.tsx
// ============================================
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, Users, Trophy, Settings, HelpCircle, 
  Zap, BarChart3, Gift 
} from 'lucide-react'

export function DashboardSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Parrainages', href: '/dashboard/referrals', icon: Users },
    { name: 'Progression', href: '/dashboard/progress', icon: Trophy },
    { name: 'Récompenses', href: '/dashboard/rewards', icon: Gift },
    { name: 'Statistiques', href: '/dashboard/stats', icon: BarChart3 },
    { name: 'Paramètres', href: '/dashboard/settings', icon: Settings },
    { name: 'Aide', href: '/dashboard/help', icon: HelpCircle },
  ]

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-900">Statut Premium</p>
              <p className="text-slate-600">Bientôt disponible</p>
            </div>
          </div>
          <Link
            href="/dashboard/premium"
            className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
          >
            En savoir plus
          </Link>
        </div>
      </div>
    </aside>
  )
}