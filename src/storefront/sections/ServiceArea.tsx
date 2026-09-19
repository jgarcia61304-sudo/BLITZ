import type { BookingSettings, ServiceArea as Area } from '../../types/storefront'
import { formatPrice, hasText } from '../format'

export function ServiceArea({
  area,
  booking,
}: {
  area: Area | undefined
  booking: BookingSettings | undefined
}) {
  if (!area) return null

  if (area.is_mobile) {
    const terms: string[] = []
    if (typeof area.radius_miles === 'number') {
      terms.push(`Travelling up to ${area.radius_miles} miles.`)
    }
    terms.push(
      typeof booking?.travel_fee_cents === 'number'
        ? `Travel fee of ${formatPrice(booking.travel_fee_cents)} per visit.`
        : 'Travel is included in the service price.',
    )
    if (booking?.requires_client_address) {
      terms.push('Your address is collected when you book.')
    }
    if (!hasText(area.description) && terms.length === 0) return null

    return (
      <section className="sf-section" aria-labelledby="sf-area-title">
        <div className="sf-wrap">
          <h2 className="sf-section-title" id="sf-area-title">Where we come to you</h2>
          {hasText(area.description) && <p className="sf-body-text">{area.description}</p>}
          <ul className="sf-terms">
            {terms.map((term) => <li key={term}>{term}</li>)}
          </ul>
        </div>
      </section>
    )
  }

  if (!hasText(area.base_address)) return null
  return (
    <section className="sf-section" aria-labelledby="sf-area-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-area-title">Find us</h2>
        <p className="sf-body-text">{area.base_address}</p>
        {hasText(area.description) && (
          <ul className="sf-terms"><li>{area.description}</li></ul>
        )}
      </div>
    </section>
  )
}
