'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { WaitlistCounter } from '@/components/waitlist/waitlist-counter'

interface CTASectionProps {
  onJoinWaitlist: () => void
}

export function CTASection({ onJoinWaitlist }: CTASectionProps) {
  const [isMounted, setIsMounted] = useState(false)

  const stars = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 4,
    })),
    []
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-blue-900 py-12 text-white sm:py-20 lg:py-32">
      <div className="absolute inset-0">
        {isMounted && stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
              opacity: 0.15,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-400 sm:mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Rejoignez le mouvement</span>
        </div>

        <h2 className="mb-4 text-3xl font-extrabold leading-tight sm:mb-6 sm:text-5xl lg:text-6xl">
          Rejoignez la révolution énergétique
        </h2>

        <p className="mx-auto mb-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:mb-10 sm:text-2xl">
          Soyez parmi les premiers à suivre vos compteurs, comprendre votre consommation et gérer
          vos factures depuis une seule application.
        </p>

        <div className="mb-8 flex flex-col justify-center gap-3 sm:mb-12 sm:flex-row sm:gap-4">
          <button
            type="button"
            onClick={onJoinWaitlist}
            className="group flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:shadow-orange-500/30 sm:w-auto sm:px-10 sm:py-5 sm:text-lg sm:hover:scale-105"
          >
            Rejoindre la liste d’attente
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link href="/contact" className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-base font-bold transition-all duration-300 hover:bg-white/20 sm:w-auto sm:px-10 sm:py-5 sm:text-lg">
            <Phone className="w-6 h-6" />
            Nous contacter
          </Link>
        </div>

        {/* Social proof basée sur les inscriptions réellement enregistrées */}
        <WaitlistCounter hideWhenEmpty className="mb-8 sm:mb-12" />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400 sm:mt-10 sm:gap-6 sm:text-sm">
          {['100% Sécurisé', 'Sans engagement', 'Particuliers : gratuit', 'Made in Togo'].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
