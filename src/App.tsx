import { useAuth } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { Redirect } from './components/Redirect'
import { Admin } from './pages/Admin'
import { Login } from './pages/Login'
import { Portal } from './pages/Portal'

function Routes() {
  const { user, loading } = useAuth()
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return <Login />
  if (path === '/admin') return <ProtectedRoute><Admin /></ProtectedRoute>
  if (path === '/portal') return <ProtectedRoute><Portal /></ProtectedRoute>

  if (loading) return <p className="auth-status" role="status">Loading…</p>
  return <Redirect to={user ? '/admin' : '/login'} />
}

export default function App() {
  return (
    <div className="blitz-app min-h-dvh">
      <header className="app-header">
        <span className="app-name">BLITZ</span>
      </header>
      <Routes />
    </div>
  )
}
