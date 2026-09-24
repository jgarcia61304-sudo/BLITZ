import type { StorefrontContent } from '../types/storefront'

/*
 * Demo content for /s/demo, in the contract from docs/storefront-spec.md.
 *
 * Services, prices, FAQ, hours and contact details carry over from the Fade
 * Theory row already in Supabase. Photos are Unsplash placeholders under the
 * free Unsplash License; every URL was checked to return a real image.
 * Ratings and reviews are demo content for a fictional business.
 *
 * Money is integer cents.
 */

const U = (id: string) => `https://images.unsplash.com/${id}`

const PHOTOS = [
  U('photo-1641318175316-795cd2db99f8'), // Mitchell Orr
  U('photo-1599351431202-1e0f0137899a'), // straight razor
  U('photo-1546596468-13349ee0c504'), // Hangula lucas
  U('photo-1514336937476-a5b961020a5c'), // Chris Knight
  U('photo-1759134248487-e8baaf31e33e'), // Chaps & Co
  U('photo-1553519430-e89e67401ed5'), // Taylor Smith
  U('photo-1585747860715-2ba37e788b70'), // barber chair
  U('photo-1621605815971-fbc98d665033'), // clippers and comb
]

// Solid colour block, inline, so offer art makes no external request.
const block = (hex: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'%3E%3Crect width='1200' height='800' fill='%23${hex}'/%3E%3C/svg%3E`

export const placeholderStorefront: StorefrontContent = {
  business: {
    name: 'Fade Theory',
    tagline: 'A barber that comes to you, anywhere in Miami-Dade.',
    category: 'beauty',
    serviceArea:
      'Miami-Dade County, including Brickell, Downtown, Coral Gables, Coconut Grove, Key Biscayne and Wynwood.',
  },
  theme: 'ink',
  proof: {
    rating: 4.9,
    reviewCount: 184,
    scarcity: 'Usually booked about five days out.',
  },
  offers: [
    {
      id: 'offer_cut_club',
      title: 'Cut Club',
      description:
        'Twelve cuts a year at your door for one monthly price, with priority booking and no travel fee.',
      imageUrl: block('14342A'),
      prominence: 'hero',
      destination: { kind: 'external', url: 'https://example.com/fade-theory/cut-club' },
      badge: 'Enrolling through October 5',
      order: 0,
    },
    {
      id: 'offer_beard_kit',
      title: 'The Beard Kit',
      description: 'Oil, balm and a sandalwood comb, boxed. The same three we reach for in the chair.',
      imageUrl: block('6E4B2A'),
      prominence: 'feature',
      destination: { kind: 'external', url: 'https://example.com/fade-theory/shop/beard-kit' },
      order: 0,
    },
    {
      // No imageUrl on purpose — proves the text-only treatment holds up
      // beside a feature that has art.
      id: 'offer_chairside',
      title: 'Chairside Sessions',
      description: 'A half day for barbers on fading, clipper control and running a mobile round.',
      prominence: 'feature',
      destination: { kind: 'email' },
      badge: 'Six seats',
      order: 1,
    },
    {
      id: 'offer_gift_card',
      title: 'Gift cards',
      description: 'Any amount, sent by email the same day.',
      prominence: 'listed',
      destination: { kind: 'email' },
      order: 0,
    },
    {
      id: 'offer_referral',
      title: 'Refer a friend',
      description: 'They take $10 off a first cut, and so do you.',
      prominence: 'listed',
      destination: { kind: 'booking' },
      order: 1,
    },
    {
      id: 'offer_clipper_code',
      title: 'Clippers, 15% off',
      description: 'Our supplier kit with the code FADE15 at checkout.',
      prominence: 'listed',
      destination: { kind: 'external', url: 'https://example.com/fade-theory/clippers' },
      order: 2,
    },
  ],
  services: [
    {
      id: 'svc_signature',
      name: 'Signature Cut',
      price: 4500,
      durationMin: 45,
      description: 'Consultation, clipper and scissor work, hot towel finish.',
      photo: PHOTOS[0],
    },
    {
      id: 'svc_skin_fade',
      name: 'Skin Fade',
      price: 5000,
      durationMin: 45,
      description: 'Bald fade taken clean to the skin and blended by hand.',
      photo: PHOTOS[1],
    },
    {
      id: 'svc_cut_beard',
      name: 'Cut & Beard',
      price: 6500,
      durationMin: 60,
      description: 'Full haircut plus beard shape, line-up and oil.',
      photo: PHOTOS[3],
    },
    {
      id: 'svc_beard',
      name: 'Beard Detail',
      price: 3000,
      durationMin: 30,
      description: 'Shape, line-up, hot towel and beard oil. No haircut.',
      photo: PHOTOS[7],
    },
    {
      id: 'svc_kids',
      name: 'Kids Cut, 12 and under',
      price: 3500,
      durationMin: 30,
      description: 'The same care, a shorter time in the chair.',
      photo: '',
    },
    {
      id: 'svc_house_call_two',
      name: 'House Call for Two',
      price: 8500,
      durationMin: 90,
      description: 'Two cuts back to back at one address, priced per visit.',
      photo: '',
    },
  ],
  photos: PHOTOS,
  reviews: [
    {
      quote:
        'He set up in my kitchen, was done in forty minutes, and it is the cleanest fade I have had in Miami. I have not been back to a shop since.',
      author: 'Andre M.',
      date: 'August 2026',
    },
    {
      quote:
        'Booked him for my son and me back to back on a Saturday morning. On time, patient with a seven year old, and the line-up was sharp.',
      author: 'Daniel R.',
      date: 'July 2026',
    },
    {
      quote:
        'I travel constantly and he has met me at three different hotels now. Same cut every time, no fuss about parking or space.',
      author: 'Marcus T.',
      date: 'June 2026',
    },
  ],
  faq: [
    {
      q: 'Do you come to me?',
      a: 'Yes. Fade Theory is mobile only, so there is no shop. Every appointment happens at your home, office or hotel inside the service area.',
    },
    {
      q: 'How much space do you need?',
      a: 'About six feet square on a hard floor, plus an outlet. A kitchen, patio or garage all work well.',
    },
    {
      q: 'Is travel extra?',
      a: 'No. Travel anywhere inside Miami-Dade is included in the service price.',
    },
    {
      q: 'What if I need to move my appointment?',
      a: 'Reschedule at least 24 hours ahead and the deposit follows you to the new time at no charge.',
    },
    {
      q: 'Do you cut kids hair?',
      a: 'Yes, and twelve and under has its own rate. Booking two family members back to back costs less than two separate visits.',
    },
  ],
  contact: {
    phone: '(305) 555-0142',
    email: 'hello@fadetheory.com',
    instagram: '@fadetheory',
    address: '',
    hours: {
      Monday: 'Closed',
      Tuesday: '10 AM – 7 PM',
      Wednesday: '9 AM – 1 PM, 3 PM – 7 PM',
      Thursday: '10 AM – 7 PM',
      Friday: '10 AM – 8 PM',
      Saturday: '9 AM – 4 PM',
      Sunday: 'Closed',
    },
  },
  money: {
    depositAmount: 1500,
    cancellationWindowHrs: 24,
    stripeAccountId: '',
  },
}
