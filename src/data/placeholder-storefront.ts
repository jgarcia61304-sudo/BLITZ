import type { StorefrontConfig } from '../types/storefront'

/*
 * A complete storefront config for a fictional mobile barber, used to seed
 * /s/demo. The hex values here are config data, not app styling: brand colors
 * belong to the business and are injected into the storefront at render time.
 * Nothing in this file may be read by BLITZ's own interface.
 */

// Solid color block, inline so the gallery makes no external requests.
const block = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Crect width='800' height='800' fill='%23${hex}'/%3E%3C/svg%3E`

const monogram =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23C9A227'/%3E%3Ctext x='48' y='63' font-family='Georgia,serif' font-size='38' font-weight='700' text-anchor='middle' fill='%230F3D2E'%3EFT%3C/text%3E%3C/svg%3E"

export const placeholderStorefront: StorefrontConfig = {
  brand: {
    name: 'Fade Theory',
    tagline: 'A barber that comes to you, anywhere in Miami-Dade.',
    logo_url: monogram,
    colors: {
      primary: '#0F3D2E',
      accent: '#C9A227',
      background: '#FBF9F5',
      text: '#16130F',
    },
    fonts: {
      display: 'Georgia',
      body: 'Helvetica Neue',
    },
  },
  contact: {
    phone: '(305) 555-0142',
    email: 'hello@fadetheory.com',
    instagram_handle: '@fadetheory',
    booking_email: 'book@fadetheory.com',
  },
  services: [
    {
      id: 'svc_signature',
      name: 'Signature Cut',
      description: 'Consultation, clipper and scissor work, hot towel finish.',
      price_cents: 4500,
      duration_minutes: 45,
      active: true,
    },
    {
      id: 'svc_skin_fade',
      name: 'Skin Fade',
      description: 'Bald fade taken clean to the skin and blended by hand.',
      price_cents: 5000,
      duration_minutes: 45,
      active: true,
    },
    {
      id: 'svc_cut_beard',
      name: 'Cut & Beard',
      description: 'Full haircut plus beard shape, line-up and oil.',
      price_cents: 6500,
      duration_minutes: 60,
      active: true,
    },
    {
      id: 'svc_beard',
      name: 'Beard Detail',
      description: 'Shape, line-up, hot towel and beard oil. No haircut.',
      price_cents: 3000,
      duration_minutes: 30,
      active: true,
    },
    {
      id: 'svc_kids',
      name: 'Kids Cut, 12 and under',
      description: 'The same care, a shorter time in the chair.',
      price_cents: 3500,
      duration_minutes: 30,
      active: true,
    },
    {
      id: 'svc_house_call_two',
      name: 'House Call for Two',
      description: 'Two cuts back to back at one address, priced per visit.',
      price_cents: 8500,
      duration_minutes: 90,
      active: true,
    },
    {
      id: 'svc_lineup',
      name: 'Line-Up Only',
      description: 'Retired for now. Included with every cut instead.',
      price_cents: 2000,
      duration_minutes: 15,
      active: false,
    },
  ],
  gallery: [
    { url: block('0F3D2E'), caption: 'Skin fade, tapered neckline', alt_text: 'A close skin fade finished at the neckline', order: 0 },
    { url: block('16130F'), caption: 'Scissor crop', alt_text: 'A textured scissor crop from the side', order: 1 },
    { url: block('C9A227'), caption: 'Beard shape-up', alt_text: 'A squared beard line along the jaw', order: 2 },
    { url: block('6B7F6E'), caption: 'Low taper', alt_text: 'A low taper blended into the sides', order: 3 },
    { url: block('8C6A3F'), caption: 'Kids cut', alt_text: 'A short back and sides cut for a child', order: 4 },
    { url: block('3E5145'), caption: 'Setup at a client home', alt_text: 'A folding barber chair set up in a kitchen', order: 5 },
  ],
  booking: {
    payment_mode: 'deposit',
    deposit_cents: 1500,
    cancellation_window_hours: 24,
    late_cancellation_fee_cents: 2500,
    no_show_fee_cents: 4500,
    requires_client_address: true,
    travel_fee_cents: null,
  },
  availability: {
    timezone: 'America/New_York',
    weekly: {
      mon: [],
      tue: [{ start: '10:00', end: '19:00' }],
      wed: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }],
      thu: [{ start: '10:00', end: '19:00' }],
      fri: [{ start: '10:00', end: '20:00' }],
      sat: [{ start: '09:00', end: '16:00' }],
      sun: [],
    },
    blackout_dates: ['2026-11-26', '2026-12-24', '2026-12-25', '2027-01-01'],
    min_notice_hours: 12,
    buffer_minutes: 15,
  },
  service_area: {
    is_mobile: true,
    description:
      'Miami-Dade County, including Brickell, Downtown, Coral Gables, Coconut Grove, Key Biscayne and Wynwood.',
    base_address: null,
    radius_miles: 25,
  },
  policies: {
    cancellation_text:
      'Cancel or reschedule at least 24 hours before your appointment and the deposit moves with you. Inside 24 hours the deposit is kept.',
    late_text:
      'The chair is held for 15 minutes. After that the appointment is released and the late cancellation fee applies, because the next client is already booked.',
    additional: [
      {
        title: 'Parking and setup',
        body: 'A parking spot within a block of the address and an outlet within reach of the chair is all that is needed. Setup takes about five minutes.',
      },
      {
        title: 'Payment',
        body: 'Card, Apple Pay and cash are all accepted. The deposit comes off the final price.',
      },
    ],
  },
  faq: [
    {
      question: 'Do you come to me?',
      answer:
        'Yes. Fade Theory is mobile only, so there is no shop. Every appointment happens at your home, office or hotel inside the service area.',
      order: 0,
    },
    {
      question: 'How much space do you need?',
      answer:
        'About six feet square on a hard floor, plus an outlet. A kitchen, patio or garage all work well.',
      order: 1,
    },
    {
      question: 'Is travel extra?',
      answer: 'No. Travel anywhere inside Miami-Dade is included in the service price.',
      order: 2,
    },
    {
      question: 'What if I need to move my appointment?',
      answer:
        'Reschedule at least 24 hours ahead and the deposit follows you to the new time at no charge.',
      order: 3,
    },
    {
      question: 'Do you cut kids hair?',
      answer:
        'Yes, and twelve and under has its own rate. Booking two family members back to back costs less than two separate visits.',
      order: 4,
    },
  ],
  seo: {
    title: 'Fade Theory — Mobile Barber in Miami',
    description:
      'A mobile barber serving Miami-Dade. Signature cuts, skin fades and beard work at your home or office, with travel included.',
    og_image_url: block('0F3D2E'),
  },
}
