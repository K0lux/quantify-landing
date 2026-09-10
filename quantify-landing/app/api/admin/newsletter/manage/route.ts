import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function DELETE(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { subscriberId } = await request.json()

  if (!subscriberId) {
    return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 })
  }

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
