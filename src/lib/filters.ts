import type { Property, PropertyKind, PropertyPurpose } from '@/types/property'

export type SortKey =
  | 'relevancia'
  | 'menor-preco'
  | 'maior-preco'
  | 'recentes'
  | 'area'

export interface FilterState {
  q: string
  purpose: PropertyPurpose | 'todos'
  kind: PropertyKind | 'todos'
  bedrooms: 0 | 1 | 2 | 3 | 4
  priceMax: number | null
  sort: SortKey
}

export const defaultFilters: FilterState = {
  q: '',
  purpose: 'todos',
  kind: 'todos',
  bedrooms: 0,
  priceMax: null,
  sort: 'relevancia',
}

export function filtersFromParams(params: URLSearchParams): FilterState {
  const num = (v: string | null) => (v ? Number(v) : null)
  return {
    q: params.get('q') ?? '',
    purpose: (params.get('finalidade') as FilterState['purpose']) || 'todos',
    kind: (params.get('tipo') as FilterState['kind']) || 'todos',
    bedrooms: (Number(params.get('dorms')) || 0) as FilterState['bedrooms'],
    priceMax: num(params.get('ate')),
    sort: (params.get('ordem') as SortKey) || 'relevancia',
  }
}

export function paramsFromFilters(f: FilterState): URLSearchParams {
  const p = new URLSearchParams()
  if (f.q) p.set('q', f.q)
  if (f.purpose !== 'todos') p.set('finalidade', f.purpose)
  if (f.kind !== 'todos') p.set('tipo', f.kind)
  if (f.bedrooms) p.set('dorms', String(f.bedrooms))
  if (f.priceMax) p.set('ate', String(f.priceMax))
  if (f.sort !== 'relevancia') p.set('ordem', f.sort)
  return p
}

export function countActive(f: FilterState): number {
  let n = 0
  if (f.q) n++
  if (f.purpose !== 'todos') n++
  if (f.kind !== 'todos') n++
  if (f.bedrooms) n++
  if (f.priceMax) n++
  return n
}

const SORTERS: Record<SortKey, (a: Property, b: Property) => number> = {
  relevancia: () => 0,
  'menor-preco': (a, b) => a.price - b.price,
  'maior-preco': (a, b) => b.price - a.price,
  recentes: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
  area: (a, b) =>
    (b.areaBuilt || b.areaTotal || 0) - (a.areaBuilt || a.areaTotal || 0),
}

export function applyFilters(properties: Property[], f: FilterState): Property[] {
  const q = f.q.trim().toLowerCase()

  const filtered = properties.filter((p) => {
    if (f.purpose !== 'todos' && p.purpose !== f.purpose) return false
    if (f.kind !== 'todos' && p.kind !== f.kind) return false
    if (f.bedrooms && p.bedrooms < f.bedrooms) return false
    if (f.priceMax && p.price > f.priceMax) return false
    if (q) {
      const haystack = [
        p.title,
        p.headline,
        p.neighborhood,
        p.city,
        p.description,
        ...p.features,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })

  if (f.sort !== 'relevancia') {
    filtered.sort(SORTERS[f.sort])
  }
  return filtered
}
