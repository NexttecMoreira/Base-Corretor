import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import site from '@/config/site.config'
import { useLockBodyScroll } from '@/lib/hooks'
import { whatsappLink } from '@/lib/contact'
import { IconMenu, IconClose, IconWhatsApp } from '@/components/icons'
import styles from './Navbar.module.css'

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/imoveis', label: 'Imóveis' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useLockBodyScroll(menuOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // A barra só fica transparente sobre o hero da home. Nas demais páginas
  // (fundo claro/escuro comum) ela é sempre sólida para garantir contraste.
  const solid = scrolled || location.pathname !== '/'

  return (
    <header
      className={[styles.header, solid ? styles.solid : ''].join(' ')}
      data-open={menuOpen}
    >
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.brand} aria-label={site.brand.name}>
          <span className={styles.mark} aria-hidden>
            {initials(site.brand.name)}
          </span>
          <span className={styles.brandText}>
            <strong>{site.brand.name}</strong>
            <em>{site.brand.role}</em>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                [styles.navLink, isActive ? styles.active : ''].join(' ')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <a
            href={whatsappLink(`Olá, ${site.brand.name}! Vim pelo site.`)}
            target="_blank"
            rel="noreferrer"
            className={`btn btn--sm ${styles.cta}`}
          >
            <IconWhatsApp />
            WhatsApp
          </a>
          <button
            type="button"
            className={`${styles.iconBtn} ${styles.burger}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className={styles.sheet} data-open={menuOpen} aria-hidden={!menuOpen}>
        <nav className={styles.sheetNav}>
          {LINKS.map((l, i) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={styles.sheetLink}
              style={{ ['--i' as string]: i } as object}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.sheetFoot}>
          <a
            href={whatsappLink(`Olá, ${site.brand.name}! Vim pelo site.`)}
            target="_blank"
            rel="noreferrer"
            className={`btn btn--accent ${styles.sheetCta}`}
          >
            <IconWhatsApp width={18} height={18} />
            Falar no WhatsApp
          </a>
          <div className={styles.sheetContacts}>
            <a href={`tel:+${site.contact.whatsapp}`}>{site.contact.phoneDisplay}</a>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </div>
          <Link to="/admin" className={styles.restrict}>
            Área restrita
          </Link>
        </div>
      </div>
    </header>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
