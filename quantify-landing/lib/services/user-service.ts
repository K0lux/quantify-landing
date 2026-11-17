import { getCurrentUser } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { SupabaseIntegration } from '@/lib/integrations/auth-supabase'
import type { 
  UserProfile, 
  WaitlistUser, 
  APIResponse,
  UserPreferences,
  UserPreferencesPatch,
} from '@/types'
import { DEFAULT_USER_PREFERENCES } from '@/types'
import { cache } from 'react'

export interface UnifiedUserData {
  authUser: {
    id: string
    email: string
    createdAt?: string
    lastSignInAt?: string
  } | null

  userProfile: UserProfile | null
  waitlistData: WaitlistUser | null

  syncStatus: {
    isFromWaitlist: boolean
    syncCompleted: boolean
    lastSyncAt?: string
  }

  permissions: {
    isAdmin: boolean
    canAccessDashboard: boolean
    canManageWaitlist: boolean
    subscriptionLevel: 'free' | 'premium' | 'enterprise'
  }
}

export interface UserServiceOptions {
  includeWaitlistData?: boolean
  includeAnalytics?: boolean
  forceRefresh?: boolean
}

export class UserService {
  private integration: SupabaseIntegration

  constructor() {
    this.integration = new SupabaseIntegration(true)
  }

  async getCurrentUserData(options: UserServiceOptions = {}): Promise<APIResponse<UnifiedUserData>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'USER_NOT_AUTHENTICATED',
          message: 'Utilisateur non authentifié',
          timestamp: new Date().toISOString(),
        }
      }

      const profileResult = await this.integration.getUserProfile(user.id)
      
      let userProfile: UserProfile | null = null
      let syncStatus = {
        isFromWaitlist: false,
        syncCompleted: true,
        lastSyncAt: undefined as string | undefined,
      }

      if (profileResult.success && profileResult.userProfile) {
        userProfile = profileResult.userProfile
      } else {
        const syncResult = await this.integration.syncUserFromWaitlist(
          user.id,
          user.email || ''
        )

        if (syncResult.success && syncResult.userProfile) {
          userProfile = syncResult.userProfile
          syncStatus = {
            isFromWaitlist: syncResult.fromWaitlist || false,
            syncCompleted: true,
            lastSyncAt: new Date().toISOString(),
          }
        }
      }

      let waitlistData: WaitlistUser | null = null
      if (options.includeWaitlistData && userProfile?.waitlist_id) {
        const waitlistResult = await this.getWaitlistDataById(userProfile.waitlist_id)
        if (waitlistResult.success) {
          waitlistData = waitlistResult.data!
        }
      }

      const permissions = this.calculateUserPermissions(userProfile)

      await this.integration.updateUserLastLogin(user.id)

      const unifiedData: UnifiedUserData = {
        authUser: {
          id: user.id,
          email: user.email || '',
          createdAt: user.created_at,
          lastSignInAt: user.last_sign_in_at || undefined,
        },
        userProfile,
        waitlistData,
        syncStatus,
        permissions,
      }

      return {
        success: true,
        data: unifiedData,
        timestamp: new Date().toISOString(),
      }

    } catch (error) {
      console.error('[UserService] getCurrentUserData error:', error)
      
      return {
        success: false,
        error: 'USER_DATA_FETCH_FAILED',
        message: 'Impossible de récupérer les données utilisateur',
        timestamp: new Date().toISOString(),
      }
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<APIResponse<UserProfile>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'USER_NOT_AUTHENTICATED',
          message: 'Utilisateur non authentifié',
        }
      }

      const supabase = createAdminSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('auth_user_id', user.id)
        .select()
        .single()

      if (error) {
        return {
          success: false,
          error: 'PROFILE_UPDATE_FAILED',
          message: `Échec de mise à jour: ${error.message}`,
        }
      }

      const waitlistUpdates: {
        full_name?: string
        phone?: string | null
        country?: string | null
        user_type?: string | null
        updated_at?: string
      } = { updated_at: new Date().toISOString() }
      if ('first_name' in updates || 'last_name' in updates) {
        const firstName = updates.first_name ?? data.first_name ?? ''
        const lastName = updates.last_name ?? data.last_name ?? ''
        waitlistUpdates.full_name = [firstName, lastName].filter(Boolean).join(' ')
      }
      if ('phone' in updates) waitlistUpdates.phone = updates.phone ?? null
      if ('country' in updates) waitlistUpdates.country = updates.country ?? null
      if ('user_type' in updates) waitlistUpdates.user_type = updates.user_type ?? null
      if (Object.keys(waitlistUpdates).length > 1) {
        await supabase.from('waitlist').update(waitlistUpdates).eq('auth_user_id', user.id)
      }

      return {
        success: true,
        data: data as UserProfile,
        message: 'Profil mis à jour avec succès',
      }

    } catch (error) {
      console.error('[UserService] updateUserProfile error:', error)
      
      return {
        success: false,
        error: 'PROFILE_UPDATE_ERROR',
        message: 'Erreur lors de la mise à jour du profil',
      }
    }
  }

  async updateUserPreferences(preferences: UserPreferencesPatch): Promise<APIResponse<UserPreferences>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'USER_NOT_AUTHENTICATED',
          message: 'Utilisateur non authentifié',
        }
      }

      const currentResult = await this.getUserPreferences()
      
      if (!currentResult.success) {
        return currentResult
      }

      const currentPreferences = currentResult.data ?? DEFAULT_USER_PREFERENCES
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...preferences,
        notifications: {
          ...currentPreferences.notifications,
          ...preferences.notifications,
        },
        privacy: {
          ...currentPreferences.privacy,
          ...preferences.privacy,
        },
      }

      const supabase = createAdminSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          preferences: updatedPreferences,
        })
        .eq('auth_user_id', user.id)
        .select('preferences')
        .single()

      if (error) {
        return {
          success: false,
          error: 'PREFERENCES_UPDATE_FAILED',
          message: `Échec de mise à jour: ${error.message}`,
        }
      }

      return {
        success: true,
        data: data.preferences ?? updatedPreferences,
        message: 'Préférences mises à jour avec succès',
      }

    } catch (error) {
      console.error('[UserService] updateUserPreferences error:', error)
      
      return {
        success: false,
        error: 'PREFERENCES_UPDATE_ERROR',
        message: 'Erreur lors de la mise à jour des préférences',
      }
    }
  }

  async getUserPreferences(): Promise<APIResponse<UserPreferences>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: true,
          data: DEFAULT_USER_PREFERENCES,
          message: 'Préférences par défaut utilisées',
        }
      }

      const supabase = createAdminSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('preferences')
        .eq('auth_user_id', user.id)
        .single()

      if (error || !data?.preferences) {
        return {
          success: true,
          data: DEFAULT_USER_PREFERENCES,
          message: 'Préférences par défaut utilisées',
        }
      }

      return {
        success: true,
        data: data.preferences as UserPreferences,
      }

    } catch (error) {
      console.error('[UserService] getUserPreferences error:', error)
      
      return {
        success: true,
        data: DEFAULT_USER_PREFERENCES,
        message: 'Préférences par défaut utilisées (erreur)',
      }
    }
  }

  async completeOnboarding(): Promise<APIResponse<boolean>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'USER_NOT_AUTHENTICATED',
          message: 'Utilisateur non authentifié',
        }
      }

      const supabase = createAdminSupabaseClient()
      const { error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
        })
        .eq('auth_user_id', user.id)

      if (error) {
        return {
          success: false,
          error: 'ONBOARDING_UPDATE_FAILED',
          message: `Échec de mise à jour: ${error.message}`,
        }
      }

      return {
        success: true,
        data: true,
        message: 'Onboarding terminé avec succès',
      }

    } catch (error) {
      console.error('[UserService] completeOnboarding error:', error)
      
      return {
        success: false,
        error: 'ONBOARDING_UPDATE_ERROR',
        message: 'Erreur lors de la finalisation de l\'onboarding',
      }
    }
  }

  private async getWaitlistDataById(waitlistId: string): Promise<APIResponse<WaitlistUser>> {
    try {
      const supabase = createAdminSupabaseClient()
      const { data, error } = await supabase
        .from('waitlist')
        .select('*')
        .eq('id', waitlistId)
        .single()

      if (error) {
        return {
          success: false,
          error: 'WAITLIST_DATA_NOT_FOUND',
          message: 'Données waitlist non trouvées',
        }
      }

      return {
        success: true,
        data: data as WaitlistUser,
      }

    } catch (error) {
      console.error('[UserService] getWaitlistDataById error:', error)
      
      return {
        success: false,
        error: 'WAITLIST_DATA_FETCH_ERROR',
        message: 'Erreur lors de la récupération des données waitlist',
      }
    }
  }

  private calculateUserPermissions(userProfile: UserProfile | null) {
    const isAdmin = userProfile?.user_type === 'admin'
    const subscriptionLevel = userProfile?.subscription_plan || 'free'
    
    return {
      isAdmin,
      canAccessDashboard: true,
      canManageWaitlist: isAdmin,
      subscriptionLevel: subscriptionLevel as 'free' | 'premium' | 'enterprise',
    }
  }

  async deleteUserAccount(): Promise<APIResponse<boolean>> {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        return {
          success: false,
          error: 'USER_NOT_AUTHENTICATED',
          message: 'Utilisateur non authentifié',
        }
      }

      const supabase = createAdminSupabaseClient()
      const { data: waitlistUser } = await supabase
        .from('waitlist')
        .select('id, referral_code, email')
        .eq('auth_user_id', user.id)
        .maybeSingle()

      if (waitlistUser) {
        const { error: unlinkError } = waitlistUser.referral_code
          ? await supabase
              .from('waitlist')
              .update({ referred_by: null })
              .eq('referred_by', waitlistUser.referral_code)
          : { error: null }

        if (unlinkError) throw unlinkError

        const cleanupResults = await Promise.all([
          supabase.from('user_preferences').delete().eq('waitlist_id', waitlistUser.id),
          supabase.from('analytics').delete().eq('user_id', waitlistUser.id),
          supabase.from('referrals').delete().eq('referrer_id', waitlistUser.id),
          supabase.from('referrals').delete().eq('referred_email', waitlistUser.email),
          supabase.from('user_profiles').delete().eq('auth_user_id', user.id),
        ])
        const cleanupError = cleanupResults.find((result) => result.error)?.error
        if (cleanupError) throw cleanupError

        const { error: waitlistDeleteError } = await supabase.from('waitlist').delete().eq('id', waitlistUser.id)
        if (waitlistDeleteError) throw waitlistDeleteError
      } else {
        const { error: profileDeleteError } = await supabase.from('user_profiles').delete().eq('auth_user_id', user.id)
        if (profileDeleteError) throw profileDeleteError
      }

      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id)
      if (authDeleteError) throw authDeleteError

      return {
        success: true,
        data: true,
        message: 'Compte supprimé avec succès',
      }

    } catch (error) {
      console.error('[UserService] deleteUserAccount error:', error)
      
      return {
        success: false,
        error: 'ACCOUNT_DELETION_ERROR',
        message: 'Erreur lors de la suppression du compte',
      }
    }
  }
}

const userService = new UserService()

export const getCurrentUserData = cache(
  async (options?: UserServiceOptions): Promise<APIResponse<UnifiedUserData>> => {
    return userService.getCurrentUserData(options)
  }
)

export const updateUserProfile = (updates: Partial<UserProfile>) =>
  userService.updateUserProfile(updates)

export const updateUserPreferences = (preferences: UserPreferencesPatch) =>
  userService.updateUserPreferences(preferences)

export const getUserPreferences = () =>
  userService.getUserPreferences()

export const completeOnboarding = () => 
  userService.completeOnboarding()

export const deleteUserAccount = () => 
  userService.deleteUserAccount()

export default userService
