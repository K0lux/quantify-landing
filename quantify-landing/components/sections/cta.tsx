'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'

interface CTASectionProps {
  onJoinWaitlist: () => void
}

export function CTASection({ onJoinWaitlist }: CTASectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [userCount, setUserCount] = useState(0)
  const [targetCount, setTargetCount] = useState(0)

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
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data?.total_users) {
          setTargetCount(result.data.total_users)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (targetCount === 0) return
    const steps = 40
    const increment = targetCount / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setUserCount(targetCount)
        clearInterval(timer)
      } else {
        setUserCount(Math.floor(current))
      }
    }, 1500 / steps)
    return () => clearInterval(timer)
  }, [targetCount])

  return (
    <section className="py-20 sm:py-32 bg-blue-900 text-white relative overflow-hidden">
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full font-semibold text-sm text-orange-400 mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Rejoignez le mouvement</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
          Rejoignez la révolution énergétique
        </h2>

        <p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          Soyez parmi les premiers à transformer votre gestion énergétique, vos achats locaux
          et vos services — le tout depuis une seule app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button
            onClick={onJoinWaitlist}
            className="group px-10 py-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            Créer mon compte gratuit
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="px-10 py-5 bg-white/10 border border-white/20 font-bold text-lg rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3">
            <Phone className="w-6 h-6" />
            Nous contacter
          </button>
        </div>

        {/* Social proof */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-orange-500 border-2 border-blue-900 flex items-center justify-center text-white text-xs font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <span className="font-semibold text-sm">
            <span className="text-orange-400">{userCount.toLocaleString()}</span> personnes en attente
          </span>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-6 items-center text-sm text-slate-400">
          {['100% Sécurisé', 'Sans engagement', 'Gratuit à vie', 'Made in Togo'].map((badge, i) => (
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
