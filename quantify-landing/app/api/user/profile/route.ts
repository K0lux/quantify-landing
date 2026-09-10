import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getCurrentUserData, updateUserProfile, updateUserPreferences } from '@/lib/services/user-service'
import { validateWithErrors } from '@/lib/validation/schemas'
import { z } from 'zod'

const updateProfileSchema = z.object({
  first_name: z.string().min(1, 'Prénom requis').max(50, 'Prénom trop long').optional(),
  last_name: z.string().min(1, 'Nom requis').max(50, 'Nom trop long').optional(),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Format téléphone invalide').optional(),
  city: z.string().max(100, 'Nom de ville trop long').optional(),
  country: z.enum(['TG', 'BF', 'CI', 'ML', 'NE', 'SN', 'BJ', 'GW']).optional(),
  user_type: z.enum(['particulier', 'professionnel', 'institution', 'utility', 'admin']).optional(),
})

const updatePreferencesSchema = z.object({
  language: z.enum(['fr', 'en']).optional(),
  timezone: z.string().optional(),
  currency: z.enum(['XOF', 'EUR', 'USD']).optional(),
  notifications: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
    marketing: z.boolean().optional(),
  }).optional(),
  privacy: z.object({
    profile_visibility: z.enum(['public', 'private']).optional(),
    analytics_opt_out: z.boolean().optional(),
  }).optional(),
})

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

    const body = await request.json()
    
    const validation = validateWithErrors(updateProfileSchema, body)
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Données invalides',
        details: validation.errors,
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    const result = await updateUserProfile(validation.data)

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

    const body = await request.json()
    
    const validation = validateWithErrors(updatePreferencesSchema, body)
    
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
