import { useEffect } from 'react'
import site from '@/config/site.config'

/** Atualiza <title> e a meta description por página. */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const previousDesc = meta?.content
    if (description) {
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description
    }

    return () => {
      document.title = previousTitle
      if (meta && previousDesc !== undefined) meta.content = previousDesc
    }
  }, [title, description])
}

export function pageTitle(part: string): string {
  return `${part} · ${site.brand.name}`
}
