import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProperties } from '@/lib/store'
import {
  applyFilters,
  filtersFromParams,
  paramsFromFilters,
  type FilterState,
} from '@/lib/filters'
import { usePageMeta, pageTitle } from '@/lib/usePageMeta'
import { Filters } from '@/components/property/Filters'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { ContactForm } from '@/components/contact/ContactForm'
import { IconSearch } from '@/components/icons'
import styles from './ListingsPage.module.css'

export function ListingsPage() {
  usePageMeta(pageTitle('Imóveis'), 'Todos os imóveis disponíveis, com filtros por bairro, tipo e valor.')

  const [params, setParams] = useSearchParams()
  const properties = useProperties()

  const filters = useMemo(() => filtersFromParams(params), [params])

  const priceCeiling = useMemo(() => {
    const max = Math.max(100_000, ...properties.map((p) => p.price))
    return Math.ceil(max / 100_000) * 100_000
  }, [properties])

  const results = useMemo(
    () => applyFilters(properties, filters),
    [properties, filters],
  )

  const onChange = (next: FilterState) => {
    setParams(paramsFromFilters(next), { replace: true })
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div className="container">
          <span className="eyebrow">{properties.length} imóveis no portfólio</span>
          <h1>Encontre o seu endereço</h1>
          <p>
            Explore a seleção completa. Ajuste os filtros ou{' '}
            <a href="#fale">fale comigo</a> para uma busca sob medida.
          </p>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <Filters
          value={filters}
          onChange={onChange}
          resultCount={results.length}
          priceCeiling={priceCeiling}
        />

        {results.length > 0 ? (
          <div className={styles.grid}>
            <PropertyGrid properties={results} />
          </div>
        ) : (
          <div className={styles.empty}>
            <IconSearch width={30} height={30} />
            <h3>Nenhum imóvel com esses filtros</h3>
            <p>
              Tente ampliar a faixa de valor ou remover algum filtro. Também posso
              procurar algo fora do site para você.
            </p>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setParams(new URLSearchParams(), { replace: true })}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      <section id="fale" className={styles.cta}>
        <div className={`container container--narrow ${styles.ctaInner}`}>
          <div>
            <span className="eyebrow">Busca personalizada</span>
            <h2>Não achou o que procura?</h2>
            <p>
              Descreva o imóvel ideal — região, metragem, número de quartos e faixa de
              valor. Retorno com uma seleção curada, incluindo oportunidades que não
              estão anunciadas.
            </p>
          </div>
          <ContactForm compact />
        </div>
      </section>
    </div>
  )
}
