'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/animations/fade-in'
import { AnimatedCounter } from '@/components/animations/counter'
import {
  Leaf, Users, Briefcase, TrendingUp,
  Zap, Heart, Shield, DollarSign, Lightbulb,
  Recycle, HandHeart
} from 'lucide-react'

export function ImpactSection() {
  const [activePillarIndex, setActivePillarIndex] = useState(0)
  const pillars = [
    {
      title: 'Environnement',
      icon: Leaf,
      items: [
        { icon: Recycle, text: 'Fin des relevés papier et déplacements — empreinte carbone réduite' },
        { icon: Zap, text: 'Optimisation de la consommation grâce à l’analyse des données énergétiques' },
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
        { icon: TrendingUp, text: 'Repérage des dérives pour mieux maîtriser les dépenses énergétiques' },
        { icon: DollarSign, text: 'Répartition plus claire des factures entre occupants' },
        { icon: Zap, text: 'Suivi des consommations par bâtiment, compteur ou zone' },
        { icon: Briefcase, text: 'Meilleur pilotage budgétaire des foyers et des organisations' },
      ],
    },
  ]

  const stats = [
    { value: 40, suffix: '%', label: 'Réduction des pertes utilities' },
    { value: 10, suffix: '%', label: 'Économies ménages' },
  ]
  const activePillar = pillars[activePillarIndex]

  return (
    <section id="impact" className="pb-8 pt-10 sm:py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-full text-white text-sm font-bold mb-2 sm:mb-6">
              <Zap className="w-4 h-4" />
              <span>Impact énergétique</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-6">
              Une énergie <span className="text-orange-500">mieux maîtrisée</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Comprenez votre consommation et repérez plus vite les dépenses énergétiques.
            </p>
          </div>
        </FadeIn>

        {/* Compact selector and immediate detail panel for phone and tablet */}
        <div className="mb-6 space-y-2 lg:hidden">
          <div className="grid grid-cols-[1.3fr_0.7fr_1.3fr] gap-2" role="group" aria-label="Choisir un type d’impact énergétique">
            {pillars.map((pillar, index) => {
              const selected = activePillarIndex === index
              return (
                <button
                  key={pillar.title}
                  type="button"
                  onClick={() => setActivePillarIndex(index)}
                  aria-pressed={selected}
                  className={`min-h-11 rounded-xl border px-2 py-2 text-center text-xs sm:text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                    selected
                      ? 'border-blue-900 bg-blue-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                  }`}
                >
                  {pillar.title}
                </button>
              )
            })}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4" aria-live="polite">
            <div className="mb-2 flex items-center gap-3 sm:mb-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                <activePillar.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900">{activePillar.title}</h3>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {activePillar.items.map((item) => (
                <li key={item.text} className="flex items-start gap-2 text-xs leading-tight text-slate-700 sm:gap-2.5 sm:text-[13px] sm:leading-snug">
                  <item.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-500 sm:h-4 sm:w-4" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Full pillar overview for large screens */}
        <div className="mb-8 hidden gap-6 lg:mb-16 lg:grid lg:grid-cols-3">
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
          <div className="rounded-2xl bg-blue-900 p-5 sm:rounded-3xl sm:p-12">
            <div className="grid grid-cols-2 gap-3 text-center sm:gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-white">
                  <div className="mb-1 text-3xl font-bold text-orange-400 sm:mb-2 sm:text-4xl">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[11px] leading-snug text-slate-300 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ODD alignment */}
        <FadeIn delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Contribution à l&apos;ODD 7 : accès à une énergie fiable, durable et moderne.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
