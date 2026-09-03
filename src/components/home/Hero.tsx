import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import site from '@/config/site.config'
import { whatsappLink } from '@/lib/contact'
import { IconArrowUpRight, IconChevronDown, IconWhatsApp } from '@/components/icons'
import styles from './Hero.module.css'

export function Hero() {
  const { hero } = site
  const bgRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Parallax discreto: o fundo sobe mais devagar e o conteúdo "sai" ao rolar.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        const vh = window.innerHeight || 1
        const t = Math.min(1, y / vh)
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.16}px, 0)`
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(0, ${y * 0.24}px, 0)`
          innerRef.current.style.opacity = String(Math.max(0, 1 - t * 1.15))
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.bg} ref={bgRef}>
        <img src={hero.image} alt="" loading="eager" decoding="async" />
        <div className={styles.scrim} />
        <div className={styles.grain} aria-hidden />
      </div>

      <div className={`container ${styles.inner}`} ref={innerRef}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowLine} aria-hidden />
          {hero.eyebrow}
        </p>

        <h1 className={styles.title}>
          <span className={styles.line} style={{ ['--d' as string]: '0ms' } as object}>
            {hero.titleLead}
          </span>{' '}
          <span
            className={`${styles.line} ${styles.emphasis}`}
            style={{ ['--d' as string]: '90ms' } as object}
          >
            {hero.titleEmphasis}
          </span>{' '}
          <span className={styles.line} style={{ ['--d' as string]: '180ms' } as object}>
            {hero.titleTail}
          </span>
        </h1>

        <p className={styles.subtitle}>{hero.subtitle}</p>

        <div className={styles.actions}>
          <Link to={hero.primaryCta.href} className="btn btn--accent">
            {hero.primaryCta.label}
            <IconArrowUpRight width={17} height={17} />
          </Link>
          <a
            href={whatsappLink(`Olá, ${site.brand.name}! Vim pelo site.`)}
            target="_blank"
            rel="noreferrer"
            className={styles.secondary}
          >
            <IconWhatsApp width={18} height={18} />
            {hero.secondaryCta.label}
          </a>
        </div>
      </div>

      <a href="#imoveis" className={styles.scroll} aria-label="Ver os imóveis">
        <span>Ver imóveis</span>
        <IconChevronDown width={16} height={16} />
      </a>
    </section>
  )
}
