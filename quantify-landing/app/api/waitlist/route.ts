import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { 
  waitlistApiSchema,
  validateWithErrors,
} from '@/lib/validation/schemas'
import type { 
  WaitlistUser,
  APIResponse,
  WaitlistStats,
  WaitlistFormInput
} from '@/types'
import { nanoid } from 'nanoid'

interface WaitlistCreateResponse extends APIResponse<WaitlistUser> {
  position?: number
  referralCode?: string
  estimatedLaunchDate?: string
}

interface WaitlistStatsResponse extends APIResponse<WaitlistStats> {}

interface ReferralReward {
  type: 'position_boost' | 'credits' | 'premium_trial'
  value: number
  applied: boolean
}

class WaitlistService {
  private supabase

  constructor() {
    this.supabase = createServerSupabaseClient()
  }

  async createWaitlistEntry(
    formData: WaitlistFormInput,
    userIP?: string,
    userAgent?: string
  ): Promise<WaitlistCreateResponse> {
    try {
      const validatedData = formData

      const existingUser = await this.findExistingUser(validatedData.email)
      if (existingUser) {
        return {
          success: false,
          error: 'EMAIL_EXISTS',
          message: 'Cet email est déjà inscrit sur la liste d\'attente',
          code: 'DUPLICATE_EMAIL',
          timestamp: new Date().toISOString(),
        }
      }

      const referralCode = await this.generateUniqueReferralCode()
      const position = await this.calculateNextPosition()

      let referralReward: ReferralReward | null = null
      if (validatedData.referredBy) {
        referralReward = await this.processReferral(
          validatedData.referredBy,
          validatedData.email
        )
      }

      const insertData = {
        email: validatedData.email,
        phone: validatedData.phone || null,
        full_name: validatedData.fullName,
        country: validatedData.country,
        user_type: validatedData.userType,
        referral_code: referralCode,
        referred_by: validatedData.referredBy || null,
        status: 'pending' as const,
        position,
      }

      const supabase = await this.supabase
      const { data: waitlistEntry, error: insertError } = await supabase
        .from('waitlist')
        .insert([insertData])
        .select()
        .single()

      if (insertError) {
        console.error('[WaitlistService] Insert error:', insertError)
        throw new Error(`Database insertion failed: ${insertError.message}`)
      }

      await this.trackSignupEvent(waitlistEntry, userIP, userAgent)

      const estimatedLaunchDate = this.calculateEstimatedLaunchDate(position)

      return {
        success: true,
        data: waitlistEntry,
        message: 'Inscription réussie ! Vous avez été ajouté(e) à la liste d\'attente.',
        position,
        referralCode,
        estimatedLaunchDate,
        timestamp: new Date().toISOString(),
      }

    } catch (error) {
      console.error('[WaitlistService] Create entry error:', error)
      return {
        success: false,
        error: 'CREATION_FAILED',
        message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
        code: 'INTERNAL_ERROR',
        timestamp: new Date().toISOString(),
      }
    }
  }

  async getWaitlistStats(): Promise<WaitlistStatsResponse> {
    try {
      const supabase = await this.supabase
      
      const { data: stats, error } = await supabase
        .from('waitlist_stats')
        .select('*')
        .single()

      if (error) {
        const manualStats = await this.calculateManualStats()
        return { success: true, data: manualStats, timestamp: new Date().toISOString() }
      }

      return { success: true, data: stats, timestamp: new Date().toISOString() }

    } catch (error) {
      console.error('[WaitlistService] Get stats error:', error)
      return {
        success: false,
        error: 'STATS_ERROR',
        message: 'Impossible de récupérer les statistiques',
        timestamp: new Date().toISOString(),
      }
    }
  }

  private async findExistingUser(email: string): Promise<WaitlistUser | null> {
    const supabase = await this.supabase
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.warn('[WaitlistService] Find existing user error:', error)
    }

    return data
  }

  private async generateUniqueReferralCode(): Promise<string> {
    const maxAttempts = 10
    let attempts = 0

    while (attempts < maxAttempts) {
      const code = nanoid(8).toUpperCase()
      
      const supabase = await this.supabase
      const { data } = await supabase
        .from('waitlist')
        .select('id')
        .eq('referral_code', code)
        .maybeSingle()

      if (!data) {
        return code
      }

      attempts++
    }

    return `QTF${Date.now().toString(36).toUpperCase()}`
  }

  private async calculateNextPosition(): Promise<number> {
    const supabase = await this.supabase
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.warn('[WaitlistService] Count error:', error)
      return 1
    }

    return (count || 0) + 1
  }

  private async processReferral(
    referralCode: string,
    newUserEmail: string
  ): Promise<ReferralReward | null> {
    try {
      const supabase = await this.supabase
      
      const { data: referrer, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (error || !referrer) return null

      const newPosition = Math.max(1, referrer.position - 5)
      
      await supabase
        .from('waitlist')
        .update({ position: newPosition, updated_at: new Date().toISOString() })
        .eq('id', referrer.id)

      await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_email: newUserEmail,
          referral_code: referralCode,
          reward_type: 'position_boost',
          reward_value: 5,
          status: 'completed',
        })

      return { type: 'position_boost', value: 5, applied: true }

    } catch (error) {
      console.error('[WaitlistService] Process referral error:', error)
      return null
    }
  }

  private async trackSignupEvent(
    waitlistUser: WaitlistUser,
    userIP?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const supabase = await this.supabase
      await supabase
        .from('analytics')
        .insert({
          user_id: waitlistUser.id,
          event_type: 'waitlist',
          event_name: 'signup',
          properties: {
            user_type: waitlistUser.user_type,
            country: waitlistUser.country,
            position: waitlistUser.position,
            referred: !!waitlistUser.referred_by,
            source: 'waitlist_form',
          },
          user_agent: userAgent,
          ip_address: userIP,
        })
    } catch (error) {
      console.warn('[WaitlistService] Track signup warning:', error)
    }
  }

  private calculateEstimatedLaunchDate(position: number): string {
    const launchDate = new Date('2025-03-01')
    const weeksDelay = Math.floor(position / 1000)
    launchDate.setDate(launchDate.getDate() + (weeksDelay * 7))
    return launchDate.toISOString()
  }

  private async calculateManualStats(): Promise<WaitlistStats> {
    const supabase = await this.supabase
    
    const [totalResult, pendingResult, approvedResult, convertedResult] = await Promise.all([
      supabase.from('waitlist').select('*', { count: 'exact', head: true }),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
    ])

    const totalUsers = totalResult.count || 0
    const pendingUsers = pendingResult.count || 0
    const approvedUsers = approvedResult.count || 0
    const convertedUsers = convertedResult.count || 0

    return {
      total_users: totalUsers,
      pending_users: pendingUsers,
      approved_users: approvedUsers,
      converted_users: convertedUsers,
      referrals_count: 0,
      top_referrers: [],
      daily_signups: [],
      conversion_rate: totalUsers > 0 ? (convertedUsers / totalUsers) * 100 : 0,
      avg_position: totalUsers > 0 ? (totalUsers + 1) / 2 : 0,
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json().catch(() => null)

    if (!body) {
      return NextResponse.json(
        { success: false, code: 'INVALID_JSON', message: 'Corps de requête invalide' },
        { status: 400 }
      )
    }

    const validation = validateWithErrors(waitlistApiSchema, body)
    if (!validation.success) {
      console.warn('[WaitlistAPI] Validation errors:', validation.errors)
      return NextResponse.json(
        {
          success: false,
          code: 'VALIDATION_ERROR',
          message: 'Les données envoyées sont invalides.',
          errors: validation.errors,
        },
        { status: 400 }
      )
    }

    const validData = validation.data
    const userIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const waitlistService = new WaitlistService()
    const result = await waitlistService.createWaitlistEntry(validData, userIP, userAgent)

    if (!result.success) {
      const statusCode =
        result.code === 'DUPLICATE_EMAIL' ? 409 :
        result.code === 'VALIDATION_ERROR' ? 400 : 500

      return NextResponse.json(result, { status: statusCode })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('[WaitlistAPI] POST error:', error)

    return NextResponse.json(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: 'Une erreur interne est survenue',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = await getCurrentUser()
    const isAuthenticated = !!user

    const waitlistService = new WaitlistService()
    const result = await waitlistService.getWaitlistStats()

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, code: 'STATS_ERROR', message: 'Impossible de récupérer les statistiques' },
        { status: 500 }
      )
    }

    const data = isAuthenticated
      ? result.data
      : {
          total_users: result.data.total_users,
          conversion_rate: 0,
          avg_position: 0,
          pending_users: 0,
          approved_users: 0,
          converted_users: 0,
          referrals_count: 0,
          top_referrers: [],
          daily_signups: [],
        }

    return NextResponse.json(
      { success: true, data },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300',
          'X-Authenticated': isAuthenticated.toString(),
        },
      }
    )
  } catch (error) {
    console.error('[WaitlistAPI] GET error:', error)
    return NextResponse.json(
      { success: false, code: 'STATS_INTERNAL_ERROR', message: 'Erreur interne' },
      { status: 500 }
    )
  }
}
