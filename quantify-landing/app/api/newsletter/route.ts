// ============================================
// app/api/newsletter/route.ts
// ============================================
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    const validatedData = newsletterSchema.parse(body)
    
    const supabase = createServerSupabaseClient()

    // Vérifier si l'email existe déjà
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', validatedData.email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Cet email est déjà inscrit' },
          { status: 409 }
        )
      } else {
        // Réactiver l'abonnement si désabonné
        await supabase
          .from('newsletter_subscribers')
          .update({ 
            status: 'active',
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        return NextResponse.json({
          success: true,
          message: 'Abonnement réactivé avec succès !',
        })
      }
    }

    // Insérer le nouvel abonné
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({ 
        email: validatedData.email,
        source: 'landing',
        status: 'active'
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      )
    }

    // TODO: Envoyer email de confirmation

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie !',
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    
    //if (error.name === 'ZodError') {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Email invalide', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}