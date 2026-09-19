import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { Seo, StorefrontConfig } from '../types/storefront'
import { fontStack, hasText, readableOn } from './format'
import { Booking } from './sections/Booking'
import { Faq } from './sections/Faq'
import { Footer } from './sections/Footer'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Hours } from './sections/Hours'
import { Policies } from './sections/Policies'
import { ServiceArea } from './sections/ServiceArea'
import { Services } from './sections/Services'
import { StickyBar } from './sections/StickyBar'

// Brand values become custom properties on the storefront root. Everything
// else in storefront.css mixes down from these, so a config fully determines
// how its storefront looks.
function brandStyle(config: StorefrontConfig): CSSProperties {
  const colors = config?.brand?.colors
  const fonts = config?.brand?.fonts
  const vars: Record<string, string> = {}
  const set = (name: string, value: string | undefined) => {
    if (hasText(value)) vars[name] = value
  }

  set('--sf-bg', colors?.background)
  set('--sf-text', colors?.text)
  set('--sf-primary', colors?.primary)
  set('--sf-accent', colors?.accent)
  if (hasText(colors?.primary)) vars['--sf-on-primary'] = readableOn(colors.primary)
  if (hasText(colors?.accent)) vars['--sf-on-accent'] = readableOn(colors.accent)
  set('--sf-font-display', fontStack(fonts?.display, 'display'))
  set('--sf-font-body', fontStack(fonts?.body, 'body'))

  return vars as CSSProperties
}

function useDocumentMeta(seo: Seo | undefined) {
  useEffect(() => {
    const previousTitle = document.title
    const title = seo?.title
    if (hasText(title)) document.title = title

    const description = seo?.description
    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = tag?.getAttribute('content') ?? null
    let created = false
    if (hasText(description)) {
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
        created = true
      }
      tag.setAttribute('content', description)
    }

    return () => {
      document.title = previousTitle
      if (created) tag?.remove()
      else if (tag && previousDescription !== null) tag.setAttribute('content', previousDescription)
    }
  }, [seo])
}

export function Storefront({ config }: { config: StorefrontConfig }) {
  const sentinel = useRef<HTMLDivElement>(null)
  useDocumentMeta(config?.seo)

  // Every booking call to action points at the booking section, so they all
  // disappear together when a config carries no booking settings.
  const showBooking = Boolean(config?.booking)

  return (
    <div className="storefront" style={brandStyle(config)}>
      <main>
        <Hero brand={config?.brand} showCta={showBooking} />
        <div ref={sentinel} aria-hidden="true" />
        <Services services={config?.services} />
        <Gallery gallery={config?.gallery} />
        <Booking booking={config?.booking} />
        <ServiceArea area={config?.service_area} booking={config?.booking} />
        <Hours availability={config?.availability} />
        <Policies policies={config?.policies} />
        <Faq faq={config?.faq} />
      </main>
      <Footer brand={config?.brand} contact={config?.contact} />
      {showBooking && <StickyBar watch={sentinel} />}
    </div>
  )
}
