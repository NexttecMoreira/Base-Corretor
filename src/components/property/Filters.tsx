import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { FilterState, SortKey } from '@/lib/filters'
import { countActive, defaultFilters } from '@/lib/filters'
import { KIND_LABEL, PURPOSE_LABEL } from '@/types/property'
import { formatPriceCompact } from '@/lib/format'
import { useLockBodyScroll, useMediaQuery, useOnEscape } from '@/lib/hooks'
import { IconClose, IconSearch } from '@/components/icons'
import styles from './Filters.module.css'

interface FiltersProps {
  value: FilterState
  onChange: (next: FilterState) => void
  resultCount: number
  priceCeiling: number
}

const SORT_LABEL: Record<SortKey, string> = {
  relevancia: 'Mais relevantes',
  'menor-preco': 'Menor preço',
  'maior-preco': 'Maior preço',
  recentes: 'Mais recentes',
  area: 'Maior área',
}

function priceBuckets(ceiling: number): number[] {
  if (ceiling <= 60_000) return [10_000, 20_000, 30_000, 40_000, 50_000]
  if (ceiling <= 1_000_000) return [200_000, 400_000, 600_000, 800_000]
  const out: number[] = []
  for (let v = 1_000_000; v < ceiling; v += v < 5_000_000 ? 1_000_000 : 2_500_000) {
    out.push(v)
  }
  return out.slice(0, 6)
}

export function Filters({ value, onChange, resultCount, priceCeiling }: FiltersProps) {
  const isMobile = useMediaQuery('(max-width: 720px)')
  const [sheetOpen, setSheetOpen] = useState(false)
  useLockBodyScroll(sheetOpen)
  useOnEscape(() => setSheetOpen(false), sheetOpen)

  const set = <K extends keyof FilterState>(key: K, v: FilterState[K]) =>
    onChange({ ...value, [key]: v })

  const active = countActive(value)
  const buckets = priceBuckets(priceCeiling)

  const controls = (
    <>
      <Field label="Finalidade">
        <select
          value={value.purpose}
          onChange={(e) => set('purpose', e.target.value as FilterState['purpose'])}
        >
          <option value="todos">Todas</option>
          {Object.entries(PURPOSE_LABEL).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tipo">
        <select
          value={value.kind}
          onChange={(e) => set('kind', e.target.value as FilterState['kind'])}
        >
          <option value="todos">Todos</option>
          {Object.entries(KIND_LABEL).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Dormitórios">
        <select
          value={value.bedrooms}
          onChange={(e) =>
            set('bedrooms', Number(e.target.value) as FilterState['bedrooms'])
          }
        >
          <option value={0}>Qualquer</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+ dorm.
            </option>
          ))}
        </select>
      </Field>

      <Field label="Valor máximo">
        <select
          value={value.priceMax ?? ''}
          onChange={(e) =>
            set('priceMax', e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Sem limite</option>
          {buckets.map((v) => (
            <option key={v} value={v}>
              até {formatPriceCompact(v)}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Ordenar por">
        <select
          value={value.sort}
          onChange={(e) => set('sort', e.target.value as SortKey)}
        >
          {Object.entries(SORT_LABEL).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </Field>
    </>
  )

  /* -------- Mobile: barra compacta + bottom sheet -------- */
  if (isMobile) {
    return (
      <>
        <div className={styles.mobileBar}>
          <label className={styles.search}>
            <IconSearch width={16} height={16} />
            <input
              type="search"
              placeholder="Buscar bairro, cidade…"
              value={value.q}
              onChange={(e) => set('q', e.target.value)}
            />
          </label>
          <button
            type="button"
            className={styles.filterBtn}
            onClick={() => setSheetOpen(true)}
          >
            Filtros
            {active > 0 && <span className={styles.dot}>{active}</span>}
          </button>
        </div>

        {sheetOpen &&
          createPortal(
            <div className={styles.overlay} onMouseDown={() => setSheetOpen(false)}>
              <div
                className={styles.sheet}
                role="dialog"
                aria-modal="true"
                aria-label="Filtros"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <div className={styles.sheetHead}>
                  <h3>Filtrar imóveis</h3>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Fechar"
                  >
                    <IconClose width={18} height={18} />
                  </button>
                </div>

                <div className={styles.sheetBody}>{controls}</div>

                <div className={styles.sheetFoot}>
                  {active > 0 && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() =>
                        onChange({ ...defaultFilters, q: value.q, sort: value.sort })
                      }
                    >
                      Limpar
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn--accent"
                    onClick={() => setSheetOpen(false)}
                  >
                    Ver {resultCount} {resultCount === 1 ? 'imóvel' : 'imóveis'}
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}
      </>
    )
  }

  /* -------- Desktop: barra de pílulas em linha única -------- */
  return (
    <div className={styles.bar}>
      <label className={styles.search}>
        <IconSearch width={16} height={16} />
        <input
          type="search"
          placeholder="Buscar por bairro, cidade ou característica…"
          value={value.q}
          onChange={(e) => set('q', e.target.value)}
        />
      </label>

      <select
        className={styles.select}
        aria-label="Finalidade"
        value={value.purpose}
        onChange={(e) => set('purpose', e.target.value as FilterState['purpose'])}
      >
        <option value="todos">Finalidade</option>
        {Object.entries(PURPOSE_LABEL).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Tipo"
        value={value.kind}
        onChange={(e) => set('kind', e.target.value as FilterState['kind'])}
      >
        <option value="todos">Tipo</option>
        {Object.entries(KIND_LABEL).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Dormitórios"
        value={value.bedrooms}
        onChange={(e) =>
          set('bedrooms', Number(e.target.value) as FilterState['bedrooms'])
        }
      >
        <option value={0}>Dormitórios</option>
        {[1, 2, 3, 4].map((n) => (
          <option key={n} value={n}>
            {n}+ dorm.
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Valor máximo"
        value={value.priceMax ?? ''}
        onChange={(e) =>
          set('priceMax', e.target.value ? Number(e.target.value) : null)
        }
      >
        <option value="">Valor</option>
        {buckets.map((v) => (
          <option key={v} value={v}>
            até {formatPriceCompact(v)}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        aria-label="Ordenar"
        value={value.sort}
        onChange={(e) => set('sort', e.target.value as SortKey)}
      >
        {Object.entries(SORT_LABEL).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </select>

      {active > 0 && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange({ ...defaultFilters, sort: value.sort })}
        >
          <IconClose width={13} height={13} />
          Limpar
        </button>
      )}

      <span className={styles.count}>
        {resultCount} {resultCount === 1 ? 'imóvel' : 'imóveis'}
      </span>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  )
}
