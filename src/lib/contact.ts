import site from '@/config/site.config'

/** Monta um link wa.me com mensagem pré-preenchida. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.contact.whatsapp}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function whatsappForProperty(title: string, priceLabel: string): string {
  return whatsappLink(
    `Olá, ${site.brand.name}! Tenho interesse no imóvel "${title}" (${priceLabel}). Podemos conversar?`,
  )
}

export function mailtoLink(subject: string, body?: string): string {
  const params = new URLSearchParams({ subject })
  if (body) params.set('body', body)
  return `mailto:${site.contact.email}?${params.toString()}`
}

export function telLink(): string {
  return `tel:+${site.contact.whatsapp}`
}
