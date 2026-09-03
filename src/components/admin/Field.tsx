import type { ReactNode } from 'react'
import styles from './Field.module.css'

interface FieldProps {
  label: string
  hint?: string
  htmlFor?: string
  children: ReactNode
  span?: 1 | 2 | 3
}

export function Field({ label, hint, htmlFor, children, span = 1 }: FieldProps) {
  return (
    <div className={styles.field} data-span={span}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  )
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className={styles.group}>
      <div className={styles.groupHead}>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className={styles.grid}>{children}</div>
    </section>
  )
}
