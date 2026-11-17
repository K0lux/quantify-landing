import { Metadata } from 'next'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { NewsletterManager } from '@/components/admin/newsletter-manager'

export const metadata: Metadata = {
  title: 'Newsletter - Admin Quantify',
}

async function getNewsletterData() {
  const supabase = createAdminSupabaseClient()

  const { data: subscribers, count } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, subscribed_at, status, source', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .limit(50)

  const { count: active } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return {
    subscribers: subscribers ?? [],
    total: count ?? 0,
    active: active ?? 0,
  }
}

export default async function AdminNewsletterPage() {
  const data = await getNewsletterData()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Newsletter
        </h1>
        <p className="text-slate-600 mt-1">
          {data.active} abonnés actifs sur {data.total} au total
        </p>
      </div>

      <NewsletterManager initialSubscribers={data.subscribers} activeCount={data.active} />
    </div>
  )
}
