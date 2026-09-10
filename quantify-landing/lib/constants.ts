// ============================================
// lib/constants.ts
// ============================================
export const SITE_NAME = 'Quantify'
export const SITE_DESCRIPTION = 'L\'Énergie Sous Contrôle'
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://quantify.app'

export const CONTACT = {
  email: 'kassaluc9770@gmail.com',
  phone: '+22893131874',
  location: 'Lomé, Togo'
}

export const SOCIAL_LINKS = {
  linkedin: '#',
  twitter: '#',
  facebook: '#'
}

export const WAITLIST_BENEFITS = {
  REFERRAL_BONUS_POSITIONS: 5,
  POINTS_PER_REFERRAL: 100,
  MIN_POSITION: 1
}

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Gratuit',
    price: 0,
    features: [
      'Scan illimité de compteur',
      'Suivi consommation de base',
      '1 compteur',
      'Historique 30 jours',
      'Paiement mobile money'
    ]
  },
  PREMIUM: {
    name: 'Premium',
    price: 750,
    currency: 'XOF',
    features: [
      'Tout du plan Gratuit',
      'Multi-compteurs illimités',
      'Alertes IA intelligentes',
      'Prévisions consommation',
      'Historique illimité',
      'Contrôle IoT',
      'Support prioritaire'
    ]
  }
}

export const PHASES = [
  {
    phase: 1,
    year: '2025',
    region: 'Togo',
    users: '200K',
    revenue: '1.59B FCFA',
    countries: 1
  },
  {
    phase: 2,
    year: '2027-2028',
    region: 'UEMOA',
    users: '2M',
    revenue: '15.9B FCFA',
    countries: 5
  },
  {
    phase: 3,
    year: '2030-2032',
    region: 'Afrique',
    users: '20M',
    revenue: '159B FCFA',
    countries: 20
  },
  {
    phase: 4,
    year: '2035+',
    region: 'Global',
    users: '200M',
    revenue: '1590B FCFA',
    countries: 50
  }
]