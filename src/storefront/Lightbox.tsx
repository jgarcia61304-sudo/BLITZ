import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { sizedPhoto } from './format'

/** Tap-to-expand gallery viewer. Swipeable, closes on Escape. */
export function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: string[]
  startIndex: number
  onClose: () => void
}) {
  const [emblaRef, embla] = useEmblaCarousel({ startIndex, loop: true })
  const [current, setCurrent] = useState(startIndex)

  useEffect(() => {
    if (!embla) return
    const update = () => setCurrent(embla.selectedScrollSnap())
    embla.on('select', update)
    update()
    return () => {
      embla.off('select', update)
    }
  }, [embla])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') embla?.scrollNext()
      if (event.key === 'ArrowLeft') embla?.scrollPrev()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [embla, onClose])

  return (
    <div className="sf-lightbox" role="dialog" aria-modal="true" aria-label="Photos">
      <button className="sf-lightbox-close" type="button" onClick={onClose} aria-label="Close photos">
        ×
      </button>
      <div className="sf-lightbox-viewport" ref={emblaRef}>
        <div className="sf-lightbox-track">
          {photos.map((photo, index) => (
            <div className="sf-lightbox-slide" key={`${photo}-${index}`}>
              <img src={sizedPhoto(photo, 1400)} alt="" decoding="async" />
            </div>
          ))}
        </div>
      </div>
      <p className="sf-lightbox-count">
        {current + 1} of {photos.length}
      </p>
    </div>
  )
}
