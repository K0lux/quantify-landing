import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'
import { 
  waitlistApiSchema,
  validateWithErrors,
} from '@/lib/validation/schemas'
import type { 
  WaitlistUser,
  APIResponse,
  WaitlistStats,
} from '@/types'
import type { WaitlistFormOutput } from '@/lib/validation/schemas'
import { nanoid } from 'nanoid'
import { readJsonBody } from '@/lib/security/http'
import { getClientIp } from '@/lib/security/rate-limit'

interface WaitlistCreateResponse extends APIResponse<WaitlistUser> {
  position?: number
  referralCode?: string
  estimatedLaunchDate?: string
}

type WaitlistStatsResponse = APIResponse<WaitlistStats>

interface ReferralReward {
  type: 'position_boost' | 'credits' | 'premium_trial'
  value: number
  applied: boolean
}

class WaitlistService {
  private supabase

  constructor() {
    this.supabase = createAdminSupabaseClient()
  }

  async createWaitlistEntry(
    formData: WaitlistFormOutput,
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

      if (validatedData.referredBy) {
        const supabase = await this.supabase
        const { data: referrer } = await supabase
          .from('waitlist')
          .select('id')
          .eq('referral_code', validatedData.referredBy)
          .maybeSingle()

        if (!referrer) {
          return {
            success: false,
            error: 'INVALID_REFERRAL_CODE',
            message: 'Ce code de parrainage est introuvable. Vérifiez le lien reçu.',
            code: 'INVALID_REFERRAL_CODE',
            timestamp: new Date().toISOString(),
          }
        }
      }

      const referralCode = await this.generateUniqueReferralCode()
      const position = await this.calculateNextPosition()

      const insertData = {
        email: validatedData.email,
        phone: validatedData.phone || null,
        full_name: validatedData.fullName,
        country: validatedData.country,
        user_type: validatedData.userType as WaitlistUser['user_type'],
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

      if (validatedData.referredBy) {
        await this.processReferral(validatedData.referredBy, waitlistEntry.id, waitlistEntry.email)
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
      const stats = await this.calculateManualStats()
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
    refereeId: string,
    refereeEmail: string
  ): Promise<ReferralReward | null> {
    try {
      const supabase = await this.supabase
      
      const { data: referrer, error } = await supabase
        .from('waitlist')
        .select('id, position')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (error || !referrer) return null

      const { data: reward, error: rewardError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.id,
          referred_email: refereeEmail,
          referral_code: referralCode,
          reward_type: 'position_boost',
          reward_value: 5,
          status: 'completed',
        })
        .select('id')
        .single()

      if (rewardError || !reward) {
        console.error('[WaitlistService] Referral reward insert error:', rewardError)
        return null
      }

      const { error: positionError } = await supabase
        .from('waitlist')
        .update({ position: Math.max(1, (referrer.position ?? 1) - 5), updated_at: new Date().toISOString() })
        .eq('id', referrer.id)

      if (positionError) {
        await supabase.from('referrals').delete().eq('id', reward.id)
        console.error('[WaitlistService] Referral position update error:', positionError)
        return null
      }

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
    
    const [totalResult, pendingResult, approvedResult, convertedResult, referralsResult] = await Promise.all([
      supabase.from('waitlist').select('*', { count: 'exact', head: true }),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('waitlist').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
      supabase.from('referrals').select('*', { count: 'exact', head: true }),
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
      referrals_count: referralsResult.count ?? 0,
      top_referrers: [],
      daily_signups: [],
      conversion_rate: totalUsers > 0 ? (convertedUsers / totalUsers) * 100 : 0,
      avg_position: totalUsers > 0 ? (totalUsers + 1) / 2 : 0,
    }
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await readJsonBody(request, 8 * 1024)
    if (!body.ok) return body.response

    const validation = validateWithErrors(waitlistApiSchema, body.data)
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
    if (validData.website) {
      return NextResponse.json({ success: true }, { status: 202 })
    }

    const userIP = getClientIp(request)
    const userAgent = request.headers.get('user-agent')?.slice(0, 512) || 'unknown'

    const waitlistService = new WaitlistService()
    const waitlistInput: WaitlistFormOutput = {
      ...validData,
      phone: validData.phone ?? null,
      acceptMarketing: validData.acceptMarketing ?? false,
      website: validData.website ?? '',
    }
    const result = await waitlistService.createWaitlistEntry(waitlistInput, userIP, userAgent)

    if (!result.success) {
      const statusCode =
        result.code === 'DUPLICATE_EMAIL' ? 409 :
        result.code === 'INVALID_REFERRAL_CODE' ? 400 :
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
      },
      { status: 500 }
    )
  }
}

export async function GET(): Promise<NextResponse> {
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
