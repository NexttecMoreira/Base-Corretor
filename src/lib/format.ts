import type { Property } from '@/types/property'

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

const brlCents = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const int = new Intl.NumberFormat('pt-BR')

export function formatPrice(value: number): string {
  return brl.format(value || 0)
}

export function formatMoney(value: number): string {
  return brlCents.format(value || 0)
}

/** "R$ 2,4 mi" / "R$ 890 mil" — para cartões e destaques. */
export function formatPriceCompact(value: number): string {
  if (!value) return 'Sob consulta'
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `R$ ${m.toFixed(m % 1 === 0 ? 0 : 1).replace('.', ',')} mi`
  }
  if (value >= 1_000) {
    return `R$ ${Math.round(value / 1000)} mil`
  }
  return brl.format(value)
}

export function priceSuffix(property: Pick<Property, 'purpose'>): string {
  if (property.purpose === 'aluguel') return '/mês'
  if (property.purpose === 'temporada') return '/diária'
  return ''
}

export function formatArea(value?: number): string {
  if (!value) return '—'
  return `${int.format(value)} m²`
}

export function formatNumber(value: number): string {
  return int.format(value || 0)
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function pluralize(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${int.format(count)} ${count === 1 ? singular : plural}`
}
