import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { readJsonBody } from '@/lib/security/http'
import { z } from 'zod'

const saveContentSchema = z.object({
  section: z.enum(['team', 'impact', 'usecases', 'faq', 'cta']),
  items: z.array(z.object({
    key: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9_.-]+$/),
    value: z.string().max(20_000),
    type: z.enum(['text', 'html', 'json']),
  }).strict()).max(50),
}).strict()

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await readJsonBody(request, 64 * 1024)
  if (!body.ok) return body.response
  const validation = saveContentSchema.safeParse(body.data)
  if (!validation.success) return NextResponse.json({ error: 'Données de contenu invalides.' }, { status: 400 })
  const { section, items } = validation.data

  const supabase = createAdminSupabaseClient()

  await supabase
    .from('landing_content')
    .delete()
    .eq('section', section)

  const rows = items.map((item) => ({
    section,
    key: item.key,
    value: item.value,
    type: item.type,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('landing_content')
    .insert(rows)

  if (error) {
    console.error('[Content] Save error:', error)
    return NextResponse.json({ error: 'Le contenu n’a pas pu être enregistré.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function GET() {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('landing_content')
    .select('*')
    .order('section')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
