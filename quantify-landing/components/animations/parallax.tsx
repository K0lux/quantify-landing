// ============================================
// components/animations/parallax.tsx
// ============================================
'use client'

import { useEffect, useRef } from 'react'

interface ParallaxProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      
      const scrolled = window.pageYOffset
      const element = ref.current
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + scrolled
      
      if (scrolled > elementTop - window.innerHeight && scrolled < elementTop + rect.height) {
        const yPos = (scrolled - elementTop) * speed
        element.style.transform = `translateY(${yPos}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div ref={ref} className={`transition-transform duration-100 ${className}`}>
      {children}
    </div>
  )
}