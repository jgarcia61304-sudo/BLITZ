import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { parseStorefront } from '../types/storefront'
import type { StorefrontContent } from '../types/storefront'
import { StorefrontNotFound } from './NotFound'
import { Storefront } from './Storefront'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/inter'
import '../styles/storefront.css'

type State =
  | { status: 'loading' }
  | { status: 'ready'; content: StorefrontContent }
  | { status: 'held' }

/*
 * Reads the public storefronts view, never the businesses table, so no CRM
 * column is reachable from an unauthenticated page.
 *
 * Fails closed: content that does not satisfy the schema holds the storefront
 * rather than rendering a half-built page.
 */
export function StorefrontRoute({ slug }: { slug: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    if (!supabase) {
      setState({ status: 'held' })
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
        if (error || !data?.storefront_config) {
          setState({ status: 'held' })
          return
        }
        const parsed = parseStorefront(data.storefront_config)
        if (!parsed.success) {
          console.error('Storefront held — content failed validation:', parsed.error.issues)
          setState({ status: 'held' })
          return
        }
        setState({ status: 'ready', content: parsed.data })
      })

    return () => {
      active = false
    }
  }, [slug])

  if (state.status === 'loading') return null
  if (state.status === 'held') return <StorefrontNotFound />
  return <Storefront content={state.content} />
}
