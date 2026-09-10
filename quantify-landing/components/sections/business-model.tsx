'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/animations/fade-in'
import {
  Coins, Camera, BarChart3, Bot, FileText, Share2,
  Store, Search, ShoppingCart, MessageCircle,
  Briefcase, Wrench, ClipboardList, Star,
  ArrowRight, Check
} from 'lucide-react'

const modules = [
  {
    id: 'meters',
    icon: BarChart3,
    label: 'Quantify Meters',
    steps: [
      { icon: Camera, label: 'Scan', cost: '5 QC' },
      { icon: BarChart3, label: 'Suivi', cost: 'Gratuit' },
      { icon: Bot, label: 'Kilo IA', cost: '10 QC' },
      { icon: FileText, label: 'Facture', cost: '3 QC' },
      { icon: Share2, label: 'Partage', cost: 'Gratuit' },
    ],
  },
  {
    id: 'products',
    icon: Store,
    label: 'Market — Produits',
    steps: [
      { icon: Search, label: 'Recherche', cost: 'Gratuit' },
      { icon: Store, label: 'Vitrine', cost: 'Lead Fee' },
      { icon: MessageCircle, label: 'Contact', cost: '50 QC' },
      { icon: ShoppingCart, label: 'Commande', cost: '5-10%' },
      { icon: Star, label: 'Avis', cost: 'Trust Score' },
    ],
  },
  {
    id: 'services',
    icon: Briefcase,
    label: 'Market — Services',
    steps: [
      { icon: Search, label: 'Demande', cost: 'Gratuit' },
      { icon: Wrench, label: 'Matching', cost: 'Lead Fee' },
      { icon: ClipboardList, label: 'Devis', cost: 'Comparé' },
      { icon: Briefcase, label: 'Mission', cost: '8%' },
      { icon: Star, label: 'Review', cost: 'Trust Score' },
    ],
  },
]

const plans = [
  {
    name: 'Découverte',
    price: '500',
    unit: 'FCFA',
    desc: 'Pour tester Quantify',
    features: ['Premiers crédits QC', 'Scan de compteurs', 'Alertes coupures', 'Accès Kilo basique', 'Paiement mobile money'],
    popular: false,
  },
  {
    name: 'Usage régulier',
    price: 'Packs',
    unit: 'optimisés',
    desc: 'Pour gestionnaires actifs',
    features: ['Packs QC mieux valorisés', 'Analyses avancées Kilo', 'Relances automatisées', 'Alertes à grande échelle', 'Historique détaillé QC'],
    popular: true,
  },
  {
    name: 'B2B / Utilities',
    price: 'Sur mesure',
    unit: '',
    desc: 'Pour entreprises et fournisseurs',
    features: ['Intégration SI existant', 'Dashboard entreprise & API', 'Grille tarifaire personnalisée', 'Analytics avancées', 'Support dédié 24/7'],
    popular: false,
  },
]

export function BusinessModelSection() {
  const [activeModule, setActiveModule] = useState(0)
  const current = modules[activeModule]

  return (
    <section id="business-model" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-600 font-bold text-sm mb-6">
              <Coins className="w-4 h-4" />
              <span>Modèle économique</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Trois modules, <span className="text-orange-500">un écosystème</span>
            </h2>
            <p className="text-lg text-slate-700">
              Prépaiement par action, zéro abonnement, transparence totale.
            </p>
          </div>
        </FadeIn>

        {/* Module tabs + flow */}
        <FadeIn delay={0.1}>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-12">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              {modules.map((mod, idx) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveModule(idx)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-bold transition-all ${
                    activeModule === idx
                      ? 'bg-blue-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <mod.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mod.label}</span>
                </button>
              ))}
            </div>

            {/* Flow */}
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
                {current.steps.map((step, i, arr) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex flex-col items-center gap-2 min-w-[90px]">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                        <step.icon className="w-6 h-6 text-blue-900" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{step.label}</span>
                      <span className="text-xs text-orange-500 font-semibold">{step.cost}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-slate-300 hidden sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 pb-6">
              {modules.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModule(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeModule === idx ? 'w-8 bg-blue-900' : 'w-2 bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Pricing cards */}
        <FadeIn delay={0.2}>
          <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative bg-white rounded-2xl border p-6 sm:p-8 hover-lift transition-all duration-300 ${
                  plan.popular ? 'border-orange-500 ring-1 ring-orange-500' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    Le plus populaire
                  </div>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-600 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">{plan.price}</span>
                  {plan.unit && <span className="text-sm text-slate-500 ml-2">{plan.unit}</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.popular
                      ? 'bg-blue-900 text-white hover:bg-blue-800'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {plan.price === 'Sur mesure' ? 'Nous contacter' : 'Commencer'}
                </button>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Revenue summary */}
        <FadeIn delay={0.3}>
          <div className="bg-blue-900 rounded-3xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              {[
                { value: 'Pay-per-use', label: 'Crédits QC', desc: 'Prépaiement par action' },
                { value: '5-10%', label: 'Commissions Market', desc: 'Sur ventes et missions' },
                { value: '50-100 QC', label: 'Lead Fees', desc: 'Par demande qualifiée' },
              ].map((item, i) => (
                <div key={i} className="text-white">
                  <p className="text-2xl sm:text-3xl font-bold mb-1">{item.value}</p>
                  <p className="text-sm font-bold text-orange-400">{item.label}</p>
                  <p className="text-xs text-white/50 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
