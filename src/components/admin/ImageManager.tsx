import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import type { PropertyImage } from '@/types/property'
import { uid } from '@/lib/slugify'
import {
  approxDataUrlKB,
  fileToCompressedDataUrl,
  localStorageUsageMB,
} from '@/lib/image'
import {
  IconChevronLeft,
  IconChevronRight,
  IconGrip,
  IconImage,
  IconStar,
  IconTrash,
} from '@/components/icons'
import styles from './ImageManager.module.css'

interface ImageManagerProps {
  images: PropertyImage[]
  onChange: (next: PropertyImage[]) => void
}

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [urlDraft, setUrlDraft] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setBusy(true)
    setError(null)
    const added: PropertyImage[] = []
    for (const file of Array.from(files)) {
      try {
        const url = await fileToCompressedDataUrl(file)
        added.push({ id: uid('img'), url, alt: '' })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao processar imagem.')
      }
    }
    if (added.length) onChange([...images, ...added])
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    void handleFiles(e.target.files)
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (e.dataTransfer.files.length) {
      void handleFiles(e.dataTransfer.files)
    }
  }

  function addUrl() {
    const u = urlDraft.trim()
    if (!/^https?:\/\//i.test(u)) {
      setError('Informe uma URL completa (https://…).')
      return
    }
    onChange([...images, { id: uid('img'), url: u, alt: '' }])
    setUrlDraft('')
    setError(null)
  }

  function update(index: number, patch: Partial<PropertyImage>) {
    onChange(images.map((img, i) => (i === index ? { ...img, ...patch } : img)))
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const usage = localStorageUsageMB()

  return (
    <div className={styles.wrap}>
      <div
        className={styles.dropzone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      >
        <IconImage width={26} height={26} />
        <p>
          <strong>Arraste fotos aqui</strong> ou clique para escolher
        </p>
        <span>JPG, PNG ou WebP · redimensionadas para ~1600px automaticamente</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={onInputChange}
        />
      </div>

      <div className={styles.urlRow}>
        <input
          className="input"
          placeholder="…ou cole a URL de uma imagem hospedada"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addUrl())}
        />
        <button type="button" className="btn btn--ghost btn--sm" onClick={addUrl}>
          Adicionar URL
        </button>
      </div>

      {busy && <p className={styles.status}>Processando imagens…</p>}
      {error && <p className={styles.error}>{error}</p>}

      {images.length > 0 && (
        <>
          <ul className={styles.grid}>
            {images.map((img, i) => (
              <li
                key={img.id}
                className={[styles.item, dragIndex === i ? styles.dragging : ''].join(' ')}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragEnd={() => setDragIndex(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== i) move(dragIndex, i)
                  setDragIndex(null)
                }}
              >
                <div className={styles.preview}>
                  <img src={img.url} alt={img.alt || ''} loading="lazy" />
                  {i === 0 && <span className={styles.coverTag}>Capa</span>}
                  <span className={styles.grip}>
                    <IconGrip width={16} height={16} />
                  </span>
                </div>

                <input
                  className={styles.alt}
                  placeholder="Legenda / descrição da foto"
                  value={img.alt ?? ''}
                  onChange={(e) => update(i, { alt: e.target.value })}
                />

                <div className={styles.itemActions}>
                  <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} title="Mover para trás">
                    <IconChevronLeft width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === images.length - 1}
                    title="Mover para frente"
                  >
                    <IconChevronRight width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 0)}
                    disabled={i === 0}
                    title="Definir como capa"
                  >
                    <IconStar width={15} height={15} />
                  </button>
                  <button
                    type="button"
                    className={styles.del}
                    onClick={() => remove(i)}
                    title="Remover"
                  >
                    <IconTrash width={15} height={15} />
                  </button>
                </div>

                <span className={styles.size}>
                  {img.url.startsWith('data:') ? `~${approxDataUrlKB(img.url)} KB` : 'URL externa'}
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.meta}>
            {images.length} foto{images.length > 1 ? 's' : ''} · armazenamento local usado:{' '}
            {usage} MB
            {usage > 4 && (
              <strong className={styles.warn}> — perto do limite do navegador (~5 MB). Use URLs para muitas fotos.</strong>
            )}
          </p>
        </>
      )}
    </div>
  )
}
