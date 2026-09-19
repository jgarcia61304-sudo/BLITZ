import { useEffect } from 'react'

export function Redirect({ to }: { to: '/admin' | '/login' }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  return null
}
