// ============================================
// components/optimizations/lazy-image.tsx
// ============================================
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export function LazyImage({ src, alt, width, height, className, priority }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        quality={90}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}
    </div>
  )
}