import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import site from '@/config/site.config'
import { useAuth } from '@/lib/auth'
import { IconArrowLeft, IconArrowRight } from '@/components/icons'
import styles from './LoginPage.module.css'

interface LocationState {
  from?: string
}

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/admin'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const data = new FormData(e.currentTarget)
    try {
      await login(String(data.get('username') || ''), String(data.get('password') || ''))
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <aside className={styles.brandPane}>
        <div className={styles.brandTop}>
          <span className={styles.mark}>{initials(site.brand.name)}</span>
          <span>{site.brand.name}</span>
        </div>
        <div className={styles.brandMid}>
          <p className="eyebrow">Área restrita</p>
          <h1>
            Gerencie seu portfólio <span className="serif-italic">com calma</span>.
          </h1>
          <p className={styles.brandText}>
            Cadastre imóveis, envie fotos e vídeos e publique com um clique. Tudo o que
            você edita aqui aparece no site na hora.
          </p>
        </div>
        <Link to="/" className={styles.brandBack}>
          <IconArrowLeft width={15} height={15} />
          Voltar ao site
        </Link>
      </aside>

      <div className={styles.formPane}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Entrar no painel</h2>
          <p className={styles.hint}>{site.admin.hint}</p>

          <label className="field">
            <span className="field-label">Usuário</span>
            <input
              className="input"
              name="username"
              autoComplete="username"
              autoFocus
              required
              defaultValue=""
              placeholder="seu usuário"
            />
          </label>

          <label className="field">
            <span className="field-label">Senha</span>
            <input
              className="input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className="btn btn--accent btn--block" disabled={loading}>
            {loading ? 'Entrando…' : 'Acessar painel'}
            {!loading && <IconArrowRight width={17} height={17} />}
          </button>

          <p className={styles.demo}>
            <strong>Demonstração:</strong> usuário <code>{site.admin.username}</code> · senha{' '}
            <code>{site.admin.password}</code>
            <br />
            <span>Defina os dados reais em <code>src/config/site.config.ts</code>.</span>
          </p>
        </form>
      </div>
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
