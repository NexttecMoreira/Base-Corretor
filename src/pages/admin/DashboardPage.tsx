import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Property, PropertyStatus } from '@/types/property'
import { STATUS_LABEL } from '@/types/property'
import { useProperties, usePropertyActions } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { usePageMeta } from '@/lib/usePageMeta'
import { formatPrice, formatPriceCompact, priceSuffix } from '@/lib/format'
import { locationLabel } from '@/lib/propertyView'
import { Modal } from '@/components/ui/Modal'
import {
  IconArrowUpRight,
  IconEdit,
  IconPlus,
  IconSearch,
  IconStar,
  IconTrash,
} from '@/components/icons'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  usePageMeta('Imóveis · Painel')
  const properties = useProperties()
  const { update, remove, create, reset } = usePropertyActions()
  const toast = useToast()
  const navigate = useNavigate()

  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'todos'>('todos')
  const [toDelete, setToDelete] = useState<Property | null>(null)

  const stats = useMemo(() => {
    const disponivel = properties.filter((p) => p.status === 'disponivel')
    const vgv = disponivel
      .filter((p) => p.purpose === 'venda')
      .reduce((sum, p) => sum + p.price, 0)
    return {
      total: properties.length,
      disponivel: disponivel.length,
      fechados: properties.filter((p) => p.status !== 'disponivel').length,
      vgv,
    }
  }, [properties])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return properties.filter((p) => {
      if (statusFilter !== 'todos' && p.status !== statusFilter) return false
      if (!term) return true
      return `${p.title} ${p.neighborhood} ${p.city}`.toLowerCase().includes(term)
    })
  }, [properties, q, statusFilter])

  async function changeStatus(p: Property, status: PropertyStatus) {
    await update(p.id, { ...p, status })
    toast.success(`"${p.title}" agora está ${STATUS_LABEL[status].toLowerCase()}`)
  }

  async function toggleFeatured(p: Property) {
    await update(p.id, { ...p, featured: !p.featured })
  }

  async function duplicate(p: Property) {
    const copy = await create({ ...p, title: `${p.title} (cópia)`, featured: false })
    toast.success('Imóvel duplicado')
    navigate(`/admin/imoveis/${copy.id}`)
  }

  async function confirmDelete() {
    if (!toDelete) return
    await remove(toDelete.id)
    toast.success(`"${toDelete.title}" foi removido`)
    setToDelete(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <h1>Imóveis</h1>
          <p>Gerencie o portfólio publicado no site.</p>
        </div>
        <Link to="/admin/imoveis/novo" className="btn btn--accent">
          <IconPlus width={17} height={17} />
          Novo imóvel
        </Link>
      </header>

      <div className={styles.stats}>
        <div>
          <strong>{stats.total}</strong>
          <span>no portfólio</span>
        </div>
        <div>
          <strong>{stats.disponivel}</strong>
          <span>disponíveis</span>
        </div>
        <div>
          <strong>{stats.fechados}</strong>
          <span>reservados / vendidos</span>
        </div>
        <div>
          <strong>{formatPriceCompact(stats.vgv)}</strong>
          <span>VGV disponível</span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <IconSearch width={17} height={17} />
          <input
            type="search"
            placeholder="Buscar por título ou bairro…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className={styles.segment}>
          {(['todos', 'disponivel', 'reservado', 'vendido'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={statusFilter === s ? styles.segOn : ''}
              onClick={() => setStatusFilter(s)}
            >
              {s === 'todos' ? 'Todos' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>Nenhum imóvel {q || statusFilter !== 'todos' ? 'com esse filtro' : 'cadastrado'}.</p>
          {properties.length === 0 && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={async () => {
                await reset()
                toast.success('Imóveis de exemplo restaurados')
              }}
            >
              Restaurar imóveis de exemplo
            </button>
          )}
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((p) => (
            <li key={p.id} className={styles.row}>
              <Link to={`/admin/imoveis/${p.id}`} className={styles.thumb}>
                {p.images[0] ? (
                  <img src={p.images[0].url} alt="" loading="lazy" />
                ) : (
                  <span className={styles.noThumb}>sem foto</span>
                )}
              </Link>

              <div className={styles.info}>
                <Link to={`/admin/imoveis/${p.id}`} className={styles.title}>
                  {p.title}
                </Link>
                <span className={styles.meta}>
                  {locationLabel(p)} · {p.images.length} fotos · {p.videos.length} vídeos
                </span>
                <span className={styles.price}>
                  {formatPrice(p.price)}
                  {priceSuffix(p)}
                </span>
              </div>

              <button
                type="button"
                className={[styles.star, p.featured ? styles.starOn : ''].join(' ')}
                onClick={() => toggleFeatured(p)}
                title={p.featured ? 'Remover destaque' : 'Marcar como destaque'}
                aria-pressed={p.featured}
              >
                <IconStar width={16} height={16} />
              </button>

              <select
                className={styles.status}
                value={p.status}
                data-status={p.status}
                onChange={(e) => changeStatus(p, e.target.value as PropertyStatus)}
              >
                {Object.entries(STATUS_LABEL).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>

              <div className={styles.actions}>
                <Link to={`/imoveis/${p.slug}`} target="_blank" title="Ver no site">
                  <IconArrowUpRight width={16} height={16} />
                </Link>
                <button type="button" onClick={() => duplicate(p)} title="Duplicar">
                  <IconPlus width={16} height={16} />
                </button>
                <Link to={`/admin/imoveis/${p.id}`} title="Editar">
                  <IconEdit width={16} height={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => setToDelete(p)}
                  title="Excluir"
                  className={styles.danger}
                >
                  <IconTrash width={16} height={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} label="Confirmar exclusão">
        <div className={styles.confirm}>
          <h3>Excluir imóvel?</h3>
          <p>
            “{toDelete?.title}” será removido permanentemente do site. Esta ação não pode
            ser desfeita.
          </p>
          <div className={styles.confirmBtns}>
            <button type="button" className="btn btn--ghost" onClick={() => setToDelete(null)}>
              Cancelar
            </button>
            <button type="button" className={`btn ${styles.confirmDanger}`} onClick={confirmDelete}>
              <IconTrash width={16} height={16} />
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
