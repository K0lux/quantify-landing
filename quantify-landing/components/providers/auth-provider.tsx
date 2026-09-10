'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthContext, type AuthState } from '@/hooks/use-auth'
import type { Session } from '@supabase/supabase-js'

interface AuthProviderProps {
  children: React.ReactNode
  initialSession?: Session | null
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const initialized = useRef(false)
  const [state, setState] = useState<AuthState>({
    user: initialSession?.user ?? null,
    session: initialSession ?? null,
    isLoading: true,
    isAuthenticated: !!initialSession?.user,
  })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        initialized.current = true
        setState({
          user: session?.user ?? null,
          session,
          isLoading: false,
          isAuthenticated: !!session?.user,
        })

        if (event === 'SIGNED_OUT') {
          router.push('/')
          router.refresh()
        }

        if (event === 'TOKEN_REFRESHED') {
          router.refresh()
        }

        // SIGNED_IN is handled by login/register forms via window.location
        // Calling router.refresh() here causes a race condition
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.refreshSession()
    setState({
      user: session?.user ?? null,
      session,
      isLoading: false,
      isAuthenticated: !!session?.user,
    })
  }, [supabase])

  return (
    <AuthContext.Provider value={{ ...state, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}
