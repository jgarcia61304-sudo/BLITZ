import type { GalleryImage } from '../../types/storefront'
import { hasText } from '../format'

export function Gallery({ gallery }: { gallery: GalleryImage[] | undefined }) {
  const items = [...(gallery ?? [])]
    .filter((image) => hasText(image?.url))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  if (items.length === 0) return null

  return (
    <section className="sf-section" aria-labelledby="sf-gallery-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-gallery-title">Work</h2>
        <ul className="sf-gallery">
          {items.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <figure>
                <img
                  src={image.url}
                  alt={hasText(image.alt_text) ? image.alt_text : ''}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                />
                {hasText(image.caption) && <figcaption>{image.caption}</figcaption>}
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
