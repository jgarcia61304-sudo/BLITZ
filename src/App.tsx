import { useAuth } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Redirect } from './components/Redirect'
import { Admin } from './pages/Admin'
import { Login } from './pages/Login'
import { Portal } from './pages/Portal'
import { StorefrontRoute } from './storefront/StorefrontRoute'

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

function BlitzRoutes() {
  const { user, loading } = useAuth()
  const path = currentPath()

  if (path === '/login') return <Login />
  if (path === '/admin') return <ProtectedRoute><Admin /></ProtectedRoute>
  if (path === '/portal') return <ProtectedRoute><Portal /></ProtectedRoute>

  if (loading) return <p className="auth-status" role="status">Loading…</p>
  return <Redirect to={user ? '/admin' : '/login'} />
}

export default function App() {
  const storefront = /^\/s\/([^/]+)$/.exec(currentPath())

  // Storefronts render outside .blitz-app, and outside the BLITZ shell, so
  // they cannot inherit a single token from tokens.css.
  if (storefront) return <StorefrontRoute slug={decodeURIComponent(storefront[1])} />

  return (
    <div className="blitz-app min-h-dvh">
      <header className="app-header">
        <span className="app-name">BLITZ</span>
      </header>
      <BlitzRoutes />
    </div>
  )
}
