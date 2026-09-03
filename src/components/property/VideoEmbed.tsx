import { useState } from 'react'
import type { PropertyVideo } from '@/types/property'
import { parseVideo } from '@/lib/propertyView'
import { IconPlay } from '@/components/icons'
import styles from './VideoEmbed.module.css'

export function VideoEmbed({ video, poster }: { video: PropertyVideo; poster?: string }) {
  const [active, setActive] = useState(false)
  const parsed = parseVideo(video.url)

  if (!parsed) {
    return (
      <a href={video.url} target="_blank" rel="noreferrer" className={styles.fallback}>
        <IconPlay width={18} height={18} />
        {video.title || 'Assistir ao vídeo'}
      </a>
    )
  }

  if (parsed.kind === 'file') {
    return (
      <div className={styles.frame}>
        <video src={parsed.src} controls playsInline poster={poster} preload="metadata" />
      </div>
    )
  }

  if (!active) {
    return (
      <button
        type="button"
        className={`${styles.frame} ${styles.cover} group`}
        onClick={() => setActive(true)}
        style={poster ? { backgroundImage: `url(${poster})` } : undefined}
        aria-label={video.title || 'Reproduzir vídeo'}
      >
        <span className={styles.play}>
          <IconPlay width={22} height={22} />
        </span>
        <span className={styles.label}>{video.title || 'Tour em vídeo'}</span>
      </button>
    )
  }

  return (
    <div className={styles.frame}>
      <iframe
        src={`${parsed.src}${parsed.src.includes('?') ? '&' : '?'}autoplay=1`}
        title={video.title || 'Vídeo do imóvel'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
