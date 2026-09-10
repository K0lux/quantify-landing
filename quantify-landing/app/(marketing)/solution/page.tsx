
// ============================================
// app/(marketing)/solution/page.tsx
// ============================================
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  Camera, BarChart3, Wallet, Share2, Wifi, Globe, 
  Shield, Zap, CheckCircle, ArrowRight, Sparkles 
} from 'lucide-react'
import Link from 'next/link'
import { ViewportAnimation } from '@/components/optimizations/viewport-animation'

export const metadata: Metadata = generateMetadata({
  title: 'Solution Quantify - Gestion Énergétique Intelligente',
  description: 'Découvrez comment Quantify révolutionne la gestion énergétique avec l\'OCR, l\'IA et le paiement mobile. Sans matériel supplémentaire.',
  keywords: ['solution quantify', 'OCR compteur', 'IA énergie', 'paiement mobile énergie'],
})

export default function SolutionPage() {
  const features = [
    {
      icon: Camera,
      title: "Numérisation OCR/IA",
      description: "Scannez votre compteur analogique avec votre smartphone. Notre IA reconnaît instantanément les chiffres avec 98% de précision.",
      benefits: [
        "Reconnaissance instantanée en <2 secondes",
        "Fonctionne sur tous les smartphones",
        "Historique illimité des scans",
        "Détection automatique des anomalies"
      ],
      gradient: "from-blue-500 to-cyan-500",
      demoImage: "/demo-ocr.jpg"
    },
    {
      icon: BarChart3,
      title: "Suivi Temps Réel",
      description: "Tableau de bord interactif avec consommation quotidienne, prévisions de factures et alertes d'anomalies intelligentes.",
      benefits: [
        "Graphiques interactifs de consommation",
        "Prévisions basées sur l'IA",
        "Comparaisons période précédente",
        "Alertes personnalisées"
      ],
      gradient: "from-purple-500 to-pink-500",
      demoImage: "/demo-dashboard.jpg"
    },
    {
      icon: Wallet,
      title: "Paiements Simplifiés",
      description: "Payez en un clic via Flooz et YasTogo. Fini les files d'attente et les déplacements inutiles.",
      benefits: [
        "Intégration Flooz et YasTogo",
        "Paiement en 1 clic",
        "Historique des transactions",
        "Reçus automatiques par email"
      ],
      gradient: "from-green-500 to-emerald-500",
      demoImage: "/demo-payment.jpg"
    },
    {
      icon: Share2,
      title: "Collaboration Sécurisée",
      description: "Partagez l'accès avec vos colocataires ou techniciens en toute sécurité. Contrôle total sur les permissions.",
      benefits: [
        "Partage avec permissions granulaires",
        "Gestion multi-compteurs",
        "Notifications en temps réel",
        "Révocation instantanée"
      ],
      gradient: "from-orange-500 to-red-500",
      demoImage: "/demo-sharing.jpg"
    },
    {
      icon: Wifi,
      title: "Mode Offline",
      description: "Fonctionne même sans connexion internet. Synchronisation automatique dès que vous êtes en ligne.",
      benefits: [
        "Scans offline disponibles",
        "Synchronisation automatique",
        "Données locales sécurisées",
        "Zéro perte de données"
      ],
      gradient: "from-yellow-500 to-orange-500",
      demoImage: "/demo-offline.jpg"
    },
    {
      icon: Globe,
      title: "Marketplace IoT",
      description: "Achetez des équipements connectés auprès de commerçants locaux. Transformez votre maison en smart home.",
      benefits: [
        "Vendeurs locaux certifiés",
        "Livraison sous 48h",
        "Garantie produits",
        "Installation assistée"
      ],
      gradient: "from-indigo-500 to-blue-500",
      demoImage: "/demo-marketplace.jpg"
    }
  ]

  const technologies = [
    {
      name: "OCR Avancé",
      description: "Technologie de reconnaissance optique de caractères optimisée pour compteurs",
      accuracy: "98%"
    },
    {
      name: "Intelligence Artificielle",
      description: "Prédictions de consommation et détection d'anomalies",
      accuracy: "95%"
    },
    {
      name: "Machine Learning",
      description: "Apprentissage continu pour améliorer les prévisions",
      accuracy: "Évolutif"
    }
  ]

  const useCases = [
    {
      persona: "Particuliers",
      icon: "🏠",
      needs: ["Économiser sur la facture", "Comprendre sa consommation", "Payer facilement"],
      solution: "Scans illimités, prévisions IA, paiement mobile"
    },
    {
      persona: "Professionnels (PME)",
      icon: "🏢",
      needs: ["Multi-sites", "Rapports détaillés", "Contrôle des coûts"],
      solution: "Gestion multi-compteurs, analytics avancés, alertes budget"
    },
    {
      persona: "Gestionnaires Immobiliers",
      icon: "🏘️",
      needs: ["Gestion locataires", "Suivi global", "Automatisation"],
      solution: "Partage d'accès, dashboard unifié, facturation automatique"
    },
    {
      persona: "Utilities (CEET)",
      icon: "⚡",
      needs: ["Réduire les pertes", "Détecter fraudes", "Améliorer service"],
      solution: "API entreprise, analytics fraude, portail client"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-yellow-300 font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Une solution complète</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              La Solution Quantify
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300 mb-8">
              Tout ce dont vous avez besoin pour maîtriser votre consommation énergétique, dans une seule application.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/rejoindre"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
              >
                Commencer gratuitement
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Découvrir les fonctionnalités
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features détaillées */}
      <section id="features" className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {features.map((feature, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                      {feature.title}
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8">
                      {feature.description}
                    </p>

                    <div className="space-y-4">
                      {feature.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-2xl">
                      {/* Placeholder pour image de démo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                            <feature.icon className="w-12 h-12 text-white" />
                          </div>
                          <p className="text-slate-500">Démo interactive</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-20 sm:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Technologies de Pointe
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nous utilisons les dernières avancées en IA pour vous offrir la meilleure expérience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                  <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    {tech.accuracy}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {tech.name}
                  </h3>
                  <p className="text-slate-600">
                    {tech.description}
                  </p>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Pour Qui ?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Quantify s&apos;adapte à tous les profils d&apos;utilisateurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition-all">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {useCase.persona}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <p className="text-sm font-semibold text-slate-700">Besoins :</p>
                    <ul className="space-y-2">
                      {useCase.needs.map((need, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {need}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-semibold text-green-700 mb-2">
                      ✓ Solution Quantify
                    </p>
                    <p className="text-sm text-slate-600">
                      {useCase.solution}
                    </p>
                  </div>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Prêt à Transformer Votre Gestion Énergétique ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez les 1,247 personnes déjà inscrites sur la liste d&apos;attente
          </p>
          <Link
            href="/rejoindre"
            className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Rejoindre Gratuitement
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  )
}