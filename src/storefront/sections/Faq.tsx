import type { FaqItem } from '../../types/storefront'
import { hasText } from '../format'

export function Faq({ faq }: { faq: FaqItem[] | undefined }) {
  const items = [...(faq ?? [])]
    .filter((item) => hasText(item?.question) && hasText(item?.answer))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  if (items.length === 0) return null

  return (
    <section className="sf-section" aria-labelledby="sf-faq-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-faq-title">Questions</h2>
        <div className="sf-faq">
          {items.map((item, index) => (
            <details className="sf-faq-item" key={`${item.question}-${index}`}>
              <summary>{item.question}</summary>
              <p className="sf-faq-answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
