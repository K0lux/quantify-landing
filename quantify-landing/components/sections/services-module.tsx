'use client'

import { FadeIn } from '@/components/animations/fade-in'
import { Briefcase, Handshake, ShieldCheck, Store, Timer, Zap } from 'lucide-react'

export function ServicesModuleSection() {
  const pillars = [
    {
      icon: Briefcase,
      title: 'Profils prestataires riches',
      description:
        "Des fiches complètes pour chaque électricien, plombier ou technicien : bio, compétences, certifications vérifiées, zone d’intervention et disponibilité en temps réel.",
      points: [
        'Profil ServiceProvider structuré (bio, années d’expérience, langues)',
        'Zone d’intervention précise (rayon, quartiers, frais de déplacement)',
        'Badge identité & certifications vérifiées pour inspirer confiance',
      ],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Timer,
      title: 'Flux de réservation & exécution',
      description:
        'Un parcours complet de la demande à la mission terminée : demande de service, devis structuré, planification dans le calendrier et suivi sur le terrain.',
      points: [
        'ServiceRequest → Quote → Mission avec suivi d’état clair',
        'Calendrier temps réel, urgences et visites techniques gérés dans la même interface',
        'Gestion des travaux supplémentaires et rapports de fin de mission avec photos',
      ],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: ShieldCheck,
      title: 'Monétisation & confiance intégrées',
      description:
        'Un modèle pensé pour aligner les intérêts de la plateforme, des prestataires et des clients, tout en maximisant la qualité des missions.',
      points: [
        'Lead Fee variable selon le type de demande (standard, urgente, emergency, récurrente)',
        'Commission 8% sur les paiements in‑app, 1,5% sur les flux déclarés hors‑app',
        'ProviderTrustScore et plans Free / Starter / Pro / Business pour récompenser les meilleurs prestataires',
      ],
      gradient: 'from-emerald-500 to-green-600',
    },
  ]

  const comparison = [
    {
      label: 'Objet vendu',
      products: 'Produit stockable (compteur, IoT, équipement)',
      services: 'Temps, expertise et déplacement (mission sur site ou à distance)',
    },
    {
      label: 'Unité de vente',
      products: 'Pièce / pack, stock, livraison',
      services: 'Créneaux horaires, durée estimée, type d’intervention',
    },
    {
      label: 'Parcours client',
      products: 'Ajout au panier → paiement',
      services: 'Demande de service → devis / réservation → exécution → review',
    },
    {
      label: 'Monétisation Quantify',
      products: 'Commission 5–10% sur les ventes produits',
      services: 'Commission 8% + Lead Fee par demande qualifiée',
    },
  ]

  const monetizationBullets = [
    'Lead Fee Services de 50 à 100 QC selon le niveau d’urgence et la qualité de la demande (photos, récurrence, visite technique).',
    'Commission 8% sur les missions payées in‑app (Mobile Money), 1,5% sur les montants déclarés hors‑app.',
    'Réduction progressive des Lead Fees selon le plan prestataire : Starter (‑20%), Pro (‑40%), Business (‑50%).',
  ]

  return (
    <section id="services-module" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">
            <Zap className="w-4 h-4" />
            <span>Quantify Market — Module Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            La verticale Services de Quantify Market
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Au‑delà des produits IoT, Quantify Market connecte les clients à des prestataires de confiance
            (électriciens, plombiers, techniciens…) avec un moteur de réservation, de devis et de missions
            pensé pour les services.
          </p>
        </div>

        {/* Comparatif Produits vs Services */}
        <FadeIn>
          <div className="mb-16 bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-3">
              <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-slate-50 rounded-full text-xs font-semibold mb-4">
                  <Store className="w-4 h-4" />
                  <span>Deux verticales complémentaires</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Produits vs Services</h3>
                <p className="text-sm text-slate-600">
                  Le module Services ne remplace pas le module Produits : il l&apos;étend. Le premier vend des
                  objets, le second orchestre des missions terrain avec des contraintes de temps, de distance
                  et de disponibilité.
                </p>
              </div>

              <div className="md:col-span-2 p-6 sm:p-8">
                <div className="grid grid-cols-3 text-xs sm:text-sm font-semibold text-slate-500 mb-4">
                  <div className="uppercase tracking-wide">Dimension</div>
                  <div className="uppercase tracking-wide text-center">Module Produits</div>
                  <div className="uppercase tracking-wide text-center">Module Services</div>
                </div>
                <div className="space-y-4">
                  {comparison.map((row, index) => (
                    <div
                      key={row.label}
                      className={`grid grid-cols-3 gap-4 items-start rounded-2xl p-4 ${
                        index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                      }`}
                    >
                      <div className="text-sm font-medium text-slate-800">{row.label}</div>
                      <div className="text-sm text-slate-600 text-center">{row.products}</div>
                      <div className="text-sm text-slate-900 text-center font-medium">{row.services}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Trois piliers du module Services */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {pillars.map((pillar, index) => (
            <FadeIn key={pillar.title} delay={index * 0.1}>
              <div className="group h-full bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-500">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${pillar.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{pillar.description}</p>
                <ul className="space-y-2 text-sm text-slate-600">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Monétisation Services (aperçu) */}
        <FadeIn delay={0.2}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4">Monétisation pensée pour les services</h3>
                <p className="text-indigo-100 text-lg mb-6">
                  Le module Services combine un modèle de Lead Fee intelligent et des commissions flexibles
                  pour aligner les intérêts de Quantify, des prestataires et des clients finaux.
                </p>
              </div>
              <div className="space-y-3">
                {monetizationBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm"
                  >
                    <Handshake className="w-5 h-5 mt-0.5 text-yellow-300 flex-shrink-0" />
                    <p className="text-sm text-indigo-50">{item}</p>
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

