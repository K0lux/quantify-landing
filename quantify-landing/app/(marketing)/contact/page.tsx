// ============================================
// app/(marketing)/contact/page.tsx
// ============================================
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'
import { 
  Mail, Phone, MapPin, Clock,
  Briefcase, Users, HelpCircle, MessageSquare
} from 'lucide-react'
import { ContactForm } from '@/components/forms/contact-form'
import { ViewportAnimation } from '@/components/optimizations/viewport-animation'

export const metadata: Metadata = generateMetadata({
  title: 'Contact - Quantify | Parlons de Votre Projet',
  description: 'Contactez l\'équipe Quantify pour toute question, partenariat ou opportunité d\'investissement. Nous sommes à votre écoute.',
  keywords: ['contact quantify', 'investissement', 'partenariat', 'support'],
})

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "kassaluc9770@gmail.com",
      href: "mailto:kassaluc9770@gmail.com",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+228 93 13 18 74",
      href: "tel:+22893131874",
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Lomé, Togo",
      href: null,
    },
    {
      icon: Clock,
      label: "Disponibilité",
      value: "Lun-Ven: 9h-18h GMT",
      href: null,
    }
  ]

  const contactTypes = [
    {
      icon: Briefcase,
      title: "Investisseurs",
      description: "Vous souhaitez investir dans Quantify et participer à la révolution énergétique"
    },
    {
      icon: Users,
      title: "Partenariats",
      description: "Fournisseurs d'énergie, techniciens et autres acteurs du secteur énergétique"
    },
    {
      icon: HelpCircle,
      title: "Support",
      description: "Questions techniques, aide à l'utilisation, ou feedback sur l'application"
    },
    {
      icon: MessageSquare,
      title: "Général",
      description: "Toute autre question ou opportunité de collaboration"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Contactez-Nous
            </h1>
            
            <p className="text-xl sm:text-2xl text-slate-300">
              Une question ? Un projet ? Nous sommes là pour vous écouter
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{info.label}</p>
                  {info.href ? (
                    <a
                      href={info.href}
                      className="font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-slate-900">{info.value}</p>
                  )}
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Types */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Comment Pouvons-Nous Vous Aider ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactTypes.map((type, index) => (
              <ViewportAnimation key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-12 h-12 flex items-center justify-center mb-4">
                    <type.icon className="w-6 h-6 text-[#FF6B35]" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {type.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {type.description}
                  </p>
                </div>
              </ViewportAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 sm:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Envoyez-Nous un Message
            </h2>
            <p className="text-lg text-slate-600">
              Nous vous répondrons dans les 24-48 heures
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center">
            <MapPin className="w-16 h-16 text-[#FF6B35] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Lomé, Togo
            </h3>
            <p className="text-slate-600">
              Notre équipe est basée à Lomé et opère dans toute l&apos;Afrique de l&apos;Ouest
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
