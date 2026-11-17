import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getCurrentUserData, updateUserProfile, updateUserPreferences } from '@/lib/services/user-service'
import { validateWithErrors } from '@/lib/validation/schemas'
import { z } from 'zod'
import { readJsonBody } from '@/lib/security/http'

const updateProfileSchema = z.object({
  first_name: z.string().trim().min(1, 'Prénom requis').max(50, 'Prénom trop long').regex(/^[\p{L}\p{M} '-]+$/u).optional(),
  last_name: z.string().trim().max(80, 'Nom trop long').regex(/^[\p{L}\p{M} '-]*$/u).optional(),
  phone: z.string().trim().max(30).regex(/^\+?[0-9 ()-]{7,20}$/).refine(value => value.replace(/\D/g, '').length >= 8 && value.replace(/\D/g, '').length <= 15).or(z.literal('')).optional(),
  country: z.enum(['TG', 'BF', 'CI', 'ML', 'NE', 'SN', 'BJ', 'GW']).optional(),
  user_type: z.enum(['particulier', 'professionnel', 'institution', 'utility']).optional(),
}).strict()

const updatePreferencesSchema = z.object({
  language: z.enum(['fr', 'en']).optional(),
  timezone: z.string().trim().max(64).regex(/^[A-Za-z0-9_+./-]+$/).optional(),
  currency: z.enum(['XOF', 'EUR', 'USD']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
    marketing: z.boolean().optional(),
  }).strict().optional(),
  privacy: z.object({
    profile_visibility: z.enum(['public', 'private']).optional(),
    analytics_opt_out: z.boolean().optional(),
  }).strict().optional(),
}).strict()

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentification requise',
        timestamp: new Date().toISOString(),
      }, { status: 401 })
    }

    const url = new URL(request.url)
    const includeWaitlist = url.searchParams.get('include_waitlist') === 'true'
    const includeAnalytics = url.searchParams.get('include_analytics') === 'true'
    
    const result = await getCurrentUserData({
      includeWaitlistData: includeWaitlist,
      includeAnalytics,
    })

    if (!result.success) {
      return NextResponse.json(result, { 
        status: result.error === 'USER_NOT_AUTHENTICATED' ? 401 : 500,
      })
    }

    const headers = new Headers()
    headers.set('Cache-Control', 'private, max-age=300')
    headers.set('X-User-ID', user.id)
    
    return NextResponse.json(result, { status: 200, headers })

  } catch (error) {
    console.error('[UserProfileAPI] GET error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Erreur interne du serveur',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentification requise',
      }, { status: 401 })
    }

    const body = await readJsonBody(request, 8 * 1024)
    if (!body.ok) return body.response
    
    const validation = validateWithErrors(updateProfileSchema, body.data)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: validation.errors,
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    const result = await updateUserProfile({
      ...validation.data,
      ...(validation.data.phone !== undefined ? { phone: validation.data.phone || null } : {}),
    })

    return NextResponse.json(result, { status: result.success ? 200 : 400 })

  } catch (error) {
    console.error('[UserProfileAPI] PUT error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Erreur lors de la mise à jour du profil',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentification requise',
      }, { status: 401 })
    }

    const body = await readJsonBody(request, 8 * 1024)
    if (!body.ok) return body.response
    
    const validation = validateWithErrors(updatePreferencesSchema, body.data)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Préférences invalides',
        details: validation.errors,
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    const result = await updateUserPreferences(validation.data)

    return NextResponse.json(result, { status: result.success ? 200 : 400 })

  } catch (error) {
    console.error('[UserProfileAPI] PATCH error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Erreur lors de la mise à jour des préférences',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentification requise',
      }, { status: 401 })
    }

    const confirmHeader = request.headers.get('X-Confirm-Deletion')
    
    if (confirmHeader !== 'true') {
      return NextResponse.json({
        success: false,
        error: 'CONFIRMATION_REQUIRED',
        message: 'Confirmation de suppression requise',
        hint: 'Ajoutez le header X-Confirm-Deletion: true',
      }, { status: 400 })
    }

    const { deleteUserAccount } = await import('@/lib/services/user-service')
    const result = await deleteUserAccount()

    return NextResponse.json(result, { status: result.success ? 200 : 400 })

  } catch (error) {
    console.error('[UserProfileAPI] DELETE error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Erreur lors de la suppression du compte',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}
