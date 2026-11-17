'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  type: string | null
  status: string | null
  created_at: string | null
}

const statuses = [
  { value: 'new', label: 'Nouveau' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'resolved', label: 'Résolu' },
  { value: 'closed', label: 'Clôturé' },
  { value: 'spam', label: 'Indésirable' },
]

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export function ContactMessageManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')

  const filtered = messages.filter((message) => {
    const query = search.trim().toLowerCase()
    return !query || [message.name, message.email, message.subject || '', message.message]
      .some((value) => value.toLowerCase().includes(query))
  })

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    setError('')

    try {
      const response = await fetch('/api/admin/contact-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'La mise à jour a échoué.')
        return
      }

      setMessages((current) => current.map((message) => message.id === id ? { ...message, status } : message))
    } catch {
      setError('Connexion impossible. Réessayez.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-4">
      <label className="relative block max-w-lg">
        <span className="sr-only">Rechercher dans les messages</span>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, e-mail, sujet ou contenu…" className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700" />
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      {filtered.length ? filtered.map((message) => (
        <article key={message.id} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-950">{message.subject || 'Sans sujet'}</h2>
              <p className="mt-1 text-sm text-slate-700">{message.name} <span className="text-slate-400">·</span> <a className="text-orange-800 hover:underline" href={`mailto:${message.email}`}>{message.email}</a>{message.phone && <> <span className="text-slate-400">·</span> {message.phone}</>}</p>
              <p className="mt-1 text-xs text-slate-500">{message.type || 'Demande générale'} · {message.created_at ? dateFormatter.format(new Date(message.created_at)) : 'Date indisponible'}</p>
            </div>
            <label className="text-xs font-medium text-slate-500">
              Statut
              <select aria-label={`Statut du message de ${message.name}`} disabled={updating === message.id} value={statuses.some((item) => item.value === message.status) ? message.status || 'new' : 'new'} onChange={(event) => updateStatus(message.id, event.target.value)} className="mt-1 block min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:opacity-60">
                {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{message.message}</p>
        </article>
      )) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center text-sm text-slate-600">Aucun message ne correspond à cette recherche.</p>
      )}
    </div>
  )
}
