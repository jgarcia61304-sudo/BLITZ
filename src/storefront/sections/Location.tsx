import type { StorefrontContent } from '../../types/storefront'
import { hasText } from '../format'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function Location({
  contact,
  serviceArea,
}: {
  contact: StorefrontContent['contact']
  serviceArea: string
}) {
  const hours = contact.hours ?? {}
  const days = DAY_ORDER.filter((day) => hasText(hours[day]))
  const rest = Object.keys(hours).filter((day) => !DAY_ORDER.includes(day) && hasText(hours[day]))
  const rows = [...days, ...rest]

  return (
    <div className="sf-wrap">
      <p className="sf-eyebrow">Where and when</p>
      <h2 className="sf-h2" id="sf-location-title">Location</h2>

      {/* A map is only honest when there is an address to put on it. */}
      {hasText(contact.address) && (
        <iframe
          className="sf-map"
          title="Map"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik&marker=&query=${encodeURIComponent(contact.address)}`}
        />
      )}

      <p className="sf-area">{hasText(contact.address) ? contact.address : serviceArea}</p>

      {rows.length > 0 && (
        <dl className="sf-hours">
          {rows.map((day) => (
            <div key={day} style={{ display: 'contents' }}>
              <dt>{day}</dt>
              <dd>{hours[day]}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
