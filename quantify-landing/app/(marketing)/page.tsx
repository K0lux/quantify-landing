// ============================================
// app/(marketing)/page.tsx - Homepage
// ============================================
/*import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'
import { QuantifyLanding } from '@/components/landing/quantify-landing'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import { FacebookPixel } from '@/components/analytics/facebook-pixel'

export const metadata: Metadata = generateMetadata({
  title: 'Quantify - L\'Énergie Sous Contrôle | Gestion Énergétique Intelligente au Togo',
  description: 'Digitalisez vos compteurs électriques avec l\'OCR et l\'IA. Suivez votre consommation en temps réel, payez en un clic via Flooz et YasTogo. Lancement au Togo en 2025.',
  keywords: [
    'quantify',
    'énergie Togo',
    'compteur électrique',
    'OCR IA',
    'CEET',
    'Flooz',
    'YasTogo',
    'gestion énergétique',
    'économie énergie',
    'facture électricité',
    'Lomé',
    'Afrique',
  ],
})

export default function HomePage() {
  return (
    <>
      <QuantifyLanding />
      
     
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
      {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
        <FacebookPixel pixelId={process.env.NEXT_PUBLIC_FB_PIXEL_ID} />
      )}
    </>
  )
}*/

// ============================================
// app/(marketing)/page.tsx - CORRIGÉ
// ============================================
import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata'
import dynamic from 'next/dynamic'

// Import dynamique des sections
const HeroSection = dynamic(() => import('@/components/sections/hero').then(mod => ({ default: mod.HeroSection })))
const ProblemSection = dynamic(() => import('@/components/sections/problem').then(mod => ({ default: mod.ProblemSection })))
const SolutionSection = dynamic(() => import('@/components/sections/solution').then(mod => ({ default: mod.SolutionSection })))
const FeaturesSection = dynamic(() => import('@/components/sections/features').then(mod => ({ default: mod.FeaturesSection })))
const InnovationSection = dynamic(() => import('@/components/sections/innovation').then(mod => ({ default: mod.InnovationSection })))
const MarketSection = dynamic(() => import('@/components/sections/market').then(mod => ({ default: mod.MarketSection })))
const BusinessModelSection = dynamic(() => import('@/components/sections/business-model').then(mod => ({ default: mod.BusinessModelSection })))
const RoadmapSection = dynamic(() => import('@/components/sections/roadmap').then(mod => ({ default: mod.RoadmapSection })))
const TeamSection = dynamic(() => import('@/components/sections/team').then(mod => ({ default: mod.TeamSection })))
const MetricsSection = dynamic(() => import('@/components/sections/metrics').then(mod => ({ default: mod.MetricsSection })))
const ImpactSection = dynamic(() => import('@/components/sections/impact').then(mod => ({ default: mod.ImpactSection })))
const InvestorsSection = dynamic(() => import('@/components/sections/investors').then(mod => ({ default: mod.InvestorsSection })))
const CTASection = dynamic(() => import('@/components/sections/cta').then(mod => ({ default: mod.CTASection })))
import { QuantifyLanding } from '@/components/landing/quantify-landing'


export const metadata: Metadata = generateSEOMetadata({
  title: 'Quantify - L\'Énergie Sous Contrôle | Gestion Énergétique Intelligente au Togo',
  description: 'Digitalisez vos compteurs électriques avec l\'OCR et l\'IA. Suivez votre consommation en temps réel, payez en un clic via Flooz et YasTogo. Lancement au Togo en 2025.',
  keywords: [
    'quantify',
    'énergie Togo',
    'compteur électrique',
    'OCR IA',
    'CEET',
    'Flooz',
    'YasTogo',
    'gestion énergétique',
    'économie énergie',
    'facture électricité',
    'Lomé',
    'Afrique',
  ],
})

export default function HomePage() {
  return( 
    <>
      <QuantifyLanding />
    </>
  )
   
}