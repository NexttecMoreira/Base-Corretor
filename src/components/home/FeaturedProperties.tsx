import { Link } from 'react-router-dom'
import { useProperties } from '@/lib/store'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { SectionHeader } from './SectionHeader'
import { IconArrowRight } from '@/components/icons'

export function FeaturedProperties() {
  const all = useProperties()
  const featured = all.filter((p) => p.featured)
  // Prévia da home: 5 imóveis (destaques primeiro). O resto fica no catálogo.
  const rest = all.filter((p) => !featured.includes(p))
  const list = [...featured, ...rest].slice(0, 5)
  const hasMore = all.length > list.length

  if (list.length === 0) return null

  return (
    <section id="imoveis" className="section container">
      <SectionHeader
        index={1}
        eyebrow={`${all.length} imóveis disponíveis`}
        title={
          <>
            Casas, apartamentos e <span className="serif-italic">coberturas</span> à venda
          </>
        }
        intro="Uma seleção curada — cada imóvel visitado e avaliado pessoalmente."
        action={
          <Link to="/imoveis" className="link-underline">
            Ver todos os imóveis <IconArrowRight width={16} height={16} />
          </Link>
        }
      />
      <PropertyGrid properties={list} spotlightFirst />

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <Link to="/imoveis" className="btn btn--ghost">
            Ver catálogo completo
            <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      )}
    </section>
  )
}
