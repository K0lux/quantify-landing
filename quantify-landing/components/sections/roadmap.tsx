// ============================================
// components/sections/roadmap.tsx
// ============================================
'use client'

import { Calendar, CheckCircle, Clock, Rocket } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'

export function RoadmapSection() {
  const timeline = [
    {
      year: "T4 2024",
      title: "Création de Quantify",
      description: "Les 3 co-fondateurs se rencontrent et partagent leur vision",
      status: "completed"
    },
    {
      year: "T1 2025",
      title: "Lancement Beta Togo",
      description: "MVP avec OCR, dashboard et paiements Flooz/YasTogo",
      status: "current"
    },
    {
      year: "T4 2025",
      title: "200K Utilisateurs",
      description: "Atteindre 200,000 utilisateurs actifs au Togo",
      status: "upcoming"
    },
    {
      year: "2027",
      title: "Expansion UEMOA",
      description: "5 pays: Bénin, Ghana, Côte d'Ivoire, Sénégal, Burkina",
      status: "upcoming"
    },
    {
      year: "2030",
      title: "20M Utilisateurs",
      description: "Présence dans 20+ pays africains",
      status: "upcoming"
    },
    {
      year: "2035+",
      title: "Leader Global",
      description: "200M utilisateurs, expansion mondiale",
      status: "upcoming"
    }
  ]

  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-medium mb-6">
            <Calendar className="w-4 h-4" />
            <span>Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
            Notre Feuille de Route
          </h2>
          <p className="text-lg sm:text-xl text-slate-600">
            De la vision à la réalité, étape par étape
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="relative pl-20">
                  <div className={`absolute left-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    item.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                    item.status === 'current' ? 'bg-gradient-to-br from-yellow-500 to-orange-600 ring-4 ring-yellow-500/30' :
                    'bg-gradient-to-br from-slate-400 to-slate-500'
                  }`}>
                    {item.status === 'completed' && <CheckCircle className="w-8 h-8" />}
                    {item.status === 'current' && <Rocket className="w-8 h-8" />}
                    {item.status === 'upcoming' && <Clock className="w-8 h-8" />}
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-blue-600">{item.year}</span>
                      {item.status === 'current' && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                          En cours
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}