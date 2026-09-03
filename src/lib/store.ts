/* =============================================================================
   CAMADA DE DADOS DOS IMÓVEIS
   -----------------------------------------------------------------------------
   Sem backend: os imóveis vivem no localStorage do navegador, semeados a partir
   de src/data/seedProperties.ts na primeira visita.

   A API abaixo é assíncrona de propósito (retorna Promise). Para plugar um
   backend real depois, basta criar outra implementação de `PropertyRepository`
   (ex.: chamando fetch/`/api/properties`) e trocar o `repo` exportado no fim
   do arquivo. Nenhum componente precisa mudar.
   ========================================================================== */

import { useCallback, useSyncExternalStore } from 'react'
import type { Property, PropertyDraft } from '@/types/property'
import { seedProperties } from '@/data/seedProperties'
import { uid, uniqueSlug } from './slugify'

/* Chave do localStorage. Enquanto você ainda está montando a base, se mudar os
   imóveis de exemplo em src/data/seedProperties.ts, suba o número da versão
   (v2 → v3 …) para forçar o navegador a recarregar o seed novo. Isso descarta o
   que estiver salvo localmente. (Ou use o painel → Ajustes → "Restaurar exemplos".) */
const STORAGE_KEY = 'corretor.properties.v5'

export interface PropertyRepository {
  list(): Promise<Property[]>
  getBySlug(slug: string): Promise<Property | undefined>
  getById(id: string): Promise<Property | undefined>
  create(draft: PropertyDraft): Promise<Property>
  update(id: string, draft: PropertyDraft): Promise<Property>
  remove(id: string): Promise<void>
  /** Restaura os imóveis de exemplo (usado no painel). */
  reset(): Promise<void>
  /** Substitui todo o acervo (import de backup). */
  importAll(list: Property[]): Promise<void>
  /** Remove todos os imóveis. */
  clear(): Promise<void>
}

/* -------------------------------------------------------------------------- */
/* Implementação local (localStorage)                                         */
/* -------------------------------------------------------------------------- */

type Listener = () => void

class LocalPropertyRepository implements PropertyRepository {
  private cache: Property[] | null = null
  private listeners = new Set<Listener>()

  private read(): Property[] {
    if (this.cache) return this.cache
    let data: Property[] | null = null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) data = JSON.parse(raw) as Property[]
    } catch {
      data = null
    }
    if (!data || !Array.isArray(data)) {
      data = seedProperties.map(normalize)
      this.persist(data)
    }
    this.cache = data
    return data
  }

  private persist(data: Property[]) {
    this.cache = data
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (err) {
      // localStorage cheio: normalmente imagens base64 grandes demais.
      console.warn('[store] não foi possível salvar no localStorage:', err)
    }
    this.emit()
  }

  private emit() {
    this.listeners.forEach((l) => l())
  }

  subscribe = (listener: Listener) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  /** Snapshot síncrono estável para useSyncExternalStore. */
  snapshot = (): Property[] => this.read()

  async list() {
    return sortProperties(this.read())
  }

  async getBySlug(slug: string) {
    return this.read().find((p) => p.slug === slug)
  }

  async getById(id: string) {
    return this.read().find((p) => p.id === id)
  }

  async create(draft: PropertyDraft) {
    const all = this.read()
    const taken = new Set(all.map((p) => p.slug))
    const now = new Date().toISOString()
    const property: Property = {
      ...normalize(draft as Property),
      id: uid('imv'),
      slug: uniqueSlug(draft.slug || draft.title, taken),
      createdAt: now,
      updatedAt: now,
    }
    this.persist([property, ...all])
    return property
  }

  async update(id: string, draft: PropertyDraft) {
    const all = this.read()
    const index = all.findIndex((p) => p.id === id)
    if (index === -1) throw new Error('Imóvel não encontrado')
    const current = all[index]
    const taken = new Set(all.filter((p) => p.id !== id).map((p) => p.slug))
    const nextSlugBase = draft.slug || draft.title
    const slug =
      nextSlugBase && nextSlugBase !== current.title
        ? uniqueSlug(nextSlugBase, taken)
        : current.slug
    const updated: Property = {
      ...current,
      ...normalize({ ...current, ...draft } as Property),
      id: current.id,
      slug,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    }
    const next = [...all]
    next[index] = updated
    this.persist(next)
    return updated
  }

  async remove(id: string) {
    this.persist(this.read().filter((p) => p.id !== id))
  }

  async reset() {
    this.persist(seedProperties.map(normalize))
  }

  async importAll(list: Property[]) {
    if (!Array.isArray(list)) throw new Error('Arquivo inválido.')
    this.persist(list.map(normalize))
  }

  async clear() {
    this.persist([])
  }
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalize(p: Property): Property {
  return {
    ...p,
    headline: p.headline ?? '',
    features: Array.isArray(p.features) ? p.features.filter(Boolean) : [],
    images: Array.isArray(p.images) ? p.images : [],
    videos: Array.isArray(p.videos) ? p.videos : [],
    bedrooms: Number(p.bedrooms) || 0,
    bathrooms: Number(p.bathrooms) || 0,
    parking: Number(p.parking) || 0,
    suites: p.suites ? Number(p.suites) : undefined,
    price: Number(p.price) || 0,
    monthlyCosts: p.monthlyCosts ? Number(p.monthlyCosts) : undefined,
    areaBuilt: p.areaBuilt ? Number(p.areaBuilt) : undefined,
    areaTotal: p.areaTotal ? Number(p.areaTotal) : undefined,
    featured: Boolean(p.featured),
  }
}

const STATUS_ORDER: Record<Property['status'], number> = {
  disponivel: 0,
  reservado: 1,
  vendido: 2,
}

export function sortProperties(list: Property[]): Property[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.status !== b.status) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

/* -------------------------------------------------------------------------- */
/* Singleton + hooks React                                                    */
/* -------------------------------------------------------------------------- */

const localRepo = new LocalPropertyRepository()

/** Troque aqui para plugar um backend real no futuro. */
export const repo: PropertyRepository = localRepo

/** Lista reativa de imóveis (ordenada). */
export function useProperties(): Property[] {
  const list = useSyncExternalStore(
    localRepo.subscribe,
    localRepo.snapshot,
    localRepo.snapshot,
  )
  return sortProperties(list)
}

/** Um imóvel por slug (reativo). Retorna `null` enquanto não encontra. */
export function useProperty(slug: string | undefined): Property | null {
  const all = useSyncExternalStore(
    localRepo.subscribe,
    localRepo.snapshot,
    localRepo.snapshot,
  )
  if (!slug) return null
  return all.find((p) => p.slug === slug) ?? null
}

/** Um imóvel por id (reativo) — usado no editor do painel. */
export function usePropertyById(id: string | undefined): Property | null {
  const all = useSyncExternalStore(
    localRepo.subscribe,
    localRepo.snapshot,
    localRepo.snapshot,
  )
  if (!id) return null
  return all.find((p) => p.id === id) ?? null
}

/** Ações memoizadas do repositório. */
export function usePropertyActions() {
  return {
    create: useCallback((draft: PropertyDraft) => repo.create(draft), []),
    update: useCallback(
      (id: string, draft: PropertyDraft) => repo.update(id, draft),
      [],
    ),
    remove: useCallback((id: string) => repo.remove(id), []),
    reset: useCallback(() => repo.reset(), []),
    importAll: useCallback((list: Property[]) => repo.importAll(list), []),
    clear: useCallback(() => repo.clear(), []),
  }
}
