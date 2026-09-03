import { useRef, useState } from 'react'
import site from '@/config/site.config'
import { useProperties, usePropertyActions } from '@/lib/store'
import { useToast } from '@/lib/toast'
import { usePageMeta } from '@/lib/usePageMeta'
import { localStorageUsageMB } from '@/lib/image'
import { Modal } from '@/components/ui/Modal'
import { IconCheck, IconTrash } from '@/components/icons'
import styles from './AdminConfigPage.module.css'

export function AdminConfigPage() {
  usePageMeta('Ajustes · Painel')
  const properties = useProperties()
  const { reset, importAll, clear } = usePropertyActions()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState<'reset' | 'clear' | null>(null)

  function exportJson() {
    const blob = new Blob([JSON.stringify(properties, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `imoveis-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Backup exportado')
  }

  async function onImport(file: File) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!Array.isArray(data)) throw new Error('O arquivo não contém uma lista de imóveis.')
      await importAll(data)
      toast.success(`${data.length} imóveis importados`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Falha ao importar.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const usage = localStorageUsageMB()

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <h1>Ajustes</h1>
        <p>Backup dos imóveis e personalização da base.</p>
      </header>

      <section className={styles.card}>
        <h2>Dados dos imóveis</h2>
        <p className={styles.desc}>
          Sem servidor, os imóveis ficam salvos apenas neste navegador. Exporte um
          backup antes de trocar de máquina ou limpar o histórico.
        </p>
        <dl className={styles.stats}>
          <div>
            <dt>Imóveis</dt>
            <dd>{properties.length}</dd>
          </div>
          <div>
            <dt>Armazenamento local</dt>
            <dd>{usage} MB {usage > 4 && <em className={styles.warn}>(perto do limite)</em>}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <button type="button" className="btn btn--ghost btn--sm" onClick={exportJson}>
            Exportar backup (.json)
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => fileRef.current?.click()}
          >
            Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => setConfirm('reset')}
          >
            Restaurar exemplos
          </button>
          <button
            type="button"
            className={`btn btn--ghost btn--sm ${styles.danger}`}
            onClick={() => setConfirm('clear')}
          >
            <IconTrash width={15} height={15} />
            Apagar todos
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h2>Personalizar esta base</h2>
        <p className={styles.desc}>
          Para adaptar o site a um novo cliente, edite estes arquivos no projeto:
        </p>
        <ul className={styles.files}>
          <li>
            <code>src/config/site.config.ts</code>
            <span>Nome, CRECI, contatos, redes, textos das seções e login do painel.</span>
          </li>
          <li>
            <code>src/styles/theme.css</code>
            <span>Cores da marca, fontes, espaçamentos e presets prontos.</span>
          </li>
          <li>
            <code>index.html</code>
            <span>Título, meta description, imagem de compartilhamento e fontes.</span>
          </li>
          <li>
            <code>src/data/seedProperties.ts</code>
            <span>Imóveis de exemplo carregados na primeira visita.</span>
          </li>
        </ul>
        <p className={styles.note}>
          <IconCheck width={15} height={15} />
          Login atual: <strong>{site.admin.username}</strong> — troque a senha em{' '}
          <code>site.config.ts</code> antes de entregar ao cliente.
        </p>
      </section>

      <Modal open={confirm !== null} onClose={() => setConfirm(null)} label="Confirmar">
        <div className={styles.confirm}>
          <h3>{confirm === 'clear' ? 'Apagar todos os imóveis?' : 'Restaurar exemplos?'}</h3>
          <p>
            {confirm === 'clear'
              ? 'Todos os imóveis cadastrados serão removidos deste navegador.'
              : 'Os imóveis atuais serão substituídos pelos 6 exemplos originais.'}{' '}
            Exporte um backup antes, se precisar.
          </p>
          <div className={styles.confirmBtns}>
            <button type="button" className="btn btn--ghost" onClick={() => setConfirm(null)}>
              Cancelar
            </button>
            <button
              type="button"
              className={`btn ${styles.confirmDanger}`}
              onClick={async () => {
                if (confirm === 'clear') {
                  await clear()
                  toast.success('Imóveis apagados')
                } else {
                  await reset()
                  toast.success('Exemplos restaurados')
                }
                setConfirm(null)
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
