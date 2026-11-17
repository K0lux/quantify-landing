import { Metadata } from 'next'
import { DashboardPageIntro } from '@/components/dashboard/page-intro'
import { SettingsForm } from '@/components/dashboard/settings-form'
import { getDashboardAccount } from '@/lib/dashboard-data'
import { DEFAULT_USER_PREFERENCES, type UserPreferences } from '@/types'

export const metadata: Metadata = {
  title: 'Paramètres - Quantify',
  description: 'Mettez à jour votre profil et vos préférences Quantify.',
}

export default async function DashboardSettingsPage() {
  const { user, supabase, waitlistUser } = await getDashboardAccount()
  const [{ data: profile }, { data: energy }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('email, phone, first_name, last_name, country, user_type, preferences')
      .eq('auth_user_id', user.id)
      .maybeSingle(),
    supabase
      .from('user_preferences')
      .select('interests, estimated_consumption, current_utility, has_analog_meter')
      .eq('waitlist_id', waitlistUser.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const names = (waitlistUser.full_name || '').trim().split(/\s+/)
  const storedPreferences = profile?.preferences
  const preferences = storedPreferences && typeof storedPreferences === 'object' && !Array.isArray(storedPreferences)
    ? {
        ...DEFAULT_USER_PREFERENCES,
        ...storedPreferences,
        notifications: { ...DEFAULT_USER_PREFERENCES.notifications, ...storedPreferences.notifications },
        privacy: { ...DEFAULT_USER_PREFERENCES.privacy, ...storedPreferences.privacy },
      } as UserPreferences
    : DEFAULT_USER_PREFERENCES

  return (
    <div className="mx-auto max-w-3xl">
      <DashboardPageIntro
        eyebrow="Mon compte"
        title="Paramètres"
        description="Gérez vos coordonnées, vos besoins énergétiques et vos notifications."
      />
      <SettingsForm
        initialValues={{
          profile: {
            first_name: profile?.first_name || names[0] || '',
            last_name: profile?.last_name || names.slice(1).join(' '),
            email: profile?.email || user.email || waitlistUser.email,
            phone: profile?.phone || waitlistUser.phone || '',
            country: profile?.country || waitlistUser.country || 'TG',
            user_type: profile?.user_type || waitlistUser.user_type || 'particulier',
          },
          energy: {
            interests: energy?.interests || [],
            estimated_consumption: energy?.estimated_consumption || '',
            current_utility: energy?.current_utility || '',
            has_analog_meter: energy?.has_analog_meter || false,
          },
          notifications: {
            email: preferences.notifications.email,
            sms: preferences.notifications.sms,
            marketing: preferences.notifications.marketing,
          },
        }}
      />
    </div>
  )
}
