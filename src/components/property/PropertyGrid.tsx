import type { Property } from '@/types/property'
import { PropertyCard } from './PropertyCard'
import styles from './PropertyGrid.module.css'

interface PropertyGridProps {
  properties: Property[]
  /** O 1º item, se for destaque, ocupa 2 colunas. */
  spotlightFirst?: boolean
}

export function PropertyGrid({ properties, spotlightFirst }: PropertyGridProps) {
  return (
    <div className={styles.grid}>
      {properties.map((p, i) => (
        <PropertyCard
          key={p.id}
          property={p}
          index={i}
          revealDelay={Math.min(i, 5) * 55}
          featured={spotlightFirst && i === 0 && p.featured}
        />
      ))}
    </div>
  )
}
