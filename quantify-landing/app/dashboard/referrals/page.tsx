import { Metadata } from 'next'
import { Users } from 'lucide-react'
import { DashboardPageIntro } from '@/components/dashboard/page-intro'
import { getDashboardAccount } from '@/lib/dashboard-data'
import { SocialShare } from '@/components/features/social-share'

export const metadata: Metadata = {
  title: 'Parrainages - Quantify',
  description: 'Suivez les personnes inscrites avec votre lien de parrainage.',
}

const formatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
const statusLabels: Record<string, string> = {
  pending: 'En attente',
  approved: 'Validé',
  invited: 'Invité',
  converted: 'Compte activé',
  rejected: 'Clôturé',
}

export default async function DashboardReferralsPage() {
  const { supabase, waitlistUser } = await getDashboardAccount()
  const { data: referrals, count } = waitlistUser.referral_code
    ? await supabase
        .from('waitlist')
        .select('id, full_name, created_at, status', { count: 'exact' })
        .eq('referred_by', waitlistUser.referral_code)
        .order('created_at', { ascending: false })
        .limit(20)
    : { data: null, count: 0 }
  const referralCount = count ?? 0

  return (
    <div className="mx-auto max-w-5xl">
      <DashboardPageIntro
        eyebrow="Invitations"
        title="Vos parrainages"
        description="Chaque inscription avec votre lien vous fait gagner 5 places sur la liste d’attente."
      />

      <section className="mb-6 flex flex-col gap-5 rounded-2xl border border-orange-200 bg-orange-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div>
          <p className="text-sm font-medium text-slate-600">Inscriptions avec votre lien</p>
          <p className="mt-1 text-4xl font-semibold tabular-nums text-slate-950">{referralCount}</p>
          {waitlistUser.referral_code && (
            <p className="mt-3 text-sm text-slate-600">
              Code <span className="ml-1 rounded bg-white px-2 py-1 font-mono font-semibold text-slate-900" translate="no">{waitlistUser.referral_code}</span>
            </p>
          )}
        </div>
        {waitlistUser.referral_code && <SocialShare referralCode={waitlistUser.referral_code} />}
      </section>

      <section aria-labelledby="referral-list-heading" className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 id="referral-list-heading" className="text-lg font-semibold text-slate-950">Inscriptions récentes</h2>
        {referralCount === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-50 px-5 py-8 text-center">
            <Users className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
            <p className="mt-3 font-medium text-slate-800">Aucun parrainage pour le moment</p>
            <p className="mt-1 text-sm text-slate-600">Partagez votre lien pour inviter vos proches.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {referrals?.map((referral) => (
              <li key={referral.id} className="flex items-center gap-3 py-4 first:pt-2 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-800" aria-hidden="true">
                  {referral.full_name?.trim().charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{referral.full_name || 'Membre Quantify'}</p>
                  <p className="text-sm text-slate-500">{referral.created_at ? formatter.format(new Date(referral.created_at)) : 'Date indisponible'}</p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {statusLabels[referral.status || ''] || 'En attente'}
                </span>
              </li>
            ))}
          </ul>
        )}
        {referralCount > 20 && (
          <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">Affichage des 20 inscriptions les plus récentes sur {referralCount}.</p>
        )}
      </section>
    </div>
  )
}
