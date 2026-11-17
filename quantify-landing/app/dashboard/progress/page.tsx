import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, BadgeCheck, Gift, MapPin, Users } from 'lucide-react'
import { DashboardPageIntro } from '@/components/dashboard/page-intro'
import { getDashboardAccount } from '@/lib/dashboard-data'

export const metadata: Metadata = {
  title: 'Progression - Quantify',
  description: 'Suivez votre place dans la liste et les avancées obtenues grâce à vos parrainages.',
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  approved: 'Inscription validée',
  invited: 'Invitation envoyée',
  converted: 'Compte activé',
  rejected: 'Demande clôturée',
}

export default async function DashboardProgressPage() {
  const { supabase, waitlistUser } = await getDashboardAccount()
  const [{ count: referralCount }, { data: completedRewards }] = await Promise.all([
    waitlistUser.referral_code
      ? supabase
          .from('waitlist')
          .select('id', { count: 'exact', head: true })
          .eq('referred_by', waitlistUser.referral_code)
      : Promise.resolve({ count: 0 }),
    supabase
      .from('referrals')
      .select('reward_value')
      .eq('referrer_id', waitlistUser.id)
      .eq('reward_type', 'position_boost')
      .eq('status', 'completed'),
  ])

  const referrals = referralCount ?? 0
  const placesGained = completedRewards?.reduce((total, reward) => total + (reward.reward_value ?? 0), 0) ?? 0
  const status = waitlistUser.status || 'pending'
  const isInvited = status === 'invited' || status === 'converted' || !!waitlistUser.invited_at
  const isConverted = status === 'converted' || !!waitlistUser.converted_at
  const isRejected = status === 'rejected'

  const nextStep = isConverted
    ? {
        title: 'Votre compte Quantify est activé',
        description: 'Vous pouvez retrouver votre espace et vos informations depuis la vue générale.',
        href: '/dashboard',
        linkLabel: 'Retour à la vue générale',
      }
    : isRejected
      ? {
          title: 'Besoin d’une précision ?',
          description: 'Notre équipe peut vous expliquer le statut de votre inscription.',
          href: '/contact',
          linkLabel: 'Contacter l’équipe',
        }
      : isInvited
        ? {
            title: 'Finalisez votre accès',
            description: 'Consultez le message d’invitation envoyé par Quantify ou contactez-nous si vous ne le retrouvez pas.',
            href: '/dashboard/help',
            linkLabel: 'Obtenir de l’aide',
          }
        : {
            title: 'Faites avancer votre place',
            description: 'Chaque personne qui s’inscrit avec votre lien vous fait gagner 5 places sur la liste.',
            href: '/dashboard/referrals',
            linkLabel: 'Inviter un proche',
          }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <DashboardPageIntro
        eyebrow="Votre parcours"
        title="Votre progression"
        description="Consultez votre statut actuel, votre place et l’impact de vos parrainages."
      />

      <section aria-label="État de votre progression" className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <MapPin className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-slate-500">Votre place actuelle</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">
            {waitlistUser.position ? `#${waitlistUser.position}` : 'Non attribuée'}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <Gift className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-slate-500">Places gagnées</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{placesGained}</p>
          <p className="mt-1 text-sm text-slate-500">grâce aux parrainages validés</p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <Users className="h-5 w-5 text-orange-700" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-slate-500">Inscriptions parrainées</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-slate-950">{referrals}</p>
          <p className="mt-1 text-sm text-slate-500">via votre lien personnel</p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">Statut de votre inscription</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {isConverted
                ? 'Votre accès est prêt. Vous pouvez utiliser toutes les fonctions de votre espace.'
                : isRejected
                  ? 'Votre demande a été clôturée. Contactez notre équipe si vous souhaitez en connaître la raison.'
                  : isInvited
                    ? 'Votre invitation a été envoyée. Suivez les instructions reçues pour finaliser votre accès.'
                    : status === 'approved'
                      ? 'Votre inscription a été validée. Nous vous contacterons lorsque votre invitation sera prête.'
                      : 'Votre inscription est enregistrée et en attente de traitement.'}
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-800">
            <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            {statusLabels[status] || 'En attente'}
          </span>
        </div>
        {waitlistUser.created_at && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-500">
            Inscription effectuée le {dateFormatter.format(new Date(waitlistUser.created_at))}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 sm:p-7">
        <p className="text-sm font-semibold text-orange-800">Prochaine étape</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">{nextStep.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{nextStep.description}</p>
        <Link
          href={nextStep.href}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
        >
          {nextStep.linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
