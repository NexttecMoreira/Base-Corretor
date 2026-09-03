import type { ReactNode } from 'react'
import { Reveal } from '@/components/ui/Reveal'
import styles from './SectionHeader.module.css'

interface SectionHeaderProps {
  eyebrow: string
  title: ReactNode
  intro?: string
  align?: 'left' | 'center'
  action?: ReactNode
  /** Número da seção (ex.: 2 → "02"). Detalhe editorial. */
  index?: number
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  action,
  index,
}: SectionHeaderProps) {
  return (
    <Reveal
      className={[styles.head, align === 'center' ? styles.center : ''].join(' ')}
    >
      <div className={styles.text}>
        <span className={`eyebrow ${align === 'center' ? 'eyebrow--center' : ''}`}>
          {index != null && (
            <span className={styles.num}>{String(index).padStart(2, '0')}</span>
          )}
          {eyebrow}
        </span>
        <h2 className={styles.title}>{title}</h2>
        {intro && <p className={styles.intro}>{intro}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </Reveal>
  )
}
