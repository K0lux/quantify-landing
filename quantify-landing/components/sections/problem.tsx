'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  ArrowRight,
  Calculator,
  Gauge,
  MapPin,
  ShieldAlert,
  UserX
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function StaggeredItem({ children, index, className = '' }: { children: React.ReactNode; index: number; className?: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 120)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
    >
      {children}
    </div>
  )
}

export function ProblemSection() {
  const problems = [
    {
      tag: 'Compteurs & Factures',
      tagIcon: Gauge,
      title: 'Aucune solution simple, automatisée et flexible',
      description:
        "Qu'il s'agisse d'un propriétaire, d'un gestionnaire de compteur principal ou d'un occupant sur sous-compteur — personne n'a d'outil unique et adapté.",
      painPoints: [
        { icon: MapPin, text: 'Se déplacer physiquement pour chaque relevé ou facture' },
        { icon: Calculator, text: 'Calculs manuels pour répartir charges communes et pertes' },
        { icon: UserX, text: 'Aucune vue partagée entre propriétaire, locataire et gestionnaire' },
        { icon: ShieldAlert, text: 'Factures imprévues, sans preuve ni historique fiable' },
      ],
    },
  ]

  return (
    <section className="py-12 sm:py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-6 leading-tight">
              Une gestion énergétique{' '}
              <span className="text-orange-500">encore trop manuelle</span>
            </h2>
            <p className="text-base sm:text-xl text-slate-700 leading-relaxed">
              Relevés, répartition des charges et historique restent souvent dispersés entre plusieurs
              outils et calculs manuels.
            </p>
          </div>
        </FadeIn>

        {/* Real meters from Togo — credibility banner */}
        <FadeIn delay={0.15}>
          <div className="mb-8 sm:mb-12 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
            <div className="grid grid-cols-4 gap-px bg-slate-200">
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-ceet-double.png"
                  alt="Deux compteurs prépayés CEET LAFIA au Togo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-analog-closeup.png"
                  alt="Compteur analogique monophasé — 40 466 kWh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-sous-compteur-1.png"
                  alt="Sous-compteur YAKI Electric monophasé — 3 664 kWh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-sous-compteur-2.png"
                  alt="Sous-compteur YAKI Electric avec disjoncteur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="bg-slate-900 px-3 py-3 text-center sm:px-6 sm:py-4">
              <p className="text-xs leading-relaxed text-slate-300 sm:text-sm">
                <span className="font-semibold text-white">Vrais compteurs au Togo</span> — CEET, YAKI, YAKI.
                Compteurs principaux et sous-compteurs. Quantify les digitalise tous.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Timeline layout */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="hidden lg:block absolute left-8 top-8 bottom-8 w-px bg-slate-200">
            <div className="timeline-line absolute inset-0 bg-blue-900/30" />
          </div>

          <div className="space-y-8">
            {problems.map((problem, index) => (
              <FadeIn key={index} delay={index * 0.15}>
                <div className="relative lg:pl-20">
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-4 top-10 w-8 h-8 rounded-full bg-blue-900 items-center justify-center text-white text-sm font-bold z-10">
                    {index + 1}
                  </div>

                  <div
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <div className="grid lg:grid-cols-5 gap-0">
                      <div className="flex flex-col justify-center p-4 sm:p-8 lg:col-span-2 lg:p-10">
                        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-900 px-3 py-1.5 text-xs font-bold text-white mb-4 sm:mb-5">
                          <problem.tagIcon className="w-3.5 h-3.5" />
                          <span>{problem.tag}</span>
                        </div>
                        <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 leading-snug">
                          {problem.title}
                        </h3>
                        <p className="text-base text-slate-700 leading-relaxed">{problem.description}</p>
                      </div>

                      <div className="bg-slate-50 p-4 sm:p-8 lg:col-span-3 lg:p-10">
                        <div className="grid sm:grid-cols-2 gap-4">
                          {problem.painPoints.map((pain, i) => (
                            <StaggeredItem key={i} index={i}>
                              <div className="hover-icon flex items-start gap-3 bg-white rounded-xl p-4 border border-slate-200 hover-lift cursor-default">
                                <div className="icon-target w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-50 border border-orange-200">
                                  <pain.icon className="w-4 h-4 text-orange-500" />
                                </div>
                                <p className="text-sm text-slate-800 font-medium leading-snug">{pain.text}</p>
                              </div>
                            </StaggeredItem>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.5}>
          <div className="mt-8 rounded-2xl border border-orange-500/25 bg-orange-500/5 p-5 text-center sm:mt-12 sm:p-8 hover-lift">
            <p className="mb-2 text-base font-bold text-slate-900 sm:text-xl">
              Sans suivi fiable, difficile d&apos;anticiper sa consommation
            </p>
            <p className="max-w-2xl mx-auto text-sm text-slate-700 leading-relaxed sm:text-base">
              Des relevés réguliers et un historique partagé aident à repérer les écarts, mieux répartir
              les charges et comprendre les factures.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
              <span>Quantify centralise vos données énergétiques</span>
              <ArrowRight className="w-4 h-4 arrow-animate" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
