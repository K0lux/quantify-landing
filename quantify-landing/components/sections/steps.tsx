// ============================================
// components/sections/steps.tsx
// ============================================
'use client'

import { Camera, CheckCircle, ShieldCheck, Workflow } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'

export function StepsSection() {
  const steps = [
    {
      step: 1,
      icon: Camera,
      title: "Choix de la méthode d’identification",
      description:
        "Pour chaque nouveau compteur, vous choisissez comment l’identifier : QR Code Quantify, code alphanumérique ou signature visuelle du compteur.",
      details: [
        "QR Code généré par Quantify ou déjà apposé sur le compteur",
        "Code alphanumérique normalisé à partir du numéro de série",
        "Signature visuelle basée sur plusieurs photos ou une courte vidéo"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      step: 2,
      icon: ShieldCheck,
      title: "Association physique & empreinte composite",
      description:
        "Vous capturez une photo nette du compteur. Quantify vérifie qu’il n’existe pas déjà dans le système avant de lier définitivement l’application au compteur physique.",
      details: [
        "Photo obligatoire du compteur avec le code ou le QR visible",
        "Vérification d’unicité sur QR, code alphanumérique et signature visuelle",
        "Création d’une empreinte composite immuable pour tous les scans futurs"
      ],
      gradient: "from-slate-700 to-slate-900"
    },
    {
      step: 3,
      icon: Workflow,
      title: "Relevé initial & paramètres de facturation",
      description:
        "Quantify extrait automatiquement la valeur affichée (index ou solde prépayé), que vous confirmez avant de configurer vos premiers paramètres de facturation.",
      details: [
        "OCR appliqué sur la photo avec score de confiance affiché",
        "Index initial (mécanique) ou solde restant (prépayé) enregistrés",
        "Tarif, tranches et délais de paiement configurés dès le départ"
      ],
      gradient: "from-amber-500 to-orange-500"
    },
    {
      step: 4,
      icon: CheckCircle,
      title: "Validation atomique & activation du compteur",
      description:
        "Un écran de récapitulatif vous permet de vérifier toutes les informations avant d’activer définitivement le compteur dans Quantify.",
      details: [
        "Vérification finale de doublon et transaction tout-ou-rien",
        "Passage automatique du statut « brouillon » à « actif »",
        "Suggestions guidées : lier des sous-compteurs, créer un virtuel, configurer les tranches"
      ],
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <section id="comment-ca-marche" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            <span>Comment Quantify initialise vos compteurs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Un pipeline d’initialisation en 4 phases
          </h2>
            <p className="text-lg sm:text-xl text-slate-600">
              De la première photo à l’activation finale, chaque compteur suit le même parcours : identification, preuve
              physique, relevé initial, validation atomique. Les brouillons peuvent être repris à tout moment.
            </p>
        </div>

        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-16">
          {steps.map((step, index) => (
            <FadeIn key={step.step} delay={index * 0.2}>
              <div className="relative">
                {/* Step number */}
                <div className="absolute -left-4 top-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-100 z-10">
                  <span className="text-lg font-bold text-slate-900">{step.step}</span>
                </div>

                {/* Content card */}
                <div className="group bg-white rounded-2xl p-8 ml-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Benefits */}
                      <div className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-2 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-200 to-purple-200" />
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center">
          <FadeIn delay={0.8}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ne soyez plus jamais surpris par une coupure
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Rejoignez les premiers utilisateurs de Quantify qui transforment les délestages en événements prévisibles et
                gérables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                  Créer mon compte gratuit
                </button>
                <button className="px-8 py-4 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors backdrop-blur-sm">
                  Découvrir les fonctionnalités délestage
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}