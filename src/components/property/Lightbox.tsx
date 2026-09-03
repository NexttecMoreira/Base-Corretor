import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PropertyImage } from '@/types/property'
import { useLockBodyScroll } from '@/lib/hooks'
import { IconChevronLeft, IconChevronRight, IconClose } from '@/components/icons'
import styles from './Lightbox.module.css'

interface LightboxProps {
  images: PropertyImage[]
  startIndex: number
  onClose: () => void
}

export function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const [dir, setDir] = useState(1)
  const touchX = useRef<number | null>(null)
  useLockBodyScroll(true)

  const go = useCallback(
    (d: number) => {
      setDir(d)
      setIndex((i) => (i + d + images.length) % images.length)
    },
    [images.length],
  )

  const jump = useCallback(
    (target: number) => {
      setDir(target > index ? 1 : -1)
      setIndex(target)
    },
    [index],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, onClose])

  const current = images[index]

  return createPortal(
    <div className={styles.root} role="dialog" aria-modal="true" aria-label="Galeria de fotos">
      <div className={styles.top}>
        <span className={styles.counter}>
          <b>{String(index + 1).padStart(2, '0')}</b>
          <i>/</i>
          {String(images.length).padStart(2, '0')}
        </span>
        <button type="button" onClick={onClose} aria-label="Fechar galeria">
          <IconClose />
        </button>
      </div>

      <button
        type="button"
        className={`${styles.nav} ${styles.prev}`}
        onClick={() => go(-1)}
        aria-label="Foto anterior"
      >
        <IconChevronLeft />
      </button>

      <figure
        className={styles.stage}
        onClick={onClose}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return
          const delta = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <img
          key={current?.url}
          src={current?.url}
          alt={current?.alt ?? ''}
          className={dir >= 0 ? styles.slideNext : styles.slidePrev}
          onClick={(e) => e.stopPropagation()}
        />
        {current?.alt && <figcaption key={`cap-${index}`}>{current.alt}</figcaption>}
      </figure>

      <button
        type="button"
        className={`${styles.nav} ${styles.next}`}
        onClick={() => go(1)}
        aria-label="Próxima foto"
      >
        <IconChevronRight />
      </button>

      <div className={styles.thumbs}>
        {images.map((img, i) => (
          <button
            key={`${img.id}-${i}`}
            type="button"
            className={i === index ? styles.thumbActive : ''}
            onClick={() => jump(i)}
            aria-label={`Ir para foto ${i + 1}`}
          >
            <img src={img.url} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  )
}
