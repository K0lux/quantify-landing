import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowUpRight, Mail } from 'lucide-react'
import { DashboardPageIntro } from '@/components/dashboard/page-intro'

export const metadata: Metadata = {
  title: 'Aide - Quantify',
  description: 'Trouvez de l’aide sur votre compte, votre position et vos parrainages.',
}

const answers = [
  {
    question: 'Comment ma place sur la liste évolue-t-elle ?',
    answer: 'Votre place est enregistrée sur votre compte. Une inscription faite avec votre lien de parrainage peut la faire avancer de 5 places.',
  },
  {
    question: 'Quand recevrai-je une invitation ?',
    answer: 'Votre statut se met à jour dès que Quantify envoie une invitation. L’e-mail associé à votre compte reste votre adresse de contact.',
  },
  {
    question: 'Pourquoi un parrainage n’apparaît-il pas encore ?',
    answer: 'Le parrainage est comptabilisé après l’inscription complète de la personne avec votre lien. Vérifiez qu’elle a utilisé le lien contenant votre code.',
  },
]

export default function DashboardHelpPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DashboardPageIntro
        eyebrow="Assistance"
        title="Aide"
        description="Réponses aux questions courantes sur votre compte Quantify."
      />

      <section className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5 sm:px-7">
        {answers.map((item) => (
          <article key={item.question} className="py-5 first:pt-6 last:pb-6">
            <h2 className="font-semibold text-slate-950">{item.question}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" aria-hidden="true" />
          <div>
            <h2 className="font-semibold text-slate-950">Besoin d’une réponse personnalisée ?</h2>
            <p className="mt-1 text-sm text-slate-600">Écrivez à l’équipe Quantify depuis le formulaire de contact.</p>
          </div>
        </div>
        <Link href="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
          Contacter Quantify <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
