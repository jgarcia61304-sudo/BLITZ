import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// Mobile-only booking bar. Slides in once the hero has scrolled past.
export function StickyBar({ watch }: { watch: RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const sentinel = watch.current
    if (!sentinel || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only once the sentinel has left the top of the viewport, so the
        // bar stays hidden while the hero is still on screen.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [watch])

  return (
    <div className="sf-sticky" data-visible={visible} aria-hidden={!visible}>
      <a className="sf-button" href="#book" tabIndex={visible ? undefined : -1}>
        Book Now
      </a>
    </div>
  )
}
