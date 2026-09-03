import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import site from '@/config/site.config'
import { useAuth } from '@/lib/auth'
import { useProperties } from '@/lib/store'
import {
  IconArrowUpRight,
  IconGauge,
  IconLogout,
  IconMenu,
  IconPlus,
  IconClose,
  IconSparkle,
} from '@/components/icons'
import styles from './AdminLayout.module.css'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const properties = useProperties()
  const [navOpen, setNavOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className={styles.shell} data-nav-open={navOpen}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.mark}>{initials(site.brand.name)}</span>
          <div>
            <strong>{site.brand.shortName}</strong>
            <span>Painel</span>
          </div>
          <button
            type="button"
            className={styles.closeNav}
            onClick={() => setNavOpen(false)}
            aria-label="Fechar menu"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={() => setNavOpen(false)}
          >
            <IconGauge width={18} height={18} />
            Imóveis
            <span className={styles.count}>{properties.length}</span>
          </NavLink>
          <NavLink
            to="/admin/imoveis/novo"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={() => setNavOpen(false)}
          >
            <IconPlus width={18} height={18} />
            Novo imóvel
          </NavLink>
          <NavLink
            to="/admin/config"
            className={({ isActive }) => (isActive ? styles.active : '')}
            onClick={() => setNavOpen(false)}
          >
            <IconSparkle width={18} height={18} />
            Ajustes
          </NavLink>
        </nav>

        <div className={styles.sideFoot}>
          <Link to="/" target="_blank" className={styles.viewSite}>
            Ver site publicado
            <IconArrowUpRight width={15} height={15} />
          </Link>
          <div className={styles.userRow}>
            <span>
              Conectada como <strong>{user}</strong>
            </span>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <IconLogout width={15} height={15} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.mobileBar}>
          <button
            type="button"
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menu"
          >
            <IconMenu />
          </button>
          <span>{site.brand.shortName} · Painel</span>
          <button type="button" onClick={handleLogout} aria-label="Sair">
            <IconLogout />
          </button>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      {navOpen && <div className={styles.backdrop} onClick={() => setNavOpen(false)} />}
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
