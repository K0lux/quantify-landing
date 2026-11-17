import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new', 'in_progress', 'resolved', 'closed', 'spam']),
})

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
  }

  const body = await request.json().catch(() => null)
  const validation = updateSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()
  const { error } = await supabase
    .from('contact_messages')
    .update({ status: validation.data.status })
    .eq('id', validation.data.id)

  if (error) {
    console.error('[AdminContactMessages] Status update failed:', error)
    return NextResponse.json({ error: 'Impossible de mettre à jour le message.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
