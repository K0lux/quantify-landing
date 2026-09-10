import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import {
  Users, Mail, TrendingUp, Clock,
  UserCheck, UserX, ArrowUpRight, ArrowDownRight,
  Activity
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin - Quantify',
  description: 'Panneau d\'administration Quantify',
}

async function getStats() {
  const supabase = createAdminSupabaseClient()

  const [
    waitlistRes,
    waitlistPendingRes,
    waitlistInvitedRes,
    newsletterRes,
  ] = await Promise.all([
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'invited'),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { count: todaySignups } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', today.toISOString())

  const { data: recentUsers } = await supabase
    .from('waitlist')
    .select('id, full_name, email, status, created_at, country, user_type')
    .order('created_at', { ascending: false })
    .limit(8)

  return {
    totalWaitlist: waitlistRes.count ?? 0,
    pendingWaitlist: waitlistPendingRes.count ?? 0,
    invitedWaitlist: waitlistInvitedRes.count ?? 0,
    totalNewsletter: newsletterRes.count ?? 0,
    todaySignups: todaySignups ?? 0,
    recentUsers: recentUsers ?? [],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      label: 'Waitlist totale',
      value: stats.totalWaitlist,
      icon: Users,
      color: 'blue',
      trend: stats.todaySignups > 0 ? `+${stats.todaySignups} aujourd'hui` : 'Aucun aujourd\'hui',
      trendUp: stats.todaySignups > 0,
    },
    {
      label: 'En attente',
      value: stats.pendingWaitlist,
      icon: Clock,
      color: 'orange',
      trend: `${Math.round((stats.pendingWaitlist / Math.max(stats.totalWaitlist, 1)) * 100)}% du total`,
      trendUp: null,
    },
    {
      label: 'Invités',
      value: stats.invitedWaitlist,
      icon: UserCheck,
      color: 'green',
      trend: `${Math.round((stats.invitedWaitlist / Math.max(stats.totalWaitlist, 1)) * 100)}% convertis`,
      trendUp: true,
    },
    {
      label: 'Newsletter',
      value: stats.totalNewsletter,
      icon: Mail,
      color: 'purple',
      trend: 'Abonnés actifs',
      trendUp: null,
    },
  ]

  const colorMap: Record<string, { bg: string; icon: string; badge: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-900', badge: 'bg-blue-100 text-blue-700' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', badge: 'bg-orange-100 text-orange-700' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', badge: 'bg-green-100 text-green-700' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Vue d&apos;ensemble
        </h1>
        <p className="text-slate-600 mt-1">
          Bienvenue dans le panneau d&apos;administration Quantify
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const c = colorMap[card.color]
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${c.icon}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.badge}`}>
                  {card.label}
                </span>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{card.value.toLocaleString('fr-FR')}</p>
              <div className="flex items-center gap-1 mt-2">
                {card.trendUp !== null && (
                  card.trendUp
                    ? <ArrowUpRight className="w-4 h-4 text-green-500" />
                    : <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <span className="text-sm text-slate-500">{card.trend}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent users */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-900" />
            <h2 className="text-lg font-bold text-slate-900">Inscriptions récentes</h2>
          </div>
          <a href="/admin/waitlist" className="text-sm font-semibold text-blue-900 hover:underline">
            Voir tout
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-6 py-3 font-semibold">Utilisateur</th>
                <th className="text-left px-6 py-3 font-semibold">Pays</th>
                <th className="text-left px-6 py-3 font-semibold">Type</th>
                <th className="text-left px-6 py-3 font-semibold">Statut</th>
                <th className="text-left px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(user.full_name?.charAt(0) || '?').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{user.full_name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{user.country}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium">
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      user.status === 'invited' ? 'bg-blue-100 text-blue-700' :
                      user.status === 'converted' ? 'bg-green-100 text-green-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {user.status === 'pending' ? 'En attente' :
                       user.status === 'invited' ? 'Invité' :
                       user.status === 'converted' ? 'Actif' : user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
