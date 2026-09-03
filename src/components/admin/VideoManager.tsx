import type { PropertyVideo } from '@/types/property'
import { uid } from '@/lib/slugify'
import { parseVideo } from '@/lib/propertyView'
import { IconCheck, IconPlus, IconTrash } from '@/components/icons'
import styles from './VideoManager.module.css'

interface VideoManagerProps {
  videos: PropertyVideo[]
  onChange: (next: PropertyVideo[]) => void
}

export function VideoManager({ videos, onChange }: VideoManagerProps) {
  function add() {
    onChange([...videos, { id: uid('vid'), url: '', title: '' }])
  }
  function update(index: number, patch: Partial<PropertyVideo>) {
    onChange(videos.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }
  function remove(index: number) {
    onChange(videos.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.wrap}>
      {videos.map((v, i) => {
        const parsed = v.url ? parseVideo(v.url) : null
        return (
          <div key={v.id} className={styles.row}>
            <div className={styles.inputs}>
              <input
                className="input"
                placeholder="Link do YouTube, Vimeo ou .mp4"
                value={v.url}
                onChange={(e) => update(i, { url: e.target.value })}
              />
              <input
                className="input"
                placeholder="Título (ex.: Tour completo)"
                value={v.title ?? ''}
                onChange={(e) => update(i, { title: e.target.value })}
              />
            </div>
            <div className={styles.side}>
              <span className={parsed ? styles.ok : styles.pending}>
                {parsed ? (
                  <>
                    <IconCheck width={13} height={13} /> {parsed.kind}
                  </>
                ) : v.url ? (
                  'link não reconhecido'
                ) : (
                  'aguardando link'
                )}
              </span>
              <button type="button" onClick={() => remove(i)} aria-label="Remover vídeo">
                <IconTrash width={15} height={15} />
              </button>
            </div>
          </div>
        )
      })}

      <button type="button" className="btn btn--ghost btn--sm" onClick={add}>
        <IconPlus width={15} height={15} />
        Adicionar vídeo
      </button>
    </div>
  )
}
