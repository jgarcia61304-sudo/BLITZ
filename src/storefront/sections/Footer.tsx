import type { Brand, Contact } from '../../types/storefront'
import { hasText, instagramUrl, telHref } from '../format'

export function Footer({
  brand,
  contact,
}: {
  brand: Brand | undefined
  contact: Contact | undefined
}) {
  const links: { href: string; label: string }[] = []
  if (hasText(contact?.instagram_handle)) {
    links.push({
      href: instagramUrl(contact.instagram_handle),
      label: contact.instagram_handle.startsWith('@')
        ? contact.instagram_handle
        : `@${contact.instagram_handle}`,
    })
  }
  if (hasText(contact?.phone)) {
    links.push({ href: telHref(contact.phone), label: contact.phone })
  }
  if (hasText(contact?.email)) {
    links.push({ href: `mailto:${contact.email.trim()}`, label: contact.email })
  }
  if (links.length === 0) return null

  return (
    <footer className="sf-footer">
      <div className="sf-wrap">
        {hasText(brand?.name) && <p className="sf-footer-name">{brand.name}</p>}
        <ul className="sf-footer-links">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
