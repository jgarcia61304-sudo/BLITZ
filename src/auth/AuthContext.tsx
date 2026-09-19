import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: Boolean(supabase),
    error: null,
  })

  useEffect(() => {
    if (!supabase) return

    let active = true
    let receivedAuthEvent = false

    // Subscribe before reading storage so a newer auth event wins any race.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        receivedAuthEvent = true
        if (active) {
          setState({ user: session?.user ?? null, loading: false, error: null })
        }
      },
    )

    supabase.auth.getSession().then(({ data, error }) => {
      if (active && !receivedAuthEvent) {
        setState({
          user: data.session?.user ?? null,
          loading: false,
          error: error ? 'Your session could not be restored. Please sign in again.' : null,
        })
      }
    }).catch(() => {
      if (active && !receivedAuthEvent) {
        setState({
          user: null,
          loading: false,
          error: 'Your session could not be restored. Please sign in again.',
        })
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
