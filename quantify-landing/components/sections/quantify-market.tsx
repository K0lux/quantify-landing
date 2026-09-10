// ============================================
// components/sections/quantify-market.tsx
// ============================================
'use client'

import { FadeIn } from '@/components/animations/fade-in'
import { Store, MessageCircle, ShoppingCart, ShieldCheck, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const columns = [
  {
    icon: Store,
    title: 'Pour les marchands',
    description:
      "Transformez votre présence énergétique en véritable vitrine commerciale, sans créer un nouveau compte ni une nouvelle infrastructure.",
    points: [
      'Création de boutique reliée à votre compte Quantify',
      'Listings produits illimités selon votre plan',
      'Vidéos courtes type Reels pour se faire découvrir',
      'Boosts payants pour remonter dans le feed et la recherche'
    ]
  },
  {
    icon: MessageCircle,
    title: 'Monétisation & leads',
    description:
      "Chaque contact devient une opportunité mesurée et monétisée, même quand la vente se conclut en dehors de l’app.",
    points: [
      'Leads multi-canal : WhatsApp, téléphone, chat in-app, QR en boutique',
      'Lead fee débité automatiquement en crédits QC',
      'Self-report vendeur + confirmation acheteur',
      'Trust Score public pour récompenser les marchands honnêtes'
    ]
  },
  {
    icon: ShoppingCart,
    title: 'Transactions in-app',
    description:
      "Un parcours d’achat fluide, pensé pour l’Afrique, avec Mobile Money et gestion automatique des commissions.",
    points: [
      'Panier et paiement Mobile Money (Flooz / TMoney)',
      'Commissions prélevées automatiquement en QC',
      'Suivi de commande et confirmation de réception',
      'Litiges et remboursements gérés dans l’écosystème Quantify'
    ]
  }
]

export function QuantifyMarketSection() {
  return (
    <section id="quantify-market" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            <span>Quantify Market — couche commerciale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            De la gestion d&apos;énergie au revenu
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            Les mêmes utilisateurs qui suivent leur énergie peuvent acheter, vendre et se faire découvrir dans le
            même écosystème, avec le même wallet de crédits QC.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {columns.map((col, index) => (
            <FadeIn key={col.title} delay={index * 0.1}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 text-white">
                  <col.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{col.title}</h3>
                <p className="text-slate-600 text-sm mb-5">{col.description}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {col.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-6 sm:px-10 py-6 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-100 mb-1">
                Pour marchands et créateurs de services
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                Découvrez comment Quantify Market transforme vos leads en revenus mesurables.
              </p>
            </div>
            <Link
              href="/marche"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl shadow-md hover:shadow-xl transition-all"
            >
              Découvrir Quantify Market
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

