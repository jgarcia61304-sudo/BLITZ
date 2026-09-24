import { z } from 'zod'

/*
 * The storefront content contract, per docs/storefront-spec.md.
 * One JSON object per business, validated before render. Fail closed.
 *
 * Two deliberate departures from the spec's example JSON, both forced by
 * rules that outrank it:
 *
 * 1. Money is integer cents, not dollars — "All money is integer cents" in
 *    CLAUDE.md, and businesses.storefront_config already stores cents. So
 *    `price: 4500` is $45.00 and `depositAmount: 1500` is $15.00.
 * 2. Services keep an `id`. appointments.service_id points at it, and a past
 *    appointment loses its link to the menu without it.
 */

export const THEMES = ['ink', 'sand', 'slate', 'clay'] as const
export type ThemeName = (typeof THEMES)[number]

// MoneyEngine is the one section that varies, and it switches on this, so it
// is an enum rather than free text — an unknown vertical must fail validation
// rather than render nothing.
export const VERTICALS = ['beauty', 'events', 'fitness'] as const
export type Vertical = (typeof VERTICALS)[number]

const nonEmpty = z.string().trim().min(1)
const cents = z.number().int().nonnegative()

export const serviceSchema = z.object({
  id: nonEmpty,
  name: nonEmpty,
  price: cents,
  durationMin: z.number().int().positive(),
  description: z.string().default(''),
  photo: z.string().default(''),
})

export const reviewSchema = z.object({
  quote: nonEmpty,
  author: nonEmpty,
  // Optional attribution and manual ordering. Was: date required, no source.
  source: nonEmpty.optional(),
  date: nonEmpty.optional(),
  order: z.number().int().optional(),
})

export const faqSchema = z.object({ q: nonEmpty, a: nonEmpty })

export const storefrontContentSchema = z.object({
  business: z.object({
    name: nonEmpty,
    tagline: nonEmpty,
    category: z.enum(VERTICALS),
    serviceArea: nonEmpty,
  }),
  theme: z.enum(THEMES),
  proof: z.object({
    rating: z.number().min(0).max(5),
    reviewCount: z.number().int().nonnegative(),
    scarcity: z.string().default(''),
    // Optional: sourced attribution for the rating, e.g. 'Google', with a
    // link to that profile.
    source: nonEmpty.optional(),
    profileUrl: nonEmpty.optional(),
  }),
  // Optional: a storefront without an intro must still render correctly.
  intro: z
    .object({
      heading: nonEmpty,
      // Short paragraph, the "about" copy.
      body: nonEmpty,
    })
    .optional(),
  services: z.array(serviceSchema).min(1),
  // Spec: "Minimum 6 photos or it does not ship."
  photos: z.array(nonEmpty).min(6),
  // Spec: "2-3 real quotes with attribution."
  reviews: z.array(reviewSchema).min(2).max(3),
  faq: z.array(faqSchema).min(1),
  contact: z.object({
    phone: z.string().default(''),
    email: z.string().default(''),
    instagram: z.string().default(''),
    address: z.string().default(''),
    // Day name -> display string, e.g. { Monday: 'Closed' }.
    hours: z.record(z.string(), z.string()).default({}),
  }),
  money: z.object({
    depositAmount: cents,
    cancellationWindowHrs: z.number().int().nonnegative(),
    stripeAccountId: z.string().default(''),
  }),
})

export type StorefrontContent = z.infer<typeof storefrontContentSchema>
export type Service = z.infer<typeof serviceSchema>
export type Review = z.infer<typeof reviewSchema>
export type FaqEntry = z.infer<typeof faqSchema>

/** Fail closed: anything that does not validate is not a storefront. */
export function parseStorefront(input: unknown) {
  return storefrontContentSchema.safeParse(input)
}
