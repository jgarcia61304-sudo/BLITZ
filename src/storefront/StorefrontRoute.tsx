import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { StorefrontConfig } from '../types/storefront'
import { StorefrontNotFound } from './NotFound'
import { Storefront } from './Storefront'
import '../styles/storefront.css'

type State =
  | { status: 'loading' }
  | { status: 'found'; config: StorefrontConfig }
  | { status: 'missing' }

// Reads the public storefronts view, never the businesses table, so no CRM
// column is reachable from an unauthenticated page.
export function StorefrontRoute({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!supabase) {
      setState({ status: 'missing' })
      return
    }

    let active = true
    void supabase
      .from('storefronts')
      .select('storefront_config')
      .eq('slug', slug)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        const config = data?.storefront_config as StorefrontConfig | null | undefined
        setState(error || !config ? { status: 'missing' } : { status: 'found', config })
      })

    return () => {
      active = false
    }
  }, [slug])

  if (state.status === 'loading') return null
  if (state.status === 'missing') return <StorefrontNotFound />
  return <Storefront config={state.config} />
}
