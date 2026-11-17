import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { readJsonBody } from '@/lib/security/http'
import { z } from 'zod'

async function requireAdminAccess() {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  return null
}

export async function PATCH(request: NextRequest) {
  const forbidden = await requireAdminAccess()
  if (forbidden) return forbidden

  const body = await readJsonBody(request, 2 * 1024)
  if (!body.ok) return body.response
  const validation = z.object({
    userId: z.string().uuid(),
    status: z.enum(['pending', 'invited', 'converted']),
  }).strict().safeParse(body.data)
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const { userId, status } = validation.data

  const supabase = createAdminSupabaseClient()

  const updateData: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'invited') {
    updateData.invited_at = new Date().toISOString()
  } else if (status === 'converted') {
    updateData.converted_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('waitlist')
    .update(updateData)
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const forbidden = await requireAdminAccess()
  if (forbidden) return forbidden

  const body = await readJsonBody(request, 2 * 1024)
  if (!body.ok) return body.response
  const validation = z.object({ userId: z.string().uuid() }).strict().safeParse(body.data)
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const { userId } = validation.data

  const supabase = createAdminSupabaseClient()

  const { error } = await supabase
    .from('waitlist')
    .delete()
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
