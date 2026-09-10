import { getCurrentUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { SupabaseIntegration } from '@/lib/integrations/auth-supabase'
import type { 
  UserProfile, 
  WaitlistUser, 
  APIResponse,
  UserPreferences,
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
  private supabase
  private integration: SupabaseIntegration

  constructor() {
    this.supabase = createServerSupabaseClient()
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

      const supabase = await this.supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
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

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<APIResponse<UserPreferences>> {
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

      const updatedPreferences = {
        ...currentResult.data,
        ...preferences,
      }

      const supabase = await this.supabase
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          preferences: updatedPreferences,
          updated_at: new Date().toISOString(),
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
        data: data.preferences as UserPreferences,
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

      const supabase = await this.supabase
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

      const supabase = await this.supabase
      const { error } = await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
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
      const supabase = await this.supabase
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

      const supabase = await this.supabase
      
      await Promise.all([
        supabase.from('user_profiles').delete().eq('auth_user_id', user.id),
        supabase.from('analytics').delete().eq('user_id', user.id),
        supabase.from('user_sessions').delete().eq('auth_user_id', user.id),
      ])

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

export const updateUserPreferences = (preferences: Partial<UserPreferences>) => 
  userService.updateUserPreferences(preferences)

export const getUserPreferences = () => 
  userService.getUserPreferences()

export const completeOnboarding = () => 
  userService.completeOnboarding()

export const deleteUserAccount = () => 
  userService.deleteUserAccount()

export default userService
