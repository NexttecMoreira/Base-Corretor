import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import site from '@/config/site.config'
import { Reveal } from '@/components/ui/Reveal'
import styles from './RegionsSection.module.css'

/** Versão discreta: só o rótulo + os bairros como links numa linha. */
export function RegionsSection() {
  const { regions } = site

  return (
    <section id="regioes" className={styles.section}>
      <Reveal className="container">
        <span className={`eyebrow ${styles.label}`}>{regions.eyebrow}</span>
        <p className={styles.list}>
          {regions.items.map((r, i) => (
            <Fragment key={r.name}>
              {i > 0 && <span className={styles.sep} aria-hidden>·</span>}
              <Link to={`/imoveis?q=${encodeURIComponent(r.name)}`}>{r.name}</Link>
            </Fragment>
          ))}
        </p>
      </Reveal>
    </section>
  )
}
