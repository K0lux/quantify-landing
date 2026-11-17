import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import type { 
  WaitlistUser,
  UserProfile,
} from '@/types'

export interface UserData {
  id: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  createdAt: number
  updatedAt: number
  lastSignInAt?: number
}
export interface SyncResult {
  success: boolean
  userId?: string
  profileId?: string
  error?: string
  details?: string
  userProfile?: UserProfile | null
  fromWaitlist?: boolean
}
export class SupabaseIntegration {
  private serverClient: boolean

  constructor(serverClient = false) {
    this.serverClient = serverClient
  }

  private getSupabaseClient() {
    return this.serverClient ? createServerSupabaseClient() : createClient()
  }

  async getUserProfile(authUserId: string): Promise<SyncResult> {
    try {
      const supabase = this.serverClient ? createAdminSupabaseClient() : await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single()

      if (error && error.code !== 'PGRST116') {
        return { success: false, error: 'PROFILE_FETCH_ERROR', details: error.message }
      }

      return {
        success: !!data,
        userId: authUserId,
        profileId: data?.id,
        userProfile: data,
      }
    } catch (error) {
      console.error('[SupabaseIntegration] Get user profile error:', error)
      return { success: false, error: 'PROFILE_FETCH_ERROR' }
    }
  }

  async syncUserFromWaitlist(
    authUserId: string,
    email: string
  ): Promise<SyncResult> {
    try {
      const supabase = this.serverClient ? createAdminSupabaseClient() : await this.getSupabaseClient()

      const { data: waitlistUser } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      const profileData: Database['public']['Tables']['user_profiles']['Insert'] = {
        auth_user_id: authUserId,
        email,
        country: waitlistUser?.country || 'TG',
        user_type: waitlistUser?.user_type || 'particulier',
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
        metadata: { source: waitlistUser ? 'waitlist' : 'direct', synced_at: new Date().toISOString() },
      }

      if (waitlistUser) {
        profileData.waitlist_id = waitlistUser.id
        profileData.phone = waitlistUser.phone || null
        const nameParts = (waitlistUser.full_name || '').trim().split(' ')
        profileData.first_name = nameParts[0] || null
        profileData.last_name = nameParts.slice(1).join(' ') || null

        await supabase
          .from('waitlist')
          .update({
            auth_user_id: authUserId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', waitlistUser.id)
      }

      const { data: profile, error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'auth_user_id' })
        .select()
        .single()

      if (upsertError) {
        return { success: false, error: 'PROFILE_CREATE_ERROR', details: upsertError.message }
      }

      return {
        success: true,
        userId: authUserId,
        profileId: profile.id,
        userProfile: profile,
        fromWaitlist: !!waitlistUser,
      }
    } catch (error) {
      console.error('[SupabaseIntegration] Sync error:', error)
      return {
        success: false,
        error: 'SYNC_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async updateUserLastLogin(authUserId: string): Promise<void> {
    try {
      const supabase = this.serverClient ? createAdminSupabaseClient() : await this.getSupabaseClient()
      await supabase
        .from('user_profiles')
        .update({
          last_login_at: new Date().toISOString(),
        })
        .eq('auth_user_id', authUserId)
    } catch (error) {
      console.warn('[SupabaseIntegration] Update last login warning:', error)
    }
  }

  async linkWaitlistUser(authUserId: string, email: string): Promise<SyncResult> {
    try {
      if (!this.serverClient) {
        return { success: false, error: 'SERVER_REQUIRED', details: 'Waitlist linking is only available on the server' }
      }

      const supabase = createAdminSupabaseClient()
      
      const { data: waitlistUser, error: findError } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (findError || !waitlistUser) {
        return {
          success: false,
          error: 'WAITLIST_USER_NOT_FOUND',
          details: 'No waitlist user found with this email',
        }
      }

      const { error: updateError } = await supabase
        .from('waitlist')
        .update({
          auth_user_id: authUserId,
          status: 'converted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', waitlistUser.id)

      if (updateError) {
        return { success: false, error: 'LINK_ERROR', details: updateError.message }
      }

      return {
        success: true,
        userId: authUserId,
        details: 'Waitlist user linked successfully',
      }
    } catch (error) {
      console.error('[SupabaseIntegration] Link waitlist error:', error)
      return {
        success: false,
        error: 'LINK_ERROR',
        details: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  async getWaitlistData(email: string): Promise<WaitlistUser | null> {
    try {
      const supabase = this.serverClient ? createAdminSupabaseClient() : await this.getSupabaseClient()
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('[SupabaseIntegration] Get waitlist data error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('[SupabaseIntegration] Get waitlist data error:', error)
      return null
    }
  }
}
