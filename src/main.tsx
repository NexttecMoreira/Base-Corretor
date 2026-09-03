import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from '@/lib/toast'
import { AuthProvider } from '@/lib/auth'
import { applyBrandTheme } from '@/lib/applyBrandTheme'
import './styles/global.css'

applyBrandTheme()

const container = document.getElementById('root')
if (!container) throw new Error('Elemento #root não encontrado.')

/* Sem a barra final: em dev vira "" (raiz), em produção vira "/Base-Corretor".
   Assim as rotas do React Router funcionam sob o subcaminho do GitHub Pages. */
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(container).render(
  <StrictMode>
    <BrowserRouter basename={routerBase}>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
