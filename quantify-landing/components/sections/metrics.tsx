// ============================================
// components/sections/metrics.tsx
// ============================================
'use client'

import { TrendingUp, BarChart3, Star, Heart, Trophy, Award, Zap } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'
import { AnimatedCounter } from '@/components/animations/counter'

export function MetricsSection() {
  return (
    <section className="py-20 sm:py-32 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-yellow-300 font-medium mb-6">
            <Trophy className="w-4 h-4" />
            <span>Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Des résultats qui parlent
          </h2>
          <p className="text-lg sm:text-xl text-slate-300">
            Nos objectifs de performance dépassent les standards de l&apos;industrie
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              metric: "35", 
              suffix: "%",
              label: "Rétention J1", 
              comparison: "vs 26% moyenne",
              icon: TrendingUp,
              color: "from-green-500 to-emerald-500"
            },
            { 
              metric: "19.1", 
              label: "Minutes/session", 
              comparison: "Engagement élevé",
              icon: BarChart3,
              color: "from-blue-500 to-cyan-500"
            },
            { 
              metric: "50", 
              prefix: ">",
              label: "NPS Ciblé", 
              comparison: "Satisfaction client",
              icon: Star,
              color: "from-yellow-500 to-orange-500"
            },
            { 
              metric: "15", 
              suffix: "%",
              label: "Économies CO₂", 
              comparison: "Impact environnemental",
              icon: Heart,
              color: "from-purple-500 to-pink-500"
            }
          ].map((item, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {item.prefix}<AnimatedCounter end={parseFloat(item.metric)} />{item.suffix}
                </div>
                <div className="text-lg font-semibold text-white mb-1">{item.label}</div>
                <div className="text-sm text-slate-400">{item.comparison}</div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn delay={0}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Rétention vs Industrie
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Quantify (Objectif)", value: 35, color: "bg-green-500" },
                  { label: "Apps Financières", value: 11.6, color: "bg-blue-500" },
                  { label: "Moyenne Apps", value: 26, color: "bg-slate-500" }
                ].map((bar, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-300">{bar.label}</span>
                      <span className="text-sm font-bold">{bar.value}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${bar.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(bar.value / 35) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-400" />
                Sources de Validation
              </h3>
              <div className="space-y-4">
                {[
                  { source: "AppsFlyer", year: "2023", metric: "Benchmarks rétention" },
                  { source: "Adjust", year: "2022", metric: "Apps financières" },
                  { source: "Mistplay", year: "2023", metric: "DAU/MAU ratios" },
                  { source: "Sendbird", year: "2024", metric: "Onboarding J1" }
                ].map((source, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{source.source} ({source.year})</div>
                      <div className="text-xs text-slate-400">{source.metric}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}