# Storefront Design + Build Spec

## Governing rule
AI never makes a design decision. AI fills a slot. Layout, type scale, spacing,
motion and components are fixed in the template. Only content and a theme choice
(one of four presets) vary per business.

## What the page must have
1. Photography leads — full-bleed, above the fold. Minimum 6 photos or it does not ship.
2. Motion on entry — sections rise 16–24px and fade in as they scroll into view, 400–600ms ease-out.
3. Depth — overlap and layering, not flat stacked blocks.
4. A real typeface pairing — never system fonts. One display face, one text face.
5. Micro-interactions — press states, smooth accordions, tap-to-expand images.
6. Sub-2s load, zero layout shift.
7. One action always reachable via a sticky bar.

## Section order (fixed)
Hero -> ProofBar -> Services -> Gallery -> MoneyEngine -> Reviews -> FAQ -> Location -> Footer
plus a persistent StickyBar.

- Hero: full-bleed photo, business name, one-line positioning, rating, primary action
- ProofBar: rating, review count, scarcity line
- Services: name, duration, price, optional thumbnail
- Gallery: photo grid, tap to expand
- MoneyEngine: the only section that differs by vertical.
  Beauty -> book (calendar + deposit). Events -> quote. Fitness -> subscribe.
- Reviews: 2-3 real quotes with attribution
- FAQ: accordion
- Location: map, hours, service area

## Content contract
One JSON object per business, validated with Zod before render. Fail closed.

{
  "business": { "name": "", "tagline": "", "category": "", "serviceArea": "" },
  "theme": "ink | sand | slate | clay",
  "proof": { "rating": 4.9, "reviewCount": 212, "scarcity": "" },
  "services": [{ "name": "", "price": 0, "durationMin": 45, "description": "", "photo": "" }],
  "photos": ["minimum 6"],
  "reviews": [{ "quote": "", "author": "", "date": "" }],
  "faq": [{ "q": "", "a": "" }],
  "contact": { "phone": "", "email": "", "instagram": "", "address": "", "hours": {} },
  "money": { "depositAmount": 10, "cancellationWindowHrs": 24, "stripeAccountId": "" }
}

Themes are an enum of four hand-tuned token sets with verified contrast.
Never invent a color. Never pick a theme outside the enum.

## Quality gates before any storefront is shown to a lead
- Zod validation passes
- Playwright renders at 390px with no horizontal overflow
- All tap targets >= 44px
- Text contrast >= 4.5:1
- Lighthouse performance and accessibility >= 90
Any failure holds the storefront instead of shipping it.
