import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(): Promise<NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  } catch (error) {
    console.error('[Auth Logout] Error:', error)
    return NextResponse.json(
      { success: false, code: 'INTERNAL_ERROR', message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
