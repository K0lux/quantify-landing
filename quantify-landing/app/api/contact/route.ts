// ============================================
// app/api/contact/route.ts
// ============================================
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validation/schemas'
import { readJsonBody } from '@/lib/security/http'

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request, 8 * 1024)
    if (!body.ok) return body.response

    const validation = contactFormSchema.safeParse(body.data)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Vérifiez les champs du formulaire.', details: validation.error.flatten() },
        { status: 400 }
      )
    }

    if (validation.data.website) {
      return NextResponse.json({ success: true, message: 'Message envoyé avec succès' })
    }

    const supabase = createAdminSupabaseClient()
    const { name, email, phone, company, subject, message, type } = validation.data

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        subject,
        message: company ? `Entreprise : ${company}\n\n${message}` : message,
        type,
        status: 'new'
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    // TODO: Envoyer une notification email à l'équipe

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès'
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
