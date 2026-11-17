import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowUpRight, Check, Users } from 'lucide-react'
import { getDashboardAccount } from '@/lib/dashboard-data'
import { SocialShare } from '@/components/features/social-share'

export const metadata: Metadata = {
  title: 'Dashboard - Quantify | Votre Espace Personnel',
  description: 'Suivez votre place sur la liste d’attente Quantify et invitez vos proches.',
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  approved: 'Validé',
  invited: 'Invitation envoyée',
  converted: 'Compte activé',
  rejected: 'Clôturé',
}

const referralStatusLabels: Record<string, string> = {
  pending: 'En attente',
  approved: 'Validé',
  invited: 'Invité',
  converted: 'Actif',
  rejected: 'Clôturé',
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export default async function DashboardPage() {
  const { supabase, waitlistUser: waitlistData } = await getDashboardAccount()
  const { data: referrals, count } = waitlistData.referral_code
    ? await supabase
        .from('waitlist')
        .select('id, full_name, created_at, status', { count: 'exact' })
        .eq('referred_by', waitlistData.referral_code)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: null, count: 0 }

  const referralCount = count ?? 0
  const firstName = waitlistData.full_name?.trim().split(/\s+/)[0] || ''
  const statusLabel = statusLabels[waitlistData.status || ''] || 'En attente'

  return (
    <div className="mx-auto max-w-5xl space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-orange-700">Mon espace</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            {firstName ? `Bonjour, ${firstName}.` : 'Bonjour !'}
          </h1>
          <p className="mt-2 text-slate-600">Retrouvez votre place et vos parrainages en un coup d’œil.</p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700">
          <span className={`h-2 w-2 rounded-full ${waitlistData.status === 'rejected' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
          {statusLabel}
        </span>
      </div>

      <section aria-label="Résumé de votre liste d’attente" className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
          <p className="text-sm font-medium text-slate-500">Votre place</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 tabular-nums">
            {waitlistData.position ? `#${waitlistData.position}` : '—'}
          </p>
          <p className="mt-2 text-sm text-slate-600">Sur la liste d’attente Quantify</p>
        </article>

        <article className="flex items-center justify-between gap-4 rounded-2xl border border-orange-200 bg-orange-50/70 p-6 sm:p-7">
          <div>
            <p className="text-sm font-medium text-slate-600">Vos parrainages</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight text-slate-950 tabular-nums">{referralCount}</p>
            <p className="mt-2 text-sm text-slate-600">
              {referralCount === 0 ? 'Aucun filleul pour le moment' : `${referralCount === 1 ? 'personne inscrite' : 'personnes inscrites'} via votre lien`}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-700 ring-1 ring-orange-100" aria-hidden="true">
            <Users className="h-5 w-5" />
          </div>
        </article>
      </section>

      <section aria-labelledby="referral-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-orange-700">Faites avancer votre place</p>
          <h2 id="referral-heading" className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Invitez vos proches
          </h2>
          <p className="mt-2 text-slate-600">
            Chaque inscription avec votre lien vous fait gagner 5 places sur la liste.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Votre code <span className="ml-2 rounded-md bg-slate-100 px-2 py-1 font-mono font-semibold text-slate-800" translate="no">{waitlistData.referral_code || 'Indisponible'}</span>
          </p>
          {waitlistData.referral_code && <SocialShare referralCode={waitlistData.referral_code} />}
        </div>
      </section>

      {referralCount > 0 && (
        <section aria-labelledby="referrals-heading" className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="referrals-heading" className="text-xl font-semibold text-slate-950">Inscriptions via votre lien</h2>
            <Link href="/dashboard/referrals" className="shrink-0 text-sm font-medium text-orange-800 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">Voir tout</Link>
          </div>

          <ul className="divide-y divide-slate-100">
            {referrals?.map((referral) => (
              <li key={referral.id} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-800" aria-hidden="true">
                  {referral.full_name?.trim().charAt(0).toUpperCase() || <Check className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{referral.full_name || 'Membre Quantify'}</p>
                  <p className="text-sm text-slate-500">
                    {referral.created_at ? `Inscrit le ${dateFormatter.format(new Date(referral.created_at))}` : 'Date indisponible'}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {referralStatusLabels[referral.status || ''] || 'En attente'}
                </span>
              </li>
            ))}
          </ul>
          {referralCount > 5 && (
            <p className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-500">
              Affichage des 5 inscriptions les plus récentes sur {referralCount}.
            </p>
          )}
        </section>
      )}

      <p className="flex items-center gap-2 text-sm text-slate-500">
        Une question sur votre inscription ? <Link href="/contact" className="inline-flex items-center gap-1 font-medium text-orange-700 hover:text-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">Contactez-nous <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></Link>
      </p>
    </div>
  )
}
