import site from '@/config/site.config'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import { IconMail, IconMapPin, IconPhone } from '@/components/icons'
import styles from './CTASection.module.css'

export function CTASection() {
  const { cta, contact } = site

  return (
    <section id="contato" className={styles.section}>
      <div className={styles.texture} aria-hidden />
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.pitch}>
          <span className="eyebrow">
            <span className={styles.num}>04</span>
            Contato direto
          </span>
          <h2>{cta.title}</h2>
          <p>{cta.text}</p>

          <ul className={styles.info}>
            <li>
              <IconPhone width={18} height={18} />
              <a href={`tel:+${contact.whatsapp}`}>{contact.phoneDisplay}</a>
            </li>
            <li>
              <IconMail width={18} height={18} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <IconMapPin width={18} height={18} />
              <span>
                {contact.addressLine}
                <br />
                {contact.city}
              </span>
            </li>
          </ul>
          <p className={styles.hours}>{contact.hours}</p>
        </Reveal>

        <Reveal className={styles.card}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  )
}
