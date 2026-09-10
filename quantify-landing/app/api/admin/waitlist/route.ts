import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

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

  const { userId, status } = await request.json()

  if (!userId || !['pending', 'invited', 'converted'].includes(status)) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

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

  const { userId } = await request.json()

  if (!userId) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

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
