/* =============================================================================
   AUTENTICAÇÃO DO PAINEL — versão local (sem servidor)
   -----------------------------------------------------------------------------
   Compara usuário/senha com src/config/site.config.ts e guarda um "token" fake
   no sessionStorage. É suficiente para demonstração.

   Para produção com backend: substitua `login` por uma chamada real
   (POST /api/login) e troque o storage por um cookie httpOnly / JWT.
   ========================================================================== */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import site from '@/config/site.config'

const SESSION_KEY = 'corretor.session.v1'

interface AuthContextValue {
  isAuthenticated: boolean
  user: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() => readSession())

  const login = useCallback(async (username: string, password: string) => {
    // Pequeno atraso para simular request e evitar brute force instantâneo.
    await new Promise((r) => setTimeout(r, 450))
    const ok =
      username.trim().toLowerCase() === site.admin.username.toLowerCase() &&
      password === site.admin.password
    if (!ok) {
      throw new Error('Usuário ou senha incorretos.')
    }
    try {
      sessionStorage.setItem(SESSION_KEY, username.trim())
    } catch {
      /* ignore */
    }
    setUser(username.trim())
  }, [])

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      user,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
