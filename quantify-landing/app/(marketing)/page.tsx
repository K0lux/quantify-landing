import { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata'
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
  return (
    <>
      <QuantifyLanding />
    </>
  )
}
