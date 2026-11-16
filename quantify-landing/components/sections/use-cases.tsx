'use client'

import { useState } from 'react'
import { FadeIn } from '@/components/animations/fade-in'
import {
  ArrowLeft, ArrowRight, Building, GraduationCap, Home, ClipboardList, Users,
  Factory, Hotel, Zap
} from 'lucide-react'

export function UseCasesSection() {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0)
  const useCases = [
    {
      icon: Building,
      title: 'Immeuble : un compteur principal, plusieurs logements',
      context: 'Un compteur principal alimente l’immeuble ; un sous-compteur mesure chaque appartement.',
      solution: 'Quantify compare les relevés et calcule la part de chaque logement, charges communes incluses.',
      benefit: 'Chaque occupant comprend sa facture et peut vérifier son historique.',
    },
    {
      icon: Users,
      title: 'Colocataires et partage des coûts',
      context: 'Plusieurs occupants, un compteur, répartition manuelle.',
      solution: 'Pourcentages définis, sous-factures auto-générées par occupant.',
      benefit: 'Répartition claire et suivi des paiements.',
    },
    {
      icon: GraduationCap,
      title: 'Résidence étudiante — 30 compteurs',
      context: 'Un compteur principal alimente 30 chambres ; les relevés manuels entraînent des erreurs.',
      solution: 'Les relevés sont regroupés, les factures calculées par chambre et les écarts signalés.',
      benefit: 'Facturation en minutes, vue globale.',
    },
    {
      icon: ClipboardList,
      title: 'Audit fournisseur & réclamation',
      context: 'Facture contestée, besoin de preuves.',
      solution: 'Journal immuable, exports certifiés, vue Lecture pour l\'auditeur.',
      benefit: 'Preuves numériques et processus structuré.',
    },
    {
      icon: Home,
      title: 'Famille multi-sources',
      context: 'Prépayé + solaire + groupe, aucune vision consolidée.',
      solution: 'Compteurs virtuels par usage, projections budgétaires.',
      benefit: 'Pilotage budgétaire et détection des dérives.',
    },
    {
      icon: Factory,
      title: 'Site industriel multi-zones',
      context: 'Plusieurs compteurs par zone de production.',
      solution: 'Arborescence à 5 niveaux, ratios et simulation.',
      benefit: 'Optimisation par zone, ROI mesurable.',
    },
    {
      icon: Hotel,
      title: 'Hôtel ou résidence de tourisme',
      context: 'Compteurs par chambre, rotation de clients.',
      solution: 'Liaison/déliaison rapide, facturation par séjour.',
      benefit: 'Transparence client, gestion simplifiée.',
    },
    {
      icon: Zap,
      title: 'Collectivité locale',
      context: 'Suivi énergétique des bâtiments publics.',
      solution: 'Dashboard multi-sites, alertes anomalies, exports conformes.',
      benefit: 'Maîtrise budgétaire et reporting.',
    },
  ]
  const activeCase = useCases[activeCaseIndex]

  return (
    <section id="cas-usage" className="py-12 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-900 px-4 py-2 text-sm font-bold text-white sm:mb-6">
              Cas concrets déjà modélisés
            </div>
            <h2 className="mb-3 text-2xl font-extrabold leading-tight text-slate-900 sm:mb-4 sm:text-4xl lg:text-5xl">
              Un compteur principal, plusieurs logements
            </h2>
            <p className="text-base sm:text-lg text-slate-700">
              Pour un immeuble, une colocation ou une résidence : suivez les compteurs et comprenez la part de chacun.
            </p>
          </div>
        </FadeIn>

        {/* One focused, complete case at a time keeps the mobile view glanceable. */}
        <div className="lg:hidden">
          <div className="mb-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setActiveCaseIndex((index) => (index - 1 + useCases.length) % useCases.length)}
              aria-label="Afficher le cas précédent"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 transition hover:border-blue-900 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2" aria-live="polite">
              <span className="text-sm font-bold text-slate-900">{activeCaseIndex + 1}</span>
              <span className="text-sm text-slate-500">/ {useCases.length} cas</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveCaseIndex((index) => (index + 1) % useCases.length)}
              aria-label="Afficher le cas suivant"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5"
            role="group"
            aria-roledescription="carrousel"
            aria-label="Cas d’usage énergétiques"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white">
                <activeCase.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold leading-snug text-slate-900 sm:text-base">{activeCase.title}</h3>
            </div>
            <div className="mt-4 space-y-3 text-[13px] leading-relaxed text-slate-700 sm:text-sm">
              <p><span className="font-semibold text-slate-900">Contexte :</span> {activeCase.context}</p>
              <p><span className="font-semibold text-slate-900">Solution :</span> {activeCase.solution}</p>
              <p className="font-semibold text-orange-600">{activeCase.benefit}</p>
            </div>
          </div>

        </div>

        <div className="hidden gap-4 lg:grid lg:grid-cols-3">
          {useCases.map((uc, index) => (
            <FadeIn key={uc.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-slate-200 bg-slate-50 p-5 hover-lift transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <uc.icon className="w-4 h-4 text-blue-900" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{uc.title}</h3>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  <span className="font-semibold text-slate-800">Contexte :</span> {uc.context}
                </p>
                <p className="text-xs text-slate-600 mb-2">
                  <span className="font-semibold text-slate-800">Solution :</span> {uc.solution}
                </p>
                <p className="text-xs font-semibold text-orange-500">{uc.benefit}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
