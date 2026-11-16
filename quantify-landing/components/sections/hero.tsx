// ============================================
// components/sections/hero.tsx
// ============================================
'use client'

import { ArrowRight, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WaitlistCounter } from '@/components/waitlist/waitlist-counter'

interface HeroSectionProps {
  onJoinWaitlist: () => void
}

type MascotMood = 'happy' | 'scan' | 'think' | 'alert'

const MOOD_CYCLE: MascotMood[] = ['happy', 'scan', 'think', 'alert']
const MOOD_DURATION = 5000

export function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [mascotMood, setMascotMood] = useState<MascotMood>('happy')
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const [autoCycle, setAutoCycle] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)
  const cycleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stars = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 4
    })),
    []
  )

  const sparks = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      r: 2 + Math.random() * 2,
      delay: i * 0.4,
      color: i % 2 === 0 ? '#fbbf24' : '#FF6B35',
    })),
    []
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto mood cycle
  useEffect(() => {
    if (!autoCycle) return
    cycleTimer.current = setInterval(() => {
      setMascotMood(prev => {
        const idx = MOOD_CYCLE.indexOf(prev)
        return MOOD_CYCLE[(idx + 1) % MOOD_CYCLE.length]
      })
    }, MOOD_DURATION)
    return () => { if (cycleTimer.current) clearInterval(cycleTimer.current) }
  }, [autoCycle])

  const handleManualMood = useCallback((mood: MascotMood) => {
    setAutoCycle(false)
    setMascotMood(mood)
    if (cycleTimer.current) clearInterval(cycleTimer.current)
    setTimeout(() => setAutoCycle(true), 15000)
  }, [])

  // Eye tracking — pupils follow mouse
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.26
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxOffset = 3.5
      const factor = Math.min(dist / 300, 1)
      setEyeOffset({
        x: (dx / (dist || 1)) * maxOffset * factor,
        y: (dy / (dist || 1)) * maxOffset * factor,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const pupilCx1 = 88 + eyeOffset.x
  const pupilCy1 = 66 + eyeOffset.y
  const pupilCx2 = 114 + eyeOffset.x
  const pupilCy2 = 66 + eyeOffset.y

  return (
    <section className="relative min-h-screen min-h-[100svh] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center">
      {/* Animated star background */}
      <div className="absolute inset-0 overflow-hidden">
        {isMounted && stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`
            }}
          />
        ))}
      </div>

      {/* Grid with animated light beams */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Horizontal beams */}
          <div className="grid-beam-h" style={{ top: '15%', animationDuration: '4s', animationDelay: '0s' }} />
          <div className="grid-beam-h" style={{ top: '35%', animationDuration: '5s', animationDelay: '1.5s' }} />
          <div className="grid-beam-h" style={{ top: '55%', animationDuration: '4.5s', animationDelay: '3s' }} />
          <div className="grid-beam-h" style={{ top: '75%', animationDuration: '5.5s', animationDelay: '0.8s' }} />
          <div className="grid-beam-h" style={{ top: '90%', animationDuration: '4s', animationDelay: '2.2s' }} />
          {/* Vertical beams */}
          <div className="grid-beam-v" style={{ left: '10%', animationDuration: '5s', animationDelay: '0.5s' }} />
          <div className="grid-beam-v" style={{ left: '30%', animationDuration: '4s', animationDelay: '2s' }} />
          <div className="grid-beam-v" style={{ left: '55%', animationDuration: '5.5s', animationDelay: '1s' }} />
          <div className="grid-beam-v" style={{ left: '75%', animationDuration: '4.5s', animationDelay: '3.5s' }} />
          <div className="grid-beam-v" style={{ left: '92%', animationDuration: '5s', animationDelay: '0.2s' }} />
        </div>
      )}

      {/* Drifting ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" style={{ animation: 'hero-glow-drift 12s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" style={{ animation: 'hero-glow-drift 15s ease-in-out infinite reverse' }} />

      <div className="relative max-w-7xl mx-auto w-full px-4 pt-28 pb-10 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="space-y-5 text-center text-white sm:space-y-8 lg:text-left">
            <div className="hero-fade-up mx-auto inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-3 py-2 text-xs font-medium text-yellow-300 backdrop-blur-sm hero-badge-pulse sm:px-4 sm:text-sm lg:mx-0">
              <Sparkles className="w-4 h-4" />
              <span>Gestion énergétique multi-compteurs, du foyer à l&apos;immeuble</span>
            </div>

            <h1 className="hero-fade-up-1 text-3xl font-bold leading-tight sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="mb-1 block sm:mb-2">L&apos;appli pour</span>
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 bg-[length:200%_auto] bg-clip-text text-transparent hero-shimmer-text">
                mieux gérer votre énergie
              </span>
            </h1>

            <p className="hero-fade-up-2 mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-xl lg:mx-0">
              Scannez votre compteur en un clic, suivez votre consommation en temps réel, payez facilement via mobile money (Flooz et YasTogo, etc.). Sans matériel.
            </p>

            {/* Stats Grid */}
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2 py-3 sm:gap-4 sm:py-6 lg:mx-0">
              <div className="stat-pop-1 text-center lg:text-left">
                <div className="text-xl font-bold text-yellow-400 sm:text-3xl">100%</div>
                <p className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">Mobile, sans matériel</p>
              </div>
              <div className="stat-pop-2 text-center lg:text-left">
                <div className="text-xl font-bold text-green-400 sm:text-3xl">3 clics</div>
                <p className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">Scan → Suivi → Paiement</p>
              </div>
              <div className="stat-pop-3 text-center lg:text-left">
                <div className="text-xl font-bold text-blue-400 sm:text-3xl">3.6M</div>
                <p className="mt-1 text-[10px] leading-tight text-slate-400 sm:text-sm">Foyers au Togo</p>
              </div>
            </div>

            {/* CTA */}
            <div className="hero-fade-up-4 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
              <button
                type="button"
                onClick={onJoinWaitlist}
                className="group relative flex min-h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 px-5 py-4 text-base font-semibold shadow-lg transition-all duration-300 hover:shadow-yellow-500/50 sm:w-auto sm:px-8 sm:text-lg sm:hover:scale-105"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                Rejoindre la liste d&apos;attente
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Social Proof */}
            <WaitlistCounter
              hideWhenEmpty
              className="hero-fade-up-5 pt-2 sm:pt-4 lg:justify-start"
            />
          </div>

          {/* Right content - Animated Wati Mascot */}
          <div className={`relative flex flex-col items-center gap-3 sm:gap-6 ${isMounted ? 'wati-entrance' : 'opacity-0'}`}>
            <div className="relative wati-float">
              {/* Pulsing glow behind mascot */}
              <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full wati-glow" />

              {/* Orbiting energy particles */}
              {isMounted && sparks.map(s => (
                <div
                  key={s.id}
                  className={`absolute left-1/2 top-1/2 wati-particle-${(s.id % 3) + 1}`}
                  style={{ animationDelay: `${s.delay}s` }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: s.r * 2,
                      height: s.r * 2,
                      background: s.color,
                      boxShadow: `0 0 8px ${s.color}`,
                    }}
                  />
                </div>
              ))}

              <svg
                ref={svgRef}
                width="280"
                height="360"
                viewBox="0 0 200 260"
                className="relative h-auto w-[176px] drop-shadow-2xl sm:w-[240px] lg:w-[280px]"
              >
                <defs>
                  <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="bodyGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                  <radialGradient id="glowOrb" cx="50%" cy="40%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  <filter id="softShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.4" />
                  </filter>
                </defs>

                {/* Glow Aura */}
                <ellipse cx="100" cy="145" rx="60" ry="70" fill="rgba(251,191,36,0.08)" className="wati-glow" />

                {/* Legs */}
                <ellipse cx="80" cy="218" rx="14" ry="8" fill="#e67e22" />
                <rect x="66" y="185" width="28" height="36" rx="14" fill="url(#bodyGrad)" />
                <ellipse cx="120" cy="218" rx="14" ry="8" fill="#e67e22" />
                <rect x="106" y="185" width="28" height="36" rx="14" fill="url(#bodyGrad)" />

                {/* Shoes */}
                <ellipse cx="80" cy="220" rx="18" ry="9" fill="#1e3a5f" />
                <ellipse cx="120" cy="220" rx="18" ry="9" fill="#1e3a5f" />
                <ellipse cx="80" cy="217" rx="14" ry="6" fill="#2d5986" />
                <ellipse cx="120" cy="217" rx="14" ry="6" fill="#2d5986" />

                {/* Body — Lightning bolt (shakes on alert) */}
                <g className={mascotMood === 'alert' ? 'wati-alert-shake' : ''}>
                  <path
                    d="M100 60 L130 110 L115 110 L125 155 L70 105 L88 105 Z"
                    fill="url(#bodyGrad)"
                    filter="url(#softShadow)"
                  />
                  <path
                    d="M100 65 L122 105 L115 105 L120 130 L85 100 L95 100 Z"
                    fill="url(#glowOrb)"
                    opacity="0.6"
                  />
                  <path
                    d="M100 60 L130 110 L115 110 L125 155 L70 105 L88 105 Z"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                  />
                </g>

                {/* Left arm */}
                <path d="M72 108 Q48 115 42 130" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none" />
                <ellipse cx="41" cy="133" rx="10" ry="10" fill="#fde68a" />

                {/* Right arm — waves when happy */}
                <g className={mascotMood === 'happy' ? 'wati-wave' : ''}>
                  {mascotMood === 'happy' && (
                    <path d="M123 108 Q148 100 155 88" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none" />
                  )}
                  {mascotMood === 'scan' && (
                    <path d="M123 108 Q150 112 158 125" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none" />
                  )}
                  {mascotMood === 'think' && (
                    <path d="M123 108 Q145 90 148 75" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none" />
                  )}
                  {mascotMood === 'alert' && (
                    <path d="M123 108 Q150 105 158 112" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" fill="none" />
                  )}
                  <ellipse
                    cx={mascotMood === 'happy' ? 157 : mascotMood === 'scan' ? 160 : mascotMood === 'think' ? 150 : 160}
                    cy={mascotMood === 'happy' ? 85 : mascotMood === 'scan' ? 128 : mascotMood === 'think' ? 71 : 115}
                    rx="10" ry="10" fill="#fde68a"
                  />
                </g>

                {/* Head */}
                <ellipse cx="100" cy="68" rx="34" ry="36" fill="url(#bodyGrad2)" filter="url(#softShadow)" />
                <ellipse cx="100" cy="60" rx="22" ry="18" fill="url(#glowOrb)" opacity="0.5" />

                {/* Ears */}
                <polygon points="68,50 60,36 75,45" fill="url(#bodyGrad)" />
                <polygon points="132,50 140,36 125,45" fill="url(#bodyGrad)" />
                <polygon points="70,48 64,38 74,44" fill="#fde68a" opacity="0.7" />
                <polygon points="130,48 136,38 126,44" fill="#fde68a" opacity="0.7" />

                {/* Eye whites */}
                <ellipse cx="87" cy="65" rx="11" ry="12" fill="white" />
                <ellipse cx="113" cy="65" rx="11" ry="12" fill="white" />

                {/* Blinking eyelids */}
                <ellipse cx="87" cy="65" rx="11" ry="12" fill="url(#bodyGrad2)" className="wati-blink" />
                <ellipse cx="113" cy="65" rx="11" ry="12" fill="url(#bodyGrad2)" className="wati-blink" />

                {/* Pupils — follow mouse cursor */}
                {mascotMood === 'scan' ? (
                  <>
                    <ellipse cx={88 + eyeOffset.x} cy={66 + eyeOffset.y} rx="7" ry="7" fill="#1e293b" />
                    <ellipse cx={114 + eyeOffset.x} cy={66 + eyeOffset.y} rx="7" ry="7" fill="#1e293b" />
                    <ellipse cx={88 + eyeOffset.x} cy={66 + eyeOffset.y} rx="4" ry="4" fill="#FF6B35" />
                    <ellipse cx={114 + eyeOffset.x} cy={66 + eyeOffset.y} rx="4" ry="4" fill="#FF6B35" />
                    <ellipse cx={88 + eyeOffset.x} cy={66 + eyeOffset.y} rx="2" ry="2" fill="white" />
                    <ellipse cx={114 + eyeOffset.x} cy={66 + eyeOffset.y} rx="2" ry="2" fill="white" />
                    <line x1="76" y1="66" x2="100" y2="66" stroke="#fbbf24" strokeWidth="0.8" className="wati-scan-line" />
                    <line x1="102" y1="66" x2="124" y2="66" stroke="#fbbf24" strokeWidth="0.8" className="wati-scan-line" />
                  </>
                ) : (
                  <>
                    <ellipse cx={pupilCx1} cy={pupilCy1} rx="7" ry="7" fill="#1e293b" />
                    <ellipse cx={pupilCx2} cy={pupilCy2} rx="7" ry="7" fill="#1e293b" />
                    <ellipse cx={pupilCx1} cy={pupilCy1} rx="4" ry="4" fill="#FF6B35" />
                    <ellipse cx={pupilCx2} cy={pupilCy2} rx="4" ry="4" fill="#FF6B35" />
                    <ellipse cx={pupilCx1 + 1.5} cy={pupilCy1 - 2} rx="2" ry="2" fill="rgba(255,255,255,0.9)" />
                    <ellipse cx={pupilCx2 + 1.5} cy={pupilCy2 - 2} rx="2" ry="2" fill="rgba(255,255,255,0.9)" />
                  </>
                )}

                {/* Eyebrows */}
                <path
                  d={`M78 ${54 + (mascotMood === 'alert' ? -3 : mascotMood === 'think' ? -2 : 0)} Q87 ${50 + (mascotMood === 'alert' ? -3 : mascotMood === 'think' ? -4 : 0)} 96 ${54 + (mascotMood === 'alert' ? -3 : 0)}`}
                  stroke="#e67e22" strokeWidth="2.5" fill="none" strokeLinecap="round"
                />
                <path
                  d={`M104 ${54 + (mascotMood === 'alert' ? -3 : 0)} Q113 ${50 + (mascotMood === 'alert' ? -3 : mascotMood === 'think' ? -2 : 0)} 122 ${54 + (mascotMood === 'alert' ? -3 : mascotMood === 'think' ? -2 : 0)}`}
                  stroke="#e67e22" strokeWidth="2.5" fill="none" strokeLinecap="round"
                />

                {/* Mouth */}
                {mascotMood === 'happy' && (
                  <>
                    <path d="M88 82 Q100 93 112 82" stroke="#e67e22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    <path d="M93 83 Q100 91 107 83" fill="white" />
                  </>
                )}
                {mascotMood === 'scan' && (
                  <path d="M90 83 Q100 88 110 83" stroke="#e67e22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                )}
                {mascotMood === 'think' && (
                  <path d="M91 84 Q100 88 109 82" stroke="#e67e22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                )}
                {mascotMood === 'alert' && (
                  <>
                    <ellipse cx="100" cy="85" rx="10" ry="7" fill="white" />
                    <ellipse cx="100" cy="85" rx="7" ry="5" fill="#1e293b" />
                  </>
                )}

                {/* Cheeks (happy) */}
                {mascotMood === 'happy' && (
                  <>
                    <ellipse cx="78" cy="76" rx="7" ry="4" fill="#f87171" opacity="0.4" />
                    <ellipse cx="122" cy="76" rx="7" ry="4" fill="#f87171" opacity="0.4" />
                  </>
                )}

                {/* Energy particles (alert) — animated sparks */}
                {mascotMood === 'alert' && (
                  <>
                    <circle cx="55" cy="50" r="3" fill="#fbbf24" className="wati-spark" style={{ animationDelay: '0s' }} />
                    <circle cx="145" cy="45" r="4" fill="#fbbf24" className="wati-spark" style={{ animationDelay: '0.5s' }} />
                    <circle cx="60" cy="80" r="2" fill="#FF6B35" className="wati-spark" style={{ animationDelay: '1s' }} />
                    <circle cx="140" cy="75" r="3" fill="#FF6B35" className="wati-spark" style={{ animationDelay: '0.3s' }} />
                    <path d="M50 55 L55 48 L60 55" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="wati-spark" style={{ animationDelay: '0.7s' }} />
                    <path d="M140 50 L145 42 L150 50" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="wati-spark" style={{ animationDelay: '1.2s' }} />
                    <circle cx="48" cy="110" r="2.5" fill="#fbbf24" className="wati-spark" style={{ animationDelay: '0.2s' }} />
                    <circle cx="152" cy="100" r="2" fill="#FF6B35" className="wati-spark" style={{ animationDelay: '0.8s' }} />
                  </>
                )}

                {/* Thought bubble (think) — animated */}
                {mascotMood === 'think' && (
                  <>
                    <circle cx="148" cy="55" r="3" fill="rgba(255,255,255,0.3)" className="wati-think-dot" style={{ animationDelay: '0s' }} />
                    <circle cx="156" cy="46" r="5" fill="rgba(255,255,255,0.3)" className="wati-think-dot" style={{ animationDelay: '0.3s' }} />
                    <circle cx="167" cy="37" r="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="wati-think-dot" style={{ animationDelay: '0.6s' }} />
                    <text x="160" y="41" fontSize="14" textAnchor="middle">💡</text>
                  </>
                )}

                {/* Ambient floating sparks (always visible) */}
                {isMounted && (
                  <>
                    <circle cx="50" cy="130" r="1.5" fill="#fbbf24" className="wati-spark" style={{ animationDelay: '0s', animationDuration: '3s' }} />
                    <circle cx="150" cy="90" r="1.5" fill="#FF6B35" className="wati-spark" style={{ animationDelay: '1s', animationDuration: '3.5s' }} />
                    <circle cx="155" cy="150" r="1" fill="#fbbf24" className="wati-spark" style={{ animationDelay: '2s', animationDuration: '4s' }} />
                  </>
                )}
              </svg>
            </div>

            {/* Mood selector */}
            <div className="flex flex-wrap justify-center gap-2">
              {([
                { mood: 'happy' as MascotMood, label: '😊 Accueil', color: 'bg-green-500/20 border-green-500/40 text-green-300' },
                { mood: 'scan' as MascotMood, label: '🔍 Scan', color: 'bg-sky-500/20 border-sky-500/40 text-sky-300' },
                { mood: 'think' as MascotMood, label: '🤔 IA', color: 'bg-orange-500/20 border-orange-500/40 text-orange-300' },
                { mood: 'alert' as MascotMood, label: '⚡ Alerte', color: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300' },
              ]).map(m => (
                <button
                  key={m.mood}
                  onClick={() => handleManualMood(m.mood)}
                  className={`min-h-9 rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-300 sm:px-3 sm:text-xs ${
                    mascotMood === m.mood
                      ? `${m.color} scale-110`
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Mascot name tag */}
            <div className="text-center">
              <div className="text-xl font-extrabold text-yellow-400">Wati</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
