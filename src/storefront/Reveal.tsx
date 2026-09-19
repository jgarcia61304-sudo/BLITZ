import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/*
 * Scroll-entry motion, per spec: sections rise 16-24px and fade in as they
 * come into view, 400-600ms ease-out. Fixed for every business and every
 * section, so nothing here varies per storefront.
 */
export function Reveal({
  children,
  className,
  id,
  delay = 0,
  'aria-labelledby': labelledBy,
}: {
  children: ReactNode
  className?: string
  id?: string
  delay?: number
  'aria-labelledby'?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.section
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.section>
  )
}
