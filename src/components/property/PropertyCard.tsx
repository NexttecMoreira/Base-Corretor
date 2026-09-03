import { Link } from 'react-router-dom'
import type { Property } from '@/types/property'
import { STATUS_LABEL } from '@/types/property'
import { formatPrice, formatPriceCompact, priceSuffix } from '@/lib/format'
import { locationLabel, roomsSummary } from '@/lib/propertyView'
import { useScrollReveal } from '@/lib/hooks'
import { SmartImage } from '@/components/ui/SmartImage'
import {
  IconArrowUpRight,
  IconBed,
  IconBath,
  IconCar,
  IconMapPin,
  IconRuler,
} from '@/components/icons'
import styles from './PropertyCard.module.css'

interface PropertyCardProps {
  property: Property
  featured?: boolean
  index?: number
  revealDelay?: number
}

export function PropertyCard({
  property,
  featured,
  index = 0,
  revealDelay = 0,
}: PropertyCardProps) {
  const revealRef = useScrollReveal<HTMLElement>()
  const href = `/imoveis/${property.slug}`
  const rooms = roomsSummary(property)
  const area = property.areaBuilt || property.areaTotal

  return (
    <article
      ref={revealRef}
      className={[
        styles.card,
        'group',
        'reveal',
        featured ? styles.featured : '',
        property.status !== 'disponivel' ? styles.muted : '',
      ].join(' ')}
      style={{ ['--reveal-delay' as string]: `${revealDelay}ms` } as object}
    >
      <Link to={href} className={styles.media} aria-label={property.title}>
        {featured ? (
          <SmartImage
            src={property.images[0]?.url ?? ''}
            alt={property.images[0]?.alt ?? property.title}
            fill
            zoomOnHover
            eager
            sizes="(max-width: 900px) 100vw, 60vw"
          />
        ) : (
          <SmartImage
            src={property.images[0]?.url ?? ''}
            alt={property.images[0]?.alt ?? property.title}
            ratio="4 / 5"
            mobileRatio="16 / 11"
            zoomOnHover
            eager={index < 2}
            sizes="(max-width: 900px) 100vw, 33vw"
          />
        )}
        <div className={styles.tags}>
          <span className={styles.purpose}>
            {property.purpose === 'aluguel'
              ? 'Para alugar'
              : property.purpose === 'temporada'
                ? 'Temporada'
                : 'À venda'}
          </span>
          {property.status !== 'disponivel' && (
            <span className={styles.status}>{STATUS_LABEL[property.status]}</span>
          )}
        </div>

        <div className={styles.priceOverlay}>
          <span className={styles.price}>
            {formatPrice(property.price)}
            <em>{priceSuffix(property)}</em>
          </span>
          <span className={styles.compact}>{formatPriceCompact(property.price)}</span>
        </div>
      </Link>

      <div className={styles.body}>
        <p className={styles.kind}>{property.headline || kindLine(property)}</p>
        <h3 className={styles.title}>
          <Link to={href}>{property.title}</Link>
        </h3>
        <p className={styles.location}>
          <IconMapPin width={15} height={15} />
          {locationLabel(property)}
        </p>

        <ul className={styles.stats}>
          {property.bedrooms > 0 && (
            <li>
              <IconBed width={17} height={17} />
              {property.bedrooms}
            </li>
          )}
          {property.bathrooms > 0 && (
            <li>
              <IconBath width={17} height={17} />
              {property.bathrooms}
            </li>
          )}
          {property.parking > 0 && (
            <li>
              <IconCar width={17} height={17} />
              {property.parking}
            </li>
          )}
          {area && (
            <li>
              <IconRuler width={17} height={17} />
              {area} m²
            </li>
          )}
        </ul>

        {featured && (
          <p className={styles.blurb}>{property.description.slice(0, 180)}…</p>
        )}

        <Link to={href} className={`link-underline ${styles.cta}`}>
          Ver imóvel
          <IconArrowUpRight width={16} height={16} />
        </Link>
      </div>

      {featured && <span className={styles.ribbon}>Destaque</span>}
      {/* fallback textual p/ leitores de tela do resumo de cômodos */}
      <span className="visually-hidden">{rooms.join(', ')}</span>
    </article>
  )
}

function kindLine(p: Property): string {
  const map: Record<Property['kind'], string> = {
    casa: 'Casa',
    apartamento: 'Apartamento',
    cobertura: 'Cobertura',
    terreno: 'Terreno',
    comercial: 'Sala comercial',
    rural: 'Imóvel rural',
  }
  return map[p.kind]
}
