'use client'

import { useState } from 'react'
import { Send, Mail, Loader2, CheckCircle, AlertCircle, Search, Trash2, Users } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  status: string
  source: string
  subscribed_at: string
}

export function NewsletterManager({
  initialSubscribers,
  activeCount,
}: {
  initialSubscribers: Subscriber[]
  activeCount: number
}) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [search, setSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [tab, setTab] = useState<'send' | 'subscribers'>('send')

  const filtered = subscribers.filter(
    (s) => !search || s.email.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !body.trim()) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ success: true, message: `Newsletter envoyée à ${data.count} abonné(s)` })
        setSubject('')
        setBody('')
      } else {
        setResult({ success: false, message: data.error || 'Erreur' })
      }
    } catch {
      setResult({ success: false, message: 'Erreur réseau' })
    } finally {
      setSending(false)
    }
  }

  async function removeSubscriber(id: string) {
    if (!confirm('Retirer cet abonné ?')) return

    try {
      const res = await fetch('/api/admin/newsletter/manage', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriberId: id }),
      })
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (err) {
      console.error('Remove failed:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('send')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'send' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Send className="w-4 h-4" />
          Envoyer
        </button>
        <button
          onClick={() => setTab('subscribers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            tab === 'subscribers' ? 'bg-blue-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          Abonnés ({activeCount})
        </button>
      </div>

      {tab === 'send' && (
        <form onSubmit={handleSend} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div>
            <label htmlFor="nl-subject" className="block text-sm font-semibold text-slate-600 mb-1">
              Objet
            </label>
            <input
              id="nl-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Ex: Quantify — Les nouveautés du mois"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-sm"
            />
          </div>

          <div>
            <label htmlFor="nl-body" className="block text-sm font-semibold text-slate-600 mb-1">
              Contenu (HTML supporté)
            </label>
            <textarea
              id="nl-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={10}
              placeholder="Rédigez votre newsletter..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none text-sm resize-none font-mono"
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
            disabled={sending || !subject.trim() || !body.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-all"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            Envoyer à {activeCount} abonné(s)
          </button>
        </form>
      )}

      {tab === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Source</th>
                <th className="text-left px-4 py-3 font-semibold">Statut</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{sub.email}</td>
                  <td className="px-4 py-3 text-slate-500">{sub.source}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {sub.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {new Date(sub.subscribed_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeSubscriber(sub.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Retirer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
