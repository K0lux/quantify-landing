// ============================================
// components/waitlist/waitlist-form.tsx - FORMULAIRE WAITLIST COMPLET
// ============================================

'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { 
  waitlistFormSchema, 
  type WaitlistFormInput,
  type WaitlistFormOutput,
} from '@/lib/validation/schemas'
import { 
  USER_TYPES, 
  COUNTRIES, 
  type WaitlistUser, 
  type APIResponse 
} from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useAnalytics } from '@/hooks/use-analytics'
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

// ==========================================
// TYPES ET INTERFACES
// ==========================================

interface WaitlistFormProps {
  className?: string
  onSuccess?: (data: WaitlistUser, position: number) => void
  onError?: (error: string) => void
  compact?: boolean
  showReferral?: boolean
  initialReferralCode?: string
}

interface SubmissionState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
  position?: number
  referralCode?: string
}

// ==========================================
// UTILITAIRES
// ==========================================

const DEFAULT_ERROR_MESSAGE = 'Une erreur est survenue. Veuillez réessayer.'

const COUNTRIES_OPTIONS = Object.entries(COUNTRIES).map(([key, value]) => ({
  value: value,
  label: key === 'TG' ? 'Togo' :
         key === 'BF' ? 'Burkina Faso' :
         key === 'CI' ? 'Côte d\'Ivoire' :
         key === 'ML' ? 'Mali' :
         key === 'NE' ? 'Niger' :
         key === 'SN' ? 'Sénégal' :
         key === 'BJ' ? 'Bénin' :
         key === 'GW' ? 'Guinée-Bissau' : value
}))

const USER_TYPES_OPTIONS = Object.entries(USER_TYPES).map(([key, value]) => ({
  value: value,
  label: key === 'PARTICULIER' ? 'Particulier' :
         key === 'PROFESSIONNEL' ? 'Professionnel' :
         key === 'INSTITUTION' ? 'Institution' :
         key === 'UTILITY' ? 'Utility Company' :
         key === 'ADMIN' ? 'Administrateur' : value
}))

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

export function WaitlistForm({
  className,
  onSuccess,
  onError,
  compact = false,
  showReferral = true,
  initialReferralCode
}: WaitlistFormProps) {
  // ==========================================
  // HOOKS ET STATE
  // ==========================================
  
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  const { track } = useAnalytics()
  
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    isLoading: false,
    isSuccess: false,
    error: null
  })
  
  const [showReferralField, setShowReferralField] = useState(
    showReferral && (!!initialReferralCode || !!searchParams.get('ref'))
  )
  
  // Configuration React Hook Form avec Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    reset,
    setValue,
    clearErrors
  } = useForm<WaitlistFormInput, unknown, WaitlistFormOutput>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      email: '',
      phone: '',
      fullName: '',
      country: 'TG',
      userType: 'particulier',
      referredBy: initialReferralCode || searchParams.get('ref') || '',
      acceptTerms: false,
      acceptMarketing: false
    },
    mode: 'onBlur'
  })
  
  // ==========================================
  // HANDLERS
  // ==========================================
  
  /**
   * Soumission du formulaire
   */
  const onSubmit: SubmitHandler<WaitlistFormOutput> = useCallback(async (data) => {
    try {
      setSubmissionState({
        isLoading: true,
        isSuccess: false,
        error: null
      })
      
      // Track tentative de soumission
      track('waitlist_form_submit_attempt', {
        user_type: data.userType,
        country: data.country,
        has_referral: !!data.referredBy,
        accept_marketing: data.acceptMarketing
      })
      
      // Appel API
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
      })
      
      const result: APIResponse<WaitlistUser> & {
        position?: number
        referralCode?: string
        estimatedLaunchDate?: string
      } = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || result.error || DEFAULT_ERROR_MESSAGE)
      }
      
      if (!result.success || !result.data) {
        throw new Error(result.message || result.error || DEFAULT_ERROR_MESSAGE)
      }
      
      // Succès
      setSubmissionState({
        isLoading: false,
        isSuccess: true,
        error: null,
        position: result.position,
        referralCode: result.referralCode
      })
      
      // Analytics
      track('waitlist_form_submit_success', {
        position: result.position,
        user_type: data.userType,
        country: data.country,
        has_referral: !!data.referredBy
      })
      
      // Toast de succès
      showToast(
        `Inscription réussie ! Vous êtes à la position #${result.position} sur la liste d'attente.`,
        'success'
      )
      
      // Callback personnalisé
      onSuccess?.(result.data, result.position || 0)
      
      // Reset du formulaire
      reset()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE
      
      setSubmissionState({
        isLoading: false,
        isSuccess: false,
        error: errorMessage
      })
      
      // Analytics
      track('waitlist_form_submit_error', {
        error: errorMessage,
        user_type: data.userType,
        country: data.country
      })
      
      // Toast d'erreur
      showToast(
        `Erreur d'inscription: ${errorMessage}`,
        'error'
      )
      
      // Callback personnalisé
      onError?.(errorMessage)
      
      console.error('[WaitlistForm] Submission error:', error)
    }
  }, [track, showToast, onSuccess, onError, reset])
  
  /**
   * Gère l'affichage/masquage du champ de parrainage
   */
  const handleToggleReferral = useCallback(() => {
    setShowReferralField(!showReferralField)
    if (!showReferralField) {
      setValue('referredBy', '')
      clearErrors('referredBy')
    }
    
    track('waitlist_referral_field_toggle', {
      show: !showReferralField
    })
  }, [showReferralField, setValue, clearErrors, track])
  
  // ==========================================
  // UTILITAIRES D'INTERFACE
  // ==========================================
  
  const getFieldError = (fieldName: keyof WaitlistFormInput): string | undefined => {
    return errors[fieldName]?.message
  }
  
  const isFieldTouched = (fieldName: keyof WaitlistFormInput): boolean => {
    return touchedFields[fieldName] || false
  }
  
  const getFieldClassName = (fieldName: keyof WaitlistFormInput, baseClasses: string): string => {
    const hasError = !!getFieldError(fieldName)
    const isTouched = isFieldTouched(fieldName)
    
    return cn(
      baseClasses,
      'bg-white text-slate-900 placeholder:text-slate-400',
      {
        'border-red-400 ring-2 ring-red-100 focus:border-red-500 focus:ring-red-200': hasError,
        'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-100': isTouched && !hasError,
        'border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100': !hasError && !isTouched
      }
    )
  }
  
  // ==========================================
  // RENDER
  // ==========================================
  
  if (submissionState.isSuccess) {
    return (
      <div className={cn(
        'bg-white rounded-2xl p-5 shadow-lg border border-green-200 sm:p-8',
        className
      )}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Félicitations !
          </h2>
          
          <p className="text-slate-600 mb-6">
            Vous avez été ajouté(e) avec succès à la liste d&apos;attente de Quantify.
          </p>
          
          {submissionState.position && (
            <div className="bg-gradient-to-r from-orange-50 to-white rounded-xl p-6 mb-6">
              <p className="text-3xl font-bold text-blue-600 mb-2">
                Position #{submissionState.position}
              </p>
              <p className="text-sm text-slate-600">
                Vous recevrez une invitation dès que votre tour arrivera
              </p>
            </div>
          )}
          
          {submissionState.referralCode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-slate-700 mb-2">
                <strong>Votre code de parrainage :</strong>
              </p>
              <div className="font-mono text-lg font-bold text-yellow-800 bg-yellow-100 rounded-lg px-4 py-2">
                {submissionState.referralCode}
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Partagez ce code pour gagner des positions dans la file !
              </p>
            </div>
          )}
          
          <button
            onClick={() => {
              setSubmissionState({ isLoading: false, isSuccess: false, error: null })
              reset()
            }}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
          >
            Inscrire une autre personne
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-slate-200',
        compact ? 'p-4' : 'p-4 sm:p-6',
        className
      )}
      noValidate
    >
      {/* En-tête */}
      {!compact && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Rejoindre la liste d&apos;attente
          </h2>
          <p className="text-slate-600">
            Soyez parmi les premiers à découvrir Quantify
          </p>
        </div>
      )}
      
      {/* Erreur globale */}
      {submissionState.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Erreur d&apos;inscription</p>
            <p className="text-red-700 text-sm">{submissionState.error}</p>
          </div>
        </div>
      )}
      
      <div className={compact ? 'space-y-4 sm:space-y-5' : 'space-y-6'}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Adresse email <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            autoComplete="email"
            placeholder="votre@email.com"
            className={getFieldClassName('email', 
              'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200'
            )}
            disabled={submissionState.isLoading}
          />
          {getFieldError('email') && (
            <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
          )}
        </div>
        
        {/* Nom complet */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName')}
            type="text"
            id="fullName"
            autoComplete="name"
            placeholder="Prénom Nom"
            className={getFieldClassName('fullName', 
              'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200'
            )}
            disabled={submissionState.isLoading}
          />
          {getFieldError('fullName') && (
            <p className="text-red-600 text-sm mt-1">{getFieldError('fullName')}</p>
          )}
        </div>
        
        {/* Téléphone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
            Numéro de téléphone
          </label>
          <input
            {...register('phone')}
            type="tel"
            id="phone"
            autoComplete="tel"
            placeholder="+228 XX XX XX XX"
            className={getFieldClassName('phone', 
              'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200'
            )}
            disabled={submissionState.isLoading}
          />
          {getFieldError('phone') && (
            <p className="text-red-600 text-sm mt-1">{getFieldError('phone')}</p>
          )}
        </div>
        
        {/* Pays & Type d'utilisateur */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Pays <span className="text-red-500">*</span>
            </label>
            <select
              {...register('country')}
              id="country"
              className={getFieldClassName('country', 
                'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200 appearance-none cursor-pointer'
              )}
              disabled={submissionState.isLoading}
            >
              {COUNTRIES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {getFieldError('country') && (
              <p className="text-red-600 text-sm mt-1">{getFieldError('country')}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="userType" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Type de profil <span className="text-red-500">*</span>
            </label>
            <select
              {...register('userType')}
              id="userType"
              className={getFieldClassName('userType', 
                'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200 appearance-none cursor-pointer'
              )}
              disabled={submissionState.isLoading}
            >
              {USER_TYPES_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {getFieldError('userType') && (
              <p className="text-red-600 text-sm mt-1">{getFieldError('userType')}</p>
            )}
          </div>
        </div>
        
        {/* Code de parrainage */}
        {showReferral && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="referredBy" className="block text-sm font-medium text-slate-700">
                Code de parrainage (optionnel)
              </label>
              <button
                type="button"
                onClick={handleToggleReferral}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                {showReferralField ? (
                  <><EyeOff className="w-3 h-3" /> Masquer</>
                ) : (
                  <><Eye className="w-3 h-3" /> Afficher</>
                )}
              </button>
            </div>
            
            {showReferralField && (
              <>
                <input
                  {...register('referredBy')}
                  type="text"
                  id="referredBy"
                  placeholder="CODE12345"
                  className={getFieldClassName('referredBy', 
                    'w-full px-4 py-3 border-2 rounded-xl shadow-sm focus:ring-2 focus:outline-none transition-all duration-200 font-mono uppercase tracking-wider'
                  )}
                  disabled={submissionState.isLoading}
                />
                {getFieldError('referredBy') && (
                  <p className="text-red-600 text-sm mt-1">{getFieldError('referredBy')}</p>
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Entrez le code d&apos;un ami pour gagner des positions dans la file
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Checkboxes */}
        <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-start gap-3">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              id="acceptTerms"
              className="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer accent-blue-600"
              disabled={submissionState.isLoading}
            />
            <label htmlFor="acceptTerms" className="text-sm text-slate-800 cursor-pointer leading-relaxed">
              J&apos;accepte les{' '}
              <a href="/conditions" target="_blank" className="text-blue-600 font-medium hover:underline">
                conditions d&apos;utilisation
              </a>{' '}
              et la{' '}
              <a href="/confidentialite" target="_blank" className="text-blue-600 font-medium hover:underline">
                politique de confidentialité
              </a>
              {' '}<span className="text-red-500">*</span>
            </label>
          </div>
          {getFieldError('acceptTerms') && (
            <p className="text-red-600 text-sm font-medium">{getFieldError('acceptTerms')}</p>
          )}
          
          <div className="flex items-start gap-3">
            <input
              {...register('acceptMarketing')}
              type="checkbox"
              id="acceptMarketing"
              className="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer accent-blue-600"
              disabled={submissionState.isLoading}
            />
            <label htmlFor="acceptMarketing" className="text-sm text-slate-800 cursor-pointer leading-relaxed">
              Je souhaite recevoir les actualités et offres spéciales de Quantify
            </label>
          </div>
        </div>
        
        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={submissionState.isLoading || isSubmitting}
          className={
            cn(
              'w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200',
              'bg-gradient-to-r from-yellow-500 to-orange-600',
              'hover:from-yellow-600 hover:to-orange-700',
              'focus:ring-4 focus:ring-yellow-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center gap-2'
            )
          }
        >
          {submissionState.isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Inscription en cours...
            </>
          ) : (
            'Rejoindre la liste d\'attente'
          )}
        </button>
        
        {/* Note de sécurité */}
        <p className="text-xs text-slate-500 text-center">
          Vos données sont sécurisées et ne seront jamais partagées avec des tiers.
        </p>
      </div>
    </form>
  )
}
