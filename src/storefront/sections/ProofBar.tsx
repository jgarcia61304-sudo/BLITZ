import type { StorefrontContent } from '../../types/storefront'
import { formatRating, hasText, starGlyphs } from '../format'

/** Lifted over the hero so the page layers rather than stacks flat. */
export function ProofBar({ proof }: { proof: StorefrontContent['proof'] }) {
  return (
    <div className="sf-proof">
      <div className="sf-wrap">
        <div className="sf-proof-card">
          <span className="sf-proof-score">{formatRating(proof.rating)}</span>
          <span className="sf-stars" aria-hidden="true">{starGlyphs(proof.rating)}</span>
          <span className="sf-proof-count">{proof.reviewCount} reviews</span>
          {hasText(proof.scarcity) && <span className="sf-proof-scarcity">{proof.scarcity}</span>}
        </div>
      </div>
    </div>
  )
}
