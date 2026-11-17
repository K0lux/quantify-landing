// ============================================
// lib/supabase/types.ts - TYPES SUPABASE COMPLETS
// ============================================

import type { JsonValue, UserPreferences } from '@/types'

// ==========================================
// TYPES HELPERS POUR SUPABASE
// ==========================================

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database["public"]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never)
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database["public"]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never)
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database["public"]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
    ? (Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never)
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"] &
      Database["public"]["Enums"])[EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

// ==========================================
// TYPES SPÉCIALISÉS POUR L'APP
// ==========================================

// Types pour les requêtes complexes
export type WaitlistUserWithReferrals = Tables<'waitlist'> & {
  referrals: Tables<'referrals'>[]
  referrals_count: number
  total_points: number
}

export type UserProfileComplete = Tables<'user_profiles'> & {
  waitlist: Tables<'waitlist'> | null
  referrals_made: Tables<'referrals'>[]
  referrals_received: Tables<'referrals'>[]
  sessions: Tables<'user_sessions'>[]
}

export type ContactMessageWithAssignee = Tables<'contact_messages'> & {
  assignee: Pick<Tables<'user_profiles'>, 'id' | 'first_name' | 'last_name' | 'email'> | null
}

// Types pour les vues
export type WaitlistStatsView = Database['public']['Views']['waitlist_stats']['Row']

// Types pour les fonctions
export type CalculatePositionFunction = Database['public']['Functions']['calculate_waitlist_position']['Returns']

// ==========================================
// TYPES CUSTOM POUR LES REQUÊTES
// ==========================================

export interface SupabaseQueryOptions {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, unknown>
  search?: string
}

export interface SupabaseResponse<T> {
  data: T | null
  error: {
    message: string
    code?: string
    details?: string
    hint?: string
  } | null
  count: number | null
  status: number
  statusText: string
}

export interface SupabasePaginatedResponse<T> extends SupabaseResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type ContactMessageRow = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string
  message: string
  type: 'general' | 'investment' | 'partnership' | 'support' | 'media'
  status: 'new' | 'in_progress' | 'resolved' | 'closed' | 'spam'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: string | null
  tags: string[]
  response_sent: boolean
  response_sent_at: string | null
  metadata: Json | null
  created_at: string
  updated_at: string
}

type AnalyticsRow = {
  id: string
  user_id: string | null
  session_id: string | null
  event_type: string
  event_name: string
  properties: Json
  user_agent: string | null
  ip_address: string | null
  country: string | null
  referrer: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      // Table principale des utilisateurs en liste d'attente
      waitlist: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          phone: string | null
          full_name: string | null
          country: string
          city: string | null
          user_type: 'particulier' | 'professionnel' | 'institution' | 'utility'
          referral_code: string
          referred_by: string | null
          position: number
          status: 'pending' | 'approved' | 'invited' | 'converted' | 'rejected'
          metadata: Json | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
          invited_at: string | null
          converted_at: string | null
          last_login_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          phone?: string | null
          full_name?: string | null
          country?: string
          city?: string | null
          user_type?: 'particulier' | 'professionnel' | 'institution' | 'utility'
          referral_code?: string
          referred_by?: string | null
          position?: number
          status?: 'pending' | 'approved' | 'invited' | 'converted' | 'rejected'
          metadata?: Json | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
          invited_at?: string | null
          converted_at?: string | null
          last_login_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          phone?: string | null
          full_name?: string | null
          country?: string
          city?: string | null
          user_type?: 'particulier' | 'professionnel' | 'institution' | 'utility'
          referral_code?: string
          referred_by?: string | null
          position?: number
          status?: 'pending' | 'approved' | 'invited' | 'converted' | 'rejected'
          metadata?: Json | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
          invited_at?: string | null
          converted_at?: string | null
          last_login_at?: string | null
        }
        Relationships: []
      }
      
      // Profils utilisateurs complets
      user_profiles: {
        Row: {
          id: string
          auth_user_id: string
          waitlist_id: string | null
          email: string
          phone: string | null
          full_name: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          country: string | null
          city: string | null
          timezone: string | null
          language: string
          user_type: 'particulier' | 'professionnel' | 'institution' | 'utility' | 'admin'
          subscription_plan: 'free' | 'premium' | 'enterprise'
          subscription_status: 'active' | 'inactive' | 'cancelled' | 'past_due'
          company_name: string | null
          job_title: string | null
          onboarding_completed: boolean
          preferences: UserPreferences | null
          metadata: JsonValue | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          email_verified: boolean
          phone_verified: boolean
          is_active: boolean
        }
        Insert: {
          id?: string
          auth_user_id: string
          waitlist_id?: string | null
          email: string
          phone?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          country?: string | null
          city?: string | null
          timezone?: string | null
          language?: string
          user_type?: 'particulier' | 'professionnel' | 'institution' | 'utility' | 'admin'
          subscription_plan?: 'free' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          company_name?: string | null
          job_title?: string | null
          onboarding_completed?: boolean
          preferences?: UserPreferences | null
          metadata?: JsonValue | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          is_active?: boolean
        }
        Update: {
          id?: string
          auth_user_id?: string
          waitlist_id?: string | null
          email?: string
          phone?: string | null
          full_name?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          country?: string | null
          city?: string | null
          timezone?: string | null
          language?: string
          user_type?: 'particulier' | 'professionnel' | 'institution' | 'utility' | 'admin'
          subscription_plan?: 'free' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'inactive' | 'cancelled' | 'past_due'
          company_name?: string | null
          job_title?: string | null
          onboarding_completed?: boolean
          preferences?: UserPreferences | null
          metadata?: JsonValue | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          email_verified?: boolean
          phone_verified?: boolean
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_waitlist_id_fkey"
            columns: ["waitlist_id"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          }
        ]
      }

      // Sessions utilisateurs pour tracking
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          ip_address: string | null
          user_agent: string | null
          country: string | null
          city: string | null
          device_type: string | null
          browser: string | null
          os: string | null
          referrer: string | null
          landing_page: string | null
          session_duration: number | null
          pages_viewed: number | null
          actions_taken: Json | null
          created_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_duration?: number | null
          pages_viewed?: number | null
          actions_taken?: Json | null
          created_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          os?: string | null
          referrer?: string | null
          landing_page?: string | null
          session_duration?: number | null
          pages_viewed?: number | null
          actions_taken?: Json | null
          created_at?: string
          ended_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // Système de parrainage avancé
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referee_id: string
          referral_code: string
          status: 'pending' | 'completed' | 'expired' | 'invalid'
          reward_type: 'position_boost' | 'early_access' | 'credits' | 'discount'
          reward_value: number | null
          reward_applied: boolean
          conversion_date: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referee_id: string
          referral_code: string
          status?: 'pending' | 'completed' | 'expired' | 'invalid'
          reward_type?: 'position_boost' | 'early_access' | 'credits' | 'discount'
          reward_value?: number | null
          reward_applied?: boolean
          conversion_date?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          referrer_id?: string
          referee_id?: string
          referral_code?: string
          status?: 'pending' | 'completed' | 'expired' | 'invalid'
          reward_type?: 'position_boost' | 'early_access' | 'credits' | 'discount'
          reward_value?: number | null
          reward_applied?: boolean
          conversion_date?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "waitlist"
            referencedColumns: ["id"]
          }
        ]
      }

      // Newsletter avec segmentation
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          full_name: string | null
          source: string | null
          segment: string | null
          interests: string[] | null
          preferences: Json | null
          status: 'active' | 'unsubscribed' | 'bounced' | 'spam'
          confirmed_at: string | null
          unsubscribed_at: string | null
          bounce_count: number
          last_opened: string | null
          last_clicked: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          source?: string | null
          segment?: string | null
          interests?: string[] | null
          preferences?: Json | null
          status?: 'active' | 'unsubscribed' | 'bounced' | 'spam'
          confirmed_at?: string | null
          unsubscribed_at?: string | null
          bounce_count?: number
          last_opened?: string | null
          last_clicked?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          source?: string | null
          segment?: string | null
          interests?: string[] | null
          preferences?: Json | null
          status?: 'active' | 'unsubscribed' | 'bounced' | 'spam'
          confirmed_at?: string | null
          unsubscribed_at?: string | null
          bounce_count?: number
          last_opened?: string | null
          last_clicked?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      // Analytics et métriques
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          session_id: string | null
          event_name: string
          event_category: string
          event_properties: Json | null
          page_url: string | null
          referrer: string | null
          ip_address: string | null
          user_agent: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          event_name: string
          event_category: string
          event_properties?: Json | null
          page_url?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string | null
          event_name?: string
          event_category?: string
          event_properties?: Json | null
          page_url?: string | null
          referrer?: string | null
          ip_address?: string | null
          user_agent?: string | null
          timestamp?: string
          created_at?: string
        }
        Relationships: []
      }

      // Notifications système
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'email' | 'sms' | 'push' | 'in_app'
          category: 'waitlist' | 'referral' | 'system' | 'marketing'
          title: string
          message: string
          metadata: Json | null
          status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
          sent_at: string | null
          read_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'email' | 'sms' | 'push' | 'in_app'
          category: 'waitlist' | 'referral' | 'system' | 'marketing'
          title: string
          message: string
          metadata?: Json | null
          status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
          sent_at?: string | null
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'email' | 'sms' | 'push' | 'in_app'
          category?: 'waitlist' | 'referral' | 'system' | 'marketing'
          title?: string
          message?: string
          metadata?: Json | null
          status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
          sent_at?: string | null
          read_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      landing_content: {
        Row: {
          id: string
          section: string
          key: string
          value: string | null
          type: 'text' | 'html' | 'json' | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          section: string
          key: string
          value?: string | null
          type?: 'text' | 'html' | 'json' | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          section?: string
          key?: string
          value?: string | null
          type?: 'text' | 'html' | 'json' | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          id: string
          title: string
          message: string
          audience: 'all' | 'pending' | 'invited' | null
          recipients_count: number | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          title: string
          message: string
          audience?: 'all' | 'pending' | 'invited' | null
          recipients_count?: number | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          message?: string
          audience?: 'all' | 'pending' | 'invited' | null
          recipients_count?: number | null
          sent_at?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: ContactMessageRow
        Insert: Pick<ContactMessageRow, 'name' | 'email' | 'subject' | 'message'> &
          Partial<Omit<ContactMessageRow, 'id' | 'name' | 'email' | 'subject' | 'message'>>
        Update: Partial<ContactMessageRow>
        Relationships: []
      }
      analytics: {
        Row: AnalyticsRow
        Insert: Pick<AnalyticsRow, 'event_type' | 'event_name'> &
          Partial<Omit<AnalyticsRow, 'id' | 'event_type' | 'event_name'>>
        Update: Partial<AnalyticsRow>
        Relationships: []
      }
    }
    Views: {
      // Vue pour les statistiques de la waitlist
      waitlist_stats: {
        Row: {
          total_users: number | null
          pending_users: number | null
          invited_users: number | null
          converted_users: number | null
          total_referrals: number | null
          avg_position: number | null
          signup_rate_7d: number | null
          conversion_rate: number | null
        }
        Relationships: []
      }
      
      // Vue pour le leaderboard des parrainages
      referral_leaderboard: {
        Row: {
          user_id: string | null
          full_name: string | null
          email: string | null
          total_referrals: number | null
          successful_referrals: number | null
          position_improvement: number | null
          rank: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      // Fonction pour générer un code de parrainage unique
      generate_referral_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      
      // Fonction pour calculer la position dans la waitlist
      calculate_waitlist_position: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      
      // Fonction pour appliquer les récompenses de parrainage
      apply_referral_rewards: {
        Args: {
          referrer_id: string
          referee_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_type_enum: 'particulier' | 'professionnel' | 'institution' | 'utility'
      waitlist_status_enum: 'pending' | 'invited' | 'converted' | 'rejected'
      notification_type_enum: 'email' | 'sms' | 'push' | 'in_app'
      notification_category_enum: 'waitlist' | 'referral' | 'system' | 'marketing'
      notification_status_enum: 'pending' | 'sent' | 'delivered' | 'failed' | 'read'
      referral_status_enum: 'pending' | 'completed' | 'expired' | 'invalid'
      reward_type_enum: 'position_boost' | 'early_access' | 'credits' | 'discount'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
