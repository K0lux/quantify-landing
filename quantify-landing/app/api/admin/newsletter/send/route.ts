import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { readJsonBody } from '@/lib/security/http'
import { escapeHtml } from '@/lib/security/escape-html'
import { z } from 'zod'

const newsletterSchema = z.object({
  subject: z.string().trim().min(1).max(150).refine(value => !/[\r\n]/.test(value)),
  body: z.string().trim().min(1).max(12_000),
}).strict()

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

  const requestBody = await readJsonBody(request, 16 * 1024)
  if (!requestBody.ok) return requestBody.response
  const validation = newsletterSchema.safeParse(requestBody.data)
  if (!validation.success) return NextResponse.json({ error: 'Objet ou contenu invalide.' }, { status: 400 })
  const { subject, body } = validation.data

  const supabase = createAdminSupabaseClient()

  const { data: subscribers, count, error } = await supabase
    .from('newsletter_subscribers')
    .select('email', { count: 'exact' })
    .eq('status', 'active')
    .limit(501)

  if (error || !subscribers) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }

  if ((count ?? subscribers.length) > 500) {
    return NextResponse.json({ error: 'Limite de 500 destinataires par envoi. Réduisez l’audience.' }, { status: 413 })
  }

  const emails = subscribers.map((s) => s.email).filter(Boolean)

  if (emails.length === 0) {
    return NextResponse.json({ error: 'No active subscribers', count: 0 }, { status: 404 })
  }

  try {
    const batchSize = 50
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Quantify <newsletter@quantify.app>',
        to: batch,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #001d3d; border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Quantify</h1>
            </div>
            <div style="padding: 32px; color: #334155; font-size: 16px; line-height: 1.6;">
              ${escapeHtml(body).replace(/\r?\n/g, '<br>')}
            </div>
            <div style="background: #f1f5f9; border-radius: 0 0 16px 16px; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>© Quantify ${new Date().getFullYear()} — Vous recevez cet email car vous êtes abonné à notre newsletter.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe" style="color: #64748b;">Se désabonner</a>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true, count: emails.length })
  } catch (err) {
    console.error('[Newsletter] Send error:', err)
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 })
  }
}
