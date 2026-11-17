// ============================================
// components/animations/fade-in.tsx
// ============================================
'use client'

import { useEffect, useRef, useState } from 'react'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    let timeout: ReturnType<typeof setTimeout> | undefined

    if (typeof IntersectionObserver === 'undefined') {
      timeout = setTimeout(() => setIsVisible(true), delay * 1000)

      return () => {
        if (timeout) clearTimeout(timeout)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.unobserve(element)
          timeout = setTimeout(() => setIsVisible(true), delay * 1000)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (timeout) clearTimeout(timeout)
    }
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  )
}
