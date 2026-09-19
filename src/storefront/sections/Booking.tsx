import type { BookingSettings } from '../../types/storefront'
import { formatPrice } from '../format'

// Placeholder section. The real booking flow is a later phase, so the
// button is deliberately inert; the hero and sticky bar link here.
export function Booking({ booking }: { booking: BookingSettings | undefined }) {
  if (!booking) return null

  const terms: string[] = []
  if (booking.payment_mode === 'deposit' && typeof booking.deposit_cents === 'number') {
    terms.push(`A ${formatPrice(booking.deposit_cents)} deposit holds your slot.`)
  }
  if (booking.payment_mode === 'card_on_file') {
    terms.push('A card on file holds your slot. Nothing is charged until service.')
  }
  if (typeof booking.cancellation_window_hours === 'number') {
    terms.push(`Free to reschedule up to ${booking.cancellation_window_hours} hours ahead.`)
  }

  return (
    <section className="sf-section sf-booking" id="book" aria-labelledby="sf-booking-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-booking-title">Book an appointment</h2>
        {terms.length > 0 && <p className="sf-booking-note">{terms.join(' ')}</p>}
        <button className="sf-button" type="button">Book Now</button>
      </div>
    </section>
  )
}
