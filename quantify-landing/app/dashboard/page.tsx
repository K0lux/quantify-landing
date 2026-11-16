import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Metadata } from 'next'
import { 
  Users, TrendingUp, Award, Share2, Copy, 
  CheckCircle, Clock, Gift, Trophy, Zap 
} from 'lucide-react'
import { SocialShare } from '@/components/features/social-share'

export const metadata: Metadata = {
  title: 'Dashboard - Quantify | Votre Espace Personnel',
  description: 'Suivez votre position sur la liste d\'attente et parrainez vos amis',
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/connexion')
  }

  const supabase = createAdminSupabaseClient()

  // Try by auth user ID first, then fallback to email (admin bypasses RLS)
  const { data: waitlistById } = await supabase
    .from('waitlist')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  let waitlistData = waitlistById

  if (!waitlistData && user.email) {
    const { data: waitlistByEmail } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', user.email)
      .single()

    if (waitlistByEmail) {
      await supabase
        .from('waitlist')
        .update({ auth_user_id: user.id, updated_at: new Date().toISOString() })
        .eq('id', waitlistByEmail.id)

      waitlistData = waitlistByEmail
    }
  }

  if (!waitlistData) {
    redirect('/rejoindre')
  }

  const { data: referrals } = await supabase
    .from('waitlist')
    .select('id, full_name, created_at, status')
    .eq('referred_by', waitlistData.referral_code)

  const totalReferrals = referrals?.length || 0
  const activeReferrals = referrals?.filter(r => r.status !== 'pending').length || 0

  const progressSteps = [
    { 
      id: 1, 
      label: 'Inscription', 
      done: true, 
      icon: CheckCircle,
      date: waitlistData.created_at 
    },
    { 
      id: 2, 
      label: 'Premier parrainage', 
      done: totalReferrals >= 1,
      icon: Users,
      date: referrals?.[0]?.created_at
    },
    { 
      id: 3, 
      label: '3 parrainages', 
      done: totalReferrals >= 3,
      icon: Trophy,
      date: referrals?.[2]?.created_at
    },
    { 
      id: 4, 
      label: 'Invitation reçue', 
      done: waitlistData.status === 'invited' || waitlistData.status === 'converted',
      icon: Gift,
      date: waitlistData.invited_at
    },
    { 
      id: 5, 
      label: 'Compte activé', 
      done: waitlistData.status === 'converted',
      icon: Zap,
      date: waitlistData.converted_at
    },
  ]

  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}?ref=${waitlistData.referral_code}`

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#FF8C42] to-[#E04400] rounded-3xl p-8 sm:p-12 text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Bienvenue, {waitlistData.full_name?.split(' ')[0]} !
        </h1>
        <p className="text-blue-100 text-lg">
          Vous êtes en bonne position pour rejoindre la révolution énergétique
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Position */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Position
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">
            #{waitlistData.position}
          </div>
          <p className="text-sm text-slate-600">
            Sur la liste d&apos;attente
          </p>
        </div>

        {/* Parrainages */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C42] to-[#E04400] rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Parrainages
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">
            {totalReferrals}
          </div>
          <p className="text-sm text-slate-600">
            {activeReferrals} actifs
          </p>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Statut
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mb-1 capitalize">
            {waitlistData.status === 'pending' ? 'En attente' : 
             waitlistData.status === 'invited' ? 'Invité' : 
             waitlistData.status === 'converted' ? 'Actif' : waitlistData.status}
          </div>
          <p className="text-sm text-slate-600">
            {waitlistData.status === 'pending' && 'Bientôt invité'}
            {waitlistData.status === 'invited' && 'Créez votre compte'}
            {waitlistData.status === 'converted' && 'Compte actif'}
          </p>
        </div>

        {/* Points */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Points
            </span>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">
            {totalReferrals * 100}
          </div>
          <p className="text-sm text-slate-600">
            100 pts par parrainage
          </p>
        </div>
      </div>

      {/* Referral Section */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Parrainez vos amis !
            </h2>
            <p className="text-slate-700">
              Remontez de <strong>5 places</strong> par parrainage. Plus vous parrainez, plus vite vous accédez à Quantify.
            </p>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Votre code de parrainage
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={waitlistData.referral_code || ''}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg font-mono font-bold text-xl text-slate-900 text-center"
            />
            <button 
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Copy className="w-5 h-5" />
              <span className="hidden sm:inline">Copier</span>
            </button>
          </div>
        </div>

        {/* Social Share */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            Partager sur les réseaux sociaux
          </label>
          <SocialShare
            url={referralUrl}
            text={`Rejoins-moi sur Quantify, l'app qui révolutionne la gestion énergétique en Afrique ! Utilise mon code ${waitlistData.referral_code}`}
            hashtags={['Quantify', 'Energie', 'Togo', 'Innovation']}
          />
        </div>

        {/* Referral Stats */}
        {totalReferrals > 0 && (
          <div className="bg-white/50 rounded-xl p-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">
              Vous avez parrainé {totalReferrals} personne{totalReferrals > 1 ? 's' : ''} !
            </p>
            <p className="text-sm text-slate-600">
              Vous avez gagné <strong className="text-green-600">{totalReferrals * 5} places</strong> sur la liste d&apos;attente
            </p>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">
          Votre Progression
        </h2>

        <div className="space-y-6">
          {progressSteps.map((step) => (
            <div key={step.id} className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.done 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-slate-200'
              }`}>
                {step.done ? (
                  <step.icon className="w-6 h-6 text-white" />
                ) : (
                  <Clock className="w-6 h-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1 pt-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold ${
                    step.done ? 'text-slate-900' : 'text-slate-500'
                  }`}>
                    {step.label}
                  </h3>
                  {step.done && step.date && (
                    <span className="text-xs text-slate-500">
                      {new Date(step.date).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ${
                      step.done ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referrals List */}
      {referrals && referrals.length > 0 && (
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Vos Parrainages ({totalReferrals})
          </h2>

          <div className="space-y-4">
            {referrals.map((referral) => (
              <div 
                key={referral.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#FF8C42] to-[#E04400] rounded-full flex items-center justify-center text-white font-bold">
                    {referral.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {referral.full_name || 'Utilisateur anonyme'}
                    </p>
                    <p className="text-sm text-slate-600">
                      Inscrit le {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  referral.status === 'converted' 
                    ? 'bg-green-100 text-green-700'
                    : referral.status === 'invited'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {referral.status === 'converted' ? 'Actif' : 
                   referral.status === 'invited' ? 'Invité' : 
                   'En attente'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-gradient-to-r from-orange-50 to-white border border-blue-200 rounded-3xl p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          Conseils pour monter dans la liste
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">
              Partagez votre code avec vos amis, famille et collègues
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">
              Publiez sur les réseaux sociaux avec le hashtag #Quantify
            </span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-slate-700">
              Rejoignez notre communauté pour être informé en premier
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
