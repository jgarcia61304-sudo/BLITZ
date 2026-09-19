import type { StorefrontContent } from '../../types/storefront'
import { hasText, instagramHandle, instagramUrl, telHref } from '../format'

export function Footer({
  business,
  contact,
}: {
  business: StorefrontContent['business']
  contact: StorefrontContent['contact']
}) {
  const links: { href: string; label: string; external?: boolean }[] = []
  if (hasText(contact.instagram)) {
    links.push({
      href: instagramUrl(contact.instagram),
      label: instagramHandle(contact.instagram),
      external: true,
    })
  }
  if (hasText(contact.phone)) links.push({ href: telHref(contact.phone), label: contact.phone })
  if (hasText(contact.email)) links.push({ href: `mailto:${contact.email.trim()}`, label: contact.email })

  return (
    <footer className="sf-footer">
      <div className="sf-wrap">
        <p className="sf-footer-name">{business.name}</p>
        {links.length > 0 && (
          <ul className="sf-footer-links">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} rel={link.external ? 'noreferrer' : undefined}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
