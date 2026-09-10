// ============================================
// app/manifest.ts
// ============================================
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quantify - L\'Énergie Sous Contrôle',
    short_name: 'Quantify',
    description: 'Digitalisez vos compteurs électriques avec l\'OCR et l\'IA. Suivez votre consommation en temps réel.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#FBBF24',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    categories: ['utilities', 'productivity', 'finance'],
    lang: 'fr',
    dir: 'ltr',
    prefer_related_applications: false
  }
}