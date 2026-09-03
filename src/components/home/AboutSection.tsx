import { Link } from 'react-router-dom'
import site from '@/config/site.config'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal } from '@/components/ui/Reveal'
import { IconArrowRight } from '@/components/icons'
import styles from './AboutSection.module.css'

export function AboutSection() {
  const { about } = site

  return (
    <section id="sobre" className={styles.section}>
      <Reveal className={`container ${styles.inner}`}>
        <div className={`${styles.portrait} group`}>
          <SmartImage
            src={about.portrait}
            alt={`Retrato de ${site.brand.name}`}
            ratio="1 / 1"
            objectPosition="center top"
            zoomOnHover
          />
        </div>

        <div className={styles.body}>
          <span className="eyebrow">
            <span className={styles.num}>02</span>
            {about.eyebrow}
          </span>
          <h2 className={styles.title}>{about.title}</h2>
          <p className={styles.para}>{about.paragraphs[0]}</p>
          <div className={styles.foot}>
            <span className={styles.sign}>{about.signature}</span>
            <Link to="/sobre" className="link-underline">
              Sobre mim <IconArrowRight width={16} height={16} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
