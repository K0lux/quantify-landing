'use client'

import { useState } from 'react'
import { Search, UserCheck, Trash2, Mail, Filter, Loader2 } from 'lucide-react'

interface WaitlistUser {
  id: string
  full_name: string
  email: string
  phone?: string
  country: string
  user_type: string
  status: string
  position: number
  referral_code: string
  referred_by?: string
  created_at: string
}

export function WaitlistManager({ initialUsers }: { initialUsers: WaitlistUser[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = users.filter((u) => {
    const matchSearch = !search || 
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    return matchSearch && matchStatus
  })

  async function updateStatus(userId: string, newStatus: string) {
    setLoading(userId)
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
        )
      }
    } catch (err) {
      console.error('Update failed:', err)
    } finally {
      setLoading(null)
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm('Supprimer cet utilisateur de la waitlist ?')) return
    setLoading(userId)
    try {
      const res = await fetch('/api/admin/waitlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId))
      }
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none"
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="invited">Invités</option>
            <option value="converted">Convertis</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">#</th>
              <th className="text-left px-4 py-3 font-semibold">Utilisateur</th>
              <th className="text-left px-4 py-3 font-semibold">Pays</th>
              <th className="text-left px-4 py-3 font-semibold">Type</th>
              <th className="text-left px-4 py-3 font-semibold">Code</th>
              <th className="text-left px-4 py-3 font-semibold">Statut</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                  {user.position}
                </td>
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-900">{user.full_name}</p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-700">{user.country}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                    {user.user_type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">{user.referral_code}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    user.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    user.status === 'invited' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user.status === 'pending' ? 'En attente' :
                     user.status === 'invited' ? 'Invité' : 'Actif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {loading === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    ) : (
                      <>
                        {user.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(user.id, 'invited')}
                            title="Inviter"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                        {user.status === 'invited' && (
                          <button
                            onClick={() => updateStatus(user.id, 'converted')}
                            title="Marquer comme converti"
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          title="Supprimer"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Aucun résultat trouvé
          </div>
        )}
      </div>
    </div>
  )
}
