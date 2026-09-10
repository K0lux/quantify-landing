// ============================================
// components/dashboard/waitlist-status.tsx - WaitlistStatus Component
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Clock, 
  Trophy, 
  Share2, 
  Gift, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, SuccessAlert, InfoAlert } from '@/components/ui/alert'
import { useNotifications } from '@/components/ui/toast'

interface WaitlistData {
  position: number
  totalUsers: number
  estimatedWaitTime: string
  referralCount: number
  referralCode: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum'
  rewards: {
    current: string[]
    next: {
      requirement: number
      reward: string
    }
  }
  registrationDate: string
  lastActivity: string
}

interface WaitlistStatusProps {
  userId?: string
  className?: string
}

export function WaitlistStatus({ userId, className }: WaitlistStatusProps) {
  const [data, setData] = useState<WaitlistData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { success, error: showError } = useNotifications()

  // Mock data - remplacez par votre API call
  const mockData: WaitlistData = {
    position: 1247,
    totalUsers: 8932,
    estimatedWaitTime: "3-4 semaines",
    referralCount: 7,
    referralCode: "QUANTIFY_USER_" + userId?.slice(-6) || "123ABC",
    tier: 'silver',
    rewards: {
      current: [
        "Accès anticipé beta",
        "Badge Early Adopter",
        "Guide exclusif optimisation énergétique"
      ],
      next: {
        requirement: 10,
        reward: "Consultation personnalisée gratuite (1h)"
      }
    },
    registrationDate: "2024-02-15",
    lastActivity: "2024-03-10"
  }

  const fetchWaitlistData = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true)
      else setRefreshing(true)
      
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      // API call réel ici
      // const response = await fetch(`/api/waitlist/status/${userId}`)
      // const data = await response.json()
      
      setData(mockData)
      setError(null)
    } catch (err) {
      setError("Impossible de charger vos données de waitlist")
      console.error('Erreur waitlist:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWaitlistData()
  }, [userId])

  const handleRefresh = () => {
    fetchWaitlistData(false)
  }

  const handleShareReferral = async (platform?: string) => {
    if (!data) return
    
    const referralUrl = `${window.location.origin}/join?ref=${data.referralCode}`
    const shareText = "🚀 Rejoignez-moi sur la liste d'attente de Quantify - la révolution de l'optimisation énergétique ! Utilisez mon code pour des bonus exclusifs."
    
    try {
      if (platform) {
        const urls = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralUrl)}`
        }
        
        window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400')
      } else {
        await navigator.clipboard.writeText(referralUrl)
        success('Lien de parrainage copié dans le presse-papier!')
      }
    } catch (err) {
      showError('Erreur lors du partage')
      console.error('Erreur partage:', err)
    }
  }

  const getTierColor = (tier: string) => {
    const colors = {
      bronze: 'text-amber-600 bg-amber-50 border-amber-200',
      silver: 'text-gray-600 bg-gray-50 border-gray-200',
      gold: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      platinum: 'text-purple-600 bg-purple-50 border-purple-200'
    }
    return colors[tier as keyof typeof colors] || colors.bronze
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum': return '💎'
      case 'gold': return '🏆'
      case 'silver': return '🥈'
      default: return '🥉'
    }
  }

  const getProgressPercentage = () => {
    if (!data) return 0
    return Math.min((data.referralCount / data.rewards.next.requirement) * 100, 100)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Chargement de votre statut waitlist...</p>
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
          <p>{error || "Impossible de charger vos données"}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Principal */}
      <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Votre Position dans la Waitlist
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              loading={refreshing}
            >
              🔄 Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Position */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                #{data.position.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Votre position</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {data.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total inscrits</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border">
              <div className="text-2xl font-bold text-orange-600 mb-2 flex items-center justify-center gap-2">
                <Clock className="h-6 w-6" />
                {data.estimatedWaitTime}
              </div>
              <div className="text-sm text-gray-600">Temps d&apos;attente estimé</div>
            </div>
          </div>

          {/* Tier Status */}
          <div className={`p-4 rounded-xl border-2 ${getTierColor(data.tier)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getTierIcon(data.tier)}</span>
                <div>
                  <h3 className="font-semibold capitalize">Tier {data.tier}</h3>
                  <p className="text-sm opacity-80">{data.referralCount} parrainages effectués</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Progression</div>
                <div className="text-xs opacity-80">
                  {data.referralCount}/{data.rewards.next.requirement} parrainages
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-white/50 rounded-full h-2">
                <div 
                  className="bg-current h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="text-xs mt-1 opacity-80">
                {Math.round(getProgressPercentage())}% vers le prochain niveau
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rewards & Referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              Récompenses Acquises
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.rewards.current.map((reward, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-800">{reward}</span>
              </div>
            ))}
            
            {/* Next Reward */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Prochaine récompense</span>
              </div>
              <p className="text-sm text-blue-800">{data.rewards.next.reward}</p>
              <p className="text-xs text-blue-600 mt-1">
                Plus que {data.rewards.next.requirement - data.referralCount} parrainages !
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referral System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-purple-600" />
              Système de Parrainage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Referral Code */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Votre code de parrainage
              </label>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-gray-50 rounded-lg border font-mono text-sm">
                  {data.referralCode}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareReferral()}
                  className="px-3"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Share Buttons */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Partager sur les réseaux sociaux
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareReferral('facebook')}
                  className="flex items-center gap-2"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareReferral('twitter')}
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareReferral('linkedin')}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShareReferral('whatsapp')}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-700">Total parrainages</span>
                <span className="font-semibold text-purple-900">{data.referralCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-purple-700">Positions gagnées</span>
                <span className="font-semibold text-purple-900">+{data.referralCount * 50}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline & Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Chronologie de votre inscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-blue-900">Inscription à la waitlist</div>
                <div className="text-sm text-blue-600">
                  {new Date(data.registrationDate).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-900">Dernière activité</div>
                <div className="text-sm text-green-600">
                  {new Date(data.lastActivity).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Tips */}
      <div className="space-y-3">
        <InfoAlert title="💡 Astuce">
          Partagez votre code de parrainage pour grimper plus rapidement dans la waitlist ! 
          Chaque parrainage vous fait gagner 50 positions.
        </InfoAlert>
        
        <SuccessAlert title="🎯 Objectif">
          Atteignez 10 parrainages pour débloquer une consultation personnalisée gratuite 
          et passer au tier Gold !
        </SuccessAlert>
      </div>
    </div>
  )
}