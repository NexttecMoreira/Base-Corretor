import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import site from '@/config/site.config'
import { whatsappLink } from '@/lib/contact'
import { IconWhatsApp } from '@/components/icons'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollProgress } from './ScrollProgress'
import styles from './SiteLayout.module.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export function SiteLayout() {
  const { pathname } = useLocation()

  // A página do imóvel tem barra de ação fixa no celular — o FAB atrapalharia.
  const isPropertyDetail = /^\/imoveis\/[^/]+$/.test(pathname)

  return (
    <div className={styles.shell}>
      <ScrollToTop />
      <ScrollProgress />
      <a href="#conteudo" className={styles.skip}>
        Pular para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <div key={pathname} className={styles.route}>
          <Outlet />
        </div>
      </main>
      <Footer />

      <a
        id="whatsapp"
        href={whatsappLink(`Olá, ${site.brand.name}! Vim pelo site e gostaria de mais informações.`)}
        target="_blank"
        rel="noreferrer"
        className={[styles.fab, isPropertyDetail ? styles.fabHideMobile : ''].join(' ')}
        aria-label="Conversar no WhatsApp"
      >
        <span className={styles.fabPulse} aria-hidden />
        <IconWhatsApp width={24} height={24} />
        <span className={styles.fabLabel}>Fale comigo</span>
      </a>
    </div>
  )
}
