import type { Policies as PolicyConfig } from '../../types/storefront'
import { hasText } from '../format'

export function Policies({ policies }: { policies: PolicyConfig | undefined }) {
  if (!policies) return null

  const blocks: { title: string; body: string }[] = []
  if (hasText(policies.cancellation_text)) {
    blocks.push({ title: 'Cancellations', body: policies.cancellation_text })
  }
  if (hasText(policies.late_text)) {
    blocks.push({ title: 'Running late', body: policies.late_text })
  }
  for (const extra of policies.additional ?? []) {
    if (hasText(extra?.body)) {
      blocks.push({ title: hasText(extra.title) ? extra.title : '', body: extra.body })
    }
  }
  if (blocks.length === 0) return null

  return (
    <section className="sf-section" aria-labelledby="sf-policies-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-policies-title">Policies</h2>
        {blocks.map((block, index) => (
          <div className="sf-policy" key={`${block.title}-${index}`}>
            {hasText(block.title) && <h3 className="sf-policy-title">{block.title}</h3>}
            <p className="sf-policy-body">{block.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
