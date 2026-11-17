import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { section, items } = await request.json()

  if (!section || !items || !Array.isArray(items)) {
    return NextResponse.json({ error: 'Section and items required' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()

  await supabase
    .from('landing_content')
    .delete()
    .eq('section', section)

  const rows = items.map((item: { key: string; value: string; type: string }) => ({
    section,
    key: item.key,
    value: item.value,
    type: (item.type === 'html' || item.type === 'json' ? item.type : 'text') as
      | 'text'
      | 'html'
      | 'json',
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('landing_content')
    .insert(rows)

  if (error) {
    console.error('[Content] Save error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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
