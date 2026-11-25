import { NextRequest, NextResponse } from 'next/server'
import { getLocalRedirectPath } from '@/lib/auth-redirect'
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server'

function redirectToAuthPage(request: NextRequest, path: string, authError: string) {
  const url = new URL(path, request.url)
  url.searchParams.set('authError', authError)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const intent = searchParams.get('intent') === 'signup' ? 'signup' : 'login'
  const authPage = intent === 'signup' ? '/creer-compte' : '/connexion'
  const code = searchParams.get('code')

  if (!code || searchParams.has('error')) {
    return redirectToAuthPage(request, authPage, 'google_callback')
  }

  const supabase = await createServerSupabaseClient()
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('[Auth Google] Code exchange failed:', exchangeError)
    return redirectToAuthPage(request, authPage, 'google_callback')
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    console.error('[Auth Google] Could not load authenticated user:', userError)
    await supabase.auth.signOut()
    return redirectToAuthPage(request, authPage, 'google_callback')
  }

  const adminDb = createAdminSupabaseClient()
  const { data: profile, error: profileLookupError } = await adminDb
    .from('user_profiles')
    .select('auth_user_id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (profileLookupError) {
    console.error('[Auth Google] Profile lookup failed:', profileLookupError)
    await supabase.auth.signOut()
    return redirectToAuthPage(request, authPage, 'google_callback')
  }

  if (!profile) {
    const email = user.email?.trim().toLowerCase()
    if (!email) {
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'google_email_missing')
    }

    const { data: waitlistUser, error: waitlistError } = await adminDb
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .maybeSingle()

    if (waitlistError) {
      console.error('[Auth Google] Waitlist lookup failed:', waitlistError)
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'google_callback')
    }

    if (!waitlistUser) {
      const { error: deleteError } = await adminDb.auth.admin.deleteUser(user.id)
      if (deleteError) {
        console.error('[Auth Google] Could not remove unapproved user:', deleteError)
      }
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'not_in_waitlist')
    }

    if (waitlistUser.auth_user_id && waitlistUser.auth_user_id !== user.id) {
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'account_already_linked')
    }

    const fullName = waitlistUser.full_name?.trim() ||
      user.user_metadata.full_name?.trim() ||
      user.user_metadata.name?.trim() ||
      ''
    const nameParts = fullName.split(/\s+/).filter(Boolean)

    const { error: profileError } = await adminDb
      .from('user_profiles')
      .upsert({
        auth_user_id: user.id,
        waitlist_id: waitlistUser.id,
        email,
        phone: waitlistUser.phone || null,
        first_name: nameParts[0] || null,
        last_name: nameParts.slice(1).join(' ') || null,
        country: waitlistUser.country || 'TG',
        user_type: waitlistUser.user_type === 'admin' ? 'particulier' : waitlistUser.user_type || 'particulier',
        subscription_plan: 'free',
        subscription_status: 'active',
        onboarding_completed: false,
        preferences: {
          language: 'fr',
          timezone: 'Africa/Lome',
          currency: 'XOF',
          notifications: { email: true, sms: false, push: true, marketing: false },
          privacy: { profile_visibility: 'private', analytics_opt_out: false },
        },
        metadata: { registered_at: new Date().toISOString(), source: 'google' },
      }, { onConflict: 'auth_user_id' })

    if (profileError) {
      console.error('[Auth Google] Profile creation failed:', profileError)
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'google_callback')
    }

    const { data: linkedWaitlistUser, error: linkError } = await adminDb
      .from('waitlist')
      .update({
        auth_user_id: user.id,
        status: 'converted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', waitlistUser.id)
      .select('id')
      .maybeSingle()

    if (linkError || !linkedWaitlistUser) {
      console.error('[Auth Google] Waitlist link failed:', linkError)
      await supabase.auth.signOut()
      return redirectToAuthPage(request, authPage, 'google_callback')
    }
  }

  const destination = getLocalRedirectPath(searchParams.get('next'))
  return NextResponse.redirect(new URL(destination, request.url))
}
