// ============================================
// components/sections/innovation.tsx
// ============================================
'use client'

import { Sparkles, Zap, Wifi, Globe, Shield, Award } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'

export function InnovationSection() {
  const innovations = [
    {
      icon: Zap,
      title: "Sans matériel supplémentaire",
      description: "Notre technologie OCR fonctionne sur n'importe quel smartphone. Pas besoin d'acheter de nouveaux compteurs coûteux.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Globe,
      title: "Modèle Freemium accessible",
      description: "Version gratuite complète pour attirer une large base d'utilisateurs, Premium à partir de 500 FCFA/mois.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Wifi,
      title: "Mode Offline innovant",
      description: "Fonctionnalités essentielles disponibles sans connexion internet, crucial pour les zones rurales.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Sécurité renforcée",
      description: "Cryptage end-to-end, authentification multi-facteurs, et conformité RGPD pour protéger vos données.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Rétention exceptionnelle",
      description: "35% de rétention J1 vs 26% de moyenne industrie grâce à notre gamification et UX optimisée.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Sparkles,
      title: "IA prédictive",
      description: "Algorithmes d'apprentissage automatique pour prédire votre consommation et détecter les anomalies.",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  return (
    <section className="py-20 sm:py-32 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-yellow-300 font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Innovation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ce qui nous rend uniques
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">
            Des innovations qui changent la donne dans la gestion énergétique
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {innovations.map((innovation, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${innovation.color} rounded-xl flex items-center justify-center mb-6`}>
                  <innovation.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{innovation.title}</h3>
                <p className="text-slate-300 leading-relaxed">{innovation.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Badges Sources */}
        <div className="mt-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <h3 className="text-center text-lg font-bold mb-6">Sources de validation</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { source: "AppsFlyer 2023", metric: "Benchmarks rétention" },
              { source: "Adjust 2022", metric: "Apps financières" },
              { source: "Mistplay 2023", metric: "DAU/MAU ratios" },
              { source: "Sendbird 2024", metric: "Onboarding J1" }
            ].map((badge, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 text-center">
                <div className="font-bold text-yellow-400 mb-1">{badge.source}</div>
                <div className="text-xs text-slate-400">{badge.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}