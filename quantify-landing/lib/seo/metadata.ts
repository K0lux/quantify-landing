
// ============================================
// lib/seo/metadata.ts
// ============================================
/*import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = process.env.NEXT_PUBLIC_APP_URL,
  } = config

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Quantify Team' }],
    creator: 'Quantify',
    publisher: 'Quantify',
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url,
      title,
      description,
      siteName: 'Quantify',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@quantify_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}*/

import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  } = config

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'Quantify Team' }],
    creator: 'Quantify',
    publisher: 'Quantify',
    metadataBase: new URL(url),
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url,
      title,
      description,
      siteName: 'Quantify',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@quantify_app',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
  }
}