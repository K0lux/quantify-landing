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
  const mobileEntity = entities.find((entity) => entity.id === activeEntity) ?? entities[0]

  return (
    <section id="architecture" className="pb-8 pt-10 sm:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900 text-white text-sm font-bold mb-2 sm:mb-6">
              <Layers3 className="w-4 h-4" />
              <span>Architecture Quantify</span>
            </div>
            <h2 className="mb-2 text-2xl font-extrabold leading-tight text-slate-900 sm:mb-6 sm:text-4xl lg:text-5xl">
              4 entités pour piloter <span className="text-orange-500">votre</span> énergie
            </h2>
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              Du compteur principal aux sous-compteurs, chaque usage reste relié et clair.
            </p>
          </div>
        </FadeIn>

        {/* Mobile selectors show their active details immediately below the controls. */}
        <div className="mb-6 rounded-3xl bg-blue-900 p-3 sm:mb-8 sm:p-6 lg:hidden">
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Choisir une entité énergétique">
            {entities.map((entity) => {
              const selected = mobileEntity.id === entity.id
              return (
                <button
                  key={entity.id}
                  type="button"
                  onClick={() => setActiveEntity(entity.id)}
                  aria-pressed={selected}
                  className={`flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                    selected
                      ? 'border-orange-400 bg-orange-500 text-white'
                      : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <entity.icon className="h-4 w-4 shrink-0" />
                  <span>{entity.label}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-3 sm:mt-3 sm:p-4" aria-live="polite">
            <div className="mb-1.5 flex items-center gap-3 sm:mb-2">
              <mobileEntity.icon className="h-6 w-6 shrink-0 text-orange-300" />
              <h3 className="font-bold text-white">{mobileEntity.label}</h3>
            </div>
            <p className="mb-2 text-[13px] leading-snug text-slate-200 sm:mb-3 sm:text-sm sm:leading-relaxed">{mobileEntity.short}</p>
            <ul className="space-y-1.5 sm:space-y-2">
              {mobileEntity.details.map((detail) => (
                <li key={detail} className="flex items-start gap-2 text-xs leading-snug text-white/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual flow diagram */}
        <FadeIn delay={0.15}>
          <div className="hidden bg-blue-900 rounded-3xl p-8 sm:p-12 mb-12 lg:block">
            {/* Flow: horizontal on desktop, vertical on mobile */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0">
              {entities.map((entity, idx) => (
                <div key={entity.id} className="flex flex-col lg:flex-row items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveEntity(activeEntity === entity.id ? null : entity.id)}
                    aria-pressed={activeEntity === entity.id}
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
        <div className="hidden grid-cols-4 gap-4 lg:grid">
          {entities.map((entity, idx) => (
            <FadeIn key={entity.id} delay={idx * 0.1}>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
