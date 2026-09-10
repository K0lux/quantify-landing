'use client'

import { useState } from 'react'
import {
  FileEdit, Users, Leaf, HelpCircle, Layers, Megaphone,
  Save, Loader2, CheckCircle, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp
} from 'lucide-react'

interface ContentItem {
  id?: string
  section: string
  key: string
  value: string
  type: 'text' | 'html' | 'json'
  updated_at?: string
}

const sectionMeta: Record<string, { label: string; icon: typeof FileEdit; description: string }> = {
  team: { label: 'Équipe', icon: Users, description: 'Membres de l\'équipe et rôles' },
  impact: { label: 'Impact', icon: Leaf, description: 'Chiffres et engagement environnemental/social' },
  usecases: { label: 'Cas d\'usage', icon: Layers, description: 'Scénarios d\'utilisation concrets' },
  faq: { label: 'FAQ', icon: HelpCircle, description: 'Questions fréquentes et réponses' },
  cta: { label: 'CTA', icon: Megaphone, description: 'Appel à l\'action et texte final' },
}

const defaultSections: Record<string, ContentItem[]> = {
  team: [
    { section: 'team', key: 'members', value: '[]', type: 'json' },
  ],
  impact: [
    { section: 'impact', key: 'stats', value: '[]', type: 'json' },
    { section: 'impact', key: 'description', value: '', type: 'html' },
  ],
  usecases: [
    { section: 'usecases', key: 'items', value: '[]', type: 'json' },
  ],
  faq: [
    { section: 'faq', key: 'items', value: '[]', type: 'json' },
  ],
  cta: [
    { section: 'cta', key: 'title', value: '', type: 'text' },
    { section: 'cta', key: 'description', value: '', type: 'text' },
    { section: 'cta', key: 'button_text', value: '', type: 'text' },
  ],
}

export function ContentManager({ initialContent }: { initialContent: ContentItem[] }) {
  const [content, setContent] = useState<ContentItem[]>(() => {
    if (initialContent.length > 0) return initialContent

    return Object.values(defaultSections).flat()
  })
  const [saving, setSaving] = useState<string | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [openSection, setOpenSection] = useState<string | null>('team')

  function getItemsForSection(section: string): ContentItem[] {
    return content.filter((c) => c.section === section)
  }

  function updateItem(section: string, key: string, value: string) {
    setContent((prev) =>
      prev.map((c) => (c.section === section && c.key === key ? { ...c, value } : c))
    )
  }

  function addItem(section: string) {
    const newItem: ContentItem = {
      section,
      key: `item_${Date.now()}`,
      value: '',
      type: 'text',
    }
    setContent((prev) => [...prev, newItem])
  }

  function removeItem(section: string, key: string) {
    setContent((prev) => prev.filter((c) => !(c.section === section && c.key === key)))
  }

  async function saveSection(section: string) {
    setSaving(section)
    setResult(null)

    const items = getItemsForSection(section)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, items }),
      })

      if (res.ok) {
        setResult({ success: true, message: `Section "${sectionMeta[section]?.label}" sauvegardée` })
      } else {
        const data = await res.json()
        setResult({ success: false, message: data.error || 'Erreur' })
      }
    } catch {
      setResult({ success: false, message: 'Erreur réseau' })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-4">
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

      {Object.entries(sectionMeta).map(([section, meta]) => {
        const isOpen = openSection === section
        const items = getItemsForSection(section)
        const Icon = meta.icon

        return (
          <div key={section} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setOpenSection(isOpen ? null : section)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-900" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-900">{meta.label}</h3>
                  <p className="text-xs text-slate-500">{meta.description}</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-slate-100 p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">
                        {item.key.replace(/_/g, ' ')}
                      </label>
                      {item.type === 'json' ? (
                        <textarea
                          value={item.value}
                          onChange={(e) => updateItem(section, item.key, e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-900 outline-none resize-none"
                          placeholder="[]"
                        />
                      ) : item.type === 'html' ? (
                        <textarea
                          value={item.value}
                          onChange={(e) => updateItem(section, item.key, e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none resize-none"
                          placeholder="Contenu HTML..."
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => updateItem(section, item.key, e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                          placeholder="Texte..."
                        />
                      )}
                    </div>
                    {!['members', 'items', 'stats', 'title', 'description', 'button_text'].includes(item.key) && (
                      <button
                        onClick={() => removeItem(section, item.key)}
                        className="self-end p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => addItem(section)}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un champ
                  </button>

                  <button
                    onClick={() => saveSection(section)}
                    disabled={saving === section}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white font-bold text-sm rounded-xl hover:bg-blue-800 disabled:opacity-50 transition-all"
                  >
                    {saving === section ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Sauvegarder
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
