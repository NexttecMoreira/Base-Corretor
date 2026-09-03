import { useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link, useParams } from 'react-router-dom'
import site from '@/config/site.config'
import { useProperties, useProperty } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { useMediaQuery } from '@/lib/hooks'
import { usePageMeta } from '@/lib/usePageMeta'
import {
  formatMoney,
  formatPrice,
  formatPriceCompact,
  priceSuffix,
} from '@/lib/format'
import {
  kindPurposeLabel,
  locationLabel,
  mapQueryFor,
} from '@/lib/propertyView'
import { whatsappForProperty } from '@/lib/contact'
import { KIND_LABEL, STATUS_LABEL } from '@/types/property'
import { Gallery } from '@/components/property/Gallery'
import { VideoEmbed } from '@/components/property/VideoEmbed'
import { PropertyMap } from '@/components/property/PropertyMap'
import { PropertyCard } from '@/components/property/PropertyCard'
import { Reveal } from '@/components/ui/Reveal'
import { CountUp } from '@/components/ui/CountUp'
import { ContactForm } from '@/components/contact/ContactForm'
import {
  IconArrowLeft,
  IconBath,
  IconBed,
  IconCalendar,
  IconCar,
  IconCheck,
  IconMapPin,
  IconRuler,
  IconShare,
  IconStairs,
  IconWhatsApp,
} from '@/components/icons'
import styles from './PropertyDetailPage.module.css'

export function PropertyDetailPage() {
  const { slug } = useParams()
  const property = useProperty(slug)
  const all = useProperties()
  const toast = useToast()
  const isMobile = useMediaQuery('(max-width: 900px)')

  usePageMeta(
    property ? `${property.title} · ${site.brand.name}` : 'Imóvel não encontrado',
    property?.headline || property?.description.slice(0, 150),
  )

  const similar = useMemo(() => {
    if (!property) return []
    return all
      .filter(
        (p) =>
          p.id !== property.id &&
          (p.kind === property.kind || p.neighborhood === property.neighborhood),
      )
      .slice(0, 3)
  }, [all, property])

  if (!property) {
    return (
      <div className={styles.missing}>
        <p className="eyebrow">404</p>
        <h1>Este imóvel não está mais disponível</h1>
        <p>Ele pode ter sido vendido ou retirado. Veja as outras opções.</p>
        <Link to="/imoveis" className="btn btn--accent">
          Ver imóveis
        </Link>
      </div>
    )
  }

  const priceLabel = `${formatPrice(property.price)}${priceSuffix(property)}`

  const facts = [
    property.bedrooms > 0 && {
      icon: <IconBed width={20} height={20} />,
      value: property.bedrooms,
      label: property.bedrooms === 1 ? 'dormitório' : 'dormitórios',
    },
    property.suites && property.suites > 0 && {
      icon: <IconStairs width={20} height={20} />,
      value: property.suites,
      label: property.suites === 1 ? 'suíte' : 'suítes',
    },
    property.bathrooms > 0 && {
      icon: <IconBath width={20} height={20} />,
      value: property.bathrooms,
      label: property.bathrooms === 1 ? 'banheiro' : 'banheiros',
    },
    property.parking > 0 && {
      icon: <IconCar width={20} height={20} />,
      value: property.parking,
      label: property.parking === 1 ? 'vaga' : 'vagas',
    },
    (property.areaBuilt || property.areaTotal) && {
      icon: <IconRuler width={20} height={20} />,
      value: property.areaBuilt || property.areaTotal,
      label: property.areaBuilt ? 'm² construídos' : 'm² de terreno',
    },
  ].filter(Boolean) as { icon: ReactNode; value: number; label: string }[]

  async function share() {
    const url = window.location.href
    const data = { title: property!.title, text: property!.headline, url }
    if (navigator.share) {
      try {
        await navigator.share(data)
      } catch {
        /* cancelado */
      }
      return
    }
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado para a área de transferência')
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  return (
    <article className={styles.page}>
      <div className={`container ${styles.top}`}>
        <Link to="/imoveis" className={styles.back}>
          <IconArrowLeft width={16} height={16} />
          Todos os imóveis
        </Link>

        <div className={styles.titleRow}>
          <div>
            <div className={styles.badges}>
              <span className={styles.kindBadge}>{kindPurposeLabel(property)}</span>
              {property.status !== 'disponivel' && (
                <span className={styles.statusBadge}>{STATUS_LABEL[property.status]}</span>
              )}
              {property.featured && <span className={styles.featBadge}>Destaque</span>}
            </div>
            <h1>{property.title}</h1>
            <p className={styles.loc}>
              <IconMapPin width={16} height={16} />
              {property.address ? `${property.address} — ` : ''}
              {locationLabel(property)}
            </p>
          </div>

          <div className={styles.priceTag}>
            <span className={styles.priceValue}>
              {formatPrice(property.price)}
              <em>{priceSuffix(property)}</em>
            </span>
            {property.monthlyCosts ? (
              <span className={styles.priceNote}>
                + {formatMoney(property.monthlyCosts)}/mês (cond. + IPTU)
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container">
        <Gallery images={property.images} title={property.title} />
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <Reveal as="section" plain className={styles.facts}>
            {facts.map((f, i) => (
              <div key={i} style={{ ['--fi' as string]: i } as object}>
                <span className={styles.factIcon}>{f.icon}</span>
                <strong>
                  <CountUp value={f.value} duration={1000} />
                </strong>
                <span className={styles.factLabel}>{f.label}</span>
              </div>
            ))}
          </Reveal>

          <Reveal as="section" className={styles.block}>
            <h2>Sobre o imóvel</h2>
            {property.headline && <p className={styles.headline}>{property.headline}</p>}
            {property.description.split('\n').filter(Boolean).map((par, i) => (
              <p key={i}>{par}</p>
            ))}
          </Reveal>

          {property.features.length > 0 && (
            <Reveal as="section" className={styles.block}>
              <h2>Diferenciais</h2>
              <ul className={styles.features}>
                {property.features.map((feat, i) => (
                  <li key={feat} style={{ ['--fi' as string]: i } as object}>
                    <IconCheck width={16} height={16} />
                    {feat}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {property.videos.length > 0 && (
            <Reveal as="section" className={styles.block}>
              <h2>Vídeo</h2>
              <div className={styles.videos}>
                {property.videos.map((v) => (
                  <VideoEmbed key={v.id} video={v} poster={property.images[0]?.url} />
                ))}
              </div>
            </Reveal>
          )}

          <Reveal as="section" className={styles.block}>
            <h2>Localização</h2>
            <p className={styles.mapNote}>
              {property.neighborhood}, {property.city} — {property.state}. Localização
              aproximada; o endereço exato é enviado no agendamento da visita.
            </p>
            <PropertyMap query={mapQueryFor(property)} />
          </Reveal>
        </div>

        <aside className={styles.aside}>
          <div className={styles.card}>
            <p className={styles.cardKicker}>{KIND_LABEL[property.kind]} · {property.city}</p>
            <p className={styles.cardPrice}>
              {formatPrice(property.price)}
              <em>{priceSuffix(property)}</em>
            </p>

            <a
              href={whatsappForProperty(property.title, priceLabel)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--accent btn--block"
            >
              <IconWhatsApp width={18} height={18} />
              Falar no WhatsApp
            </a>
            <a href="#agendar" className="btn btn--ghost btn--block">
              <IconCalendar width={17} height={17} />
              Agendar uma visita
            </a>

            <div className={styles.cardActions}>
              <button type="button" onClick={share}>
                <IconShare width={16} height={16} />
                Compartilhar imóvel
              </button>
            </div>

            <div className={styles.broker}>
              <span className={styles.brokerMark}>{initials(site.brand.name)}</span>
              <div>
                <strong>{site.brand.name}</strong>
                <span>{site.brand.role} · {site.brand.creci}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section id="agendar" className={styles.schedule}>
        <div className={`container container--narrow ${styles.scheduleInner}`}>
          <div>
            <span className="eyebrow">Agende sua visita</span>
            <h2>Quer ver de perto?</h2>
            <p>
              Envie seus dados e um horário de preferência. Confirmo a visita e passo o
              endereço completo com as instruções de acesso.
            </p>
          </div>
          <ContactForm subject={property.title} compact />
        </div>
      </section>

      {similar.length > 0 && (
        <section className={`container ${styles.similar}`}>
          <h2>Imóveis parecidos</h2>
          <div className={styles.similarGrid}>
            {similar.map((p, i) => (
              <PropertyCard key={p.id} property={p} index={i} revealDelay={i * 60} />
            ))}
          </div>
        </section>
      )}

      {isMobile &&
        createPortal(
          <div className={styles.actionBar}>
            <span className={styles.actionPrice}>
              <b>{formatPriceCompact(property.price)}</b>
              <i>{priceSuffix(property) || 'à vista'}</i>
            </span>
            <a href="#agendar" className={`btn btn--ghost btn--sm ${styles.actionGhost}`}>
              <IconCalendar width={16} height={16} />
              Visita
            </a>
            <a
              href={whatsappForProperty(property.title, priceLabel)}
              target="_blank"
              rel="noreferrer"
              className="btn btn--accent btn--sm"
            >
              <IconWhatsApp width={16} height={16} />
              WhatsApp
            </a>
          </div>,
          document.body,
        )}
    </article>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
