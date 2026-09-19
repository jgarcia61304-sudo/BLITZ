import type { Service } from '../../types/storefront'
import { formatDuration, formatPrice, hasText, sizedPhoto } from '../format'

export function Services({ services }: { services: Service[] }) {
  return (
    <div className="sf-wrap">
      <p className="sf-eyebrow">The menu</p>
      <h2 className="sf-h2" id="sf-services-title">Services</h2>
      <ul className="sf-services">
        {services.map((service) => {
          const duration = formatDuration(service.durationMin)
          const photo = hasText(service.photo)
          return (
            <li className={photo ? 'sf-service' : 'sf-service sf-service-nophoto'} key={service.id}>
              {photo && (
                <img
                  className="sf-service-thumb"
                  src={sizedPhoto(service.photo, 160)}
                  alt=""
                  width={64}
                  height={64}
                  loading="lazy"
                  decoding="async"
                />
              )}
              <h3 className="sf-service-name">{service.name}</h3>
              <span className="sf-service-price">{formatPrice(service.price)}</span>
              {hasText(service.description) && (
                <p className="sf-service-desc">{service.description}</p>
              )}
              {hasText(duration) && <span className="sf-service-dur">{duration}</span>}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
