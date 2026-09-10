import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { validateWithErrors } from '@/lib/validation/schemas'

const registerSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  fullName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
})

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null)

    if (!body) {
      return NextResponse.json(
        { success: false, code: 'INVALID_JSON', message: 'Corps de requête invalide' },
        { status: 400 }
      )
    }

    const validation = validateWithErrors(registerSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, code: 'VALIDATION_ERROR', message: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { email, password, fullName } = validation.data
    const adminDb = createAdminSupabaseClient()

    // Check if email exists in waitlist (admin client bypasses RLS)
    const { data: waitlistUser, error: waitlistError } = await adminDb
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single()

    if (waitlistError || !waitlistUser) {
      console.error('[Auth Register] Waitlist lookup error:', waitlistError)
      return NextResponse.json(
        {
          success: false,
          code: 'NOT_IN_WAITLIST',
          message: 'Cet email n\'est pas inscrit sur la liste d\'attente. Inscrivez-vous d\'abord sur la waitlist.',
        },
        { status: 403 }
      )
    }

    // Create Supabase Auth user via admin API (bypasses email confirmation)
    const { data: authData, error: authError } = await adminDb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        waitlist_id: waitlistUser.id,
      },
    })

    if (authError) {
      if (authError.message.includes('already been registered') || authError.message.includes('already registered')) {
        return NextResponse.json(
          { success: false, code: 'EMAIL_EXISTS', message: 'Un compte existe déjà avec cet email. Connectez-vous.' },
          { status: 409 }
        )
      }

      console.error('[Auth Register] Supabase auth error:', authError)
      return NextResponse.json(
        { success: false, code: 'AUTH_ERROR', message: authError.message },
        { status: 500 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, code: 'AUTH_ERROR', message: 'Erreur lors de la création du compte' },
        { status: 500 }
      )
    }

    // Link the Supabase Auth user to the waitlist entry (admin bypasses RLS)
    const { error: linkError } = await adminDb
      .from('waitlist')
      .update({
        auth_user_id: authData.user.id,
        status: 'converted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', waitlistUser.id)

    if (linkError) {
      console.error('[Auth Register] Waitlist link error:', linkError)
    }

    // Create user profile (admin bypasses RLS)
    const nameParts = fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || null

    const { error: profileError } = await adminDb
      .from('user_profiles')
      .upsert({
        auth_user_id: authData.user.id,
        waitlist_id: waitlistUser.id,
        email,
        phone: waitlistUser.phone || null,
        first_name: firstName,
        last_name: lastName,
        country: waitlistUser.country || 'TG',
        user_type: waitlistUser.user_type || 'particulier',
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
        metadata: {
          registered_at: new Date().toISOString(),
          source: 'waitlist',
        },
      })

    if (profileError) {
      console.error('[Auth Register] Profile creation error:', profileError)
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès !',
      data: {
        userId: authData.user.id,
        email: authData.user.email,
        needsConfirmation: false,
        waitlistPosition: waitlistUser.position,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('[Auth Register] Error:', error)
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
