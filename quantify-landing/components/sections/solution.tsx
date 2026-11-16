'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  BarChart3,
  Camera,
  CheckCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Wallet,
  Wifi
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function FeatureCard({ icon: Icon, label, desc, index, visible }: {
  icon: React.ElementType; label: string; desc: string; index: number; visible: boolean
}) {
  return (
    <div
      className={`hover-icon flex h-full min-w-0 flex-col items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all duration-500 hover:border-blue-200 hover-lift lg:flex-row lg:gap-3 lg:p-4 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="icon-target flex h-10 w-10 shrink-0 items-center justify-center">
        <Icon className="h-5 w-5 text-[#FF6B35]" />
      </div>
      <div className="w-full min-w-0 lg:flex-1 lg:w-auto">
        <p className="text-sm font-bold leading-snug text-slate-900">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{desc}</p>
      </div>
    </div>
  )
}

export function SolutionSection() {
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const solution = {
    tag: 'Gestion énergétique',
    title: 'Compteurs et factures au même endroit',
    subtitle: 'Du relevé au suivi des dépenses, une gestion énergétique plus claire et plus simple.',
    features: [
      { icon: Camera, label: 'Scan OCR/IA', desc: "Photographiez un compteur : l'IA extrait sa valeur et l'enregistre avec un horodatage." },
      { icon: BarChart3, label: 'Suivi multi-compteurs', desc: 'Consultez la consommation par compteur, immeuble ou résidence et répartissez les charges.' },
      { icon: Share2, label: 'Vues partagées', desc: 'Propriétaires, occupants et gestionnaires accèdent aux informations qui les concernent.' },
      { icon: Wallet, label: 'Paiement Mobile Money', desc: 'Rechargez les compteurs prépayés ou réglez vos factures via Mobile Money.' },
      { icon: Wifi, label: 'Mode hors ligne', desc: 'Scannez le compteur ou saisissez un relevé hors ligne ; les données se synchronisent dès que le réseau revient.' },
      { icon: ShieldCheck, label: 'Historique sécurisé', desc: 'Retrouvez les relevés et calculs de facturation pour vérifier les consommations.' },
    ],
  }

  const trustPoints = [
    { icon: Camera, text: 'Chaque relevé est conservé avec sa date et son historique.' },
    { icon: Share2, text: 'Les accès partagés respectent les rôles de chaque utilisateur.' },
    { icon: CheckCircle, text: 'Les calculs de facturation peuvent être vérifiés.' },
    { icon: Wifi, text: 'Les relevés restent possibles hors ligne.' },
  ]

  return (
    <section id="solution" className="bg-white py-12 sm:py-20 lg:py-32" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mx-auto mb-8 max-w-3xl text-center sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6 text-[#FF6B35]">
              <Sparkles className="w-4 h-4 text-[#FF6B35]" />
              <span>Gestion énergétique</span>
            </div>
            <h2 className="mb-4 text-3xl font-extrabold leading-tight text-slate-900 sm:mb-6 sm:text-4xl lg:text-5xl">
              Vos compteurs et factures, <span className="text-orange-500">en un seul endroit</span>
            </h2>
            <p className="text-base leading-relaxed text-slate-700 sm:text-xl">
              Suivez vos relevés, vos consommations et la répartition des charges depuis une seule
              plateforme.
            </p>
          </div>
        </FadeIn>

        {/* Active solution panel */}
        <FadeIn delay={0.2}>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="flex flex-col gap-3 bg-blue-900 px-4 py-4 sm:flex-row sm:items-center sm:px-8 sm:py-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400">
                {solution.tag}
              </div>
              <h3 className="text-lg font-bold text-white sm:text-2xl">{solution.title}</h3>
            </div>

            {/* Features grid */}
            <div className="p-4 sm:p-8 lg:p-10">
              <p className="mb-5 text-sm leading-relaxed text-slate-700 sm:mb-8 sm:text-lg">{solution.subtitle}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {solution.features.map((feat, fIdx) => (
                  <FeatureCard
                    key={fIdx}
                    icon={feat.icon}
                    label={feat.label}
                    desc={feat.desc}
                    index={fIdx}
                    visible={sectionVisible}
                  />
                ))}
              </div>
            </div>

          </div>
        </FadeIn>

        {/* Scan OCR demo with real meter photo */}
        <FadeIn delay={0.3}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-xl sm:mt-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: real meter photo with scan overlay */}
              <div className="relative min-h-[220px] overflow-hidden bg-slate-800 sm:min-h-[320px] lg:min-h-[400px]">
                <Image
                  src="/meter-analog-closeup.png"
                  alt="Compteur analogique CEET — scan OCR en cours"
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Scan overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-32 w-48 rounded-lg border-2 border-amber-400 sm:h-46 sm:w-68">
                    <div className="absolute inset-0 bg-amber-400/10 animate-pulse rounded-lg" />
                    <div className="absolute -top-6 left-0 text-[10px] font-mono text-amber-400">OCR zone detected</div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 sm:px-3">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-300 font-medium">Scan en cours...</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 sm:px-3">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-300 font-medium">98% confiance</span>
                  </div>
                </div>
              </div>

              {/* Right: extracted data */}
              <div className="flex flex-col justify-center p-4 sm:p-8 lg:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-amber-400 w-fit mb-4">
                  <Camera className="w-3.5 h-3.5" />
                  Résultat du scan OCR
                </div>
                <h3 className="mb-3 text-lg font-bold text-white sm:mb-4 sm:text-2xl">
                  Photographiez. L&apos;IA fait le reste.
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-400 sm:mb-6">
                  Pointez votre smartphone vers n&apos;importe quel compteur CEET (prépayé ou analogique).
                  Notre modèle OCR extrait la valeur instantanément et l&apos;enregistre avec horodatage.
                </p>
                <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
                  {[
                    { label: 'Valeur extraite', value: '40 466 kWh', color: 'text-white' },
                    { label: 'Type détecté', value: 'Monophasé 2 fils (E967C)', color: 'text-slate-300' },
                    { label: 'Confiance OCR', value: '98.2%', color: 'text-emerald-400' },
                    { label: 'Horodatage', value: '12 fév. 2025 — 16:57', color: 'text-slate-400' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 border-b border-slate-700/50 py-2">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-4">
                  Photo réelle d&apos;un compteur analogique CEET au Togo — le type de compteur que Quantify digitalise.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Trust block */}
        <FadeIn delay={0.35}>
          <div className="mt-8 rounded-2xl bg-blue-900 p-5 text-white sm:mt-16 sm:rounded-3xl sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
                  Un suivi clair de votre énergie
                </h3>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Retrouvez les relevés, les consommations et les calculs de facturation dans un
                  espace partagé et sécurisé.
                </p>
              </div>
              <div className="space-y-3">
                {trustPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-white/10 ${
                      sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${idx * 120 + 400}ms` }}
                  >
                    <point.icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-400" />
                    <p className="text-sm text-slate-300 leading-relaxed">{point.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
