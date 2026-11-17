import { redirect } from 'next/navigation'
import { randomUUID } from 'node:crypto'
import { getCurrentUser } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

export type DashboardWaitlistUser = Database['public']['Tables']['waitlist']['Row']

const waitlistColumns = 'id, auth_user_id, email, phone, full_name, country, user_type, referral_code, referred_by, position, status, created_at, updated_at, invited_at, converted_at'

export async function getDashboardAccount() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/connexion')
  }

  const supabase = createAdminSupabaseClient()
  const { data: linkedWaitlistUser } = await supabase
    .from('waitlist')
    .select(waitlistColumns)
    .eq('auth_user_id', user.id)
    .maybeSingle()

  let waitlistUser = linkedWaitlistUser

  if (!waitlistUser && user.email) {
    const { data: waitlistUserByEmail } = await supabase
      .from('waitlist')
      .select(waitlistColumns)
      .eq('email', user.email.toLowerCase())
      .maybeSingle()

    if (waitlistUserByEmail && (!waitlistUserByEmail.auth_user_id || waitlistUserByEmail.auth_user_id === user.id)) {
      waitlistUser = waitlistUserByEmail

      if (!waitlistUser.auth_user_id) {
        const { data: linkedUser } = await supabase
          .from('waitlist')
          .update({ auth_user_id: user.id, updated_at: new Date().toISOString() })
          .eq('id', waitlistUser.id)
          .is('auth_user_id', null)
          .select(waitlistColumns)
          .maybeSingle()

        if (linkedUser) {
          waitlistUser = linkedUser
        } else {
          const { data: refreshedUser } = await supabase
            .from('waitlist')
            .select(waitlistColumns)
            .eq('id', waitlistUser.id)
            .maybeSingle()
          waitlistUser = refreshedUser?.auth_user_id === user.id ? refreshedUser : null
        }
      }
    }
  }

  if (!waitlistUser) {
    redirect('/rejoindre')
  }

  if (!waitlistUser.referral_code) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const referralCode = randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase()
      const { data: existingCode } = await supabase
        .from('waitlist')
        .select('id')
        .eq('referral_code', referralCode)
        .maybeSingle()

      if (existingCode) continue

      const { data: updatedUser } = await supabase
        .from('waitlist')
        .update({ referral_code: referralCode, updated_at: new Date().toISOString() })
        .eq('id', waitlistUser.id)
        .is('referral_code', null)
        .select(waitlistColumns)
        .maybeSingle()

      if (updatedUser) {
        waitlistUser = updatedUser
        break
      }
    }
  }

  return { user, supabase, waitlistUser }
}
