'use client'

import { Linkedin, Mail, Github, Users } from 'lucide-react'
import { FadeIn } from '@/components/animations/fade-in'

export function TeamSection() {
  const team = [
    {
      name: 'Kassa Malipita Luc',
      role: 'CEO & Co-Founder',
      subtitle: 'Visionnaire & Stratège',
      achievement: 'De 0 à 200K utilisateurs en 1 an',
      skills: ['Stratégie', 'Fundraising', 'Leadership', 'Growth Hacking'],
      initial: 'KL',
      socials: { linkedin: '#', email: 'kassaluc9770@gmail.com' },
    },
    {
      name: 'Banakinao Irin Yolim',
      role: 'CTO Frontend & Co-Founder',
      subtitle: 'Expert UX & Mobile',
      achievement: 'Co-fondateur Laitify — Rétention 35%',
      skills: ['React/Next.js', 'Flutter', 'UX Design', 'Mobile-First'],
      initial: 'BY',
      socials: { linkedin: '#', github: '#', email: 'banakinao@quantify.app' },
    },
    {
      name: 'Hafiz Boukari',
      role: 'CTO Backend & Co-Founder',
      subtitle: 'Architecte Scalable',
      achievement: 'Ex-Lead Backend — Scale 200M users',
      skills: ['Go', 'PostgreSQL', 'Microservices', 'Cloud'],
      initial: 'HB',
      socials: { linkedin: '#', github: '#', email: 'hafiz@quantify.app' },
    },
  ]

  return (
    <section id="equipe" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 rounded-full text-white text-sm font-bold mb-6">
              <Users className="w-4 h-4" />
              <span>L&apos;équipe</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              Une équipe <span className="text-orange-500">passionnée</span>
            </h2>
            <p className="text-lg text-slate-700">
              Des experts togolais prêts à transformer la gestion énergétique en Afrique.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {team.map((member, index) => (
            <FadeIn key={index} delay={index * 0.15}>
              <div className="group bg-white border border-slate-200 rounded-2xl p-8 hover-lift transition-all duration-500 text-center">
                <div className="w-20 h-20 bg-blue-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {member.initial}
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-blue-900 mb-1">{member.role}</p>
                <p className="text-xs text-slate-500 mb-4">{member.subtitle}</p>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-4">
                  <p className="text-xs text-slate-800 font-medium">{member.achievement}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                  {member.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center gap-2">
                  {member.socials.linkedin && (
                    <a href={member.socials.linkedin} className="w-8 h-8 bg-slate-100 hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                      <Linkedin className="w-4 h-4 text-slate-600" />
                    </a>
                  )}
                  {member.socials.github && (
                    <a href={member.socials.github} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <Github className="w-4 h-4 text-slate-600" />
                    </a>
                  )}
                  <a href={`mailto:${member.socials.email}`} className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                    <Mail className="w-4 h-4 text-slate-600" />
                  </a>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Mission */}
        <FadeIn delay={0.5}>
          <div className="bg-blue-900 rounded-3xl p-8 sm:p-12 text-white text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">Notre Mission</h3>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Démocratiser l&apos;accès à une gestion énergétique transparente et efficace pour chaque foyer africain,
              tout en créant un écosystème de commerce et de services locaux de confiance.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
