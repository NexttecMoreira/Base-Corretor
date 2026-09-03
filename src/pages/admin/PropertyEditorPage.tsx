import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Property, PropertyDraft } from '@/types/property'
import { KIND_LABEL, PURPOSE_LABEL, STATUS_LABEL } from '@/types/property'
import { usePropertyById, usePropertyActions } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { usePageMeta } from '@/lib/usePageMeta'
import { slugify } from '@/lib/slugify'
import { formatPrice } from '@/lib/format'
import { Field, FieldGroup } from '@/components/admin/Field'
import { TagInput } from '@/components/admin/TagInput'
import { ImageManager } from '@/components/admin/ImageManager'
import { VideoManager } from '@/components/admin/VideoManager'
import { PropertyCard } from '@/components/property/PropertyCard'
import { Modal } from '@/components/ui/Modal'
import { IconArrowLeft, IconArrowUpRight, IconCheck, IconTrash } from '@/components/icons'
import styles from './PropertyEditorPage.module.css'

const FEATURE_SUGGESTIONS = [
  'Piscina',
  'Churrasqueira',
  'Varanda gourmet',
  'Academia',
  'Ar-condicionado',
  'Armários planejados',
  'Portaria 24h',
  'Aceita pet',
  'Mobiliado',
  'Aquecimento solar',
  'Vista livre',
  'Reformado',
]

function emptyDraft(): PropertyDraft {
  return {
    title: '',
    headline: '',
    description: '',
    purpose: 'venda',
    kind: 'apartamento',
    status: 'disponivel',
    featured: false,
    price: 0,
    monthlyCosts: undefined,
    neighborhood: '',
    city: '',
    state: 'SP',
    address: '',
    mapQuery: '',
    areaBuilt: undefined,
    areaTotal: undefined,
    bedrooms: 0,
    suites: undefined,
    bathrooms: 0,
    parking: 0,
    features: [],
    images: [],
    videos: [],
  }
}

function toDraft(p: Property): PropertyDraft {
  // createdAt/updatedAt são derivados pelo repositório — descartados aqui.
  const { createdAt, updatedAt, ...rest } = p
  void createdAt
  void updatedAt
  return rest
}

export function PropertyEditorPage() {
  const { id } = useParams()
  const isNew = !id
  const existing = usePropertyById(id)
  const { create, update, remove } = usePropertyActions()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState<PropertyDraft>(() =>
    existing ? toDraft(existing) : emptyDraft(),
  )
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [touched, setTouched] = useState(false)

  usePageMeta(isNew ? 'Novo imóvel · Painel' : 'Editar imóvel · Painel')

  useEffect(() => {
    setForm(existing ? toDraft(existing) : emptyDraft())
    setTouched(false)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = <K extends keyof PropertyDraft>(key: K, value: PropertyDraft[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    setTouched(true)
  }
  const numOrUndef = (v: string) => (v === '' ? undefined : Number(v))

  const slug = useMemo(
    () => existing?.slug ?? slugify(form.title || 'novo-imovel'),
    [existing?.slug, form.title],
  )

  const previewProperty: Property = useMemo(
    () => ({
      ...emptyDraft(),
      ...form,
      id: existing?.id ?? 'preview',
      slug,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [form, existing, slug],
  )

  if (id && !existing) {
    return (
      <div className={styles.missing}>
        <h1>Imóvel não encontrado</h1>
        <p>Ele pode ter sido removido.</p>
        <Link to="/admin" className="btn btn--accent">
          Voltar para a lista
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Dê um título ao imóvel.')
    if (!form.neighborhood.trim() || !form.city.trim())
      return toast.error('Informe pelo menos bairro e cidade.')

    setSaving(true)
    try {
      if (isNew) {
        await create(form)
        toast.success('Imóvel publicado no site')
      } else {
        await update(id as string, form)
        toast.success('Alterações salvas')
      }
      navigate('/admin')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível salvar.')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!id) return
    await remove(id)
    toast.success('Imóvel removido')
    navigate('/admin')
  }

  return (
    <form className={styles.page} onSubmit={handleSubmit}>
      <header className={styles.bar}>
        <div className={styles.barLeft}>
          <Link to="/admin" className={styles.back}>
            <IconArrowLeft width={16} height={16} />
          </Link>
          <div>
            <h1>{isNew ? 'Novo imóvel' : 'Editar imóvel'}</h1>
            <span className={styles.slug}>/imoveis/{slug}</span>
          </div>
        </div>
        <div className={styles.barActions}>
          {!isNew && existing && (
            <Link
              to={`/imoveis/${existing.slug}`}
              target="_blank"
              className="btn btn--ghost btn--sm"
            >
              Ver no site
              <IconArrowUpRight width={15} height={15} />
            </Link>
          )}
          {!isNew && (
            <button
              type="button"
              className={`btn btn--ghost btn--sm ${styles.deleteBtn}`}
              onClick={() => setConfirmDelete(true)}
            >
              <IconTrash width={15} height={15} />
              Excluir
            </button>
          )}
          <button type="submit" className="btn btn--accent btn--sm" disabled={saving}>
            {saving ? 'Salvando…' : isNew ? 'Publicar imóvel' : 'Salvar alterações'}
            {!saving && <IconCheck width={15} height={15} />}
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.form}>
          <FieldGroup title="Identificação" description="Como o imóvel aparece nas listagens.">
            <Field label="Título" span={3} htmlFor="title">
              <input
                id="title"
                className="input"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Ex.: Casa contemporânea no Alto de Pinheiros"
                required
              />
            </Field>
            <Field label="Chamada curta" span={3} hint="Uma frase de destaque (opcional).">
              <input
                className="input"
                value={form.headline ?? ''}
                onChange={(e) => set('headline', e.target.value)}
                placeholder="Arquitetura assinada, pé-direito duplo…"
              />
            </Field>
            <Field label="Finalidade">
              <select
                className="select"
                value={form.purpose}
                onChange={(e) => set('purpose', e.target.value as PropertyDraft['purpose'])}
              >
                {Object.entries(PURPOSE_LABEL).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Tipo">
              <select
                className="select"
                value={form.kind}
                onChange={(e) => set('kind', e.target.value as PropertyDraft['kind'])}
              >
                {Object.entries(KIND_LABEL).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Situação">
              <select
                className="select"
                value={form.status}
                onChange={(e) => set('status', e.target.value as PropertyDraft['status'])}
              >
                {Object.entries(STATUS_LABEL).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Destaque" span={3} hint="Aparece em posição de honra na home.">
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
                <span />
                {form.featured ? 'Em destaque' : 'Sem destaque'}
              </label>
            </Field>
          </FieldGroup>

          <FieldGroup title="Valores">
            <Field label="Preço (R$)" hint={form.price ? formatPrice(form.price) : 'Deixe 0 para "sob consulta".'}>
              <input
                className="input"
                type="number"
                min={0}
                step={1000}
                value={form.price || ''}
                onChange={(e) => set('price', Number(e.target.value) || 0)}
                placeholder="0"
              />
            </Field>
            <Field label="Condomínio + IPTU / mês (R$)">
              <input
                className="input"
                type="number"
                min={0}
                value={form.monthlyCosts ?? ''}
                onChange={(e) => set('monthlyCosts', numOrUndef(e.target.value))}
                placeholder="opcional"
              />
            </Field>
          </FieldGroup>

          <FieldGroup title="Localização">
            <Field label="Endereço" span={3} hint="Rua e número — mostrado apenas na página do imóvel.">
              <input
                className="input"
                value={form.address ?? ''}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Rua Exemplo, 123"
              />
            </Field>
            <Field label="Bairro">
              <input
                className="input"
                value={form.neighborhood}
                onChange={(e) => set('neighborhood', e.target.value)}
                required
              />
            </Field>
            <Field label="Cidade">
              <input
                className="input"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
              />
            </Field>
            <Field label="Estado (UF)">
              <input
                className="input"
                maxLength={2}
                value={form.state}
                onChange={(e) => set('state', e.target.value.toUpperCase())}
              />
            </Field>
            <Field
              label="Busca do mapa"
              span={3}
              hint="Como procurar no Google Maps. Vazio = usa o endereço."
            >
              <input
                className="input"
                value={form.mapQuery ?? ''}
                onChange={(e) => set('mapQuery', e.target.value)}
                placeholder="Ex.: Vila Nova Conceição, São Paulo - SP"
              />
            </Field>
          </FieldGroup>

          <FieldGroup title="Características">
            <Field label="Dormitórios">
              <input
                className="input"
                type="number"
                min={0}
                value={form.bedrooms || 0}
                onChange={(e) => set('bedrooms', Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Suítes">
              <input
                className="input"
                type="number"
                min={0}
                value={form.suites ?? ''}
                onChange={(e) => set('suites', numOrUndef(e.target.value))}
              />
            </Field>
            <Field label="Banheiros">
              <input
                className="input"
                type="number"
                min={0}
                value={form.bathrooms || 0}
                onChange={(e) => set('bathrooms', Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Vagas de garagem">
              <input
                className="input"
                type="number"
                min={0}
                value={form.parking || 0}
                onChange={(e) => set('parking', Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="Área construída (m²)">
              <input
                className="input"
                type="number"
                min={0}
                value={form.areaBuilt ?? ''}
                onChange={(e) => set('areaBuilt', numOrUndef(e.target.value))}
              />
            </Field>
            <Field label="Área do terreno (m²)">
              <input
                className="input"
                type="number"
                min={0}
                value={form.areaTotal ?? ''}
                onChange={(e) => set('areaTotal', numOrUndef(e.target.value))}
              />
            </Field>
          </FieldGroup>

          <FieldGroup title="Descrição">
            <Field label="Texto completo" span={3} hint="Quebras de linha viram parágrafos no site.">
              <textarea
                className="textarea"
                rows={7}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Conte a história do imóvel: projeto, acabamentos, luz natural, entorno…"
              />
            </Field>
            <Field label="Diferenciais" span={3}>
              <TagInput
                values={form.features}
                onChange={(v) => set('features', v)}
                placeholder="Digite e pressione Enter (ex.: Piscina)"
                suggestions={FEATURE_SUGGESTIONS}
              />
            </Field>
          </FieldGroup>

          <FieldGroup title="Fotos" description="A primeira imagem é a capa. Arraste para reordenar.">
            <div className={styles.full}>
              <ImageManager images={form.images} onChange={(v) => set('images', v)} />
            </div>
          </FieldGroup>

          <FieldGroup title="Vídeos" description="Links do YouTube, Vimeo ou arquivos .mp4.">
            <div className={styles.full}>
              <VideoManager videos={form.videos} onChange={(v) => set('videos', v)} />
            </div>
          </FieldGroup>

          <div className={styles.formFoot}>
            <Link to="/admin" className="btn btn--ghost">
              {touched ? 'Descartar e voltar' : 'Voltar'}
            </Link>
            <button type="submit" className="btn btn--accent" disabled={saving}>
              {saving ? 'Salvando…' : isNew ? 'Publicar imóvel' : 'Salvar alterações'}
            </button>
          </div>
        </div>

        <aside className={styles.previewCol}>
          <p className={styles.previewLabel}>Prévia do cartão</p>
          <PropertyCard property={previewProperty} />
          <p className={styles.previewNote}>
            É assim que o imóvel aparece nas listagens. A página interna usa os mesmos
            dados mais as fotos e o texto completo.
          </p>
        </aside>
      </div>

      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} label="Excluir imóvel">
        <div className={styles.confirm}>
          <h3>Excluir “{form.title}”?</h3>
          <p>O imóvel sai do site imediatamente. Não dá para desfazer.</p>
          <div className={styles.confirmBtns}>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirmDelete(false)}>
              Cancelar
            </button>
            <button type="button" className={`btn ${styles.confirmDanger}`} onClick={handleDelete}>
              <IconTrash width={15} height={15} />
              Excluir definitivamente
            </button>
          </div>
        </div>
      </Modal>
    </form>
  )
}
