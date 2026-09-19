/**
 * Shape of businesses.storefront_config (jsonb).
 *
 * Money is integer cents. Times of day are 24h 'HH:MM' strings.
 * Dates are 'YYYY-MM-DD'. Timestamps are timestamptz in Postgres.
 */

export type BrandColors = {
  primary: string
  accent: string
  background: string
  text: string
}

export type BrandFonts = {
  display: string
  body: string
}

export type Brand = {
  name: string
  tagline: string
  logo_url: string
  colors: BrandColors
  fonts: BrandFonts
}

export type Contact = {
  phone: string
  email: string
  instagram_handle: string
  booking_email: string
}

export type Service = {
  // appointments.service_id refers to this value.
  id: string
  name: string
  description: string
  price_cents: number
  duration_minutes: number
  active: boolean
}

export type GalleryImage = {
  url: string
  caption: string
  alt_text: string
  order: number
}

export type PaymentMode = 'card_on_file' | 'deposit' | 'none'

export type BookingSettings = {
  payment_mode: PaymentMode
  // Null unless payment_mode is 'deposit'.
  deposit_cents: number | null
  cancellation_window_hours: number
  late_cancellation_fee_cents: number
  no_show_fee_cents: number
  // True for mobile businesses.
  requires_client_address: boolean
  // Null when travel is included.
  travel_fee_cents: number | null
}

// 24h 'HH:MM'.
export type TimeRange = {
  start: string
  end: string
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type WeeklyAvailability = Record<Weekday, TimeRange[]>

export type Availability = {
  // IANA name, e.g. 'America/New_York'.
  timezone: string
  weekly: WeeklyAvailability
  // 'YYYY-MM-DD'.
  blackout_dates: string[]
  min_notice_hours: number
  // Gap between appointments.
  buffer_minutes: number
}

export type ServiceArea = {
  is_mobile: boolean
  // Plain text, e.g. 'Miami-Dade'.
  description: string
  base_address: string | null
  radius_miles: number | null
}

export type PolicySection = {
  title: string
  body: string
}

export type Policies = {
  cancellation_text: string
  late_text: string
  additional: PolicySection[]
}

export type FaqItem = {
  question: string
  answer: string
  order: number
}

export type Seo = {
  title: string
  description: string
  og_image_url: string
}

export type StorefrontConfig = {
  brand: Brand
  contact: Contact
  services: Service[]
  gallery: GalleryImage[]
  booking: BookingSettings
  availability: Availability
  service_area: ServiceArea
  policies: Policies
  faq: FaqItem[]
  seo: Seo
}
