import type { ReactNode } from 'react'
import { Redirect } from '../components/Redirect'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <p className="auth-status" role="status">Loading…</p>
  if (!user) return <Redirect to="/login" />

  return children
}
