'use client'

import { FadeIn } from '@/components/animations/fade-in'

const faqs = [
  {
    question: 'Quels types de compteurs Quantify supporte-t-il ?',
    answer: 'Compteurs prépayés (Cash Power), compteurs mécaniques continus, solaire, groupes électrogènes. Vous pouvez aussi créer des compteurs virtuels pour agréger plusieurs sources.',
  },
  {
    question: 'Quelle est la différence entre compteur mère, lié, virtuel et vue ?',
    answer: 'Le mère est le compteur physique principal, le lié est rattaché à un mère ou autonome, le virtuel agrège plusieurs sources sans modifier les données physiques, et la vue est un accès sécurisé partagé.',
  },
  {
    question: 'Que se passe-t-il sans connexion internet ?',
    answer: 'Les relevés peuvent être saisis hors-ligne et synchronisés plus tard avec leur horodatage réel. Les alertes passent par SMS dès que la connexion revient.',
  },
  {
    question: 'Comment sont gérées la sécurité et les permissions ?',
    answer: 'Toutes les actions passent par un middleware de permissions côté serveur. Les vues ne peuvent jamais donner plus de droits que le créateur. Chaque action est journalisée.',
  },
  {
    question: 'Les calculs de facturation sont-ils auditables ?',
    answer: 'Oui. Chaque calcul est stocké avec ses paramètres et sa version d\'algorithme, pour pouvoir être rejoué à l\'identique en cas de contestation.',
  },
  {
    question: 'Quantify est-il disponible en dehors du Togo ?',
    answer: 'Le lancement est au Togo, mais l\'architecture est conçue pour s\'étendre à toute l\'Afrique de l\'Ouest et au-delà. Les compteurs analogiques existent en Inde, au Brésil, en Pologne, etc.',
  },
  {
    question: 'Quels sont les coûts pour un particulier, un propriétaire ou un gestionnaire ?',
    answer: 'L’utilisation de Quantify est gratuite pour un particulier. Les propriétaires, gestionnaires ou administrateurs peuvent avoir une offre payante selon leurs besoins et leurs cas d’utilisation.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-slate-700">
              Compteurs, relevés, factures et suivi de votre consommation.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FadeIn key={faq.question} delay={index * 0.04}>
              <details className="group rounded-2xl border border-slate-200 bg-white px-5 py-4 hover-lift transition-all">
                <summary className="flex cursor-pointer items-center justify-between gap-3 list-none">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <span className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-600 transition-transform group-open:rotate-45 flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
