// ============================================
// components/waitlist/waitlist-counter.tsx
// ============================================
'use client'

import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'

export function WaitlistCounter() {
  const [count, setCount] = useState(1247)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/api/waitlist')
        const data = await response.json()
        setCount(data.total || 1247)
      } catch (error) {
        console.error('Error fetching waitlist count:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()

    // Mettre à jour toutes les 30 secondes
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
      <div className="flex -space-x-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 border-2 border-white"
          />
        ))}
      </div>
      <span className="font-semibold">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          <>
            <Users className="w-4 h-4 inline mr-1" />
            {count.toLocaleString()} en attente
          </>
        )}
      </span>
    </div>
  )
}