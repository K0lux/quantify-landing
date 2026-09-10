// ============================================
// hooks/use-analytics.ts
// ============================================
'use client'

import { useEffect, useCallback } from 'react'

/**
 * Hook for tracking custom events
 */
export function useAnalytics() {
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    try {
      // Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, properties)
      }

      // Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('trackCustom', eventName, properties)
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventName, properties)
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error)
    }
  }, [])

  return { track }
}

export function usePageView() {
  useEffect(() => {
    // Track page view
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: window.location.pathname,
      })
    }

    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'PageView')
    }
  }, [])
}

export function useSectionView(sectionName: string) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'section_view', {
                section_name: sectionName,
              })
            }
          }
        })
      },
      { threshold: 0.5 }
    )

    const section = document.getElementById(sectionName)
    if (section) observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
    }
  }, [sectionName])
}