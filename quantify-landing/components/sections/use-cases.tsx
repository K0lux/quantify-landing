'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  Building, GraduationCap, Home, ClipboardList, Users,
  Factory, Hotel, Store, Wrench, Zap
} from 'lucide-react'

export function UseCasesSection() {
  const useCases = [
    {
      icon: Building,
      title: 'Immeuble locatif multi-compteurs',
      context: 'Compteur mère + compteurs liés par appartement, charges communes difficiles.',
      solution: 'Quantify calcule automatiquement l\'écart et répartit la facture.',
      benefit: 'Moins de litiges, factures compréhensibles.',
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
      context: '1 mère, 30 chambres, relevés manuels, erreurs fréquentes.',
      solution: 'Scans agrégés, facturation de masse, alertes par chambre.',
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
      icon: Store,
      title: 'Commerçant sur Quantify Market',
      context: 'Besoin de visibilité locale sans site web.',
      solution: 'Vitrine reliée au wallet QC, leads multi-canal.',
      benefit: 'Nouveaux clients, revenus mesurables.',
    },
    {
      icon: Wrench,
      title: 'Prestataire de services',
      context: 'Électricien indépendant, pas de plateforme de réservation.',
      solution: 'Profil vérifié, devis structuré, missions planifiées.',
      benefit: 'Clients qualifiés, Trust Score croissant.',
    },
    {
      icon: Zap,
      title: 'Collectivité locale',
      context: 'Suivi énergétique des bâtiments publics.',
      solution: 'Dashboard multi-sites, alertes anomalies, exports conformes.',
      benefit: 'Maîtrise budgétaire et reporting.',
    },
  ]

  return (
    <section id="cas-usage" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-4 py-2 text-sm font-bold text-white mb-6">
              Cas d&apos;usage concrets
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">
              Des scénarios <span className="text-orange-500">réels</span>, déjà modélisés
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
