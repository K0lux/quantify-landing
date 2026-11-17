import { Metadata } from 'next'
import { Award, Gift } from 'lucide-react'
import { DashboardPageIntro } from '@/components/dashboard/page-intro'
import { getDashboardAccount } from '@/lib/dashboard-data'

export const metadata: Metadata = {
  title: 'Récompenses - Quantify',
  description: 'Consultez les récompenses générées par vos parrainages.',
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const rewardLabels: Record<string, string> = {
  position_boost: 'Avancement dans la liste',
  early_access: 'Accès anticipé',
  credits: 'Crédits Quantify',
  discount: 'Réduction',
}
const statusLabels: Record<string, string> = {
  completed: 'Accordée',
  pending: 'En cours',
  expired: 'Expirée',
  invalid: 'Non validée',
}

export default async function DashboardRewardsPage() {
  const { supabase, waitlistUser } = await getDashboardAccount()
  const [{ data: rewards, count: totalRewards }, { count: completedRewards }] = await Promise.all([
    supabase
      .from('referrals')
      .select('id, referred_email, reward_type, reward_value, status, created_at', { count: 'exact' })
      .eq('referrer_id', waitlistUser.id)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', waitlistUser.id)
      .eq('status', 'completed'),
  ])

  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageIntro
        eyebrow="Vos avantages"
        title="Récompenses"
        description="Retrouvez les avantages enregistrés à la suite de vos parrainages."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <Award className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-950">{completedRewards ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Récompenses accordées</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <Gift className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <p className="mt-4 text-3xl font-semibold tabular-nums text-slate-950">{totalRewards ?? 0}</p>
          <p className="mt-1 text-sm text-slate-600">Récompenses au total</p>
        </article>
      </div>

      <section aria-labelledby="reward-history-heading" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 id="reward-history-heading" className="text-lg font-semibold text-slate-950">Historique</h2>
        {rewards && rewards.length > 0 ? (
          <ul className="mt-4 divide-y divide-slate-100">
            {rewards.map((reward) => (
              <li key={reward.id} className="flex flex-col gap-2 py-4 first:pt-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-900">{rewardLabels[reward.reward_type || ''] || 'Récompense de parrainage'}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">Inscription de {reward.referred_email}</p>
                  {reward.created_at && <time className="mt-1 block text-xs text-slate-500" dateTime={reward.created_at}>{dateFormatter.format(new Date(reward.created_at))}</time>}
                </div>
                <div className="flex items-center gap-3">
                  {reward.reward_value !== null && <span className="text-sm font-semibold text-slate-700">{reward.reward_value}{reward.reward_type === 'position_boost' ? ' places' : ''}</span>}
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{statusLabels[reward.status || ''] || 'À confirmer'}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">Aucune récompense n’est encore enregistrée. Les récompenses apparaîtront après l’inscription d’un filleul avec votre lien.</p>
        )}
        {(totalRewards ?? 0) > 30 && <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Affichage des 30 récompenses les plus récentes.</p>}
      </section>
    </div>
  )
}
