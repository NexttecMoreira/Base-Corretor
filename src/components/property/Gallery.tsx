import { useRef, useState } from 'react'
import type { PropertyImage } from '@/types/property'
import { useMediaQuery } from '@/lib/hooks'
import { SmartImage } from '@/components/ui/SmartImage'
import { IconImage } from '@/components/icons'
import { Lightbox } from './Lightbox'
import styles from './Gallery.module.css'

interface GalleryProps {
  images: PropertyImage[]
  title: string
}

export function Gallery({ images, title }: GalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [slide, setSlide] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery('(max-width: 760px)')

  if (images.length === 0) {
    return (
      <div className={styles.empty}>
        <IconImage width={28} height={28} />
        <p>Sem fotos cadastradas ainda.</p>
      </div>
    )
  }

  /* -------- Mobile: carrossel com swipe + dots -------- */
  if (isMobile) {
    return (
      <>
        <div className={styles.carousel}>
          <div
            ref={trackRef}
            className={styles.track}
            onScroll={(e) => {
              const el = e.currentTarget
              setSlide(Math.round(el.scrollLeft / el.clientWidth))
            }}
          >
            {images.map((img, i) => (
              <button
                key={`${img.id}-${i}`}
                type="button"
                className={styles.slide}
                onClick={() => setLightbox(i)}
                aria-label={`Foto ${i + 1} de ${images.length}`}
              >
                <SmartImage
                  src={img.url}
                  alt={img.alt ?? title}
                  ratio="4 / 3"
                  eager={i === 0}
                />
              </button>
            ))}
          </div>

          <span className={styles.counter}>
            {slide + 1} / {images.length}
          </span>

          {images.length > 1 && (
            <div className={styles.dots}>
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={i === slide ? styles.dotOn : ''}
                  aria-label={`Ir para foto ${i + 1}`}
                  onClick={() => {
                    const el = trackRef.current
                    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <button type="button" className={styles.allBtn} onClick={() => setLightbox(slide)}>
          <IconImage width={16} height={16} />
          Ver todas as {images.length} fotos
        </button>

        {lightbox !== null && (
          <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </>
    )
  }

  /* -------- Desktop: mosaico -------- */
  const [hero, ...rest] = images
  const tiles = rest.slice(0, 4)
  const remaining = images.length - 1 - tiles.length

  return (
    <>
      <div className={styles.mosaic} data-count={Math.min(images.length, 5)}>
        <button
          type="button"
          className={`${styles.hero} group`}
          onClick={() => setLightbox(0)}
          aria-label={`Abrir galeria de ${title}`}
        >
          <SmartImage src={hero.url} alt={hero.alt ?? title} ratio="4 / 3" zoomOnHover eager />
        </button>

        {tiles.map((img, i) => (
          <button
            key={`${img.id}-${i}`}
            type="button"
            className={`${styles.tile} group`}
            onClick={() => setLightbox(i + 1)}
            aria-label={`Foto ${i + 2} de ${title}`}
          >
            <SmartImage src={img.url} alt={img.alt ?? title} ratio="4 / 3" zoomOnHover />
            {i === tiles.length - 1 && remaining > 0 && (
              <span className={styles.more}>+{remaining} fotos</span>
            )}
          </button>
        ))}
      </div>

      <button type="button" className={styles.allBtn} onClick={() => setLightbox(0)}>
        <IconImage width={16} height={16} />
        Ver todas as {images.length} fotos
      </button>

      {lightbox !== null && (
        <Lightbox images={images} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
