import type { Review } from '../../types/storefront'

export function Reviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="sf-wrap">
      <p className="sf-eyebrow">What clients say</p>
      <h2 className="sf-h2" id="sf-reviews-title">Reviews</h2>
      <ul className="sf-reviews">
        {reviews.map((review, index) => (
          <li className="sf-review" key={`${review.author}-${index}`}>
            <figure style={{ margin: 0 }}>
              <blockquote>“{review.quote}”</blockquote>
              <figcaption>
                {review.author} · {review.date}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}
