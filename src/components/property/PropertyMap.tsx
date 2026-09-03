import styles from './PropertyMap.module.css'

export function PropertyMap({ query }: { query: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
  const link = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

  return (
    <div className={styles.wrap}>
      <iframe
        title={`Mapa: ${query}`}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a href={link} target="_blank" rel="noreferrer" className={styles.open}>
        Abrir no Google Maps
      </a>
    </div>
  )
}
