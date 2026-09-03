import site from '@/config/site.config'
import { usePageMeta, pageTitle } from '@/lib/usePageMeta'
import { Reveal } from '@/components/ui/Reveal'
import { ContactForm } from '@/components/contact/ContactForm'
import {
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsApp,
} from '@/components/icons'
import { whatsappLink } from '@/lib/contact'
import styles from './ContactPage.module.css'

export function ContactPage() {
  usePageMeta(pageTitle('Contato'), 'Fale com a corretora — WhatsApp, e-mail e telefone.')
  const { contact, social } = site

  return (
    <div className={styles.page}>
      <div className={`container ${styles.grid}`}>
        <Reveal className={styles.info}>
          <span className="eyebrow">Contato</span>
          <h1>Vamos conversar</h1>
          <p className={styles.lede}>
            Atendo pessoalmente cada mensagem. Escolha o canal que preferir — respondo em
            até um dia útil.
          </p>

          <ul className={styles.channels}>
            <li>
              <span className={styles.chIcon}>
                <IconWhatsApp width={20} height={20} />
              </span>
              <div>
                <strong>WhatsApp</strong>
                <a href={whatsappLink(`Olá, ${site.brand.name}!`)} target="_blank" rel="noreferrer">
                  {contact.phoneDisplay}
                </a>
              </div>
            </li>
            <li>
              <span className={styles.chIcon}>
                <IconPhone width={20} height={20} />
              </span>
              <div>
                <strong>Telefone</strong>
                <a href={`tel:+${contact.whatsapp}`}>{contact.phoneDisplay}</a>
              </div>
            </li>
            <li>
              <span className={styles.chIcon}>
                <IconMail width={20} height={20} />
              </span>
              <div>
                <strong>E-mail</strong>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </div>
            </li>
            <li>
              <span className={styles.chIcon}>
                <IconMapPin width={20} height={20} />
              </span>
              <div>
                <strong>Escritório</strong>
                <span>
                  {contact.addressLine}
                  <br />
                  {contact.city}
                </span>
              </div>
            </li>
          </ul>

          <p className={styles.hours}>{contact.hours}</p>

          {social.instagram && (
            <a
              href={social.instagram}
              target="_blank"
              rel="noreferrer"
              className={styles.social}
            >
              <IconInstagram width={16} height={16} />
              Acompanhe os lançamentos no Instagram
            </a>
          )}
        </Reveal>

        <Reveal className={styles.formCard}>
          <h2>Envie uma mensagem</h2>
          <ContactForm />
        </Reveal>
      </div>
    </div>
  )
}
