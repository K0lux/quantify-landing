// ============================================
// components/features/countdown-timer.tsx
// ============================================
'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()
      
      if (difference <= 0) {
        onComplete?.()
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  return (
    <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
      {[
        { label: 'Jours', value: timeLeft.days },
        { label: 'Heures', value: timeLeft.hours },
        { label: 'Minutes', value: timeLeft.minutes },
        { label: 'Secondes', value: timeLeft.seconds },
      ].map((item, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-lg text-center">
          <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">
            {String(item.value).padStart(2, '0')}
          </div>
          <div className="text-xs sm:text-sm text-slate-600">{item.label}</div>
        </div>
      ))}
    </div>
  )
}