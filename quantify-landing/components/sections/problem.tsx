'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  ArrowRight,
  Calculator,
  Clock,
  Gauge,
  HelpCircle,
  MapPin,
  SearchX,
  ShieldAlert,
  UserX,
  XCircle
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const steps = 30
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return <span ref={ref} className={started ? 'anim-count-pop' : 'opacity-0'}>{count}</span>
}

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
  const [activeCard, setActiveCard] = useState<number | null>(null)

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
    {
      tag: 'Produits & Articles',
      tagIcon: SearchX,
      title: 'Impossible de chercher un produit adapté localement',
      description:
        "Avant d'acheter ou de se déplacer, aucun outil ne permet de comparer prix, disponibilité et horaires réels des commerces autour de soi.",
      painPoints: [
        { icon: HelpCircle, text: 'Aucun conseil personnalisé selon votre contexte ou besoin' },
        { icon: XCircle, text: 'Prix, stock et disponibilité inconnus avant le déplacement' },
        { icon: Clock, text: "Horaires d'ouverture non fiables — trajets souvent inutiles" },
        { icon: MapPin, text: 'Pas de vision locale : impossible de comparer les offres à proximité' },
      ],
    },
    {
      tag: 'Services & Prestataires',
      tagIcon: UserX,
      title: 'Trouver un prestataire fiable relève du parcours du combattant',
      description:
        "Électricien, plombier, maçon, technicien IT, déménageur… En urgence, pas moyen de comparer devis, prix ou disponibilité.",
      painPoints: [
        { icon: Clock, text: 'Perte de temps énorme pour trouver « la bonne personne »' },
        { icon: ShieldAlert, text: "Aucune garantie de confiance, pas d'avis vérifiés" },
        { icon: Calculator, text: "Impossible de comparer devis ou tarifs avant de s'engager" },
        { icon: SearchX, text: 'Bâtiment, nettoyage, informatique, transport — même galère partout' },
      ],
    },
  ]

  return (
    <section className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              <AnimatedCounter target={3} duration={800} /> problèmes,{' '}
              <span className="text-orange-500">0 solution adaptée</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
              Des millions de personnes subissent ces frustrations au quotidien — et pourtant,
              aucun outil ne les résout de bout en bout.
            </p>
          </div>
        </FadeIn>

        {/* Real meters from Togo — credibility banner */}
        <FadeIn delay={0.15}>
          <div className="mb-12 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200">
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-ceet-double.png"
                  alt="Deux compteurs prépayés CEET LAFIA au Togo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-analog-closeup.png"
                  alt="Compteur analogique monophasé — 40 466 kWh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-sous-compteur-1.png"
                  alt="Sous-compteur YAKI Electric monophasé — 3 664 kWh"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <Image
                  src="/meter-sous-compteur-2.png"
                  alt="Sous-compteur YAKI Electric avec disjoncteur"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-900 text-center">
              <p className="text-sm text-slate-300">
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
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-500 cursor-pointer hover-lift ${
                      activeCard === index ? 'border-orange-500/40 shadow-xl' : 'border-slate-200'
                    }`}
                    onClick={() => setActiveCard(activeCard === index ? null : index)}
                  >
                    <div className="grid lg:grid-cols-5 gap-0">
                      <div className="lg:col-span-2 p-8 sm:p-10 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-white w-fit mb-5 bg-blue-900">
                          <problem.tagIcon className="w-3.5 h-3.5" />
                          <span>{problem.tag}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
                          {problem.title}
                        </h3>
                        <p className="text-base text-slate-700 leading-relaxed">{problem.description}</p>
                      </div>

                      <div className="lg:col-span-3 bg-slate-50 p-8 sm:p-10">
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
          <div className="mt-12 rounded-2xl p-8 text-center border border-orange-500/25 bg-orange-500/5 hover-lift">
            <p className="text-lg sm:text-xl text-slate-900 font-bold mb-2">
              Et la peur du surcoût en ligne ?
            </p>
            <p className="text-base text-slate-700 max-w-2xl mx-auto leading-relaxed">
              Commissions cachées, prix gonflés, perte de contrôle… Les utilisateurs préfèrent encore
              la méthode traditionnelle plutôt que de risquer de payer plus en ligne.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
              <span>Quantify change la donne</span>
              <ArrowRight className="w-4 h-4 arrow-animate" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
