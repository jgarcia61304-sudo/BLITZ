import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'
import { Redirect } from '../components/Redirect'
import { supabase } from '../lib/supabase'

export function Login() {
  const { user, loading, error: sessionError } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || submitting) return

    setSubmitting(true)
    setError(null)
    setMessage(null)

    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        })

        if (authError) throw authError
        if (!data.session) {
          setMessage('Check your email to confirm your account, then sign in.')
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
        if (authError) throw authError
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="auth-status" role="status">Loading…</p>
  if (user) return <Redirect to="/admin" />

  return (
    <main className="auth-content">
      <section className="auth-card" aria-labelledby="login-heading">
        <h1 id="login-heading" className="page-heading">{isSignUp ? 'Sign up' : 'Sign in'}</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="email">
            Email
            <input
              className="text-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
            />
          </label>
          <label className="field-label" htmlFor="password">
            Password
            <input
              className="text-input"
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              minLength={isSignUp ? 6 : undefined}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={submitting}
            />
          </label>
          {!supabase && (
            <p className="form-message" role="status">Sign-in is not configured yet.</p>
          )}
          {(error || sessionError) && (
            <p className="form-message" role="alert">{error || sessionError}</p>
          )}
          {message && <p className="form-message" role="status">{message}</p>}
          <button className="primary-button" type="submit" disabled={submitting || !supabase}>
            {submitting ? 'Please wait…' : isSignUp ? 'Sign up' : 'Sign in'}
          </button>
        </form>
        <button
          className="text-button"
          type="button"
          disabled={submitting}
          onClick={() => {
            setIsSignUp(!isSignUp)
            setPassword('')
            setError(null)
            setMessage(null)
          }}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'Create an account'}
        </button>
      </section>
    </main>
  )
}
