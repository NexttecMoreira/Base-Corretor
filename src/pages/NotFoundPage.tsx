import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/usePageMeta'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  usePageMeta('Página não encontrada')
  return (
    <div className={styles.wrap}>
      <p className="eyebrow">Erro 404</p>
      <h1>Esta página se mudou</h1>
      <p>O endereço que você tentou acessar não existe ou foi removido.</p>
      <div className={styles.actions}>
        <Link to="/" className="btn btn--accent">
          Voltar ao início
        </Link>
        <Link to="/imoveis" className="btn btn--ghost">
          Ver imóveis
        </Link>
      </div>
    </div>
  )
}
