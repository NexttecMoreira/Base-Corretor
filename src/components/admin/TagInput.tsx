import { useState, type KeyboardEvent } from 'react'
import { IconClose, IconPlus } from '@/components/icons'
import styles from './TagInput.module.css'

interface TagInputProps {
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  suggestions?: string[]
}

export function TagInput({ values, onChange, placeholder, suggestions = [] }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function add(value: string) {
    const v = value.trim()
    if (!v || values.includes(v)) return
    onChange([...values, v])
    setDraft('')
  }

  function remove(value: string) {
    onChange(values.filter((x) => x !== value))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && values.length) {
      remove(values[values.length - 1])
    }
  }

  const openSuggestions = suggestions.filter((s) => !values.includes(s)).slice(0, 6)

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        {values.map((v) => (
          <span key={v} className={styles.tag}>
            {v}
            <button type="button" onClick={() => remove(v)} aria-label={`Remover ${v}`}>
              <IconClose width={12} height={12} />
            </button>
          </span>
        ))}
        <input
          className={styles.input}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={values.length === 0 ? placeholder : 'Adicionar…'}
        />
        {draft && (
          <button type="button" className={styles.addBtn} onClick={() => add(draft)}>
            <IconPlus width={14} height={14} />
          </button>
        )}
      </div>

      {openSuggestions.length > 0 && (
        <div className={styles.suggestions}>
          {openSuggestions.map((s) => (
            <button key={s} type="button" onClick={() => add(s)}>
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
