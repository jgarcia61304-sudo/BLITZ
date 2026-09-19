import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { FaqEntry } from '../../types/storefront'

/** Accordion with a real height transition, per spec item 5. */
export function Faq({ faq }: { faq: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const reduce = useReducedMotion()

  return (
    <div className="sf-wrap">
      <p className="sf-eyebrow">Before you book</p>
      <h2 className="sf-h2" id="sf-faq-title">Questions</h2>
      <div className="sf-faq">
        {faq.map((entry, index) => {
          const isOpen = open === index
          const panelId = `sf-faq-panel-${index}`
          return (
            <div className="sf-faq-item" data-open={isOpen} key={`${entry.q}-${index}`}>
              <button
                type="button"
                className="sf-faq-summary"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span>{entry.q}</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    className="sf-faq-answer"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{entry.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
