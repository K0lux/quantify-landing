'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoaderCircle, Save } from 'lucide-react'

interface SettingsValues {
  profile: {
    first_name: string
    last_name: string
    email: string
    phone: string
    country: string
    user_type: string
  }
  energy: {
    interests: string[]
    estimated_consumption: string
    current_utility: string
    has_analog_meter: boolean
  }
  notifications: {
    email: boolean
    sms: boolean
    marketing: boolean
  }
}

const fieldClass = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700'

export function SettingsForm({ initialValues }: { initialValues: SettingsValues }) {
  const router = useRouter()
  const [values, setValues] = useState(initialValues)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null)

  async function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          energy: {
            ...values.energy,
            interests: values.energy.interests
              .map((interest) => interest.trim())
              .filter(Boolean),
          },
        }),
      })
      const result = await response.json()

      setMessage({ success: response.ok, text: result.message || 'Une erreur est survenue.' })
      if (response.ok) router.refresh()
    } catch {
      setMessage({ success: false, text: 'Connexion impossible. Réessayez.' })
    } finally {
      setSaving(false)
    }
  }

  function updateProfile<K extends keyof SettingsValues['profile']>(key: K, value: SettingsValues['profile'][K]) {
    setValues((current) => ({ ...current, profile: { ...current.profile, [key]: value } }))
  }

  function updateEnergy<K extends keyof SettingsValues['energy']>(key: K, value: SettingsValues['energy'][K]) {
    setValues((current) => ({ ...current, energy: { ...current.energy, [key]: value } }))
  }

  function updateNotification(key: keyof SettingsValues['notifications'], value: boolean) {
    setValues((current) => ({ ...current, notifications: { ...current.notifications, [key]: value } }))
  }

  return (
    <form onSubmit={saveSettings} className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-950">Profil</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Prénom
            <input className={fieldClass} autoComplete="given-name" required value={values.profile.first_name} onChange={(event) => updateProfile('first_name', event.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Nom
            <input className={fieldClass} autoComplete="family-name" value={values.profile.last_name} onChange={(event) => updateProfile('last_name', event.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Adresse e-mail
            <input className={`${fieldClass} bg-slate-50`} type="email" value={values.profile.email} readOnly aria-describedby="email-help" />
            <span id="email-help" className="mt-1 block text-xs font-normal text-slate-500">Contactez le support pour changer votre adresse.</span>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Téléphone
            <input className={fieldClass} type="tel" autoComplete="tel" placeholder="+228 90 00 00 00" value={values.profile.phone} onChange={(event) => updateProfile('phone', event.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Pays
            <select className={fieldClass} value={values.profile.country} onChange={(event) => updateProfile('country', event.target.value)}>
              <option value="TG">Togo</option>
              <option value="BJ">Bénin</option>
              <option value="BF">Burkina Faso</option>
              <option value="CI">Côte d’Ivoire</option>
              <option value="GW">Guinée-Bissau</option>
              <option value="ML">Mali</option>
              <option value="NE">Niger</option>
              <option value="SN">Sénégal</option>
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Profil d’usage
            <select className={fieldClass} value={values.profile.user_type} onChange={(event) => updateProfile('user_type', event.target.value)}>
              <option value="particulier">Particulier</option>
              <option value="professionnel">Professionnel</option>
              <option value="institution">Institution</option>
              <option value="utility">Fournisseur d’énergie</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-950">Votre situation énergétique</h2>
        <p className="mt-1 text-sm text-slate-600">Ces informations nous aident à adapter Quantify à vos besoins.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Consommation estimée
            <input className={fieldClass} placeholder="Ex. 150 kWh par mois" value={values.energy.estimated_consumption} onChange={(event) => updateEnergy('estimated_consumption', event.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Fournisseur actuel
            <input className={fieldClass} placeholder="Ex. CEET" value={values.energy.current_utility} onChange={(event) => updateEnergy('current_utility', event.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Centres d’intérêt
            <input className={fieldClass} placeholder="Suivi de consommation, économies…" value={values.energy.interests.join(', ')} onChange={(event) => updateEnergy('interests', event.target.value.split(','))} />
            <span className="mt-1 block text-xs font-normal text-slate-500">Séparez les intérêts par des virgules.</span>
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-700 sm:col-span-2">
            <input className="h-4 w-4 rounded border-slate-300 accent-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700" type="checkbox" checked={values.energy.has_analog_meter} onChange={(event) => updateEnergy('has_analog_meter', event.target.checked)} />
            J’utilise actuellement un compteur analogique.
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-950">Notifications</h2>
        <div className="mt-4 space-y-3">
          {([
            ['email', 'E-mails liés à mon compte'],
            ['sms', 'Messages SMS importants'],
            ['marketing', 'Actualités et offres Quantify'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-slate-700">
              <input className="h-4 w-4 rounded border-slate-300 accent-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700" type="checkbox" checked={values.notifications[key]} onChange={(event) => updateNotification(key, event.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      </section>

      {message && (
        <p role="status" aria-live="polite" className={`text-sm ${message.success ? 'text-emerald-700' : 'text-red-700'}`}>
          {message.text}
        </p>
      )}

      <button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700">
        {saving ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
        {saving ? 'Enregistrement…' : 'Enregistrer les paramètres'}
      </button>
    </form>
  )
}
