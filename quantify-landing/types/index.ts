// ============================================
// types/index.ts - TYPES COMPLETS ET ROBUSTES
// ============================================

// ==========================================
// TYPES DE BASE
// ==========================================

export type UUID = string
export type Email = string
export type PhoneNumber = string
export type ISODateString = string
export type ReferralCode = string

// ==========================================
// ENUMS ET CONSTANTES
// ==========================================

export const USER_TYPES = {
  PARTICULIER: 'particulier',
  PROFESSIONNEL: 'professionnel', 
  INSTITUTION: 'institution',
  UTILITY: 'utility',
  ADMIN: 'admin'
} as const

export const WAITLIST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  INVITED: 'invited',
  CONVERTED: 'converted',
  REJECTED: 'rejected'
} as const

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const

export const COUNTRIES = {
  TG: 'TG', // Togo
  BF: 'BF', // Burkina Faso
  CI: 'CI', // Côte d'Ivoire
  ML: 'ML', // Mali
  NE: 'NE', // Niger
  SN: 'SN', // Sénégal
  BJ: 'BJ', // Bénin
  GW: 'GW'  // Guinée-Bissau
} as const

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES]
export type WaitlistStatus = typeof WAITLIST_STATUS[keyof typeof WAITLIST_STATUS]
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[keyof typeof SUBSCRIPTION_PLANS]
export type Country = typeof COUNTRIES[keyof typeof COUNTRIES]
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue | undefined }
  | JsonValue[]

export type UserPreferencesPatch = Partial<Omit<UserPreferences, 'notifications' | 'privacy'>> & {
  notifications?: Partial<UserPreferences['notifications']>
  privacy?: Partial<UserPreferences['privacy']>
}

// ==========================================
// INTERFACES PRINCIPALES
// ==========================================

/**
 * Utilisateur de la liste d'attente
 */
export interface WaitlistUser {
  id: UUID
  auth_user_id: UUID | null // Stores Supabase Auth user ID (column name kept for DB compat)
  email: Email
  phone: PhoneNumber | null
  full_name: string | null
  country: string | null
  user_type: string | null
  referral_code: ReferralCode | null
  referred_by: ReferralCode | null
  position: number | null
  status: string | null
  created_at: ISODateString | null
  updated_at: ISODateString | null
  invited_at: ISODateString | null
  converted_at: ISODateString | null
}

/**
 * Profil utilisateur complet (post-inscription)
 */
export interface UserProfile {
  id: UUID
  auth_user_id: UUID // Stores Supabase Auth user ID (column name kept for DB compat)
  waitlist_id: UUID | null
  email: Email
  phone: PhoneNumber | null
  first_name: string | null
  last_name: string | null
  country: string | null
  user_type: string | null
  subscription_plan: string | null
  subscription_status: string | null
  onboarding_completed: boolean | null
  preferences: UserPreferences | null
  metadata: JsonValue | null
  created_at: ISODateString | null
  last_login_at: ISODateString | null
}

/**
 * Préférences utilisateur
 */
export interface UserPreferences {
  language: 'fr' | 'en'
  timezone: string
  currency: 'XOF' | 'EUR' | 'USD'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    marketing: boolean
  }
  privacy: {
    profile_visibility: 'public' | 'private'
    analytics_opt_out: boolean
  }
}

/**
 * Système de parrainage robuste
 */
export interface Referral {
  id: UUID
  referrer_id: UUID | null
  referred_email: Email
  referral_code: ReferralCode
  status: string | null
  reward_type: string | null
  reward_value: number | null
  created_at: ISODateString | null
}

/**
 * Analytics et métriques
 */
export interface Analytics {
  id: UUID
  user_id: UUID | null
  event_type: string
  event_name: string
  properties: JsonValue | null
  user_agent: string | null
  ip_address: string | null
  created_at: ISODateString | null
}

/**
 * Messages de contact avec workflow
 */
export interface ContactMessage {
  id: UUID
  name: string
  email: Email
  phone: PhoneNumber | null
  company: string | null
  subject: string
  message: string
  type: 'general' | 'investment' | 'partnership' | 'support' | 'media'
  status: 'new' | 'in_progress' | 'resolved' | 'closed' | 'spam'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: UUID | null
  tags: string[]
  response_sent: boolean
  response_sent_at: ISODateString | null
  metadata: Record<string, unknown> | null
  created_at: ISODateString
  updated_at: ISODateString
}

/**
 * Newsletter avec segmentation
 */
export interface NewsletterSubscriber {
  id: UUID
  email: Email
  first_name: string | null
  source: 'landing' | 'waitlist' | 'app' | 'social' | 'referral'
  segments: string[]
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly'
    topics: string[]
  }
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained'
  confirmed: boolean
  confirmed_at: ISODateString | null
  unsubscribed_at: ISODateString | null
  last_sent_at: ISODateString | null
  metadata: Record<string, unknown> | null
  created_at: ISODateString
  updated_at: ISODateString
}

/**
 * Sessions utilisateur pour analytics
 */
export interface UserSession {
  id: UUID
  user_id: UUID | null
  auth_user_id: UUID | null // Stores Supabase Auth user ID (column name kept for DB compat)
  session_token: string
  ip_address: string | null
  user_agent: string | null
  country: string | null
  city: string | null
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  browser: string | null
  os: string | null
  referrer: string | null
  landing_page: string | null
  duration_seconds: number | null
  pages_viewed: number
  actions_taken: number
  converted: boolean
  conversion_type: string | null
  ended_at: ISODateString | null
  created_at: ISODateString
  updated_at: ISODateString
}

// ==========================================
// TYPES API ET RESPONSES
// ==========================================

export interface APIResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  timestamp?: ISODateString
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    has_next: boolean
    has_prev: boolean
  }
}

export interface WaitlistStats {
  total_users: number
  pending_users: number
  approved_users: number
  converted_users: number
  referrals_count: number
  top_referrers: Array<{
    user_id: UUID
    email: Email
    referrals_count: number
    total_points: number
  }>
  daily_signups: Array<{
    date: string
    count: number
  }>
  conversion_rate: number
  avg_position: number
}

// ==========================================
// TYPES FORMULAIRES ET VALIDATION
// ==========================================

export interface WaitlistFormData {
  email: Email
  phone?: PhoneNumber
  fullName: string
  country: Country
  userType: UserType
  referredBy?: ReferralCode
  acceptTerms: boolean
  acceptMarketing: boolean
}

export interface ContactFormData {
  name: string
  email: Email
  phone?: PhoneNumber
  company?: string
  subject: string
  message: string
  type: ContactMessage['type']
}

export interface NewsletterFormData {
  email: Email
  firstName?: string
  interests?: string[]
}

// ==========================================
// TYPES AUTH
// ==========================================

export interface AuthUser {
  id: string
  email: string
  created_at?: string
  last_sign_in_at?: string
  user_metadata?: Record<string, unknown>
}

// ==========================================
// TYPES UTILITAIRES
// ==========================================

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type Required<T> = {
  [P in keyof T]-?: T[P]
}

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

// Types pour les opérations CRUD
export type CreateWaitlistUser = Omit<WaitlistUser, 'id' | 'created_at' | 'updated_at' | 'invited_at' | 'converted_at' | 'position'>
export type UpdateWaitlistUser = Partial<Pick<WaitlistUser, 'phone' | 'full_name' | 'status'>>
export type CreateUserProfile = Omit<UserProfile, 'id' | 'created_at' | 'last_login_at'>
export type UpdateUserProfile = Partial<Omit<UserProfile, 'id' | 'auth_user_id' | 'created_at'>>

// ==========================================
// CONSTANTS EXPORTÉES
// ==========================================

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'fr',
  timezone: 'Africa/Lome',
  currency: 'XOF',
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketing: false
  },
  privacy: {
    profile_visibility: 'private',
    analytics_opt_out: false
  }
}

export const REFERRAL_REWARDS = {
  POSITION_BOOST: 5, // positions gagnées
  PREMIUM_TRIAL_DAYS: 30,
  CASH_REWARD_XOF: 1000
} as const
