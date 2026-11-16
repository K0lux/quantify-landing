// ============================================
// components/waitlist/waitlist-counter.tsx
// ============================================
'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

interface WaitlistCounterProps {
  hideWhenEmpty?: boolean
  className?: string
}

export function WaitlistCounter({
  hideWhenEmpty = false,
  className = '',
}: WaitlistCounterProps) {
  const [count, setCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/waitlist', { cache: 'no-store' })
        const data = await response.json()
        const totalUsers = data?.data?.total_users
        setCount(
          response.ok && data.success && Number.isFinite(totalUsers)
            ? totalUsers
            : null
        )
      } catch (error) {
        console.error('Error fetching waitlist count:', error)
        setCount(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()

    // Mettre à jour toutes les 30 secondes
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  if (hideWhenEmpty && !loading && (!count || count < 1)) return null

  return (
    <div className={`inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-lg sm:gap-3 sm:px-6 sm:py-3 ${className}`}>
      {count !== null && count > 0 && (
        <div className="hidden -space-x-2 sm:flex" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-yellow-400 to-orange-600"
            />
          ))}
        </div>
      )}
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold sm:text-base" aria-live="polite">
        {loading ? (
          <span className="animate-pulse">Chargement...</span>
        ) : count === null ? (
          <span>Nombre indisponible</span>
        ) : count === 0 ? (
          <span>Aucune inscription pour le moment</span>
        ) : (
          <>
            <Users className="h-4 w-4 shrink-0" />
            {count.toLocaleString('fr-FR')} {count === 1 ? 'personne inscrite' : 'personnes inscrites'}
          </>
        )}
      </span>
    </div>
  )
}
