/* Modelos de dados dos imóveis. */

export type PropertyPurpose = 'venda' | 'aluguel' | 'temporada'

export type PropertyKind =
  | 'casa'
  | 'apartamento'
  | 'cobertura'
  | 'terreno'
  | 'comercial'
  | 'rural'

export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido'

export interface PropertyImage {
  id: string
  /** URL http(s) OU data URL (base64) quando enviada pelo painel sem backend. */
  url: string
  alt?: string
}

export interface PropertyVideo {
  id: string
  /** Link do YouTube, Vimeo ou um .mp4 hospedado. */
  url: string
  title?: string
}

export interface Property {
  id: string
  slug: string
  title: string
  headline?: string
  description: string

  purpose: PropertyPurpose
  kind: PropertyKind
  status: PropertyStatus
  featured: boolean

  price: number
  /** Condomínio + IPTU mensais (opcional). */
  monthlyCosts?: number

  /** Localização. */
  neighborhood: string
  city: string
  state: string
  address?: string
  /** Consulta usada no embed do mapa; se vazio, monta a partir do endereço. */
  mapQuery?: string

  /** Números. */
  areaBuilt?: number
  areaTotal?: number
  bedrooms: number
  suites?: number
  bathrooms: number
  parking: number

  /** Diferenciais / comodidades (texto livre por item). */
  features: string[]

  images: PropertyImage[]
  videos: PropertyVideo[]

  createdAt: string
  updatedAt: string
}

/** Payload aceito pelo formulário do painel (sem campos derivados). */
export type PropertyDraft = Omit<
  Property,
  'id' | 'slug' | 'createdAt' | 'updatedAt'
> & {
  id?: string
  slug?: string
}

export const PURPOSE_LABEL: Record<PropertyPurpose, string> = {
  venda: 'Venda',
  aluguel: 'Aluguel',
  temporada: 'Temporada',
}

export const KIND_LABEL: Record<PropertyKind, string> = {
  casa: 'Casa',
  apartamento: 'Apartamento',
  cobertura: 'Cobertura',
  terreno: 'Terreno',
  comercial: 'Comercial',
  rural: 'Rural',
}

export const STATUS_LABEL: Record<PropertyStatus, string> = {
  disponivel: 'Disponível',
  reservado: 'Reservado',
  vendido: 'Vendido',
}
