import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './SmartImage.module.css'

interface SmartImageProps {
  src: string
  alt: string
  /** Ex.: "4 / 3", "16 / 10", "1 / 1". Ignorado quando `fill`. */
  ratio?: string
  /** Proporção usada em telas ≤ 640px (default: igual a `ratio`). */
  mobileRatio?: string
  sizes?: string
  className?: string
  eager?: boolean
  /** Ken Burns sutil quando um ancestral com .group está em hover. */
  zoomOnHover?: boolean
  objectPosition?: string
  /** Preenche o elemento pai (que precisa ter position/tamanho definidos). */
  fill?: boolean
}

const FALLBACK =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
      <rect width="400" height="300" fill="#efece2"/>
      <g fill="none" stroke="#b6b1a2" stroke-width="6" stroke-linejoin="round">
        <path d="M120 170l80-58 80 58"/>
        <path d="M140 160v70h120v-70"/>
        <path d="M185 230v-40h30v40"/>
      </g>
    </svg>`,
  )

export function SmartImage({
  src,
  alt,
  ratio = '4 / 3',
  mobileRatio,
  sizes,
  className,
  eager = false,
  zoomOnHover = false,
  objectPosition,
  fill = false,
}: SmartImageProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const imgRef = useRef<HTMLImageElement>(null)

  // Imagens em cache podem já estar completas antes do onLoad ser anexado.
  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    if (img.complete) {
      setStatus(img.naturalWidth > 0 ? 'ready' : 'error')
    }
  }, [src])

  const style: CSSProperties = fill
    ? {}
    : ({
        ['--sm-ratio' as string]: ratio,
        ['--sm-ratio-m' as string]: mobileRatio ?? ratio,
      } as CSSProperties)
  const imgStyle: CSSProperties = objectPosition ? { objectPosition } : {}

  return (
    <div
      className={[
        styles.wrap,
        fill ? styles.fill : '',
        zoomOnHover ? styles.zoom : '',
        className ?? '',
      ].join(' ')}
      style={style}
      data-status={status}
    >
      <div className={styles.shimmer} aria-hidden />
      <img
        ref={imgRef}
        src={status === 'error' ? FALLBACK : src || FALLBACK}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        style={imgStyle}
        onLoad={() => setStatus((s) => (s === 'error' ? s : 'ready'))}
        onError={() => setStatus('error')}
      />
    </div>
  )
}
