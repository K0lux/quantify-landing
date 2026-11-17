// ============================================
// app/api/contact/route.ts
// ============================================
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, type } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tous les champs requis doivent être remplis' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Insérer le message
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        phone,
        subject,
        message,
        type: type || 'general',
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
