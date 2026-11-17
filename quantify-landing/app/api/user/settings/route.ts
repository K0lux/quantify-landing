import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DEFAULT_USER_PREFERENCES, type UserPreferences } from '@/types'
import { getCurrentUser } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

const settingsSchema = z.object({
  profile: z.object({
    first_name: z.string().trim().min(1).max(50),
    last_name: z.string().trim().max(80),
    phone: z.string().trim().max(30).regex(/^\+?[0-9 ()-]{7,20}$/).or(z.literal('')),
    country: z.enum(['TG', 'BF', 'CI', 'ML', 'NE', 'SN', 'BJ', 'GW']),
    user_type: z.enum(['particulier', 'professionnel', 'institution', 'utility']),
  }),
  energy: z.object({
    interests: z.array(z.string().trim().min(1).max(40)).max(12),
    estimated_consumption: z.string().trim().max(80),
    current_utility: z.string().trim().max(80),
    has_analog_meter: z.boolean(),
  }),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    marketing: z.boolean(),
  }),
})

function getPreferences(value: unknown): UserPreferences {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return DEFAULT_USER_PREFERENCES
  }

  const stored = value as Partial<UserPreferences>
  return {
    ...DEFAULT_USER_PREFERENCES,
    ...stored,
    notifications: {
      ...DEFAULT_USER_PREFERENCES.notifications,
      ...stored.notifications,
    },
    privacy: {
      ...DEFAULT_USER_PREFERENCES.privacy,
      ...stored.privacy,
    },
  }
}

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'Authentification requise.' }, { status: 401 })
  }

  const supabase = createAdminSupabaseClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('waitlist_id, email, phone, first_name, last_name, country, user_type, preferences')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  let waitlist = profile?.waitlist_id
    ? await supabase
        .from('waitlist')
        .select('id, email, phone, full_name, country, user_type')
        .eq('id', profile.waitlist_id)
        .maybeSingle()
        .then(({ data }) => data)
    : null

  if (!waitlist && user.email) {
    const { data } = await supabase
      .from('waitlist')
      .select('id, email, phone, full_name, country, user_type')
      .eq('email', user.email.toLowerCase())
      .maybeSingle()
    waitlist = data
  }

  if (!waitlist) {
    return NextResponse.json({ success: false, message: 'Inscription à la liste d’attente introuvable.' }, { status: 404 })
  }

  const { data: energy } = await supabase
    .from('user_preferences')
    .select('interests, estimated_consumption, current_utility, has_analog_meter')
    .eq('waitlist_id', waitlist.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const names = (waitlist.full_name || '').trim().split(/\s+/)
  const preferences = getPreferences(profile?.preferences)

  return NextResponse.json({
    success: true,
    data: {
      profile: {
        first_name: profile?.first_name || names[0] || '',
        last_name: profile?.last_name || names.slice(1).join(' '),
        email: profile?.email || user.email || '',
        phone: profile?.phone || waitlist.phone || '',
        country: profile?.country || waitlist.country || 'TG',
        user_type: profile?.user_type || waitlist.user_type || 'particulier',
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
    },
  })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ success: false, message: 'Authentification requise.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const validation = settingsSchema.safeParse(body)

  if (!validation.success) {
    return NextResponse.json({ success: false, message: 'Vérifiez les champs du formulaire.' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()
  const { data: waitlist } = await supabase
    .from('waitlist')
    .select('id, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!waitlist) {
    return NextResponse.json({ success: false, message: 'Inscription à la liste d’attente introuvable.' }, { status: 404 })
  }

  const { data: existingProfile } = await supabase
    .from('user_profiles')
    .select('preferences')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const currentPreferences = getPreferences(existingProfile?.preferences)
  const preferences: UserPreferences = {
    ...currentPreferences,
    notifications: {
      ...currentPreferences.notifications,
      ...validation.data.notifications,
    },
  }
  const fullName = [validation.data.profile.first_name, validation.data.profile.last_name]
    .filter(Boolean)
    .join(' ')

  const [profileResult, waitlistResult] = await Promise.all([
    supabase.from('user_profiles').upsert({
      auth_user_id: user.id,
      waitlist_id: waitlist.id,
      email: user.email || waitlist.email,
      ...validation.data.profile,
      phone: validation.data.profile.phone || null,
      preferences,
    }, { onConflict: 'auth_user_id' }),
    supabase.from('waitlist').update({
      full_name: fullName,
      phone: validation.data.profile.phone || null,
      country: validation.data.profile.country,
      user_type: validation.data.profile.user_type,
      updated_at: new Date().toISOString(),
    }).eq('id', waitlist.id),
  ])

  if (profileResult.error || waitlistResult.error) {
    console.error('[UserSettings] Profile update failed:', profileResult.error || waitlistResult.error)
    return NextResponse.json({ success: false, message: 'Le profil n’a pas pu être enregistré.' }, { status: 500 })
  }

  const { data: existingEnergy } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('waitlist_id', waitlist.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const energyValues = {
    waitlist_id: waitlist.id,
    interests: validation.data.energy.interests,
    estimated_consumption: validation.data.energy.estimated_consumption || null,
    current_utility: validation.data.energy.current_utility || null,
    has_analog_meter: validation.data.energy.has_analog_meter,
  }

  const energyResult = existingEnergy
    ? await supabase.from('user_preferences').update(energyValues).eq('id', existingEnergy.id)
    : await supabase.from('user_preferences').insert(energyValues)

  if (energyResult.error) {
    console.error('[UserSettings] Energy preferences update failed:', energyResult.error)
    return NextResponse.json({ success: false, message: 'Profil enregistré, mais les préférences énergie n’ont pas pu être sauvegardées.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Paramètres enregistrés.' })
}
