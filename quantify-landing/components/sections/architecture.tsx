'use client'

import { FadeIn } from '@/components/animations/fade-in'
import { ArrowRight, ChevronDown, Eye, GitFork, Layers3, Triangle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

const entities = [
  {
    id: 'mere',
    icon: Triangle,
    label: 'Compteur Mère',
    short: 'Le compteur physique principal qui alimente un site.',
    photo: '/meter-ceet-double.png',
    photoAlt: 'Deux compteurs CEET LAFIA prépayés — Compteur Mère',
    details: [
      'Numéro de série, localisation, administrateur officiel',
      'Relevés horodatés côté serveur, correction auditée',
      'Seuils d\'alerte, recharges et exports certifiés',
    ],
  },
  {
    id: 'lie',
    icon: GitFork,
    label: 'Compteurs Liés',
    short: 'Rattachés à un mère ou autonomes, par occupant ou local.',
    photo: '/meter-sous-compteur-1.png',
    photoAlt: 'Sous-compteur YAKI Electric monophasé — Compteur Lié',
    details: [
      'Historique des occupants et facturation par période',
      'Liaison/déliaison avec niveaux d\'autorité',
      'Plafonds budgétaires et alertes par compteur',
    ],
  },
  {
    id: 'virtuel',
    icon: Layers3,
    label: 'Compteurs Virtuels',
    short: 'Agrègent plusieurs compteurs pour analyser un périmètre.',
    photo: null,
    photoAlt: '',
    details: [
      'Addition/soustraction, coefficients, ratios et projections',
      'Arborescences jusqu\'à 5 niveaux avec anti-boucle',
      'Scénarios de simulation budgétaire',
    ],
  },
  {
    id: 'vue',
    icon: Eye,
    label: 'Vues & Permissions',
    short: 'Accès filtrés partagés avec locataires, techniciens, etc.',
    photo: null,
    photoAlt: '',
    details: [
      'Permissions Lecture, Scan, Écriture, Admin',
      'Expiration et repartage conditionnel',
      'Partage de coûts par pourcentages',
    ],
  },
]

export function ArchitectureSection() {
  const [activeEntity, setActiveEntity] = useState<string | null>(null)

  return (
    <section id="architecture" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900 text-white text-sm font-bold mb-6">
              <Layers3 className="w-4 h-4" />
              <span>Architecture Quantify</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              4 entités pour gouverner <span className="text-orange-500">toute</span> votre énergie
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Un modèle structuré qui s'adapte du simple foyer aux grands ensembles immobiliers.
            </p>
          </div>
        </FadeIn>

        {/* Visual flow diagram */}
        <FadeIn delay={0.15}>
          <div className="bg-blue-900 rounded-3xl p-8 sm:p-12 mb-12">
            {/* Flow: horizontal on desktop, vertical on mobile */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
              {entities.map((entity, idx) => (
                <div key={entity.id} className="flex flex-col lg:flex-row items-center gap-4">
                  <button
                    onClick={() => setActiveEntity(activeEntity === entity.id ? null : entity.id)}
                    className={`group flex flex-col items-center gap-3 px-6 py-5 rounded-2xl transition-all duration-300 min-w-[160px] ${
                      activeEntity === entity.id
                        ? 'bg-orange-500 text-white scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <entity.icon className="w-8 h-8" />
                    <span className="text-sm font-bold text-center leading-tight">{entity.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeEntity === entity.id ? 'rotate-180' : ''}`} />
                  </button>

                  {idx < entities.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-white/40 hidden lg:block" />
                  )}
                  {idx < entities.length - 1 && (
                    <div className="w-px h-6 bg-white/20 lg:hidden" />
                  )}
                </div>
              ))}
            </div>

            {/* Detail panel */}
            {activeEntity && (
              <div className="mt-8 bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10 transition-all duration-300">
                {entities.filter(e => e.id === activeEntity).map(entity => (
                  <div key={entity.id} className={`${entity.photo ? 'grid lg:grid-cols-[240px,1fr]' : ''}`}>
                    {entity.photo && (
                      <div className="relative min-h-[200px] lg:min-h-0 bg-slate-800 overflow-hidden">
                        <Image
                          src={entity.photo}
                          alt={entity.photoAlt}
                          fill
                          className="object-cover opacity-90"
                          sizes="240px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/40 hidden lg:block" />
                        <div className="absolute bottom-2 left-2 text-[10px] bg-slate-900/70 text-white/70 px-2 py-0.5 rounded backdrop-blur-sm">
                          Photo réelle — Togo
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <p className="text-white/80 text-base mb-4">{entity.short}</p>
                      <div className="grid sm:grid-cols-3 gap-3">
                        {entity.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                            <p className="text-sm text-white/90">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pipeline summary */}
            <div className="mt-6 text-center">
              <p className="text-xs text-white/50 font-mono">
                Mère → Liés → Virtuels → Vues → Utilisateurs &nbsp;|&nbsp; Anti-boucle, historique complet, permissions serveur
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Entity cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {entities.map((entity, idx) => (
            <FadeIn key={entity.id} delay={idx * 0.1}>
              <div
                className={`rounded-2xl border overflow-hidden hover-lift cursor-pointer transition-all duration-300 ${
                  activeEntity === entity.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-slate-200 bg-slate-50 hover:border-blue-900'
                }`}
                onClick={() => setActiveEntity(activeEntity === entity.id ? null : entity.id)}
              >
                {entity.photo && (
                  <div className="relative h-30 bg-slate-200 overflow-hidden">
                    <Image
                      src={entity.photo}
                      alt={entity.photoAlt}
                      fill
                      className="object-cover  object-[center_10%]"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[10px] text-white/80 font-medium">
                      Photo terrain
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                    <entity.icon className="w-6 h-6 text-blue-900" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{entity.label}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{entity.short}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
