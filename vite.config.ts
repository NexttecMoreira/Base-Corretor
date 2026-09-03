import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

/* Caminho base da aplicação.
   - Netlify / Vercel / Cloudflare Pages / domínio próprio  ->  "/" (padrão).
   - GitHub Pages de projeto (site em usuario.github.io/REPO/) precisa de
     "/REPO/": nesse caso defina a env VITE_BASE="/Base-Corretor/"
     (o workflow .github/workflows/deploy.yml já faz isso sozinho).
   Em dev é sempre "/". */
const BASE = process.env.VITE_BASE ?? '/'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? BASE : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 4173,
  },
}))
