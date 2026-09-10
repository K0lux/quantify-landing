'use client'

import { useEffect, useRef } from 'react'
import { FadeIn } from '@/components/animations/fade-in'

const audiences = [
  'Propriétaires d\'immeubles',
  'Gestionnaires de copropriétés',
  'Syndics',
  'Bâtiments industriels',
  'Familles & particuliers',
  'Colocataires',
  'Résidences étudiantes',
  'Hôtels & hospitality',
  'Entreprises',
  'Fournisseurs d\'énergie',
  'Collectivités locales',
  'ONG & associations',
  'Investisseurs immobiliers',
  'Marchés & zones commerciales',
  'Commerçants locaux',
  'Électriciens',
  'Plombiers & techniciens',
  'Prestataires IT',
  'Déménageurs',
  'Artisans du bâtiment',
  'Agences immobilières',
  'Campus universitaires',
  'Centres de santé',
  'Restaurants & bars',
  'Ateliers & manufactures',
]

function MarqueeRow({ items, direction = 'left', speed = 40 }: { items: string[]; direction?: 'left' | 'right'; speed?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let raf: number
    let pos = direction === 'left' ? 0 : -el.scrollWidth / 2

    const step = () => {
      pos += direction === 'left' ? -0.5 : 0.5
      const half = el.scrollWidth / 2
      if (direction === 'left' && Math.abs(pos) >= half) pos = 0
      if (direction === 'right' && pos >= 0) pos = -half
      el.style.transform = `translateX(${pos}px)`
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [direction, speed])

  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden">
      <div ref={scrollRef} className="flex gap-3 w-max will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-slate-200 bg-white text-slate-700 whitespace-nowrap hover:border-blue-900 hover:text-blue-900 transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export function AudienceSection() {
  const row1 = audiences.slice(0, 13)
  const row2 = audiences.slice(13)

  return (
    <section id="audiences" className="py-16 sm:py-20 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
              Pour <span className="text-orange-500">tous</span> ceux qui gèrent l'énergie
            </h2>
            <p className="text-base text-slate-600">
              Du simple foyer aux grands ensembles, une seule plateforme.
            </p>
          </div>
        </FadeIn>
      </div>

      <div className="space-y-3">
        <MarqueeRow items={row1} direction="left" />
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  )
}
