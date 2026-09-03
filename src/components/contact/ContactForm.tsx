import { useState, type FormEvent } from 'react'
import site from '@/config/site.config'
import { mailtoLink, whatsappLink } from '@/lib/contact'
import { IconCheck, IconWhatsApp } from '@/components/icons'
import styles from './ContactForm.module.css'

interface ContactFormProps {
  /** Assunto pré-preenchido (ex.: título do imóvel). */
  subject?: string
  compact?: boolean
}

const INTERESTS = [
  'Quero comprar',
  'Quero vender',
  'Quero alugar',
  'Só tirar dúvidas',
]

export function ContactForm({ subject, compact }: ContactFormProps) {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get('name') || '')
    const phone = String(data.get('phone') || '')
    const email = String(data.get('email') || '')
    const interest = String(data.get('interest') || '')
    const message = String(data.get('message') || '')

    const lines = [
      `Olá, ${site.brand.name}!`,
      subject ? `Assunto: ${subject}` : null,
      interest ? `Interesse: ${interest}` : null,
      '',
      message,
      '',
      `— ${name}`,
      phone ? `Tel: ${phone}` : null,
      email ? `E-mail: ${email}` : null,
    ].filter((l): l is string => l !== null)

    const text = lines.join('\n')
    window.open(whatsappLink(text), '_blank', 'noopener')
    setSent(true)
  }

  if (sent) {
    return (
      <div className={styles.done}>
        <span className={styles.doneIcon}>
          <IconCheck width={22} height={22} />
        </span>
        <h3>Mensagem preparada!</h3>
        <p>
          Abrimos o WhatsApp com a sua mensagem. Se não abriu automaticamente,{' '}
          <a
            href={whatsappLink(`Olá, ${site.brand.name}!`)}
            target="_blank"
            rel="noreferrer"
          >
            toque aqui
          </a>
          .
        </p>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSent(false)}>
          Enviar outra
        </button>
      </div>
    )
  }

  return (
    <form className={[styles.form, compact ? styles.compact : ''].join(' ')} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label className="field">
          <span className="field-label">Nome</span>
          <input className="input" name="name" required placeholder="Seu nome" />
        </label>
        <label className="field">
          <span className="field-label">Telefone / WhatsApp</span>
          <input
            className="input"
            name="phone"
            required
            inputMode="tel"
            placeholder="(11) 90000-0000"
          />
        </label>
      </div>

      <div className={styles.row}>
        <label className="field">
          <span className="field-label">E-mail</span>
          <input className="input" type="email" name="email" placeholder="voce@email.com" />
        </label>
        <label className="field">
          <span className="field-label">Interesse</span>
          <select className="select" name="interest" defaultValue={INTERESTS[0]}>
            {INTERESTS.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span className="field-label">Mensagem</span>
        <textarea
          className="textarea"
          name="message"
          required
          placeholder={
            subject
              ? `Tenho interesse em "${subject}". Podemos agendar uma visita?`
              : 'Conte o que você procura, a região e a faixa de valor.'
          }
          defaultValue={
            subject ? `Tenho interesse em "${subject}". Podemos conversar?` : ''
          }
        />
      </label>

      <button type="submit" className="btn btn--accent btn--block">
        <IconWhatsApp width={18} height={18} />
        Enviar pelo WhatsApp
      </button>
      <p className={styles.alt}>
        Prefere e-mail?{' '}
        <a href={mailtoLink(subject ? `Site — ${subject}` : 'Contato pelo site')}>
          {site.contact.email}
        </a>
      </p>
    </form>
  )
}
