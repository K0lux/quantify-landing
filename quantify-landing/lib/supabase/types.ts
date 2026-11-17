import type { UserPreferences } from '@/types'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          type: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          type?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          type?: string | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string | null
          status: string | null
          source: string | null
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string | null
          status?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          email?: string
          subscribed_at?: string | null
          status?: string | null
          source?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          id: string
          waitlist_id: string | null
          interests: string[] | null
          estimated_consumption: string | null
          current_utility: string | null
          has_analog_meter: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          waitlist_id?: string | null
          interests?: string[] | null
          estimated_consumption?: string | null
          current_utility?: string | null
          has_analog_meter?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          waitlist_id?: string | null
          interests?: string[] | null
          estimated_consumption?: string | null
          current_utility?: string | null
          has_analog_meter?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          phone: string | null
          full_name: string | null
          country: string | null
          user_type: string | null
          referral_code: string | null
          referred_by: string | null
          position: number | null
          status: string | null
          created_at: string | null
          updated_at: string | null
          invited_at: string | null
          converted_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          phone?: string | null
          full_name?: string | null
          country?: string | null
          user_type?: string | null
          referral_code?: string | null
          referred_by?: string | null
          position?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          invited_at?: string | null
          converted_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          phone?: string | null
          full_name?: string | null
          country?: string | null
          user_type?: string | null
          referral_code?: string | null
          referred_by?: string | null
          position?: number | null
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
          invited_at?: string | null
          converted_at?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          auth_user_id: string
          waitlist_id: string | null
          email: string
          phone: string | null
          first_name: string | null
          last_name: string | null
          country: string | null
          user_type: string | null
          subscription_plan: string | null
          subscription_status: string | null
          onboarding_completed: boolean | null
          preferences: UserPreferences | null
          metadata: Json | null
          last_login_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id: string
          waitlist_id?: string | null
          email: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          country?: string | null
          user_type?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          onboarding_completed?: boolean | null
          preferences?: UserPreferences | null
          metadata?: Json | null
          last_login_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string
          waitlist_id?: string | null
          email?: string
          phone?: string | null
          first_name?: string | null
          last_name?: string | null
          country?: string | null
          user_type?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          onboarding_completed?: boolean | null
          preferences?: UserPreferences | null
          metadata?: Json | null
          last_login_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string | null
          referred_email: string
          referral_code: string
          reward_type: string | null
          reward_value: number | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          referrer_id?: string | null
          referred_email: string
          referral_code: string
          reward_type?: string | null
          reward_value?: number | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string | null
          referred_email?: string
          referral_code?: string
          reward_type?: string | null
          reward_value?: number | null
          status?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_name: string
          properties: Json | null
          user_agent: string | null
          ip_address: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_name: string
          properties?: Json | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_name?: string
          properties?: Json | null
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      landing_content: {
        Row: {
          id: string
          section: string
          key: string
          value: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          section: string
          key: string
          value?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          section?: string
          key?: string
          value?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          id: string
          title: string
          message: string
          audience: string | null
          recipients_count: number | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          title: string
          message: string
          audience?: string | null
          recipients_count?: number | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          message?: string
          audience?: string | null
          recipients_count?: number | null
          sent_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<never, never>
    Functions: Record<never, never>
    Enums: Record<never, never>
    CompositeTypes: Record<never, never>
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])[TableName] extends { Row: infer R }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])[TableName] extends { Insert: infer I }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] & Database['public']['Tables'])[TableName] extends { Update: infer U }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never
