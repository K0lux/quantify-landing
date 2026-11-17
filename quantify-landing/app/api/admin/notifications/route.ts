import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 })
  }
  const resend = new Resend(resendApiKey)

  const { audience, title, message } = await request.json()

  if (!title || !message) {
    return NextResponse.json({ error: 'Title and message required' }, { status: 400 })
  }

  const supabase = createAdminSupabaseClient()

  let query = supabase.from('waitlist').select('email, full_name')

  if (audience === 'pending') {
    query = query.eq('status', 'pending')
  } else if (audience === 'invited') {
    query = query.eq('status', 'invited')
  }

  const { data: users, error } = await query

  if (error || !users) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }

  const emails = users.map((u) => u.email).filter(Boolean)

  if (emails.length === 0) {
    return NextResponse.json({ error: 'No users found', count: 0 }, { status: 404 })
  }

  try {
    const batchSize = 50
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Quantify <noreply@quantify.app>',
        to: batch,
        subject: title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
            <div style="background: #001d3d; border-radius: 16px; padding: 32px; color: white; text-align: center;">
              <h1 style="margin: 0 0 8px; font-size: 24px;">${title}</h1>
            </div>
            <div style="padding: 24px 0; color: #334155; font-size: 16px; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <div style="text-align: center; padding: 16px 0; color: #94a3b8; font-size: 12px;">
              © Quantify ${new Date().getFullYear()}
            </div>
          </div>
        `,
      })
    }

    await supabase.from('admin_notifications').insert({
      title,
      message,
      audience,
      recipients_count: emails.length,
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, count: emails.length })
  } catch (err) {
    console.error('[Notifications] Send error:', err)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}
