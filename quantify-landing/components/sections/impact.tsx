'use client'

import { FadeIn } from '@/components/animations/fade-in'
import { AnimatedCounter } from '@/components/animations/counter'
import {
  Leaf, Users, Briefcase, Globe, TrendingUp,
  Zap, Heart, Shield, DollarSign, Lightbulb,
  Recycle, HandHeart
} from 'lucide-react'

export function ImpactSection() {
  const pillars = [
    {
      title: 'Environnement',
      icon: Leaf,
      items: [
        { icon: Recycle, text: 'Fin des relevés papier et déplacements — empreinte carbone réduite' },
        { icon: Zap, text: 'Optimisation de la consommation grâce aux insights IA de Kilo' },
        { icon: TrendingUp, text: 'Réduction des pertes réseau de 10 à 40% pour les utilities' },
        { icon: Lightbulb, text: 'Sensibilisation quotidienne des utilisateurs à leur consommation réelle' },
      ],
    },
    {
      title: 'Social',
      icon: Heart,
      items: [
        { icon: Users, text: 'Transparence totale sur les factures — fin des conflits locataires/propriétaires' },
        { icon: DollarSign, text: '5-10% d\'économies sur les factures grâce aux alertes et conseils IA' },
        { icon: Shield, text: 'Preuves numériques pour protéger les consommateurs en cas de litige' },
        { icon: HandHeart, text: 'Accès équitable à l\'énergie pour les ménages à revenus modestes' },
      ],
    },
    {
      title: 'Économique',
      icon: Briefcase,
      items: [
        { icon: Briefcase, text: 'Création d\'emplois locaux : ambassadeurs, prestataires, développeurs' },
        { icon: Globe, text: 'Écosystème de commerce local qui circule dans l\'économie réelle' },
        { icon: TrendingUp, text: 'Revenus additionnels pour les commerçants via Quantify Market' },
        { icon: DollarSign, text: 'Modèle prépayé sans dette — pas de crédit, pas de surcoût' },
      ],
    },
  ]

  const stats = [
    { value: 600, suffix: 'M', label: 'Personnes impactées potentiellement' },
    { value: 40, suffix: '%', label: 'Réduction des pertes utilities' },
    { value: 10, suffix: '%', label: 'Économies ménages' },
    { value: 3, suffix: '.6M', label: 'Foyers au Togo — marché initial' },
  ]

  return (
    <section id="impact" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-full text-white text-sm font-bold mb-6">
              <Globe className="w-4 h-4" />
              <span>Impact & Vision</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              Un projet qui <span className="text-orange-500">change la donne</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Quantify n'est pas qu'une app. C'est un levier environnemental, social et économique
              pour des millions de personnes.
            </p>
          </div>
        </FadeIn>

        {/* 3 Pillars */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar, pIdx) => (
            <FadeIn key={pillar.title} delay={pIdx * 0.12}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover-lift h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <pillar.icon className="w-5 h-5 text-blue-900" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{pillar.title}</h3>
                </div>
                <div className="space-y-3">
                  {pillar.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-md bg-orange-50 border border-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-3.5 h-3.5 text-orange-500" />
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Impact stats */}
        <FadeIn delay={0.4}>
          <div className="bg-blue-900 rounded-3xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-white">
                  <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ODD alignment */}
        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Aligné sur les ODD 7 (Énergie propre), 9 (Innovation), 11 (Villes durables), 12 (Consommation responsable)
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
