import type { StorefrontContent } from '../../types/storefront'
import { formatRating, sizedPhoto, starGlyphs } from '../format'
import { scrollToId } from '../scroll'

/** Full-bleed photography above the fold, per spec item 1. */
export function Hero({ content }: { content: StorefrontContent }) {
  const { business, proof, photos } = content
  const lead = photos[0]

  return (
    <header className="sf-hero">
      <div className="sf-hero-media">
        <img
          src={sizedPhoto(lead, 1200)}
          srcSet={`${sizedPhoto(lead, 780)} 780w, ${sizedPhoto(lead, 1200)} 1200w, ${sizedPhoto(lead, 1800)} 1800w`}
          sizes="100vw"
          alt=""
          width={1200}
          height={1600}
          decoding="async"
          // React 18 does not know the camelCase prop; the lowercase DOM
          // attribute passes straight through and is what the browser reads.
          {...{ fetchpriority: 'high' }}
        />
      </div>
      <div className="sf-wrap sf-hero-inner">
        <h1 className="sf-hero-name">{business.name}</h1>
        <p className="sf-hero-tagline">{business.tagline}</p>
        <p className="sf-hero-rating">
          <span className="sf-stars" aria-hidden="true">{starGlyphs(proof.rating)}</span>
          <span>
            {formatRating(proof.rating)} from {proof.reviewCount} reviews
          </span>
        </p>
        <p className="sf-hero-cta">
          <button className="sf-button" type="button" onClick={() => scrollToId('book')}>
            Book Now
          </button>
        </p>
      </div>
    </header>
  )
}
