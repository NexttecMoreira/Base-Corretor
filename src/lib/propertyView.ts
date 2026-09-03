import type { Property } from '@/types/property'
import { KIND_LABEL, PURPOSE_LABEL } from '@/types/property'
import { formatArea, pluralize } from './format'

export function locationLabel(p: Property): string {
  return `${p.neighborhood}, ${p.city}`
}

export function kindPurposeLabel(p: Property): string {
  return `${KIND_LABEL[p.kind]} · ${PURPOSE_LABEL[p.purpose]}`
}

/** Resumo curto de cômodos para cartões. */
export function roomsSummary(p: Property): string[] {
  const out: string[] = []
  if (p.bedrooms > 0) {
    out.push(
      p.suites && p.suites > 0
        ? `${p.bedrooms} dorm. (${p.suites} suíte${p.suites > 1 ? 's' : ''})`
        : pluralize(p.bedrooms, 'dormitório', 'dormitórios'),
    )
  }
  if (p.bathrooms > 0) out.push(pluralize(p.bathrooms, 'banheiro', 'banheiros'))
  if (p.parking > 0) out.push(pluralize(p.parking, 'vaga', 'vagas'))
  const area = p.areaBuilt || p.areaTotal
  if (area) out.push(formatArea(area))
  return out
}

export function mapQueryFor(p: Property): string {
  return (
    p.mapQuery ||
    [p.address, p.neighborhood, `${p.city} - ${p.state}`]
      .filter(Boolean)
      .join(', ')
  )
}

export function primaryImage(p: Property): string | undefined {
  return p.images[0]?.url
}

interface MediaEmbed {
  kind: 'youtube' | 'vimeo' | 'file'
  src: string
}

export function parseVideo(url: string): MediaEmbed | null {
  if (!url) return null
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  )
  if (yt) {
    return {
      kind: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1`,
    }
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vm) {
    return { kind: 'vimeo', src: `https://player.vimeo.com/video/${vm[1]}` }
  }
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return { kind: 'file', src: url }
  }
  return null
}
