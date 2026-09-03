import site from '@/config/site.config'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeader } from './SectionHeader'
import styles from './ServicesSection.module.css'

export function ServicesSection() {
  const { services } = site

  return (
    <section id="servicos" className="section container">
      <SectionHeader
        eyebrow={services.eyebrow}
        title={services.title}
        intro={services.intro}
      />

      <ol className={styles.list}>
        {services.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 70} className={styles.item}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <div className={styles.content}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
