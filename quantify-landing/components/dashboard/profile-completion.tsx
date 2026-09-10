// ============================================
// components/dashboard/profile-completion.tsx - ProfileCompletion Component
// ============================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  User, 
  Check, 
  ChevronRight, 
  Star, 
  Camera, 
  Mail,
  Phone,
  MapPin,
  Home,
  Zap,
  Shield,
  Gift,
  Calendar,
  Edit,
  Plus,
  AlertCircle,
  CheckCircle2,
  Award,
  Target,
  TrendingUp,
  Settings
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, SuccessAlert, InfoAlert } from '@/components/ui/alert'
import { useNotifications } from '@/components/ui/toast'

interface ProfileStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  completed: boolean
  required: boolean
  points: number
  action?: {
    label: string
    onClick: () => void
  }
  fields?: Array<{
    name: string
    completed: boolean
    label: string
  }>
}

interface ProfileData {
  user: {
    name: string
    email: string
    avatar?: string
    joinDate: string
  }
  completionPercentage: number
  totalPoints: number
  currentTier: 'bronze' | 'silver' | 'gold' | 'platinum'
  nextTierPoints: number
  steps: ProfileStep[]
  benefits: {
    unlocked: string[]
    nextUnlock: string
    nextUnlockAt: number // percentage
  }
}

interface ProfileCompletionProps {
  userId?: string
  onStepComplete?: (stepId: string) => void
  onProfileUpdate?: () => void
  className?: string
}

export function ProfileCompletion({ 
  userId, 
  onStepComplete, 
  onProfileUpdate,
  className 
}: ProfileCompletionProps) {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingStep, setProcessingStep] = useState<string | null>(null)
  const { success, error: showError } = useNotifications()

  // Mock comprehensive profile data
  const mockData: ProfileData = {
    user: {
      name: 'Alexandre Martin',
      email: 'alexandre.martin@email.com',
      avatar: '',
      joinDate: '2024-02-15'
    },
    completionPercentage: 67,
    totalPoints: 340,
    currentTier: 'silver',
    nextTierPoints: 500,
    steps: [
      {
        id: 'basic-info',
        title: 'Informations de base',
        description: 'Complétez votre nom, email et photo de profil',
        icon: <User className="h-5 w-5" />,
        completed: true,
        required: true,
        points: 50,
        fields: [
          { name: 'name', completed: true, label: 'Nom complet' },
          { name: 'email', completed: true, label: 'Email' },
          { name: 'avatar', completed: false, label: 'Photo de profil' }
        ]
      },
      {
        id: 'contact-info',
        title: 'Informations de contact',
        description: 'Ajoutez votre téléphone et adresse pour un meilleur service',
        icon: <Phone className="h-5 w-5" />,
        completed: false,
        required: false,
        points: 75,
        action: {
          label: 'Ajouter contacts',
          onClick: () => {}
        },
        fields: [
          { name: 'phone', completed: false, label: 'Téléphone' },
          { name: 'address', completed: false, label: 'Adresse postale' },
          { name: 'emergencyContact', completed: false, label: 'Contact d\'urgence' }
        ]
      },
      {
        id: 'home-details',
        title: 'Détails du logement',
        description: 'Renseignez les caractéristiques de votre habitation',
        icon: <Home className="h-5 w-5" />,
        completed: true,
        required: true,
        points: 100,
        fields: [
          { name: 'homeType', completed: true, label: 'Type de logement' },
          { name: 'homeSize', completed: true, label: 'Surface' },
          { name: 'constructionYear', completed: true, label: 'Année de construction' },
          { name: 'energyRating', completed: false, label: 'DPE/Étiquette énergie' }
        ]
      },
      {
        id: 'energy-setup',
        title: 'Configuration énergétique',
        description: 'Paramétrez vos équipements et sources d\'énergie',
        icon: <Zap className="h-5 w-5" />,
        completed: false,
        required: true,
        points: 125,
        action: {
          label: 'Configurer équipements',
          onClick: () => {}
        },
        fields: [
          { name: 'heatingSystem', completed: true, label: 'Système de chauffage' },
          { name: 'solarPanels', completed: false, label: 'Panneaux solaires' },
          { name: 'smartDevices', completed: false, label: 'Appareils connectés' },
          { name: 'energyProvider', completed: true, label: 'Fournisseur d\'énergie' }
        ]
      },
      {
        id: 'preferences',
        title: 'Préférences et objectifs',
        description: 'Définissez vos objectifs d\'économie et préférences',
        icon: <Target className="h-5 w-5" />,
        completed: false,
        required: false,
        points: 80,
        action: {
          label: 'Définir objectifs',
          onClick: () => {}
        },
        fields: [
          { name: 'savingsGoal', completed: false, label: 'Objectif d\'économies' },
          { name: 'comfortPreferences', completed: false, label: 'Préférences de confort' },
          { name: 'notifications', completed: true, label: 'Notifications' }
        ]
      },
      {
        id: 'security-privacy',
        title: 'Sécurité et confidentialité',
        description: 'Activez l\'authentification 2FA et gérez vos données',
        icon: <Shield className="h-5 w-5" />,
        completed: false,
        required: false,
        points: 60,
        action: {
          label: 'Sécuriser compte',
          onClick: () => {}
        },
        fields: [
          { name: '2fa', completed: false, label: 'Authentification à deux facteurs' },
          { name: 'dataConsent', completed: true, label: 'Consentements RGPD' },
          { name: 'backupEmail', completed: false, label: 'Email de récupération' }
        ]
      }
    ],
    benefits: {
      unlocked: [
        'Dashboard de base',
        'Suivi de consommation',
        'Recommandations simples',
        'Support par email'
      ],
      nextUnlock: 'Recommandations IA avancées + Support prioritaire',
      nextUnlockAt: 75
    }
  }

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // API call réel ici
      // const response = await fetch(`/api/profile/completion/${userId}`)
      // const data = await response.json()
      
      setData(mockData)
      setError(null)
    } catch (err) {
      setError("Impossible de charger vos données de profil")
      console.error('Erreur profile data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfileData()
  }, [userId])

  const handleStepAction = async (stepId: string) => {
    if (processingStep) return

    try {
      setProcessingStep(stepId)
      
      // Simulation d'action
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Action réelle ici (redirect, modal, etc.)
      success(`Étape "${stepId}" en cours de configuration...`)
      onStepComplete?.(stepId)
      
    } catch (err) {
      showError('Erreur lors du traitement de l\'étape')
      console.error('Erreur step action:', err)
    } finally {
      setProcessingStep(null)
    }
  }

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: { color: 'text-amber-600', bg: 'bg-amber-50', name: 'Bronze', icon: '🥉' },
      silver: { color: 'text-gray-600', bg: 'bg-gray-50', name: 'Silver', icon: '🥈' },
      gold: { color: 'text-yellow-600', bg: 'bg-yellow-50', name: 'Gold', icon: '🏆' },
      platinum: { color: 'text-purple-600', bg: 'bg-purple-50', name: 'Platinum', icon: '💎' }
    }
    return tiers[tier as keyof typeof tiers] || tiers.bronze
  }

  const completedSteps = useMemo(() => {
    return data?.steps.filter(step => step.completed).length || 0
  }, [data])

  const requiredSteps = useMemo(() => {
    return data?.steps.filter(step => step.required).length || 0
  }, [data])

  const requiredCompleted = useMemo(() => {
    return data?.steps.filter(step => step.required && step.completed).length || 0
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Chargement de votre profil...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <div>
          <h3 className="font-semibold">Erreur de chargement</h3>
          <p>{error || "Impossible de charger vos données de profil"}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchProfileData}
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      </Alert>
    )
  }

  const tierInfo = getTierInfo(data.currentTier)

  return (
    <div className="space-y-6">
      {/* Header avec progression */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Completion de Profil
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Complétez votre profil pour débloquer toutes les fonctionnalités
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {data.completionPercentage}%
              </div>
              <div className="text-sm text-gray-600">Complété</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Progression globale</span>
              <span className="text-gray-600">
                {completedSteps}/{data.steps.length} étapes
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${data.completionPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
              <span>Étapes requises: {requiredCompleted}/{requiredSteps}</span>
              <span>{data.totalPoints} points gagnés</span>
            </div>
          </div>

          {/* Tier et Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Current Tier */}
            <div className={`p-4 rounded-xl border-2 ${tierInfo.color} ${tierInfo.bg}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tierInfo.icon}</span>
                <div>
                  <h3 className="font-semibold">Tier {tierInfo.name}</h3>
                  <p className="text-sm opacity-80">{data.totalPoints} points</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs opacity-80 mb-1">
                  Prochain niveau: {data.nextTierPoints - data.totalPoints} points
                </div>
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div 
                    className="bg-current h-2 rounded-full transition-all"
                    style={{ 
                      width: `${Math.min((data.totalPoints / data.nextTierPoints) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Avantages débloqués</h3>
              </div>
              <div className="space-y-1">
                {data.benefits.unlocked.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    {benefit}
                  </div>
                ))}
              </div>
              {data.completionPercentage < data.benefits.nextUnlockAt && (
                <div className="mt-3 p-2 bg-green-100 rounded-lg">
                  <div className="text-xs text-green-700">
                    <strong>Prochain déblocage ({data.benefits.nextUnlockAt}%):</strong><br/>
                    {data.benefits.nextUnlock}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps List */}
      <div className="space-y-4">
        {data.steps.map((step, index) => (
          <Card key={step.id} className={`transition-all duration-200 ${
            step.completed 
              ? 'bg-green-50/50 border-green-200' 
              : step.required 
                ? 'border-blue-200 hover:shadow-md' 
                : 'hover:shadow-sm'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Icon et Status */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-100 text-green-600' 
                    : step.required 
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                }`}>
                  {step.completed ? <Check className="h-6 w-6" /> : step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        {step.required && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Requis
                          </span>
                        )}
                        {step.completed && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Complété
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{step.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium">{step.points} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Fields Progress */}
                  {step.fields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {step.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex items-center gap-2 text-sm">
                          {field.completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 border border-gray-300 rounded-full" />
                          )}
                          <span className={field.completed ? 'text-green-700' : 'text-gray-600'}>
                            {field.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  {!step.completed && step.action && (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleStepAction(step.id)}
                        loading={processingStep === step.id}
                        className="flex items-center gap-2"
                        variant={step.required ? 'default' : 'outline'}
                      >
                        {step.action.label}
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      {!step.completed && step.required && (
                        <span className="text-sm text-amber-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          Action requise
                        </span>
                      )}
                    </div>
                  )}

                  {step.completed && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Étape terminée avec succès</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto ml-2"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      {data.completionPercentage < 100 && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">
              Plus que {100 - data.completionPercentage}% pour un profil complet !
            </h3>
            <p className="text-blue-100 mb-4">
              Débloquez toutes les fonctionnalités avancées de Quantify et maximisez vos économies d&apos;énergie.
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={() => {
                const nextIncompleteStep = data.steps.find(step => !step.completed && step.required)
                if (nextIncompleteStep && nextIncompleteStep.action) {
                  handleStepAction(nextIncompleteStep.id)
                }
              }}
            >
              Compléter mon profil
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Success State */}
      {data.completionPercentage === 100 && (
        <SuccessAlert title="🎉 Profil complété !">
          Félicitations ! Votre profil est maintenant complet. Vous avez accès à toutes les fonctionnalités 
          avancées de Quantify pour optimiser votre consommation énergétique.
        </SuccessAlert>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => onProfileUpdate?.()}
            >
              <Camera className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Photo de profil</div>
                <div className="text-xs text-gray-500">Ajoutez votre photo</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => handleStepAction('energy-setup')}
            >
              <Zap className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Équipements</div>
                <div className="text-xs text-gray-500">Configurer appareils</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="flex items-center gap-2 h-auto p-4"
              onClick={() => handleStepAction('security-privacy')}
            >
              <Shield className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Sécurité</div>
                <div className="text-xs text-gray-500">Activer 2FA</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <InfoAlert title="💡 Conseil">
        Complétez en priorité les étapes marquées &apos;Requis&apos; pour débloquer les recommandations 
        personnalisées et l&apos;optimisation automatique de votre consommation.
      </InfoAlert>
    </div>
  )
}