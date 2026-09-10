'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/animations/fade-in'
import {
  AlertCircle,
  ArrowRight,
  Coins,
  CreditCard,
  LineChart,
  ShieldCheck,
  Wallet,
} from 'lucide-react'

type WalletTab = 'balance' | 'transactions' | 'packs' | 'stats'

const PACKS = [
  { name: 'Starter', credits: 500, price: 500, bestFor: 'Découvrir Quantify' },
  { name: 'Basic', credits: 1200, price: 1000, bestFor: 'Usage régulier' },
  { name: 'Standard', credits: 3000, price: 2000, bestFor: 'Multi-compteurs' },
]

const TRANSACTIONS = [
  { type: 'CONSUME', label: 'Analyse Kilo — Compteur Principal', delta: -100, time: 'Il y a 2h' },
  { type: 'CONSUME', label: 'Scan compteur #12', delta: -10, time: 'Il y a 4h' },
  { type: 'PURCHASE', label: 'Pack Basic (1200 QC)', delta: 1200, time: 'Hier · 18:12' },
  { type: 'CONSUME', label: 'Export CSV 30 jours', delta: -30, time: 'Hier · 09:27' },
]

export function WalletSection() {
  const [activeTab, setActiveTab] = useState<WalletTab>('balance')
  const [filter, setFilter] = useState<'all' | 'debits' | 'purchases'>('all')

  const blocks = [
    {
      icon: Coins,
      title: 'Crédits prépayés, zéro surprise',
      description:
        "Achetez des crédits QC à l'avance et consommez-les au rythme de vos scans, analyses Kilo, exports ou SMS. Pas d'abonnement."
    },
    {
      icon: AlertCircle,
      title: 'Toujours sous contrôle',
      description:
        "Votre solde est visible partout dans l'app, avec des alertes avant la panne sèche et un mode lecture seule qui ne coupe jamais l'accès."
    },
    {
      icon: ShieldCheck,
      title: 'Traçabilité totale',
      description:
        "Chaque action payante crée une ligne dans l'historique du wallet : date, type d'action, coût en QC et lien vers l'objet concerné."
    }
  ]

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    if (filter === 'debits') return tx.delta < 0
    if (filter === 'purchases') return tx.delta > 0
    return true
  })

  return (
    <section id="wallet" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-600 font-semibold text-sm mb-6">
              <Wallet className="w-4 h-4" />
              <span>Wallet de crédits QC</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              Un wallet pensé pour la <span className="text-orange-500">confiance</span>
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              Prépaiement simple et transparent. Chaque crédit est tracé, chaque action annoncée avant d'être débitée.
            </p>
          </div>
        </FadeIn>

        {/* 3 piliers clés */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {blocks.map((block, index) => (
            <FadeIn key={block.title} delay={index * 0.1}>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 hover-lift transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                  <block.icon className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">{block.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{block.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Wallet mock complet : onglets solde / transactions / packs / stats */}
        <FadeIn delay={0.25}>
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Navigation onglets */}
              <div className="w-full lg:w-56 flex-shrink-0">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Vue d'ensemble</p>
                <div className="flex lg:flex-col gap-2">
                  {[
                    { id: 'balance' as WalletTab, label: 'Solde & alertes', icon: Wallet },
                    { id: 'transactions' as WalletTab, label: 'Transactions QC', icon: CreditCard },
                    { id: 'packs' as WalletTab, label: 'Packs de crédits', icon: Coins },
                    { id: 'stats' as WalletTab, label: 'Statistiques', icon: LineChart },
                  ].map((tab) => {
                    const active = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${
                          active
                            ? 'bg-slate-800 border-orange-400 text-orange-300'
                            : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Contenu onglet actif */}
              <div className="flex-1 bg-slate-900/60 border border-slate-700 rounded-2xl p-5 sm:p-6">
                {activeTab === 'balance' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Solde actuel</p>
                        <p className="text-3xl font-bold text-white">
                          1 247 <span className="text-base text-slate-400">QC</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 mb-1">Estimation jours restants</p>
                        <p className="text-sm font-semibold text-emerald-300">~7 jours</p>
                      </div>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden mb-4">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-orange-400 w-2/3" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-300">
                      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
                        <p className="font-semibold mb-1">Quand le solde arrive à 0</p>
                        <ul className="space-y-1 list-disc list-inside text-[11px]">
                          <li>Lecture de toutes vos données toujours autorisée</li>
                          <li>Paiement des factures reçu toujours possible</li>
                          <li>Création de nouvelles actions bloquée (scan, exports…)</li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700">
                        <p className="font-semibold mb-1">Alertes configurées</p>
                        <ul className="space-y-1 list-disc list-inside text-[11px]">
                          <li>Solde faible &lt; 200 QC · 1 notification/jour</li>
                          <li>Solde critique &lt; 50 QC · à chaque session</li>
                          <li>Mode lecture seule activé à 0 QC</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'transactions' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Historique des transactions</p>
                        <p className="text-sm text-slate-200">Chaque débit et rechargement QC est tracé.</p>
                      </div>
                      <div className="flex gap-1.5">
                        {[
                          { id: 'all', label: 'Tous' },
                          { id: 'debits', label: 'Débits' },
                          { id: 'purchases', label: 'Achats' },
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setFilter(btn.id as typeof filter)}
                            className={`px-2 py-1 rounded-full text-[11px] border ${
                              filter === btn.id
                                ? 'bg-slate-700 border-slate-400 text-white'
                                : 'border-slate-600 text-slate-400 hover:border-slate-400'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="border border-slate-700 rounded-xl overflow-hidden text-xs text-slate-200">
                      <div className="grid grid-cols-[1.5fr,0.6fr,0.7fr] bg-slate-800/80 px-3 py-2 font-medium">
                        <span>Action</span>
                        <span className="text-right">Mouvement</span>
                        <span className="text-right">Quand</span>
                      </div>
                      <div className="divide-y divide-slate-800">
                        {filteredTransactions.map((tx, i) => (
                          <div key={i} className="grid grid-cols-[1.5fr,0.6fr,0.7fr] px-3 py-2">
                            <span className="truncate">{tx.label}</span>
                            <span
                              className={`text-right font-semibold ${
                                tx.delta > 0 ? 'text-emerald-300' : 'text-orange-300'
                              }`}
                            >
                              {tx.delta > 0 ? `+${tx.delta} QC` : `${tx.delta} QC`}
                            </span>
                            <span className="text-right text-slate-400">{tx.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Export CSV complet disponible depuis l’app (30 QC) pour audit ou comptabilité.
                    </p>
                  </div>
                )}

                {activeTab === 'packs' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Packs de crédits QC</p>
                        <p className="text-sm text-slate-200">
                          Choisissez un pack adapté à votre rythme d&apos;utilisation.
                        </p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {PACKS.map((pack, i) => (
                        <div
                          key={pack.name}
                          className={`rounded-xl border px-3 py-3 text-xs ${
                            i === 1
                              ? 'border-orange-400 bg-slate-800/80'
                              : 'border-slate-700 bg-slate-900/60'
                          }`}
                        >
                          <p className="text-slate-200 font-semibold mb-1">{pack.name}</p>
                          <p className="text-slate-300 mb-1">
                            {pack.credits.toLocaleString()} <span className="text-slate-500">QC</span>
                          </p>
                          <p className="text-slate-400 mb-2">{pack.price.toLocaleString()} FCFA</p>
                          <p className="text-[11px] text-emerald-300 mb-2">
                            {pack.bestFor}
                          </p>
                          <button className="inline-flex items-center gap-1 text-[11px] text-orange-300 hover:text-orange-200">
                            Voir en détail
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Les prix exacts et éventuels bonus (parrainage, promotions) sont gérés côté backend et peuvent évoluer.
                    </p>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div>
                    <div className="mb-4">
                      <p className="text-xs text-slate-400 mb-1">Statistiques d&apos;usage (exemple)</p>
                      <p className="text-sm text-slate-200">
                        Visualisez comment vos crédits sont consommés sur 30 jours.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 text-xs text-slate-200">
                      <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700">
                        <p className="font-semibold mb-2">Vue globale</p>
                        <ul className="space-y-1 text-[11px]">
                          <li>Total achetés : <span className="font-semibold text-emerald-300">12 500 QC</span></li>
                          <li>Total consommés : <span className="font-semibold text-orange-300">8 900 QC</span></li>
                          <li>Solde restant : <span className="font-semibold text-slate-100">3 600 QC</span></li>
                        </ul>
                      </div>
                      <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700">
                        <p className="font-semibold mb-2">Répartition par action</p>
                        <ul className="space-y-1 text-[11px]">
                          <li><span className="text-blue-300">●</span> Scans compteurs : 40%</li>
                          <li><span className="text-amber-300">●</span> Kilo (analyses) : 30%</li>
                          <li><span className="text-emerald-300">●</span> Exports & rapports : 15%</li>
                          <li><span className="text-pink-300">●</span> SMS & notifications : 10%</li>
                          <li><span className="text-slate-400">●</span> Autres : 5%</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Ces statistiques sont calculées à partir des transactions QC, sans jamais exposer vos données sensibles.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
