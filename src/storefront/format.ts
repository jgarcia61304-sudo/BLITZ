// Presentation helpers. Money arrives as integer cents.

export function hasText(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function formatPrice(cents: number): string {
  const whole = cents % 100 === 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100)
}

export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return ''
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

/** Five glyphs, filled to the nearest half. Decorative; the number is read out. */
export function starGlyphs(rating: number): string {
  const rounded = Math.round(rating * 2) / 2
  let out = ''
  for (let i = 1; i <= 5; i += 1) {
    if (rounded >= i) out += '★'
    else if (rounded >= i - 0.5) out += '⯨'
    else out += '☆'
  }
  return out
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function instagramHandle(handle: string): string {
  return handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`
}

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.trim().replace(/^@/, '')}`
}

/** Unsplash CDN urls get sized; anything else is passed through untouched. */
export function sizedPhoto(url: string, width: number): string {
  if (!url.includes('images.unsplash.com')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}auto=format&fit=crop&q=75&w=${width}`
}
