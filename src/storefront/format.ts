// Presentation helpers for the storefront renderer.
// Config carries raw values: integer cents, 24h 'HH:MM', IANA timezones.

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
  const hourLabel = `${hours} hr`
  return rest === 0 ? hourLabel : `${hourLabel} ${rest} min`
}

// '14:30' -> '2:30 PM'
export function formatTime(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim())
  if (!match) return value
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return value
  const period = hours < 12 ? 'AM' : 'PM'
  const hour = hours % 12 === 0 ? 12 : hours % 12
  return minutes === 0 ? `${hour} ${period}` : `${hour}:${match[2]} ${period}`
}

// 'America/New_York' -> 'EDT', falling back to the raw name.
export function timezoneLabel(timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(new Date())
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? timezone
  } catch {
    return timezone
  }
}

function parseHex(color: string): [number, number, number] | null {
  const hex = color.trim().replace(/^#/, '')
  const full = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

// CSS cannot pick a readable foreground, so the renderer decides here.
// Falls back to white for any color format we cannot measure.
export function readableOn(background: string): 'white' | 'black' {
  const rgb = parseHex(background)
  if (!rgb) return 'white'
  const [r, g, b] = rgb.map((channel) => {
    const s = channel / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.179 ? 'black' : 'white'
}

// config.brand.fonts holds family names, not webfonts. Nothing is fetched.
export function fontStack(family: string | undefined, kind: 'display' | 'body'): string | undefined {
  if (!hasText(family)) return undefined
  const name = family.trim()
  const fallback = kind === 'display' ? ['Georgia', 'serif'] : ['system-ui', 'sans-serif']
  const quoted = /[^a-z0-9-]/i.test(name) ? `'${name.replace(/'/g, '')}'` : name
  const rest = fallback.filter((option) => option.toLowerCase() !== name.toLowerCase())
  return [quoted, ...rest].join(', ')
}

export function instagramUrl(handle: string): string {
  return `https://instagram.com/${handle.trim().replace(/^@/, '')}`
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
