'use client'

import { useState, useEffect, useRef } from 'react'
import { FadeIn } from '@/components/animations/fade-in'
import {
  Bot,
  Send,
  BarChart3,
  AlertTriangle,
  Wrench,
  Zap,
  Paperclip,
  Mic,
  History,
  MessageSquare,
  Settings2,
  ChevronRight,
  FileText,
  Gauge,
  Bell,
  X,
  Plus,
  Search,
} from 'lucide-react'

const CHAT_MESSAGES = [
  { role: 'user' as const, text: 'Pourquoi ma facture a augmenté ce mois-ci ?', time: '10:42' },
  {
    role: 'kilo' as const,
    text: "J'ai analysé vos relevés. Votre consommation a augmenté de 23% entre le 12 et le 18 mars, principalement la nuit. Cela correspond à l'installation de votre nouveau climatiseur.",
    data: { label: 'Pic détecté', value: '+23%', period: '12-18 mars' },
    time: '10:42',
  },
  { role: 'user' as const, text: 'Comment réduire ma consommation ?', time: '10:44' },
  {
    role: 'kilo' as const,
    text: "En programmant votre climatiseur sur 24°C au lieu de 20°C la nuit, vous pourriez économiser ~15% sur ce poste. Je peux aussi activer une alerte si votre conso dépasse 8 kWh/jour.",
    data: { label: 'Économie estimée', value: '-15%', period: 'Par mois' },
    time: '10:44',
  },
  { role: 'user' as const, text: "Active l'alerte à 8 kWh/jour", time: '10:45' },
  {
    role: 'kilo' as const,
    text: "Alerte configurée. Vous recevrez une notification dès que votre compteur #12 dépasse 8 kWh sur une journée. Coût : 2 QC/alerte déclenchée.",
    data: { label: 'Alerte active', value: '8 kWh/j', period: 'Compteur #12' },
    time: '10:45',
  },
]

const HISTORY_ITEMS = [
  { id: '1', title: 'Facture mars — Compteur Principal', date: "Aujourd'hui", active: true },
  { id: '2', title: 'Comparaison conso février / mars', date: 'Hier' },
  { id: '3', title: 'Recherche électricien — Cuisine', date: 'Lun. 8 mars' },
  { id: '4', title: 'Rapport mensuel février', date: 'Dim. 7 mars' },
]

const CONTEXT_ITEMS = [
  { icon: Gauge, label: 'Compteur Principal', sub: '1280 kWh · Dernier scan 14/03', active: true },
  { icon: FileText, label: 'Facture mars en cours', sub: 'Période 01–31 mars' },
  { icon: Bell, label: 'Seuil alerte', sub: '8 kWh/j configuré' },
]

function ChatBubble({
  message,
  visible,
}: {
  message: (typeof CHAT_MESSAGES)[0]
  visible: boolean
}) {
  const isKilo = message.role === 'kilo'
  const time = 'time' in message ? message.time : ''

  return (
    <div
      className={`flex gap-3 transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isKilo ? '' : 'flex-row-reverse'}`}
    >
      {isKilo && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 ring-2 ring-slate-600">
          <Bot className="w-4 h-4 text-amber-400" />
        </div>
      )}
      <div className={`max-w-[78%] ${isKilo ? '' : 'ml-auto'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isKilo
              ? 'bg-slate-700/80 text-slate-100 rounded-tl-sm'
              : 'bg-blue-600 text-white rounded-tr-sm'
          }`}
        >
          {message.text}
        </div>
        {'data' in message && message.data && (
          <div className="mt-1.5 flex gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-lg px-2.5 py-1">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-slate-200">{message.data.label}</span>
              <span className="text-xs font-bold text-amber-400">{message.data.value}</span>
              <span className="text-xs text-slate-400">{message.data.period}</span>
            </div>
          </div>
        )}
        <p className={`text-[10px] text-slate-500 mt-1 ${isKilo ? 'text-left' : 'text-right'}`}>
          {time}
        </p>
      </div>
    </div>
  )
}

export function KiloSection() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [started, setStarted] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true)
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || visibleCount >= CHAT_MESSAGES.length) return
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1)
    }, visibleCount === 0 ? 500 : 1100)
    return () => clearTimeout(timer)
  }, [started, visibleCount])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleCount])

  const quickActions = [
    { icon: BarChart3, label: 'Analyser ma conso' },
    { icon: AlertTriangle, label: 'Vérifier une facture' },
    { icon: Wrench, label: 'Trouver un technicien' },
    { icon: Zap, label: 'Configurer une alerte' },
  ]

  return (
    <section id="kilo" className="py-16 sm:py-24 bg-slate-900" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700/80 rounded-full text-amber-400 text-sm font-medium mb-4">
              <Bot className="w-4 h-4" />
              <span>Kilo — Agent IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
              Votre copilote énergétique
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Interface réaliste : historique, saisie avec pièce jointe et vocal, panneau de contexte.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          {/* App window: 3 columns */}
          <div className="rounded-2xl overflow-hidden border border-slate-600 shadow-2xl bg-slate-800">
            {/* Top bar (browser-like) */}
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/90 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <div className="w-3 h-3 rounded-full bg-slate-600" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-700/80 rounded-lg text-slate-400 text-xs max-w-md w-full">
                  <Search className="w-3.5 h-3.5" />
                  <span>app.quantify.io/kilo</span>
                </div>
              </div>
              <div className="w-20" />
            </div>

            <div className="flex min-h-[480px]">
              {/* Left: Sidebar — Historique */}
              <aside className="w-56 sm:w-64 flex-shrink-0 border-r border-slate-700 bg-slate-800/50 flex flex-col">
                <div className="p-3 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200">Historique</span>
                  </div>
                  <button className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {HISTORY_ITEMS.map((item) => (
                    <div
                      key={item.id}
                      className={`mx-2 mb-1 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                        item.active
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-700">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors">
                    <Settings2 className="w-3.5 h-3.5" />
                    Paramètres Kilo
                  </button>
                </div>
              </aside>

              {/* Center: Chat */}
              <div className="flex-1 flex flex-col min-w-0 bg-slate-900/50">
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-slate-700 flex items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center ring-2 ring-amber-500/50">
                    <Bot className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Kilo</p>
                    <p className="text-[11px] text-slate-400">Connecté à vos compteurs · En ligne</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Messages */}
                <div
                  ref={chatRef}
                  className="flex-1 p-4 space-y-4 overflow-y-auto min-h-[240px] max-h-[320px] scroll-smooth"
                >
                  {CHAT_MESSAGES.map((msg, i) => (
                    <ChatBubble key={i} message={msg} visible={i < visibleCount} />
                  ))}
                  {visibleCount < CHAT_MESSAGES.length && started && (
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: '0s' }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div className="px-4 pb-2 flex-shrink-0">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/80 border border-slate-600 rounded-full text-xs font-medium text-slate-300 whitespace-nowrap hover:border-amber-500/50 hover:text-amber-400 transition-colors"
                      >
                        <action.icon className="w-3 h-3" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input area: upload, field, voice, send */}
                <div className="p-4 pt-2 flex-shrink-0">
                  <div className="flex items-end gap-2 bg-slate-800 border border-slate-600 rounded-xl p-2 focus-within:border-amber-500/50 transition-colors">
                    <button
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors flex-shrink-0"
                      title="Joindre un fichier"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <textarea
                      placeholder="Posez une question à Kilo..."
                      rows={1}
                      className="flex-1 min-h-[40px] max-h-24 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none resize-none py-2"
                      readOnly
                    />
                    <button
                      className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors flex-shrink-0"
                      title="Saisie vocale"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors flex-shrink-0"
                      title="Envoyer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 px-1">
                    Pièce jointe et vocal disponibles · Coût en QC affiché avant envoi
                  </p>
                </div>
              </div>

              {/* Right: Context panel (or toggle to reopen) */}
              {!contextOpen ? (
                <button
                  onClick={() => setContextOpen(true)}
                  className="w-9 flex-shrink-0 border-l border-slate-700 bg-slate-800/80 flex flex-col items-center justify-center gap-1 py-4 text-slate-400 hover:bg-slate-700 hover:text-amber-400 transition-colors"
                  title="Ouvrir le panneau Contexte"
                >
                  <Settings2 className="w-4 h-4" />
                  <span className="text-[10px] font-medium">Contexte</span>
                </button>
              ) : null}
              <aside
                className={`${
                  contextOpen ? 'w-52 sm:w-56' : 'w-0'
                } flex-shrink-0 border-l border-slate-700 bg-slate-800/50 flex flex-col transition-[width] duration-200 overflow-hidden`}
              >
                <div className="p-3 border-b border-slate-700 flex items-center justify-between min-w-[208px] sm:min-w-[224px]">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-200">Contexte</span>
                  </div>
                  <button
                    onClick={() => setContextOpen(false)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    aria-label="Fermer le panneau"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-3 px-3 space-y-2 min-w-[208px] sm:min-w-[224px]">
                  <p className="text-[11px] text-slate-500 px-1 mb-2">
                    Données injectées dans cette conversation
                  </p>
                  {CONTEXT_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2.5 rounded-lg ${
                        item.active ? 'bg-slate-700/80' : 'bg-slate-700/40'
                      }`}
                    >
                      <item.icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-200">{item.label}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-600 text-slate-500 hover:border-amber-500/50 hover:text-amber-400/80 text-xs transition-colors mt-2">
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un contexte
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
