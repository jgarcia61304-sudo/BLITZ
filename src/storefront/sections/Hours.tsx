import { Fragment } from 'react'
import type { Availability, Weekday } from '../../types/storefront'
import { formatTime, hasText, timezoneLabel } from '../format'

const DAYS: ReadonlyArray<readonly [Weekday, string]> = [
  ['mon', 'Monday'],
  ['tue', 'Tuesday'],
  ['wed', 'Wednesday'],
  ['thu', 'Thursday'],
  ['fri', 'Friday'],
  ['sat', 'Saturday'],
  ['sun', 'Sunday'],
]

export function Hours({ availability }: { availability: Availability | undefined }) {
  const weekly = availability?.weekly
  if (!weekly) return null

  const rows = DAYS.map(([key, label]) => {
    const ranges = (weekly[key] ?? []).filter(
      (range) => hasText(range?.start) && hasText(range?.end),
    )
    return { key, label, ranges }
  })
  if (rows.every((row) => row.ranges.length === 0)) return null

  const zone = hasText(availability?.timezone) ? timezoneLabel(availability.timezone) : ''

  return (
    <section className="sf-section" aria-labelledby="sf-hours-title">
      <div className="sf-wrap">
        <h2 className="sf-section-title" id="sf-hours-title">Hours</h2>
        <dl className="sf-hours">
          {rows.map(({ key, label, ranges }) => (
            <Fragment key={key}>
              <dt>{label}</dt>
              <dd className={ranges.length === 0 ? 'sf-hours-closed' : undefined}>
                {ranges.length === 0
                  ? 'Closed'
                  : ranges
                      .map((range) => `${formatTime(range.start)} – ${formatTime(range.end)}`)
                      .join(', ')}
              </dd>
            </Fragment>
          ))}
        </dl>
        {hasText(zone) && <p className="sf-hours-note">All times {zone}.</p>}
      </div>
    </section>
  )
}
