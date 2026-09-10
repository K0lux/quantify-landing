// ============================================
// components/analytics/google-analytics.tsx
// ============================================

'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Déclenche un événement de pageview à chaque navigation
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      ;(window as any).gtag('config', gaId, {
        page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      })
    }
  }, [pathname, searchParams, gaId])

  return (
    <>
      {/* Script principal de Google Analytics */}
      <Script
        id="google-analytics-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />

      {/* Configuration initiale de GA */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `,
        }}
      />
    </>
  )
}
