// ============================================
// components/sections/features.tsx
// ============================================
'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  BarChart3,
  BellRing,
  Bot,
  CheckCircle,
  Coins,
  FileText,
  Gauge,
  Layers3,
  Link2,
  ShieldCheck,
  Zap
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Zap,
      title: 'Gestion centralisée des compteurs mères',
      description:
        'Créez vos compteurs physiques principaux avec empreinte composite, seuils d’alerte, recharges prépayées et paiements de factures mécaniques.',
      gradient: 'from-orange-500 to-red-500',
      benefits: [
        "Initialisation en 4 phases avec preuve photo obligatoire",
        'Unicité garantie (QR, code, signature visuelle)',
        'Gel de configuration en cas de litige',
      ],
    },
    {
      icon: Link2,
      title: 'Compteurs liés & occupants',
      description:
        'Modélisez chaque chambre, boutique ou local comme un compteur lié avec son occupant, ses paramètres de paiement et ses alertes personnalisées.',
      gradient: 'from-slate-700 to-slate-900',
      benefits: [
        "Historique d’occupation conservé",
        'Factures individuelles ou par groupe',
        'Partage de coûts entre colocataires',
      ],
    },
    {
      icon: Layers3,
      title: 'Compteurs virtuels & vue globale',
      description:
        'Créez des compteurs virtuels pour suivre un immeuble, un étage, un atelier ou les charges communes sans toucher aux données physiques.',
      gradient: 'from-amber-500 to-orange-500',
      benefits: [
        'Addition/soustraction pondérée de plusieurs sources',
        'Hiérarchie multi-niveaux avec anti-boucle',
        'Simulations budgétaires non-destructives',
      ],
    },
    {
      icon: BarChart3,
      title: 'Analyse, tendances et anomalies',
      description:
        'Visualisez l’historique de consommation, détectez les écarts par rapport à la baseline et classez vos sources par contribution.',
      gradient: 'from-blue-500 to-cyan-500',
      benefits: [
        'Anomalies statistiques (écart-type, Z-score)',
        'KPI personnalisés (kWh/m², coûts consolidés)',
        'Comparaison multi-périodes et saisonnalité',
      ],
    },
    {
      icon: Bot,
      title: 'Agent IA Kilo',
      description:
        'Votre copilote énergétique qui lit vos données, explique vos consommations et vous propose des actions concrètes.',
      gradient: 'from-fuchsia-500 to-purple-600',
      benefits: [
        'Analyse des compteurs mères, liés et virtuels en contexte',
        'Détection d’anomalies et suggestions d’actions',
        'Aide à l’interprétation des factures et tranches tarifaires',
      ],
    },
    {
      icon: Coins,
      title: 'Wallet de crédits QC',
      description:
        'Un système de crédits prépayés, sans abonnement, pour garder le contrôle sur chaque action payante.',
      gradient: 'from-amber-500 to-orange-600',
      benefits: [
        'Crédits prépayés, jamais de facture cachée',
        'Alertes avant d’être à sec',
        'Historique détaillé de chaque action payante',
      ],
    },
    {
      icon: Gauge,
      title: 'Allocation des tranches tarifaires',
      description:
        'Un moteur d’allocation proportionnelle ou chronologique qui applique la bonne structure tarifaire à chaque période.',
      gradient: 'from-indigo-500 to-blue-600',
      benefits: [
        'N tranches paramétrables avec abonnement et taxes',
        'Gestion des charges communes (proportionnel, fixe, hybride)',
        'Calculs rejouables à l’identique pour tout audit',
      ],
    },
    {
      icon: BellRing,
      title: 'Alertes & notifications multi-canaux',
      description:
        'Configurez des alertes sur la consommation, les seuils budgétaires, les anomalies, les vues expirantes et les paiements de facture.',
      gradient: 'from-green-500 to-emerald-500',
      benefits: [
        'Notifications in-app, email, SMS et WhatsApp',
        'Seuils personnalisables par compteur ou groupe',
        'Dédoublonnage intelligent pour éviter le spam',
      ],
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité, permissions et sessions',
      description:
        'Toutes les actions passent par un middleware de permissions, avec sessions sécurisées, blocage après tentatives et masquage des actions non autorisées.',
      gradient: 'from-purple-500 to-pink-500',
      benefits: [
        'Vues granulaires (Lecture, Scan, Écriture, Admin)',
        'Sessions sécurisées avec refresh tokens',
        'Blocages et journaux en cas d’abus ou de litige',
      ],
    },
    {
      icon: FileText,
      title: 'Traçabilité & exports certifiés',
      description:
        'Un journal global immuable et des exports signés vous permettent d’auditer à tout moment vos relevés, vues et factures.',
      gradient: 'from-slate-700 to-slate-900',
      benefits: [
        'Journal append-only pour toutes les entités',
        'Hash d’intégrité sur chaque relevé',
        'Exports CSV/PDF signés pour l’audit',
      ],
    },
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Une plateforme complète de gestion énergétique multi-compteurs
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Quantify ne se contente pas de lire vos compteurs : la plateforme structure vos compteurs mères, liés et virtuels,
            partage des vues sécurisées et automatise la facturation, les alertes et l’audit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="group bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-500">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{feature.description}</p>
                
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Tech Highlight */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Un moteur d’alerte pensé pour l’Afrique
              </h3>
              <p className="text-blue-100 text-lg mb-6">
                Quantify combine signalements utilisateurs, détection automatique, SMS, USSD et Bluetooth pour faire circuler
                l’information, même quand les réseaux sont saturés ou indisponibles.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  "Architecture offline-first",
                  "Multi-opérateurs & multi-pays",
                  "Scores de confiance par quartier"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-5 h-5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <div className="text-green-400">→ Scanning meter...</div>
                  <div className="text-blue-400">→ OCR processing: 98% accuracy</div>
                  <div className="text-purple-400">→ Data synced ✓</div>
                  <div className="text-yellow-400">→ Ready to use!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}