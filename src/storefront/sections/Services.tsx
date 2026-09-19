import type { Service } from '../../types/storefront'
import { formatDuration, formatPrice, hasText } from '../format'

export function Services({ services }: { services: Service[] | undefined }) {
  const items = (services ?? []).filter(
    (service) => hasText(service?.name) && service.active !== false,
  )
  if (items.length === 0) return null

  return (
    <section className="sf-section" aria-labelledby="sf-services-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-services-title">Services</h2>
        <ul className="sf-services">
          {items.map((service, index) => {
            const duration = formatDuration(service.duration_minutes)
            return (
              <li className="sf-service" key={hasText(service.id) ? service.id : index}>
                <h3 className="sf-service-name">{service.name}</h3>
                {Number.isFinite(service.price_cents) && (
                  <span className="sf-service-price">{formatPrice(service.price_cents)}</span>
                )}
                {hasText(service.description) && (
                  <p className="sf-service-desc">{service.description}</p>
                )}
                {hasText(duration) && <span className="sf-service-meta">{duration}</span>}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
