import { Link } from 'react-router-dom'
import site from '@/config/site.config'
import { whatsappLink } from '@/lib/contact'
import styles from './Footer.module.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <span className={styles.brand}>
          {site.brand.name} <span className={styles.sep}>·</span> {site.brand.creci}
        </span>

        <nav className={styles.links} aria-label="Rodapé">
          <a
            href={whatsappLink(`Olá, ${site.brand.name}!`)}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          {site.social.instagram && (
            <a href={site.social.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
          )}
          <Link to="/contato">Contato</Link>
          <Link to="/admin">Área restrita</Link>
        </nav>

        <span className={styles.copy}>© {year}</span>
      </div>
    </footer>
  )
}
