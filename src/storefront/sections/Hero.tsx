import type { Brand } from '../../types/storefront'
import { hasText } from '../format'

export function Hero({ brand, showCta }: { brand: Brand | undefined; showCta: boolean }) {
  const name = brand?.name
  const tagline = brand?.tagline
  const logo = brand?.logo_url
  if (!hasText(name)) return null

  return (
    <header className="sf-hero">
      <div className="sf-wrap">
        {hasText(logo) && (
          <img
            className="sf-hero-logo"
            src={logo}
            alt=""
            width={96}
            height={96}
            decoding="async"
          />
        )}
        <h1 className="sf-hero-name">{name}</h1>
        {hasText(tagline) && <p className="sf-hero-tagline">{tagline}</p>}
        {showCta && (
          <p className="sf-hero-cta">
            <a className="sf-button" href="#book">Book Now</a>
          </p>
        )}
      </div>
    </header>
  )
}
