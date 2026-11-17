'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Bell, Mail, MessageSquare,
  FileEdit, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const nav = [
  { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
  { name: 'Waitlist', href: '/admin/waitlist', icon: Users },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Contenu', href: '/admin/content', icon: FileEdit },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`hidden lg:flex flex-col bg-blue-900 text-white min-h-[calc(100vh-64px)] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <nav className="flex-1 p-3 space-y-1">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-4 text-white/50 hover:text-white transition-colors border-t border-white/10 flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </aside>
  )
}
