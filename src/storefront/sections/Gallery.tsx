import { useState } from 'react'
import { Lightbox } from '../Lightbox'
import { sizedPhoto } from '../format'

export function Gallery({ photos, businessName }: { photos: string[]; businessName: string }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="sf-wrap">
      <p className="sf-eyebrow">Recent work</p>
      <h2 className="sf-h2" id="sf-gallery-title">The work</h2>
      <ul className="sf-gallery">
        {photos.map((photo, index) => (
          <li key={`${photo}-${index}`}>
            <button type="button" onClick={() => setOpen(index)} aria-label={`Expand photo ${index + 1} of ${photos.length}`}>
              <img
                src={sizedPhoto(photo, index === 0 ? 900 : 500)}
                alt={`${businessName} work, photo ${index + 1}`}
                width={index === 0 ? 800 : 500}
                height={index === 0 ? 500 : 500}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <Lightbox photos={photos} startIndex={open} onClose={() => setOpen(null)} />
      )}
    </div>
  )
}
