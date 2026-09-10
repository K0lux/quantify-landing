// ============================================
// components/sections/market.tsx
// ============================================
'use client'

import { Users, Globe, TrendingUp, MapPin, Rocket, CheckCircle } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'
import { AnimatedCounter } from '@/components/animations/counter'

export function MarketSection() {
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
        "Expansion Bénin, Ghana",
        "Côte d'Ivoire, Sénégal",
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
        "20 pays africains",
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
        "Amérique latine, Asie",
        "Series C/D: 100M+ USD",
        "IPO ou acquisition"
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
    }
  ]

  return (
    <section id="marche" className="py-20 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-yellow-300 font-medium mb-6">
            <MapPin className="w-4 h-4" />
            <span>Un marché immense</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            De 0 à 200M d&apos;utilisateurs
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">
            Notre vision : devenir le leader mondial de la gestion énergétique numérique
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative mb-16">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 -translate-y-1/2" />
          
          <div className="grid lg:grid-cols-4 gap-6 relative">
            {phases.map((phase, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className={`relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 ${
                  phase.status === 'current' ? 'ring-2 ring-yellow-500' : ''
                }`}>
                  {phase.status === 'current' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 text-xs font-bold rounded-full">
                      En cours
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 bg-gradient-to-br ${phase.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-center mb-2">{phase.phase}</h3>
                  <p className="text-slate-400 text-center text-sm mb-4">{phase.year}</p>
                  
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">{phase.region}</div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Utilisateurs:</span>
                      <span className="font-bold text-yellow-400">{phase.users}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Revenus:</span>
                      <span className="font-bold text-green-400">{phase.revenue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Pays:</span>
                      <span className="font-semibold">{phase.countries}+</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <ul className="space-y-2">
                      {phase.milestones.map((milestone, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-green-400" />
                          <span>{milestone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {marketStats.map((stat, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className={`w-12 h-12 ${stat.color} bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                <p className={`text-4xl font-bold ${stat.color} mb-1`}>
                  <AnimatedCounter end={parseFloat(stat.value)} suffix={stat.value.replace(/[0-9.]/g, '')} />
                </p>
                <p className="text-slate-500 text-sm">{stat.subtitle}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}