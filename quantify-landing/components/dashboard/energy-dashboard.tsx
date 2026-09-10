// ============================================
// components/dashboard/energy-dashboard.tsx - EnergyDashboard Component
// ============================================

'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Leaf,
  Battery,
  Sun,
  Wind,
  Home,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  Info,
  Lightbulb,
  Thermometer,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, SuccessAlert, InfoAlert, WarningAlert } from '@/components/ui/alert'
import { StatsCard } from '@/components/ui/card'

interface EnergyData {
  current: {
    consumption: number // kWh
    production: number // kWh (solar/renewable)
    cost: number // €
    carbonFootprint: number // kg CO2
  }
  previous: {
    consumption: number
    production: number
    cost: number
    carbonFootprint: number
  }
  goals: {
    monthlyTarget: number // kWh
    costTarget: number // €
    carbonReduction: number // %
  }
  insights: {
    efficiency: number // %
    savings: number // € saved this month
    greenScore: number // 0-100
    recommendations: string[]
  }
  appliances: Array<{
    name: string
    consumption: number // kWh
    cost: number // €
    efficiency: 'high' | 'medium' | 'low'
    category: 'heating' | 'cooling' | 'lighting' | 'electronics' | 'kitchen' | 'other'
  }>
  hourlyData: Array<{
    hour: string
    consumption: number
    production: number
    cost: number
  }>
  weeklyTrends: Array<{
    day: string
    consumption: number
    savings: number
    efficiency: number
  }>
}

interface EnergyDashboardProps {
  userId?: string
  timeframe?: '24h' | '7d' | '30d' | '12m'
  className?: string
}

export function EnergyDashboard({ userId, timeframe = '24h', className }: EnergyDashboardProps) {
  const [data, setData] = useState<EnergyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe)
  const [refreshing, setRefreshing] = useState(false)

  // Mock comprehensive energy data
  const mockData: EnergyData = {
    current: {
      consumption: 287.5,
      production: 124.8,
      cost: 89.42,
      carbonFootprint: 125.6
    },
    previous: {
      consumption: 321.2,
      production: 98.3,
      cost: 112.15,
      carbonFootprint: 156.8
    },
    goals: {
      monthlyTarget: 280,
      costTarget: 85,
      carbonReduction: 25
    },
    insights: {
      efficiency: 87,
      savings: 22.73,
      greenScore: 78,
      recommendations: [
        "Optimisez votre chauffage entre 19h-23h pour réduire la consommation de 15%",
        "Vos panneaux solaires produisent 23% plus que prévu ce mois-ci",
        "Remplacez votre réfrigérateur par un modèle A+++ pour économiser 120€/an",
        "Programmez votre chauffe-eau pour fonctionner durant les heures creuses"
      ]
    },
    appliances: [
      { name: 'Chauffage', consumption: 145.2, cost: 45.20, efficiency: 'medium', category: 'heating' },
      { name: 'Chauffe-eau', consumption: 68.4, cost: 21.30, efficiency: 'low', category: 'heating' },
      { name: 'Réfrigérateur', consumption: 32.1, cost: 10.00, efficiency: 'medium', category: 'kitchen' },
      { name: 'Éclairage', consumption: 18.9, cost: 5.90, efficiency: 'high', category: 'lighting' },
      { name: 'TV/Multimédia', consumption: 15.2, cost: 4.70, efficiency: 'high', category: 'electronics' },
      { name: 'Lave-linge', consumption: 7.7, cost: 2.32, efficiency: 'high', category: 'other' }
    ],
    hourlyData: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      consumption: Math.random() * 20 + 5,
      production: i >= 6 && i <= 18 ? Math.random() * 15 + 2 : 0,
      cost: Math.random() * 5 + 1
    })),
    weeklyTrends: [
      { day: 'Lun', consumption: 42.3, savings: 3.2, efficiency: 85 },
      { day: 'Mar', consumption: 38.7, savings: 4.1, efficiency: 89 },
      { day: 'Mer', consumption: 41.2, savings: 3.8, efficiency: 87 },
      { day: 'Jeu', consumption: 39.5, savings: 4.3, efficiency: 91 },
      { day: 'Ven', consumption: 44.1, savings: 2.9, efficiency: 82 },
      { day: 'Sam', consumption: 47.8, savings: 2.1, efficiency: 78 },
      { day: 'Dim', consumption: 33.9, savings: 5.2, efficiency: 94 }
    ]
  }

  const fetchEnergyData = async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true)
      else setRefreshing(true)
      
      // Simulation d'API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // API call réel ici
      // const response = await fetch(`/api/energy/dashboard/${userId}?timeframe=${selectedTimeframe}`)
      // const data = await response.json()
      
      setData(mockData)
      setError(null)
    } catch (err) {
      setError("Impossible de charger vos données énergétiques")
      console.error('Erreur energy data:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEnergyData()
  }, [userId, selectedTimeframe])

  const handleRefresh = () => {
    fetchEnergyData(false)
  }

  const calculateTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100
    return {
      percentage: Math.abs(change),
      isPositive: change < 0, // Pour la consommation, une baisse est positive
      isNegative: change > 0
    }
  }

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'heating': return <Thermometer className="h-4 w-4" />
      case 'cooling': return <Wind className="h-4 w-4" />
      case 'lighting': return <Lightbulb className="h-4 w-4" />
      case 'electronics': return <Zap className="h-4 w-4" />
      case 'kitchen': return <Home className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const metrics = useMemo(() => {
    if (!data) return []
    
    const consumptionTrend = calculateTrend(data.current.consumption, data.previous.consumption)
    const costTrend = calculateTrend(data.current.cost, data.previous.cost)
    const carbonTrend = calculateTrend(data.current.carbonFootprint, data.previous.carbonFootprint)
    
    return [
      {
        title: 'Consommation',
        value: `${data.current.consumption} kWh`,
        description: 'Ce mois',
        trend: {
          value: consumptionTrend.percentage,
          isPositive: consumptionTrend.isPositive
        },
        icon: <Zap className="h-5 w-5" />
      },
      {
        title: 'Coût énergétique',
        value: `${data.current.cost.toFixed(2)} €`,
        description: 'Ce mois',
        trend: {
          value: costTrend.percentage,
          isPositive: costTrend.isPositive
        },
        icon: <DollarSign className="h-5 w-5" />
      },
      {
        title: 'Production solaire',
        value: `${data.current.production} kWh`,
        description: 'Ce mois',
        icon: <Sun className="h-5 w-5" />
      },
      {
        title: 'Empreinte carbone',
        value: `${data.current.carbonFootprint} kg`,
        description: 'CO₂ ce mois',
        trend: {
          value: carbonTrend.percentage,
          isPositive: carbonTrend.isPositive
        },
        icon: <Leaf className="h-5 w-5" />
      }
    ]
  }, [data])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 mt-4">Analyse de vos données énergétiques...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <div>
          <h3 className="font-semibold">Erreur de chargement</h3>
          <p>{error || "Impossible de charger vos données énergétiques"}</p>
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
      {/* Header avec contrôles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                Tableau de Bord Énergétique
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Optimisez votre consommation et maximisez vos économies
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {['24h', '7d', '30d', '12m'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period as any)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      selectedTimeframe === period
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                loading={refreshing}
              >
                🔄 Actualiser
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <StatsCard
            key={index}
            title={metric.title}
            value={metric.value}
            description={metric.description}
            trend={metric.trend}
            icon={metric.icon}
            className="hover:shadow-lg transition-shadow"
          />
        ))}
      </div>

      {/* Insights et Score vert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Green Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Score Vert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - data.insights.greenScore / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {data.insights.greenScore}
                    </div>
                    <div className="text-sm text-gray-600">/ 100</div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Excellent score d&apos;efficacité énergétique
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Objectifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Objectifs du Mois
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Consommation */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Consommation</span>
                <span className="font-medium">
                  {data.current.consumption}/{data.goals.monthlyTarget} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((data.current.consumption / data.goals.monthlyTarget) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Coût */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>Budget</span>
                <span className="font-medium">
                  {data.current.cost.toFixed(0)}/{data.goals.costTarget} €
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${Math.min((data.current.cost / data.goals.costTarget) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>

            {/* Réduction carbone */}
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  -{data.goals.carbonReduction}% d&apos;émissions CO₂
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Objectif atteint à 89%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Economies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Économies Réalisées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {data.insights.savings.toFixed(2)} €
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Économisés ce mois
              </div>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Optimisation IA</span>
                  <span className="font-medium text-green-600">+12.30 €</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Production solaire</span>
                  <span className="font-medium text-green-600">+8.43 €</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Heures creuses</span>
                  <span className="font-medium text-green-600">+2.00 €</span>
                </div>
              </div>

              <div className="mt-4 p-2 bg-green-50 rounded-lg">
                <div className="text-xs text-green-700">
                  🎯 Projection annuelle: ~{(data.insights.savings * 12).toFixed(0)} FCFA d&apos;économies
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consommation par appareils */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Consommation par Appareil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.appliances.map((appliance, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(appliance.category)}
                    <span className="font-medium">{appliance.name}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getEfficiencyColor(appliance.efficiency)}`}>
                    {appliance.efficiency === 'high' ? 'Efficace' : 
                     appliance.efficiency === 'medium' ? 'Moyen' : 'À améliorer'}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Consommation</span>
                    <span className="font-medium">{appliance.consumption} kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Coût</span>
                    <span className="font-medium text-orange-600">{appliance.cost.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations IA */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recommandations Intelligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.insights.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-blue-900">{recommendation}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto mt-2 text-xs"
                  >
                    Appliquer cette recommandation →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tendances hebdomadaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-green-600" />
            Tendances de la Semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {data.weeklyTrends.map((day, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">{day.day}</div>
                <div className="text-lg font-bold text-blue-600 mb-1">{day.consumption}</div>
                <div className="text-xs text-gray-600">kWh</div>
                <div className="mt-2">
                  <div className={`text-xs font-medium ${day.efficiency >= 90 ? 'text-green-600' : day.efficiency >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {day.efficiency}% eff.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertes et notifications */}
      <div className="space-y-3">
        {data.insights.efficiency < 80 && (
          <WarningAlert title="⚠️ Efficacité en baisse">
            Votre efficacité énergétique est de {data.insights.efficiency}%. 
            Consultez nos recommandations pour optimiser votre consommation.
          </WarningAlert>
        )}

        {data.current.consumption > data.goals.monthlyTarget && (
          <InfoAlert title="📊 Objectif dépassé">
            Vous avez dépassé votre objectif de consommation mensuelle. 
            Activez le mode éco pour réduire automatiquement votre consommation.
          </InfoAlert>
        )}

        <SuccessAlert title="🌟 Félicitations !">
          Vous économisez {data.insights.savings.toFixed(2)} € ce mois grâce à 
          l&apos;optimisation intelligente de Quantify !
        </SuccessAlert>
      </div>
    </div>
  )
}