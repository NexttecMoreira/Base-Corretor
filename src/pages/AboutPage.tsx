import { Link } from 'react-router-dom'
import site from '@/config/site.config'
import { usePageMeta, pageTitle } from '@/lib/usePageMeta'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { ServicesSection } from '@/components/home/ServicesSection'
import { IconArrowRight } from '@/components/icons'
import styles from './AboutPage.module.css'

export function AboutPage() {
  usePageMeta(pageTitle('Sobre'), site.about.title)
  const { about } = site

  return (
    <div className={styles.page}>
      <header className={`container ${styles.hero}`}>
        <Reveal className={styles.heroText}>
          <span className="eyebrow">{about.eyebrow}</span>
          <h1>{about.title}</h1>
          <p>{about.paragraphs[0]}</p>
        </Reveal>
        <Reveal className={styles.heroMedia}>
          <SmartImage
            src={about.portrait}
            alt={`Retrato de ${site.brand.name}`}
            ratio="4 / 5"
            objectPosition="center top"
            eager
          />
        </Reveal>
      </header>

      <section className={`container container--narrow ${styles.story}`}>
        {about.paragraphs.slice(1).map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <p>{p}</p>
          </Reveal>
        ))}

        <Reveal as="ul" className={styles.stats}>
          {about.highlights.map((h) => (
            <li key={h.label}>
              <strong>
                <CountUp value={h.value} />
              </strong>
              <span>{h.label}</span>
            </li>
          ))}
        </Reveal>

        <Reveal className={styles.signoff}>
          <span className={styles.sign}>{about.signature}</span>
          <span>{site.brand.role} · {site.brand.creci}</span>
        </Reveal>
      </section>

      <ServicesSection />

      <section className={styles.cta}>
        <div className="container">
          <Reveal>
            <h2>{site.cta.title}</h2>
            <Link to="/contato" className="btn btn--accent">
              {site.cta.buttonLabel}
              <IconArrowRight width={17} height={17} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
