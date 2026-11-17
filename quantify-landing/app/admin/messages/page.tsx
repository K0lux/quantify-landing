import { Metadata } from 'next'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { ContactMessageManager } from '@/components/admin/contact-message-manager'

export const metadata: Metadata = {
  title: 'Messages de contact - Admin Quantify',
}

export default async function AdminMessagesPage() {
  const supabase = createAdminSupabaseClient()
  const [{ data: messages, count }, { count: openCount }] = await Promise.all([
    supabase
      .from('contact_messages')
      .select('id, name, email, phone, subject, message, type, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(100),
    supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .in('status', ['new', 'in_progress']),
  ])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950 sm:text-3xl">Messages de contact</h1>
        <p className="mt-1 text-slate-600">{openCount ?? 0} message{openCount === 1 ? '' : 's'} à traiter sur {count ?? 0} au total</p>
        {(count ?? 0) > 100 && <p className="mt-1 text-sm text-slate-500">Affichage des 100 messages les plus récents.</p>}
      </div>
      <ContactMessageManager initialMessages={messages ?? []} />
    </div>
  )
}
