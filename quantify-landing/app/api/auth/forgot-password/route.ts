import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { validateWithErrors } from '@/lib/validation/schemas'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
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

    const validation = validateWithErrors(forgotPasswordSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, code: 'VALIDATION_ERROR', message: 'Email invalide', errors: validation.errors },
        { status: 400 }
      )
    }

    const { email } = validation.data
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      console.error('[Auth ForgotPassword] Supabase error:', error)
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.',
    })

  } catch (error) {
    console.error('[Auth ForgotPassword] Error:', error)
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
