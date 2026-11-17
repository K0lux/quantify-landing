import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { emailSchema, validateWithErrors } from '@/lib/validation/schemas'
import { readJsonBody } from '@/lib/security/http'

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis').max(128, 'Mot de passe trop long'),
}).strict()

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await readJsonBody(request, 4 * 1024)
    if (!body.ok) return body.response

    const validation = validateWithErrors(loginSchema, body.data)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, code: 'VALIDATION_ERROR', message: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return NextResponse.json(
          { success: false, code: 'INVALID_CREDENTIALS', message: 'Email ou mot de passe incorrect' },
          { status: 401 }
        )
      }

      if (error.message.includes('Email not confirmed')) {
        return NextResponse.json(
          { success: false, code: 'EMAIL_NOT_CONFIRMED', message: 'Veuillez confirmer votre email avant de vous connecter' },
          { status: 403 }
        )
      }

      console.error('[Auth Login] Supabase error:', error)
      return NextResponse.json(
        { success: false, code: 'AUTH_ERROR', message: 'Erreur d\'authentification' },
        { status: 500 }
      )
    }

    if (!data.session || !data.user) {
      return NextResponse.json(
        { success: false, code: 'AUTH_ERROR', message: 'Session non créée' },
        { status: 500 }
      )
    }

    // Update last login
    await createAdminSupabaseClient()
      .from('user_profiles')
      .update({
        last_login_at: new Date().toISOString(),
      })
      .eq('auth_user_id', data.user.id)

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        userId: data.user.id,
        email: data.user.email,
      },
    })

  } catch (error) {
    console.error('[Auth Login] Error:', error)
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
