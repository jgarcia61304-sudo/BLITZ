import { formatPrice } from '../format'
import { scrollToId } from '../scroll'

/** Persistent, per spec item 7: one action always reachable. */
export function StickyBar({ fromPrice, action }: { fromPrice: number; action: string }) {
  return (
    <div className="sf-sticky">
      <div className="sf-sticky-inner">
        <p className="sf-sticky-price">
          From
          <strong>{formatPrice(fromPrice)}</strong>
        </p>
        <button className="sf-button" type="button" onClick={() => scrollToId('book')}>
          {action}
        </button>
      </div>
    </div>
  )
}
