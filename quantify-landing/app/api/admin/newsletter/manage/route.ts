import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { readJsonBody } from '@/lib/security/http'
import { z } from 'zod'

export async function DELETE(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const body = await readJsonBody(request, 2 * 1024)
  if (!body.ok) return body.response
  const validation = z.object({ subscriberId: z.string().uuid() }).strict().safeParse(body.data)
  if (!validation.success) {
    return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 })
  }
  const { subscriberId } = validation.data

  const supabase = createAdminSupabaseClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .delete()
    .eq('id', subscriberId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
