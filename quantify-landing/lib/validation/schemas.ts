// ============================================
// lib/validation/schemas.ts - VALIDATION COMPLÈTE
// ============================================

import { z } from 'zod'
import { 
  USER_TYPES, 
  WAITLIST_STATUS, 
  COUNTRIES,
  SUBSCRIPTION_PLANS,
  DEFAULT_USER_PREFERENCES
} from '@/types'

// ==========================================
// SCHÉMAS DE BASE
// ==========================================

// Validation email avec regex robuste
export const emailSchema = z
  .string({
    required_error: 'L\'email est requis',
    invalid_type_error: 'L\'email doit être une chaîne de caractères'
  })
  .min(5, 'L\'email doit contenir au moins 5 caractères')
  .max(100, 'L\'email ne peut pas dépasser 100 caractères')
  .email('Veuillez entrer un email valide')
  .toLowerCase()
  .refine(
    (email) => {
      // Rejeter les emails temporaires/jetables communs
      const tempDomains = ['10minutemail', 'guerrillamail', 'tempmail', 'mailinator']
      return !tempDomains.some(domain => email.includes(domain))
    },
    'Les emails temporaires ne sont pas autorisés'
  )

// Validation téléphone international
export const phoneSchema = z
  .string({
    invalid_type_error: 'Le numéro de téléphone doit être une chaîne de caractères'
  })
  .regex(
    /^\+?[1-9]\d{7,14}$/,
    'Le numéro de téléphone doit être valide (format international)'
  )
  .optional()
  .or(z.literal(''))
  .transform(val => val === '' ? null : val)

// Validation nom complet
export const fullNameSchema = z
  .string({
    required_error: 'Le nom complet est requis',
    invalid_type_error: 'Le nom doit être une chaîne de caractères'
  })
  .min(2, 'Le nom doit contenir au moins 2 caractères')
  .max(100, 'Le nom ne peut pas dépasser 100 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\u0100-\u017F\s'-]+$/,
    'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets'
  )
  .transform(name => 
    name.trim().split(' ')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  )

// Validation code de parrainage
export const referralCodeSchema = z
  .string()
  .length(8, 'Le code de parrainage doit contenir exactement 8 caractères')
  .regex(
    /^[A-Z0-9]{8}$/,
    'Le code de parrainage doit contenir uniquement des lettres majuscules et des chiffres'
  )
  .optional()
  .or(z.literal(''))
  .transform(val => val === '' ? null : val)

// Validation UUID
export const uuidSchema = z
  .string()
  .uuid('L\'identifiant doit être un UUID valide')

// ==========================================
// SCHÉMAS ENUMS
// ==========================================

export const userTypeSchema = z.enum(
  Object.values(USER_TYPES) as [string, ...string[]],
  {
    required_error: 'Le type d\'utilisateur est requis',
    invalid_type_error: 'Type d\'utilisateur invalide'
  }
)

export const waitlistStatusSchema = z.enum(
  Object.values(WAITLIST_STATUS) as [string, ...string[]],
  {
    required_error: 'Le statut est requis',
    invalid_type_error: 'Statut invalide'
  }
)

export const countrySchema = z.enum(
  Object.values(COUNTRIES) as [string, ...string[]],
  {
    required_error: 'Le pays est requis',
    invalid_type_error: 'Code pays invalide'
  }
)

export const subscriptionPlanSchema = z.enum(
  Object.values(SUBSCRIPTION_PLANS) as [string, ...string[]],
  {
    required_error: 'Le plan d\'abonnement est requis',
    invalid_type_error: 'Plan d\'abonnement invalide'
  }
)

// ==========================================
// SCHÉMAS COMPLEXES
// ==========================================

// Préférences utilisateur
export const userPreferencesSchema = z.object({
  language: z.enum(['fr', 'en']).default('fr'),
  timezone: z.string().default('Africa/Lome'),
  currency: z.enum(['XOF', 'EUR', 'USD']).default('XOF'),
  notifications: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
    marketing: z.boolean().default(false)
  }),
  privacy: z.object({
    profile_visibility: z.enum(['public', 'private']).default('private'),
    analytics_opt_out: z.boolean().default(false)
  })
}).default(DEFAULT_USER_PREFERENCES)

// Métadonnées flexibles
export const metadataSchema = z
  .record(z.unknown())
  .nullable()
  .optional()
  .transform(val => val || null)

// ==========================================
// SCHÉMAS FORMULAIRES
// ==========================================

/**
 * Schéma pour l'inscription à la waitlist
 */
export const waitlistFormSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  fullName: fullNameSchema,
  country: countrySchema,
  userType: userTypeSchema,
  referredBy: referralCodeSchema,
  acceptTerms: z
    .boolean()
    .refine(val => val === true, {
      message: 'Vous devez accepter les conditions d\'utilisation'
    }),
  acceptMarketing: z.boolean().optional().default(false)
}).strict()

export type WaitlistFormInput = z.input<typeof waitlistFormSchema>
export type WaitlistFormOutput = z.output<typeof waitlistFormSchema>

/**
 * Schéma pour le formulaire de contact
 */
export const contactFormSchema = z.object({
  name: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
  company: z
    .string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
  subject: z
    .string({
      required_error: 'Le sujet est requis'
    })
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
  message: z
    .string({
      required_error: 'Le message est requis'
    })
    .min(20, 'Le message doit contenir au moins 20 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères'),
  type: z.enum(['general', 'investment', 'partnership', 'support', 'media']).default('general')
}).strict()

export type ContactFormInput = z.infer<typeof contactFormSchema>

/**
 * Schéma pour l'inscription newsletter
 */
export const newsletterFormSchema = z.object({
  email: emailSchema,
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\u0100-\u017F'-]+$/,
      'Le prénom ne peut contenir que des lettres, apostrophes et tirets'
    )
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? null : val),
  interests: z.array(z.string()).optional().default([])
}).strict()

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>

// ==========================================
// SCHÉMAS ENTITÉS
// ==========================================

/**
 * Schéma pour créer un utilisateur waitlist
 */
export const createWaitlistUserSchema = z.object({
  auth_user_id: uuidSchema.nullable().optional(),
  email: emailSchema,
  phone: phoneSchema,
  full_name: fullNameSchema.nullable().optional(),
  country: countrySchema,
  user_type: userTypeSchema,
  referral_code: referralCodeSchema.default(() => 
    Math.random().toString(36).substring(2, 10).toUpperCase()
  ),
  referred_by: referralCodeSchema,
  status: waitlistStatusSchema.default('pending'),
  metadata: metadataSchema
})

export type CreateWaitlistUserInput = z.infer<typeof createWaitlistUserSchema>

/**
 * Schéma pour mettre à jour un utilisateur waitlist
 */
export const updateWaitlistUserSchema = z.object({
  phone: phoneSchema,
  full_name: fullNameSchema.nullable().optional(),
  status: waitlistStatusSchema,
  metadata: metadataSchema
}).partial()

export type UpdateWaitlistUserInput = z.infer<typeof updateWaitlistUserSchema>

/**
 * Schéma pour créer un profil utilisateur
 */
export const createUserProfileSchema = z.object({
  auth_user_id: uuidSchema,
  waitlist_id: uuidSchema.nullable().optional(),
  email: emailSchema,
  phone: phoneSchema,
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  country: countrySchema,
  city: z.string().nullable().optional(),
  user_type: userTypeSchema,
  subscription_plan: subscriptionPlanSchema.default('free'),
  subscription_status: z.enum(['active', 'inactive', 'cancelled', 'past_due']).default('active'),
  onboarding_completed: z.boolean().default(false),
  preferences: userPreferencesSchema,
  metadata: metadataSchema
})

export type CreateUserProfileInput = z.infer<typeof createUserProfileSchema>

/**
 * Schéma pour créer un parrainage
 */
export const createReferralSchema = z.object({
  referrer_id: uuidSchema,
  referred_id: uuidSchema,
  referral_code: referralCodeSchema,
  status: z.enum(['pending', 'completed', 'expired', 'cancelled']).default('pending'),
  reward_type: z.enum(['position_boost', 'credits', 'premium_trial', 'cash']).default('position_boost'),
  reward_value: z.number().positive().default(5),
  reward_claimed: z.boolean().default(false),
  reward_claimed_at: z.string().datetime().nullable().optional(),
  completed_at: z.string().datetime().nullable().optional(),
  expires_at: z.string().datetime().nullable().optional(),
  metadata: metadataSchema
})

export type CreateReferralInput = z.infer<typeof createReferralSchema>

// ==========================================
// SCHÉMAS API
// ==========================================

/**
 * Schéma pour les paramètres de requête paginée
 */
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'La page doit être un nombre')
    .transform(Number)
    .refine(n => n > 0, 'La page doit être supérieure à 0')
    .default('1'),
  limit: z
    .string()
    .regex(/^\d+$/, 'La limite doit être un nombre')
    .transform(Number)
    .refine(n => n > 0 && n <= 100, 'La limite doit être entre 1 et 100')
    .default('10'),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional()
})

export type PaginationInput = z.infer<typeof paginationSchema>

/**
 * Schéma pour les réponses API
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
  code: z.string().optional(),
  timestamp: z.string().datetime().optional()
})

export type ApiResponseInput = z.infer<typeof apiResponseSchema>

// ==========================================
// SCHÉMAS AUTH
// ==========================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Le mot de passe est requis'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
  fullName: fullNameSchema,
})

export type RegisterInput = z.infer<typeof registerSchema>

// ==========================================
// UTILITAIRES DE VALIDATION
// ==========================================

/**
 * Fonction helper pour valider avec gestion d'erreurs
 */
/*export function validateWithErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      }
    }
    return {
      success: false,
      errors: ['Erreur de validation inconnue']
    }
  }
}

**
 * Fonction helper pour valider de manière asynchrone
 *
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return await schema.parseAsync(data)
}

**
 * Fonction helper pour créer des erreurs de validation API
 *
export function createValidationError(errors: z.ZodError): {
  message: string
  code: string
  details: Array<{
    field: string
    message: string
    code: string
  }>
} {
  return {
    message: 'Erreur de validation',
    code: 'VALIDATION_ERROR',
    details: errors.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code
    }))
  }
}
import { z } from 'zod'

export const waitlistSchema = z.object({
  fullName: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom est trop long'),
  email: z.string()
    .email('Email invalide')
    .toLowerCase(),
  phone: z.string()
    .regex(/^\+?[0-9]{8,15}$/, 'Numéro de téléphone invalide'),
  userType: z.enum(['particulier', 'professionnel', 'institution', 'utility']),
  country: z.string().length(2).default('TG'),
  referredBy: z.string().optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  type: z.enum(['general', 'investment', 'partnership', 'support']).optional(),
})*/


// ==========================================
// UTILITAIRES DE VALIDATION (version robuste)
// ==========================================

/**
 * Fonction helper pour valider avec gestion d'erreurs
 */
export function validateWithErrors<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.issues.map((issue) =>
          `${issue.path.length > 0 ? issue.path.join('.') : 'inconnu'}: ${issue.message}`
        ),
      }
    }

    return {
      success: false,
      errors: [error instanceof Error ? error.message : 'Erreur de validation inconnue'],
    }
  }
}

/**
 * Fonction helper pour valider de manière asynchrone
 */
export async function validateAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return await schema.parseAsync(data)
}

/**
 * Fonction helper pour créer des erreurs de validation API
 */
export function createValidationError(errors: z.ZodError): {
  message: string
  code: string
  details: Array<{
    field: string
    message: string
    code: string
  }>
} {
  return {
    message: 'Erreur de validation',
    code: 'VALIDATION_ERROR',
    details: errors.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    })),
  }
}

// ==========================================
// SCHÉMA API WAITLIST (accepte les données post-transformation du client)
// ==========================================
export const waitlistApiSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  userType: z.enum(
    Object.values(USER_TYPES) as [string, ...string[]]
  ),
  country: z.enum(
    Object.values(COUNTRIES) as [string, ...string[]]
  ),
  referredBy: z.string().nullable().optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions' })
  }),
  acceptMarketing: z.boolean().optional().default(false),
})

export const newsletterSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  type: z
    .enum(['general', 'investment', 'partnership', 'support'])
    .optional(),
})
