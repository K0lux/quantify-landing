// ============================================
// components/sections/investors.tsx
// ============================================
'use client'

import { Rocket, Target, Trophy, Award, DollarSign, TrendingUp, CheckCircle, Mail, Users, ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'
import Link from 'next/link'

interface InvestorsSectionProps {
  onJoinWaitlist: () => void
}

export function InvestorsSection({ onJoinWaitlist }: InvestorsSectionProps) {
  const fundingRounds = [
    {
      stage: "Seed",
      year: "2025",
      amount: "25M FCFA",
      use: "MVP + Lancement Togo",
      status: "En cours"
    },
    {
      stage: "Series A",
      year: "2027",
      amount: "5-10M USD",
      use: "Expansion UEMOA (5 pays)",
      status: "Prévu"
    },
    {
      stage: "Series B",
      year: "2030",
      amount: "20-50M USD",
      use: "Expansion Afrique (20+ pays)",
      status: "Prévu"
    },
    {
      stage: "Series C/D",
      year: "2035+",
      amount: "100M+ USD",
      use: "Leadership global",
      status: "Prévu"
    }
  ]

  const partners = [
    { name: "Investment Readiness", type: "Programme gov. Togo" },
    { name: "Digital Africa", type: "Seed Fund" },
    { name: "PROPARCO", type: "500K-3M EUR Equity" },
    { name: "FasterCapital", type: "Support technique" }
  ]

  return (
    <section id="investisseurs" className="py-20 sm:py-32 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Investissement</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Investissez dans l&apos;avenir de l&apos;énergie
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">
            Rejoignez-nous pour façonner la révolution énergétique en Afrique et au-delà
          </p>
        </div>

        {/* Funding Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Stratégie de Levée de Fonds</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fundingRounds.map((round, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500 ${
                  round.status === 'En cours' ? 'ring-2 ring-yellow-500' : ''
                }`}>
                  {round.status === 'En cours' && (
                    <div className="inline-block px-3 py-1 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full mb-4">
                      {round.status}
                    </div>
                  )}
                  <h4 className="text-xl font-bold mb-2">{round.stage}</h4>
                  <p className="text-slate-400 text-sm mb-4">{round.year}</p>
                  <div className="text-3xl font-bold text-yellow-400 mb-3">{round.amount}</div>
                  <p className="text-slate-300 text-sm">{round.use}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Why Invest */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <FadeIn delay={0}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Pourquoi Investir ?
              </h3>
              <ul className="space-y-4">
                {[
                  "Marché en croissance : 5%/an d'électrification en Afrique",
                  "Technologie scalable sans matériel coûteux",
                  "Revenus prouvés : 1.59B FCFA dès 2025",
                  "Impact durable : environnemental & social",
                  "Équipe togolaise passionnée et expérimentée"
                ].map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-400" />
                Projections ROI
              </h3>
              <div className="space-y-6">
                {[
                  { year: "2025", users: "200K", revenue: "1.59B FCFA" },
                  { year: "2027", users: "2M", revenue: "15.9B FCFA" },
                  { year: "2030", users: "20M", revenue: "159B FCFA" },
                  { year: "2035+", users: "200M", revenue: "1590B FCFA" }
                ].map((projection, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-bold text-lg">{projection.year}</div>
                      <div className="text-slate-400 text-sm">{projection.users} utilisateurs</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-green-400">{projection.revenue}</div>
                      <div className="text-slate-400 text-sm">Revenus annuels</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Partners */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Partenaires & Financeurs Potentiels</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold mb-2">{partner.name}</h4>
                  <p className="text-sm text-slate-400">{partner.type}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Façonnons ensemble l&apos;avenir de l&apos;énergie
          </h3>
          <p className="text-lg text-slate-800 mb-8 max-w-2xl mx-auto">
            Avec 20M FCFA, nous lançons au Togo en 2025. Avec 5-10M USD, nous conquérons l&apos;Afrique de l&apos;Ouest d&apos;ici 2028.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all duration-300 hover:scale-105">
              <Mail className="w-5 h-5" />
              Devenir investisseur
            </button>
            <button 
              onClick={onJoinWaitlist}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105"
            >
              <Users className="w-5 h-5" />
              Rejoindre la liste d&apos;attente
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}