// ============================================
// components/forms/contact-form.tsx
// ============================================
'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'
import { useToast } from '@/components/features/toast'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'general',
    website: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi')
      }

      setSubmitted(true)
      showToast('Message envoyé avec succès !', 'success')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'general',
        website: '',
      })

      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      showToast('Erreur lors de l\'envoi du message', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">
          Message envoyé !
        </h3>
        <p className="text-slate-600">
          Nous vous répondrons dans les 24-48 heures
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl p-8 shadow-lg">
      <div className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Laisser ce champ vide</label>
        <input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(event) => setFormData({ ...formData, website: event.target.value })} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            maxLength={100}
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Koffi Mensah"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            maxLength={254}
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="koffi@example.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            maxLength={30}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="+228 90 00 00 00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Type de demande <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="general">Question générale</option>
            <option value="investment">Investissement</option>
            <option value="partnership">Partenariat</option>
            <option value="support">Support technique</option>
            <option value="press">Presse & Média</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Sujet <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          maxLength={200}
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Objet de votre message"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={6}
          maxLength={2000}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Décrivez votre demande en détail..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-[#FF8C42] to-[#E04400] text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Envoi en cours...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Envoyer le message</span>
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 text-center">
        En envoyant ce formulaire, vous acceptez que nous utilisions vos données pour vous répondre.
      </p>
    </form>
  )
}
