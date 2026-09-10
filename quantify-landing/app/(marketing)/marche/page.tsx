// ============================================
// app/(marketing)/marche/page.tsx
// ============================================
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  TrendingUp, Users, Globe, Target, Rocket, Trophy,
  BarChart3, MapPin, DollarSign, Zap, ArrowRight,CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { ViewportAnimation } from '@/components/optimizations/viewport-animation'
import { AnimatedCounter } from '@/components/landing/quantify-landing'

export const metadata: Metadata = generateMetadata({
  title: 'Marché & Impact - Quantify | De 0 à 200M d\'utilisateurs',
  description: 'Découvrez notre vision : devenir le leader mondial de la gestion énergétique numérique. Du Togo à l\'Afrique, puis au monde entier.',
  keywords: ['marché quantify', 'expansion Afrique', 'impact énergétique', 'croissance startup'],
})

export default function MarchePage() {
  const phases = [
    {
      phase: "Phase 1",
      year: "2025",
      region: "🇹🇬 Togo",
      users: "200K",
      revenue: "1.59B FCFA",
      countries: 1,
      color: "from-blue-500 to-cyan-500",
      status: "current",
      milestones: [
        "Lancement MVP Lomé",
        "Partenariat CEET",
        "Intégration Flooz/YasTogo",
        "200K utilisateurs actifs"
      ]
    },
    {
      phase: "Phase 2",
      year: "2027-2028",
      region: "🌍 UEMOA (5 pays)",
      users: "2M",
      revenue: "15.9B FCFA",
      countries: 5,
      color: "from-purple-500 to-pink-500",
      milestones: [
        "Expansion Bénin, Ghana, Côte d'Ivoire",
        "Sénégal, Burkina Faso",
        "Series A: 5-10M USD",
        "Équipe de 30 personnes"
      ]
    },
    {
      phase: "Phase 3",
      year: "2030-2032",
      region: "🌍 Afrique (20+ pays)",
      users: "20M",
      revenue: "159B FCFA",
      countries: 20,
      color: "from-orange-500 to-red-500",
      milestones: [
        "Présence dans 20 pays africains",
        "Series B: 20-50M USD",
        "Centres de données régionaux",
        "Équipe de 200 personnes"
      ]
    },
    {
      phase: "Phase 4",
      year: "2035+",
      region: "🌎 Global (50+ pays)",
      users: "200M",
      revenue: "1590B FCFA",
      countries: 50,
      color: "from-green-500 to-emerald-500",
      milestones: [
        "Leader mondial",
        "Expansion Amérique latine, Asie",
        "Series C/D: 100M+ USD",
        "IPO ou acquisition stratégique"
      ]
    }
  ]

  const marketStats = [
    {
      icon: Users,
      label: "Marché Togo",
      value: "3.6M",
      subtitle: "clients potentiels (45% électrifiés)",
      color: "text-blue-600"
    },
    {
      icon: Globe,
      label: "Marché UEMOA",
      value: "200M",
      subtitle: "clients potentiels (50% électrifiés)",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      label: "Afrique subsaharienne",
      value: "600M",
      subtitle: "personnes sans accès fiable",
      color: "text-orange-600"
    },
    {
      icon: MapPin,
      label: "Marchés globaux",
      value: "Brésil, Inde, Pologne",
      subtitle: "Millions de compteurs analogiques",
      color: "text-green-600"
    }
  ]

  const impactMetrics = [
    {
      category: "Environnemental",
      icon: "🌱",
      metrics: [
        { label: "Réduction CO₂", value: "10-15%", description: "Moins de relevés manuels" },
        { label: "Optimisation", value: "5-10%", description: "Économies d'énergie via IA" },
        { label: "Transition verte", value: "Contributeur", description: "Énergie durable en Afrique" }
      ],
      color: "from-green-50 to-emerald-50"
    },
    {
      category: "Sociétal",
      icon: "👥",
      metrics: [
        { label: "Transparence", value: "100%", description: "Visibilité consommation" },
        { label: "Économies ménages", value: "5-10%", description: "Factures réduites" },
        { label: "Emplois créés", value: "1000+", description: "D'ici 2030" }
      ],
      color: "from-blue-50 to-purple-50"
    },
    {
      category: "Économique",
      icon: "💰",
      metrics: [
        { label: "Pertes utilities", value: "-10-40%", description: "Réduction fraudes" },
        { label: "Efficacité", value: "+30%", description: "Opérations utilities" },
        { label: "PIB numérique", value: "Contributeur", description: "Économie Afrique" }
      ],
      color: "from-orange-50 to-yellow-50"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              De 0 à 200M d&apos;utilisateurs
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-8">
              Notre vision : devenir le leader mondial de la gestion énergétique numérique
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                { label: "2025", value: "200K" },
                { label: "2027", value: "2M" },
                { label: "2030", value: "20M" },
                { label: "2035+", value: "200M" }
              ].map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold text-yellow-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

       {/* Roadmap détaillée */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Feuille de Route
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une croissance structurée et ambitieuse sur 4 phases
            </p>
          </div>

          <div className="space-y-12">
            {phases.map((phase, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className={`relative bg-gradient-to-br ${phase.color} rounded-3xl p-8 sm:p-12 text-white shadow-2xl ${
                  phase.status === 'current' ? 'ring-4 ring-yellow-400' : ''
                }`}>
                  {phase.status === 'current' && (
                    <div className="absolute -top-4 left-8 px-4 py-2 bg-yellow-400 text-slate-900 font-bold rounded-full text-sm">
                      En cours
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="text-sm font-semibold text-white/70 mb-2">
                        {phase.phase}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                        {phase.region}
                      </h3>
                      <p className="text-xl text-white/90 mb-6">{phase.year}</p>

                      <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-2xl font-bold">{phase.users}</div>
                          <div className="text-sm text-white/70">Utilisateurs</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-2xl font-bold">{phase.revenue}</div>
                          <div className="text-sm text-white/70">Revenus</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                          <div className="text-2xl font-bold">{phase.countries}</div>
                          <div className="text-sm text-white/70">Pays</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                      <h4 className="font-bold text-lg mb-4">Milestones clés</h4>
                       <ul className="space-y-3">
                        {phase.milestones.map((milestone, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Un Marché Immense
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Des millions de personnes attendent une solution comme Quantify
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketStats.map((stat, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-6`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500">{stat.subtitle}</div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Notre Impact
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Au-delà des chiffres, nous créons un changement durable
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {impactMetrics.map((category, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-8 border border-slate-200`}>
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {category.category}
                  </h3>
                  
                  <div className="space-y-6">
                    {category.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-white/50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-slate-900 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm font-semibold text-slate-700 mb-1">
                          {metric.label}
                        </div>
                        <div className="text-xs text-slate-600">
                          {metric.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Participez à Cette Révolution
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Investisseurs, partenaires, early adopters : rejoignez-nous !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rejoindre"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:shadow-2xl transition-all"
            >
              Rejoindre la Waitlist
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/30 transition-all"
            >
              Devenir Investisseur
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}