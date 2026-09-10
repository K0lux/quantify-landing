'use client'

import { FadeIn } from '@/components/animations/fade-in'
import {
  Ban,
  BarChart3,
  Briefcase,
  Camera,
  CheckCircle,
  Clock,
  FileText,
  Gauge,
  MapPin,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Tag,
  Users,
  Wallet, Wifi,
  Wrench
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

function StaggerGrid({ children, activeKey }: { children: React.ReactNode; activeKey: number }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [activeKey])

  return (
    <div className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

function FeatureCard({ icon: Icon, label, desc, index, visible }: {
  icon: React.ElementType; label: string; desc: string; index: number; visible: boolean
}) {
  return (
    <div
      className={`hover-icon flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-blue-200 hover-lift cursor-default transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="icon-target w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-200">
        <Icon className="w-5 h-5 text-blue-900" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

export function SolutionSection() {
  const [activeTab, setActiveTab] = useState(0)
  const [featuresVisible, setFeaturesVisible] = useState(true)
  const [sectionVisible, setSectionVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setSectionVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTabChange = (index: number) => {
    if (index === activeTab) return
    setFeaturesVisible(false)
    setTimeout(() => {
      setActiveTab(index)
      setFeaturesVisible(true)
    }, 200)
  }

  const solutions = [
    {
      tabIcon: Gauge,
      tabLabel: 'Meters',
      tag: 'Quantify Meters',
      title: 'Compteurs & factures en pilote automatique',
      subtitle: 'Du scan à la facturation, zéro déplacement, zéro calcul.',
      features: [
        { icon: Camera, label: 'Scan OCR/IA', desc: "Photographiez n'importe quel compteur, l'IA extrait la valeur instantanément" },
        { icon: BarChart3, label: 'Suivi multi-compteurs', desc: 'Tableau de bord par compteur, immeuble ou résidence — charges communes auto-calculées' },
        { icon: Share2, label: 'Vues partagées', desc: 'Propriétaire, locataire, gestionnaire : chacun voit ce qui le concerne, avec permissions' },
        { icon: Wallet, label: 'Paiement Mobile Money', desc: 'Rechargez prépayés ou réglez factures via Flooz/TMoney, historique signé' },
        { icon: Wifi, label: 'Mode offline', desc: 'Saisie sans internet, synchronisation différée avec horodatage réel' },
        { icon: ShieldCheck, label: 'Empreinte sécurisée', desc: 'Initialisation unique avec QR + signature visuelle — anti-doublon, preuve légale' },
      ],
    },
    {
      tabIcon: Store,
      tabLabel: 'Produits',
      tag: 'Quantify Market — Produits',
      title: 'Cherchez, comparez, achetez — sans vous déplacer pour rien',
      subtitle: 'Trouvez le bon produit au bon prix, disponible maintenant, près de chez vous.',
      features: [
        { icon: Search, label: 'Recherche contextuelle IA', desc: "Décrivez votre besoin : l'IA recommande les produits adaptés à votre situation" },
        { icon: Tag, label: 'Comparaison de prix', desc: "Visualisez les offres de plusieurs commerces à proximité, en un coup d'œil" },
        { icon: MapPin, label: 'Disponibilité locale', desc: 'Stock en temps réel, adresse et distance depuis votre position' },
        { icon: Clock, label: 'Horaires réels', desc: 'Ouverture, fermeture, jours fériés — mis à jour par les commerçants eux-mêmes' },
        { icon: Star, label: 'Avis & Trust Score', desc: "Notes vérifiées pour choisir en confiance avant d'acheter ou de se déplacer" },
        { icon: Wallet, label: 'Commande & paiement in-app', desc: 'Panier, Mobile Money, suivi de commande — ou achat sur place, vous choisissez' },
      ],
    },
    {
      tabIcon: Briefcase,
      tabLabel: 'Services',
      tag: 'Quantify Market — Services',
      title: 'Le bon prestataire, au bon prix, disponible maintenant',
      subtitle: 'Électricien, plombier, technicien IT, déménageur… en quelques clics.',
      features: [
        { icon: Wrench, label: 'Toutes catégories', desc: 'Bâtiment, entretien, informatique, transport — un seul endroit pour tout trouver' },
        { icon: FileText, label: 'Devis comparés', desc: 'Recevez plusieurs devis structurés, comparez tarifs et délais avant de choisir' },
        { icon: Users, label: 'Profils vérifiés', desc: "Bio, certifications, zone d'intervention, avis clients — transparence totale" },
        { icon: Clock, label: 'Disponibilité temps réel', desc: "Calendrier live, gestion d'urgences et créneaux disponibles" },
        { icon: ShieldCheck, label: 'Trust Score', desc: 'Score de confiance basé sur les missions réelles — les meilleurs montent' },
        { icon: MapPin, label: 'Proximité', desc: "Prestataires près de chez vous, frais de déplacement affichés à l'avance" },
      ],
    },
  ]

  const trustPoints = [
    { icon: Ban, text: 'Zéro commission cachée sur les prix des produits et services' },
    { icon: CheckCircle, text: 'Prix affichés = prix payés — le commerçant fixe ses tarifs' },
    { icon: ShieldCheck, text: 'Modèle Lead Fee transparent : le coût est pour la plateforme, pas pour vous' },
    { icon: Wallet, text: 'Wallet QC prépayé : vous ne dépensez que ce que vous chargez, sans surprise' },
  ]

  const current = solutions[activeTab]

  return (
    <section id="solution" className="py-20 sm:py-32 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm mb-6 bg-orange-500/20 border border-orange-500/30 text-orange-600">
              <Sparkles className="w-4 h-4" />
              <span>Une plateforme, trois solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Quantify résout <span className="text-orange-500">tout</span>, simplement
            </h2>
            <p className="text-lg sm:text-xl text-slate-700 leading-relaxed">
              Gérez vos compteurs, trouvez vos produits, réservez vos prestataires — le tout depuis
              une seule app, sans surcoût, sans déplacement inutile.
            </p>
          </div>
        </FadeIn>

        {/* Tabs */}
        <FadeIn delay={0.15}>
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-slate-100 rounded-xl p-1.5 gap-1">
              {solutions.map((sol, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
                    activeTab === idx
                      ? 'bg-blue-900 text-white shadow-lg'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <sol.tabIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">{sol.tabLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Active solution panel */}
        <FadeIn delay={0.2}>
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-blue-900 px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/20 rounded-full text-xs font-bold text-orange-400 w-fit">
                {current.tag}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">{current.title}</h3>
            </div>

            {/* Features grid */}
            <div className="p-8 sm:p-10">
              <p className="text-base sm:text-lg text-slate-700 mb-8 leading-relaxed">{current.subtitle}</p>
              <StaggerGrid activeKey={activeTab}>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {current.features.map((feat, fIdx) => (
                    <FeatureCard
                      key={`${activeTab}-${fIdx}`}
                      icon={feat.icon}
                      label={feat.label}
                      desc={feat.desc}
                      index={fIdx}
                      visible={featuresVisible}
                    />
                  ))}
                </div>
              </StaggerGrid>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 pb-6">
              {solutions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTabChange(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    activeTab === idx ? 'w-8 bg-blue-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Scan OCR demo with real meter photo */}
        <FadeIn delay={0.3}>
          <div className="mt-12 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left: real meter photo with scan overlay */}
              <div className="relative min-h-[320px] lg:min-h-[400px] overflow-hidden bg-slate-800">
                <Image
                  src="/meter-analog-closeup.png"
                  alt="Compteur analogique CEET — scan OCR en cours"
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Scan overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-68 h-46 border-2 border-amber-400 rounded-lg relative">
                    <div className="absolute inset-0 bg-amber-400/10 animate-pulse rounded-lg" />
                    <div className="absolute -top-6 left-0 text-[10px] font-mono text-amber-400">OCR zone detected</div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-amber-400/40 rounded-lg backdrop-blur-sm">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span className="text-xs text-amber-300 font-medium">Scan en cours...</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-emerald-400/40 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-emerald-300 font-medium">98% confiance</span>
                  </div>
                </div>
              </div>

              {/* Right: extracted data */}
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 rounded-full text-xs font-bold text-amber-400 w-fit mb-4">
                  <Camera className="w-3.5 h-3.5" />
                  Résultat du scan OCR
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  Photographiez. L&apos;IA fait le reste.
                </h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Pointez votre smartphone vers n&apos;importe quel compteur CEET (prépayé ou analogique).
                  Notre modèle OCR extrait la valeur instantanément et l&apos;enregistre avec horodatage.
                </p>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Valeur extraite', value: '40 466 kWh', color: 'text-white' },
                    { label: 'Type détecté', value: 'Monophasé 2 fils (E967C)', color: 'text-slate-300' },
                    { label: 'Confiance OCR', value: '98.2%', color: 'text-emerald-400' },
                    { label: 'Horodatage', value: '12 fév. 2025 — 16:57', color: 'text-slate-400' },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-700/50">
                      <span className="text-slate-500">{row.label}</span>
                      <span className={`font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-4">
                  Photo réelle d&apos;un compteur analogique CEET au Togo — le type de compteur que Quantify digitalise.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Trust block */}
        <FadeIn delay={0.35}>
          <div className="mt-16 rounded-3xl p-8 sm:p-12 text-white bg-blue-900">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 leading-snug">
                  Pas de surcoût. Pas de commission cachée.
                </h3>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Quantify ne gonfle pas les prix. Les commerçants et prestataires fixent leurs tarifs
                  librement. Notre modèle repose sur des crédits QC transparents — vous savez
                  exactement ce que vous payez, et pourquoi.
                </p>
              </div>
              <div className="space-y-3">
                {trustPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all duration-500 hover:bg-white/10 ${
                      sectionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${idx * 120 + 400}ms` }}
                  >
                    <point.icon className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-400" />
                    <p className="text-sm text-slate-300 leading-relaxed">{point.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
