import { useEffect } from 'react'
import Lenis from 'lenis'

// Lenis takes over the scroll, so anchor jumps have to go through it.
let instance: Lenis | null = null

export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({ duration: 0.9, smoothWheel: true })
    instance = lenis

    let frame = 0
    const loop = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      instance = null
    }
  }, [])
}

/** Scrolls to an element, through Lenis when it is running. */
export function scrollToId(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (instance) instance.scrollTo(target, { offset: -8 })
  else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
