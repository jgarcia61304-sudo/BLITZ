import { useEffect } from 'react'
import type { StorefrontContent } from '../types/storefront'
import { Reveal } from './Reveal'
import { hasText } from './format'
import { useSmoothScroll } from './scroll'
import { Faq } from './sections/Faq'
import { Footer } from './sections/Footer'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Location } from './sections/Location'
import { MoneyEngine } from './sections/MoneyEngine'
import { Offers } from './sections/Offers'
import { ProofBar } from './sections/ProofBar'
import { Reviews } from './sections/Reviews'
import { Services } from './sections/Services'
import { StickyBar } from './sections/StickyBar'

const ACTION_LABEL = { beauty: 'Book Now', events: 'Get a Quote', fitness: 'Subscribe' } as const

function useDocumentMeta(content: StorefrontContent) {
  useEffect(() => {
    const previousTitle = document.title
    const title = `${content.business.name} — ${content.business.tagline}`
    document.title = title

    let tag = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDescription = tag?.getAttribute('content') ?? null
    let created = false
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
      created = true
    }
    tag.setAttribute('content', `${content.business.tagline} ${content.business.serviceArea}.`)

    return () => {
      document.title = previousTitle
      if (created) tag?.remove()
      else if (tag && previousDescription !== null) tag.setAttribute('content', previousDescription)
    }
  }, [content])
}

/*
 * Section order is fixed by docs/storefront-spec.md and does not vary:
 * Hero -> ProofBar -> Services -> Gallery -> MoneyEngine -> Reviews -> FAQ
 * -> Location -> Footer, plus a persistent StickyBar.
 */
export function Storefront({ content }: { content: StorefrontContent }) {
  useSmoothScroll()
  useDocumentMeta(content)

  const vertical = content.business.category
  const fromPrice = Math.min(...content.services.map((service) => service.price))
  const showLocation =
    hasText(content.contact.address) ||
    hasText(content.business.serviceArea) ||
    Object.keys(content.contact.hours ?? {}).length > 0

  return (
    <div className="storefront" data-theme={content.theme}>
      <main>
        <Hero content={content} />
        <ProofBar proof={content.proof} />

        {/*
          After Hero, before Services. It sits below ProofBar rather than above
          it because ProofBar is pulled up over the Hero with a negative margin;
          inserting anything between the two would break that overlap.
        */}
        {content.offers && content.offers.length > 0 && (
          <Reveal className="sf-section sf-offers" aria-labelledby="sf-offers-title">
            <Offers offers={content.offers} contactEmail={content.contact.email} />
          </Reveal>
        )}

        <Reveal className="sf-section" aria-labelledby="sf-services-title">
          <Services services={content.services} />
        </Reveal>

        <Reveal className="sf-section" aria-labelledby="sf-gallery-title">
          <Gallery photos={content.photos} businessName={content.business.name} />
        </Reveal>

        <Reveal className="sf-section sf-money" id="book" aria-labelledby="sf-money-title">
          <MoneyEngine vertical={vertical} money={content.money} fromPrice={fromPrice} />
        </Reveal>

        <Reveal className="sf-section" aria-labelledby="sf-reviews-title">
          <Reviews reviews={content.reviews} />
        </Reveal>

        <Reveal className="sf-section" aria-labelledby="sf-faq-title">
          <Faq faq={content.faq} />
        </Reveal>

        {showLocation && (
          <Reveal className="sf-section" aria-labelledby="sf-location-title">
            <Location contact={content.contact} serviceArea={content.business.serviceArea} />
          </Reveal>
        )}
      </main>

      <Footer business={content.business} contact={content.contact} />
      <StickyBar fromPrice={fromPrice} action={ACTION_LABEL[vertical]} />
    </div>
  )
}
