import type { StorefrontContent, Vertical } from '../../types/storefront'
import { formatPrice, hasText } from '../format'

/*
 * The one section that varies by vertical. The copy and the action change;
 * the layout does not. The flow behind the action is a later phase, so the
 * button is deliberately inert.
 */
const COPY: Record<Vertical, { eyebrow: string; heading: string; action: string; note: string }> = {
  beauty: {
    eyebrow: 'Reserve a chair',
    heading: 'Book an appointment',
    action: 'Book Now',
    note: 'Pick a time, leave a deposit, and the slot is yours.',
  },
  events: {
    eyebrow: 'Tell us the date',
    heading: 'Request a quote',
    action: 'Request a Quote',
    note: 'Send the date and headcount and you will have a quote back the same day.',
  },
  fitness: {
    eyebrow: 'Train with us',
    heading: 'Start a membership',
    action: 'Subscribe',
    note: 'Pick a plan and start this week. Cancel any time.',
  },
}

export function MoneyEngine({
  vertical,
  money,
  fromPrice,
}: {
  vertical: Vertical
  money: StorefrontContent['money']
  fromPrice: number
}) {
  const copy = COPY[vertical]

  return (
    <div className="sf-wrap sf-money-card">
      <div>
        <p className="sf-eyebrow">{copy.eyebrow}</p>
        <h2 className="sf-h2" id="sf-money-title">{copy.heading}</h2>
        <p className="sf-money-note">{copy.note}</p>
      </div>

      <dl className="sf-money-terms">
        <div className="sf-money-term">
          <dt>Starting from</dt>
          <dd>{formatPrice(fromPrice)}</dd>
        </div>
        {vertical === 'beauty' && money.depositAmount > 0 && (
          <div className="sf-money-term">
            <dt>Deposit to hold the slot</dt>
            <dd>{formatPrice(money.depositAmount)}</dd>
          </div>
        )}
        {money.cancellationWindowHrs > 0 && (
          <div className="sf-money-term">
            <dt>Free to reschedule</dt>
            <dd>{money.cancellationWindowHrs} hrs ahead</dd>
          </div>
        )}
      </dl>

      <button className="sf-button sf-button-block" type="button">{copy.action}</button>
      {hasText(money.stripeAccountId) && (
        <p className="sf-money-note">Payments handled securely by Stripe.</p>
      )}
    </div>
  )
}
