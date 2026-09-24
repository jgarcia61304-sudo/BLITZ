import type { ReactNode } from 'react'
import type { Offer, OfferDestination } from '../../types/storefront'
import { hasText, sizedPhoto } from '../format'
import { scrollToId } from '../scroll'

const ACTION_LABEL: Record<OfferDestination['kind'], string> = {
  external: 'View details',
  booking: 'Book now',
  email: 'Get in touch',
}

type Target = { as: 'link'; href: string; external: boolean } | { as: 'button' }

/*
 * Booking and payment behaviour are a later phase. Until then 'booking' — and
 * an 'email' offer with no address to send to — point at the booking section,
 * which is the correct affordance and never leaves a dead control.
 */
function resolveTarget(destination: OfferDestination, contactEmail: string): Target {
  if (destination.kind === 'external') {
    return { as: 'link', href: destination.url, external: true }
  }
  if (destination.kind === 'email') {
    const to = hasText(destination.url) ? destination.url : contactEmail
    if (hasText(to)) return { as: 'link', href: `mailto:${to.trim()}`, external: false }
  }
  return { as: 'button' }
}

function OfferAction({
  destination,
  contactEmail,
  className,
  children,
}: {
  destination: OfferDestination
  contactEmail: string
  className: string
  children: ReactNode
}) {
  const target = resolveTarget(destination, contactEmail)

  if (target.as === 'button') {
    return (
      <button className={className} type="button" onClick={() => scrollToId('book')}>
        {children}
      </button>
    )
  }

  return (
    <a
      className={className}
      href={target.href}
      {...(target.external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
      {target.external && <span className="sf-visually-hidden"> (opens in a new tab)</span>}
    </a>
  )
}

function HeroOffer({ offer, contactEmail }: { offer: Offer; contactEmail: string }) {
  const hasImage = hasText(offer.imageUrl)

  return (
    <article className="sf-offer-hero" data-media={hasImage ? 'photo' : 'none'}>
      {hasImage && (
        <div className="sf-offer-hero-media">
          <img
            src={sizedPhoto(offer.imageUrl as string, 1400)}
            alt=""
            width={1400}
            height={900}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="sf-wrap">
        {hasText(offer.badge) && <p className="sf-offer-badge">{offer.badge}</p>}
        <h3 className="sf-offer-hero-title">{offer.title}</h3>
        {hasText(offer.description) && <p className="sf-offer-hero-desc">{offer.description}</p>}
        <p className="sf-offer-hero-action">
          <OfferAction
            destination={offer.destination}
            contactEmail={contactEmail}
            className="sf-button"
          >
            {ACTION_LABEL[offer.destination.kind]}
          </OfferAction>
        </p>
      </div>
    </article>
  )
}

function FeatureOffer({ offer, contactEmail }: { offer: Offer; contactEmail: string }) {
  const hasImage = hasText(offer.imageUrl)

  return (
    <article className="sf-offer-feature" data-media={hasImage ? 'photo' : 'none'}>
      {hasImage && (
        <img
          className="sf-offer-feature-media"
          src={sizedPhoto(offer.imageUrl as string, 800)}
          alt=""
          width={800}
          height={500}
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="sf-offer-feature-body">
        {hasText(offer.badge) && <p className="sf-offer-feature-badge">{offer.badge}</p>}
        <h3 className="sf-offer-feature-title">{offer.title}</h3>
        {hasText(offer.description) && <p className="sf-offer-feature-desc">{offer.description}</p>}
        <OfferAction
          destination={offer.destination}
          contactEmail={contactEmail}
          className="sf-offer-feature-action"
        >
          {ACTION_LABEL[offer.destination.kind]}
        </OfferAction>
      </div>
    </article>
  )
}

function ListedOffer({ offer, contactEmail }: { offer: Offer; contactEmail: string }) {
  // The whole row is the control, so the tap target is the full width.
  return (
    <li className="sf-offer-listed-item">
      <OfferAction
        destination={offer.destination}
        contactEmail={contactEmail}
        className="sf-offer-listed-link"
      >
        <span className="sf-offer-listed-text">
          <span className="sf-offer-listed-title">{offer.title}</span>
          {hasText(offer.description) && (
            <span className="sf-offer-listed-desc">{offer.description}</span>
          )}
        </span>
        {hasText(offer.badge) && <span className="sf-offer-listed-badge">{offer.badge}</span>}
        <span className="sf-offer-listed-arrow" aria-hidden="true" />
      </OfferAction>
    </li>
  )
}

const byOrder = (a: Offer, b: Offer) => a.order - b.order

export function Offers({ offers, contactEmail }: { offers: Offer[]; contactEmail: string }) {
  // The schema caps heroes at one, so taking the first is taking the only one.
  const hero = offers.filter((offer) => offer.prominence === 'hero').sort(byOrder)[0]
  const features = offers.filter((offer) => offer.prominence === 'feature').sort(byOrder)
  const listed = offers.filter((offer) => offer.prominence === 'listed').sort(byOrder)

  if (!hero && features.length === 0 && listed.length === 0) return null

  return (
    <>
      <h2 className="sf-visually-hidden" id="sf-offers-title">
        Offers
      </h2>

      {hero && <HeroOffer offer={hero} contactEmail={contactEmail} />}

      {features.length > 0 && (
        <div className="sf-wrap">
          <div className="sf-offer-features">
            {features.map((offer) => (
              <FeatureOffer key={offer.id} offer={offer} contactEmail={contactEmail} />
            ))}
          </div>
        </div>
      )}

      {listed.length > 0 && (
        <div className="sf-wrap">
          <div className="sf-offer-listed-group">
            <p className="sf-eyebrow">Also available</p>
            <ul className="sf-offer-listed">
              {listed.map((offer) => (
                <ListedOffer key={offer.id} offer={offer} contactEmail={contactEmail} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
