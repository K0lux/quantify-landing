'use client'

import { useState } from 'react'
import { LoaderCircle, Save } from 'lucide-react'

interface AdminProfile {
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
}

const inputClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700'

export function AdminProfileForm({ initialProfile }: { initialProfile: AdminProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setResult(null)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: profile.first_name.trim(),
          last_name: profile.last_name.trim(),
          phone: profile.phone.trim(),
          country: profile.country,
        }),
      })
      const data = await response.json()
      setResult({ success: response.ok, message: data.message || 'Une erreur est survenue.' })
    } catch {
      setResult({ success: false, message: 'Connexion impossible. Réessayez.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Prénom
          <input required autoComplete="given-name" className={inputClass} value={profile.first_name} onChange={(event) => setProfile((current) => ({ ...current, first_name: event.target.value }))} />
        </label>
        <label className="text-sm font-medium text-slate-700">Nom
          <input autoComplete="family-name" className={inputClass} value={profile.last_name} onChange={(event) => setProfile((current) => ({ ...current, last_name: event.target.value }))} />
        </label>
        <label className="text-sm font-medium text-slate-700">Adresse e-mail
          <input type="email" className={`${inputClass} bg-slate-50`} value={profile.email} readOnly />
        </label>
        <label className="text-sm font-medium text-slate-700">Téléphone
          <input type="tel" autoComplete="tel" placeholder="+228 90 00 00 00" className={inputClass} value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} />
        </label>
        <label className="text-sm font-medium text-slate-700">Pays
          <select className={inputClass} value={profile.country} onChange={(event) => setProfile((current) => ({ ...current, country: event.target.value }))}>
            <option value="TG">Togo</option><option value="BJ">Bénin</option><option value="BF">Burkina Faso</option><option value="CI">Côte d’Ivoire</option><option value="GW">Guinée-Bissau</option><option value="ML">Mali</option><option value="NE">Niger</option><option value="SN">Sénégal</option>
          </select>
        </label>
      </div>

      {result && <p role="status" aria-live="polite" className={`text-sm ${result.success ? 'text-emerald-700' : 'text-red-700'}`}>{result.message}</p>}

      <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
        {saving ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
