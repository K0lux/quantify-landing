// ============================================
// app/api/newsletter/route.ts
// ============================================
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { readJsonBody } from '@/lib/security/http'

const newsletterSchema = z.object({
  email: z.string().trim().max(254).email('Email invalide').toLowerCase(),
  website: z.string().max(200).optional().default(''),
}).strict()

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody(request, 2 * 1024)
    if (!body.ok) return body.response

    const validation = newsletterSchema.safeParse(body.data)
    if (!validation.success) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
    }
    const validatedData = validation.data

    if (validatedData.website) {
      return NextResponse.json({ success: true, message: 'Inscription réussie !' })
    }
    
    const supabase = createAdminSupabaseClient()

    // Vérifier si l'email existe déjà
    const { data: existing, error: lookupError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', validatedData.email)
      .maybeSingle()

    if (lookupError) {
      console.error('Newsletter lookup error:', lookupError)
      return NextResponse.json({ error: 'Impossible de vérifier cet email.' }, { status: 500 })
    }

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'Cet email est déjà inscrit' },
          { status: 409 }
        )
      } else {
        // Réactiver l'abonnement si désabonné
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({ 
            status: 'active',
            subscribed_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Newsletter reactivation error:', updateError)
          return NextResponse.json({ error: 'Impossible de réactiver cet abonnement.' }, { status: 500 })
        }

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
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
