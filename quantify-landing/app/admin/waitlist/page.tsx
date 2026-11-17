import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { WaitlistManager } from '@/components/admin/waitlist-manager'

export const metadata: Metadata = {
  title: 'Waitlist - Admin Quantify',
}

async function getWaitlistData() {
  const supabase = createAdminSupabaseClient()

  const { data: users, count } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .limit(50)

  const { count: pending } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: invited } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'invited')

  const { count: converted } = await supabase
    .from('waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'converted')

  return {
    users: (users ?? []).map((user) => ({
      ...user,
      full_name: user.full_name ?? user.email,
    })),
    total: count ?? 0,
    pending: pending ?? 0,
    invited: invited ?? 0,
    converted: converted ?? 0,
  }
}

export default async function AdminWaitlistPage() {
  const data = await getWaitlistData()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Gestion de la Waitlist
        </h1>
        <p className="text-slate-600 mt-1">
          {data.total} inscrits au total
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'En attente', value: data.pending, cls: 'bg-yellow-100 text-yellow-700' },
          { label: 'Invités', value: data.invited, cls: 'bg-blue-100 text-blue-700' },
          { label: 'Convertis', value: data.converted, cls: 'bg-green-100 text-green-700' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-full ${s.cls}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <WaitlistManager initialUsers={data.users} />
    </div>
  )
}
