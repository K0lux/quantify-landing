'use client'

import { useState } from 'react'
import { Send, Users, UserCheck, Bell, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

const audiences = [
  { id: 'all', label: 'Tous les inscrits', icon: Users },
  { id: 'pending', label: 'En attente seulement', icon: Bell },
  { id: 'invited', label: 'Invités seulement', icon: UserCheck },
]

export function NotificationSender() {
  const [audience, setAudience] = useState('all')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audience, title, message }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: `Notification envoyée à ${data.count} utilisateur(s)` })
        setTitle('')
        setMessage('')
      } else {
        setResult({ success: false, message: data.error || 'Erreur' })
      }
    } catch {
      setResult({ success: false, message: 'Erreur réseau' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Audience selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Audience cible</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {audiences.map((a) => (
            <button
              key={a.id}
              onClick={() => setAudience(a.id)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                audience === a.id
                  ? 'border-blue-900 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <a.icon className={`w-5 h-5 ${audience === a.id ? 'text-blue-900' : 'text-slate-400'}`} />
              <span className={`text-sm font-semibold ${audience === a.id ? 'text-blue-900' : 'text-slate-600'}`}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Message form */}
      <form onSubmit={handleSend} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-700 mb-2">Composer la notification</h3>

        <div>
          <label htmlFor="notif-title" className="block text-sm font-semibold text-slate-600 mb-1">
            Titre
          </label>
          <input
            id="notif-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Ex: Nouvelle mise à jour disponible"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-sm"
          />
        </div>

        <div>
          <label htmlFor="notif-message" className="block text-sm font-semibold text-slate-600 mb-1">
            Message
          </label>
          <textarea
            id="notif-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="Rédigez votre notification..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-sm resize-none"
          />
        </div>

        {result && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
            result.success
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {result.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {result.message}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !title.trim() || !message.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-all"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          Envoyer la notification
        </button>
      </form>
    </div>
  )
}
