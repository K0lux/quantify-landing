import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Quantify - L\'Énergie Sous Contrôle',
  description: 'Digitalisez vos compteurs, suivez votre consommation en temps réel, payez en un clic via Flooz et YasTogo.',
  keywords: 'énergie, compteur électrique, OCR, IA, Togo, Afrique, mobile money',
  authors: [{ name: 'Quantify Team' }],
  openGraph: {
    title: 'Quantify - L\'Énergie Sous Contrôle',
    description: 'La révolution énergétique commence ici',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
