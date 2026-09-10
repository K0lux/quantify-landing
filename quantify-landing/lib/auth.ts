import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('[Auth] getSession error:', error)
    return null
  }

  return session
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/connexion')
  }

  return user
}

export async function getAuthUserId(): Promise<string | null> {
  const user = await getCurrentUser()
  return user?.id ?? null
}

export async function requireAuthId(): Promise<string> {
  const user = await requireAuth()
  return user.id
}

export async function isAdmin(): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_type')
    .eq('auth_user_id', user.id)
    .single()

  return profile?.user_type === 'admin'
}
