
// ============================================
// app/(marketing)/equipe/page.tsx
// ============================================
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'
import { Linkedin, Mail, Github, Twitter, Heart, Award, Target, Rocket } from 'lucide-react'
import Link from 'next/link'
import { ViewportAnimation } from '@/components/optimizations/viewport-animation'

export const metadata: Metadata = generateMetadata({
  title: 'Notre Équipe - Quantify | Passion & Expertise Togolaise',
  description: 'Rencontrez l\'équipe derrière Quantify : des experts togolais passionnés par la transformation énergétique de l\'Afrique.',
  keywords: ['équipe quantify', 'founders', 'startup Togo', 'équipe tech Afrique'],
})

export default function EquipePage() {
  const team = [
    {
      name: "Kassa Malipita Luc",
      role: "CEO & Co-Founder",
      subtitle: "Visionnaire & Stratège",
      bio: "Entrepreneur passionné par l'innovation technologique en Afrique. Expert en stratégie de croissance et levée de fonds.",
      achievement: "De 0 à 200K utilisateurs en 1 an",
      skills: ["Stratégie", "Fundraising", "Leadership", "Growth Hacking"],
      gradient: "from-blue-600 to-purple-600",
      initial: "KL",
      quote: "L'énergie est un droit fondamental. Quantify le rend accessible et transparent pour tous.",
      socials: {
        linkedin: "https://linkedin.com/in/kassa-luc",
        email: "kassaluc9770@gmail.com",
        twitter: "https://twitter.com/kassaluc"
      }
    },
    {
      name: "Banakinao Irin Yolim",
      role: "CTO Frontend & Co-Founder",
      subtitle: "Expert UX & Mobile",
      bio: "Architecte frontend avec 5+ ans d'expérience. Co-fondateur de Laitify. Spécialiste en design d'interfaces intuitives.",
      achievement: "Co-fondateur Laitify • Rétention 35%",
      skills: ["React/Next.js", "Flutter", "UX Design", "Mobile-First"],
      gradient: "from-purple-600 to-pink-600",
      initial: "BY",
      quote: "Une interface simple cache souvent des années de réflexion. C'est notre mission chez Quantify.",
      socials: {
        linkedin: "https://linkedin.com/in/banakinao",
        github: "https://github.com/banakinao",
        email: "banakinao@quantify.app"
      }
    },
    {
      name: "Hafiz Boukari",
      role: "CTO Backend & Co-Founder",
      subtitle: "Architecte Scalable",
      bio: "Expert en architecture distribuée et systèmes haute performance. Ex-Lead Backend chez [Entreprise]. Capable de gérer 200M+ d'utilisateurs.",
      achievement: "Ex-Lead Backend • Scale 200M users",
      skills: ["Go", "PostgreSQL", "Microservices", "Cloud Architecture"],
      gradient: "from-orange-600 to-red-600",
      initial: "HB",
      quote: "Un bon système backend, c'est comme l'électricité : il doit être toujours disponible, invisible et fiable.",
      socials: {
        linkedin: "https://linkedin.com/in/hafiz-boukari",
        github: "https://github.com/hafizboukari",
        email: "hafiz@quantify.app"
      }
    }
  ]

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Nous aimons ce que nous faisons et croyons profondément en notre mission",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Target,
      title: "Excellence",
      description: "Nous visons toujours la meilleure qualité dans chaque détail",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de ce qui est possible",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Award,
      title: "Impact",
      description: "Nous mesurons notre succès par l'impact positif que nous créons",
      color: "from-green-500 to-emerald-500"
    }
  ]

  const timeline = [
    {
      year: "2024",
      event: "Création de Quantify",
      description: "Les 3 co-fondateurs se rencontrent et partagent leur vision d'une Afrique énergétiquement autonome"
    },
    {
      year: "T4 2024",
      event: "Développement MVP",
      description: "Début du développement avec focus sur l'OCR et l'expérience utilisateur"
    },
    {
      year: "T1 2025",
      event: "Lancement Beta",
      description: "Lancement de la beta au Togo avec les premiers utilisateurs"
    },
    {
      year: "2025",
      event: "200K Utilisateurs",
      description: "Objectif: atteindre 200,000 utilisateurs actifs au Togo"
    },
    {
      year: "2027",
      event: "Expansion Régionale",
      description: "Expansion dans 5 pays de l'UEMOA"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-yellow-300 font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>Made with ❤️ in Togo</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              L&apos;adapte Équipe Quantify
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-8">
              Trois experts togolais unis par une vision : rendre l&apos;adapte énergie accessible et transparente pour tous
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {team.map((member, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className={`w-full aspect-square max-w-md mx-auto bg-gradient-to-br ${member.gradient} rounded-3xl flex items-center justify-center text-white text-9xl font-bold shadow-2xl hover:scale-105 transition-transform duration-300`}>
                      {member.initial}
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                      {member.name}
                    </h2>
                    <p className="text-xl font-semibold text-slate-700 mb-2">
                      {member.role}
                    </p>
                    <p className="text-lg text-slate-600 mb-6">
                      {member.subtitle}
                    </p>

                    <p className="text-slate-700 mb-6 leading-relaxed">
                      {member.bio}
                    </p>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <p className="text-sm font-bold text-slate-900 mb-1">
                        🏆 Réalisation clé
                      </p>
                      <p className="text-sm text-slate-700">
                        {member.achievement}
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-bold text-slate-900 mb-3">Expertises</p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <blockquote className="border-l-4 border-blue-600 pl-4 py-2 italic text-slate-600 mb-6">
                      {member.quote}
                    </blockquote>

                    <div className="flex gap-3">
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.socials.github && (
                        <a
                          href={member.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-slate-800 hover:bg-slate-900 text-white rounded-lg flex items-center justify-center transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.socials.email && (
                        <a
                          href={`mailto:${member.socials.email}`}
                          className="w-10 h-10 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg flex items-center justify-center transition-colors"
                          aria-label="Email"
                        >
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                      {member.socials.twitter && (
                        <a
                          href={member.socials.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ce qui nous guide au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600">
                    {value.description}
                  </p>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Notre Histoire
            </h2>
            <p className="text-lg text-slate-600">
              Le début d&apos;adapte une grande aventure
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <ViewportAnimation key={index} delay={index * 0.1}>
                  <div className="relative pl-20">
                    <div className="absolute left-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {item.year}
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {item.event}
                      </h3>
                      <p className="text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ViewportAnimation>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Rejoignez Notre Aventure
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Nous recrutons des talents passionnés pour transformer l&apos;Afrique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:shadow-2xl transition-all"
            >
              <Mail className="w-5 h-5" />
              Nous contacter
            </Link>
            <Link
              href="/rejoindre"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/30 transition-all"
            >
              Rejoindre la Waitlist
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}