import { Metadata } from 'next'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { ContentManager } from '@/components/admin/content-manager'

export const metadata: Metadata = {
  title: 'Contenu - Admin Quantify',
}

async function getContent() {
  const supabase = createAdminSupabaseClient()

  const { data } = await supabase
    .from('landing_content')
    .select('*')
    .order('section')

  return (data ?? []).map((item) => ({
    ...item,
    value: item.value ?? '',
    type: item.type ?? 'text',
    updated_at: item.updated_at ?? undefined,
  }))
}

export default async function AdminContentPage() {
  const content = await getContent()

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Contenu de la Landing Page
        </h1>
        <p className="text-slate-600 mt-1">
          Modifiez les sections de la page d&apos;accueil
        </p>
      </div>

      <ContentManager initialContent={content} />
    </div>
  )
}
